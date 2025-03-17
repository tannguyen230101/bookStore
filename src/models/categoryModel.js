import Joi from "joi";
import { GET_DB } from "../config/mongodb.js";
import { ObjectId } from "mongodb";

const CATEGORY_COLLECTION_NAME = "categories";
const CATEGORY_COLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  _isDeleted: Joi.boolean().default(false),
  position: Joi.number().integer().required(),
});

const validateBeforeCreate = async (data) => {
  return await CATEGORY_COLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const getAll = async () => {
  try {
    return await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .find({
        _isDeleted: false,
      })
      .toArray();
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
        _isDeleted: false,
      });
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByName = async (slug) => {
  try {
    return await GET_DB().collection(CATEGORY_COLLECTION_NAME).findOne({
      slug: slug,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (data) => {
  try {
    const totalPos = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .countDocuments({ _isDeleted: false });
    const validData = await validateBeforeCreate({
      ...data,
      position: totalPos + 1,
    });
    return await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .insertOne(validData);
  } catch (error) {
    throw new Error(error);
  }
};

const getDetails = async (id) => {
  try {
    return await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
        _isDeleted: false,
      });
  } catch (error) {
    throw new Error(error);
  }
};

const updateDetails = async (id, object) => {
  try {
    if (!id) throw new Error("ID is required!");

    const validData = await validateBeforeCreate(object);

    const result = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: validData },
        { returnDocument: "after" }
      );

    if (!result) throw new Error("No category found with the given ID!");

    return result;
  } catch (error) {
    throw new Error(error.message || error);
  }
};

const totalPosition = async () => {
  try {
    return await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .countDocuments({ _isDeleted: false });
  } catch (error) {
    throw new Error(error.message || error);
  }
};

const softDelete = async (idCategory) => {
  try {
    if (!idCategory) throw new Error("ID is required!");

    const result = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(idCategory) },
        { $set: { _isDeleted: true } },
        { returnDocument: "after" }
      );

    if (!result) throw new Error("No category found with the given ID!");

    return result;
  } catch (error) {
    throw new Error(error.message || error);
  }
};

export const categoryModel = {
  CATEGORY_COLECTION_SCHEMA,
  CATEGORY_COLLECTION_NAME,
  createNew,
  findOneById,
  getDetails,
  getAll,
  findOneByName,
  updateDetails,
  softDelete,
  totalPosition,
};
