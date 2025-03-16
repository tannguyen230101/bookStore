import Joi from "joi"
import { GET_DB } from "../config/mongodb.js"
import { ObjectId } from "mongodb"

const CATEGORY_COLLECTION_NAME = 'books'
const CATEGORY_COLECTION_SCHEMA = Joi.object({
    name: Joi.string()
        .required()
        .min(3)
        .max(50)
        .trim()
        .strict(),
    slug: Joi
        .string()
        .required()
        .min(3)
        .trim()
        .strict(),
    description: Joi.string()
        .min(3)
        .max(2000)
        .trim()
        .strict(),
    price: Joi
        .number()
        .required(),
    numberOfPage: Joi
        .number()
        .required()
        .integer(),
    _isDeleted: Joi
        .boolean()
        .default(false)
});

const validateBeforeCreate = async (data) => {
    return await CATEGORY_COLECTION_SCHEMA.validateAsync(
        data,
        { abortEarly: false }
    )
};

const getAll = async () => {
    try {
        return await GET_DB()
            .collection(CATEGORY_COLLECTION_NAME)
            .find({
                _isDeleted: false
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
                _isDeleted: false
            });
    } catch (error) {
        throw new Error(error);
    }
};

const findOneByName = async (slug) => {
    try {
        return await GET_DB()
        .collection(CATEGORY_COLLECTION_NAME)
        .findOne({
            slug: slug
        });;
    } catch (error) {
        throw new Error(error);
    }
};

const createNew = async (data) => {
    try {
        // const validData = await validateBeforeCreate(data);
        return await GET_DB()
            .collection(CATEGORY_COLLECTION_NAME)
            .insertOne(await validateBeforeCreate(data))
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
                _isDeleted: false
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

        if (!result) 
            throw new Error("No category found with the given ID!");

        return result;
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
                { $set: {_isDeleted: true} },
                { returnDocument: "after" } 
            );

        if (!result) 
            throw new Error("No Book found with the given ID!");

        return result;
    } catch (error) {
        throw new Error(error.message || error);
    }
};

export const bookModel = {
    CATEGORY_COLECTION_SCHEMA,
    CATEGORY_COLLECTION_NAME,
    createNew,
    findOneById,
    getDetails,
    getAll,
    findOneByName,
    updateDetails,
    softDelete
};