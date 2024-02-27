import QA from "../db/models/qaModel.js";
import { ApplicationError } from "../util/error/applicationError.js";

const mapToVisibleQA = (qa) => {
  return {
    id: qa._id,
    title: qa.title,
    author: {
      id: qa.author.id,
      nickname: qa.author.nickname,
    },
  };
};

export const getAllQAs = async () => {
  try {
    const qas = await QA.find().populate({ path: "author", model: "user" });
    return qas.map(mapToVisibleQA);
  } catch (error) {
    throw new ApplicationError(500, "Error retrieving QAs");
  }
};

export const getQAById = async (qaId) => {
  try {
    let qa;
    if (qaId) {
      qa = await QA.findById(qaId).populate("author", "nickname");
      if (!qa) {
        throw new ApplicationError(404, "QA not found");
      }
    } else {
      throw new ApplicationError(400, "QA ID is required");
    }
    return qa;
  } catch (error) {
    console.log(error);
    throw new ApplicationError(500, "Error retrieving QA");
  }
};

export const postQA = async (title, content, authorId) => {
  try {
    // 새로운 QA 생성 및 저장
    const savedQA = await QA.create({
      title: title,
      content: content,
      author: authorId,
    });

    return savedQA;
  } catch (error) {
    throw new ApplicationError(500, "Error creating new QA");
  }
};

export const deleteQA = async (qaId) => {
  try {
    if (!qaId) {
      throw new ApplicationError(400, "QA ID is required");
    }
    const deletedQA = await QA.findByIdAndDelete(qaId);
    if (!deletedQA) {
      throw new ApplicationError(404, "QA not found");
    }
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new ApplicationError(500, "Error deleting QA");
  }
};

export const editQA = async (qaId, newData) => {
  try {
    if (!qaId) {
      throw new ApplicationError(400, "QA ID is required");
    }
    const updatedQA = await QA.findByIdAndUpdate(qaId, newData, { new: true });
    if (!updatedQA) {
      throw new ApplicationError(404, "QA not found");
    }
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new ApplicationError(500, "Error updating QA");
  }
};


