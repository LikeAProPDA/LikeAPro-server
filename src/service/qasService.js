import QAModel from '../db/models/qaModel.js';

export const getAllQAs = async () => {
  try {
    const qas = await QAModel.find().populate("userId", "nickname");
    return qas;
  } catch (error) {
    throw new ApplicationError(500, "Error retrieving QAs");
  }
};
