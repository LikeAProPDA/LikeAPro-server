
import QAModel from "../db/models/qaModel.js";
import { ApplicationError } from "../util/error/applicationError.js";


export const getAllQAs = async () => {
  try {
    const qas = await QAModel.find().populate("userId", "nickname");
    return qas;
  } catch (error) {
    throw new ApplicationError(500, "Error retrieving QAs");
  }
};


export const getQAById = async (qaId) => {
  try {
    let qa;
    if (qaId) {
      qa = await QAModel.findById(qaId).populate("userId", "nickname");
      if (!qa) {
        throw new ApplicationError(404, "QA not found");
      }
    } else {
      throw new ApplicationError(400, "QA ID is required");
    }
    return qa;
  } catch (error) {
    throw new ApplicationError(500, "Error retrieving QA");
  }
};

