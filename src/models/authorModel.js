import Joi from "joi"
import { GET_DB } from "../config/mongodb.js"
import { ObjectId } from "mongodb"

const AUTHOR_COLLECTION_NAME = 'authors'
const AUTHOR_COLLECTION_SCHEMA = Joi.object({
    name: Joi.string()
        .required()
        .min(3)
        .max(50)
        .trim()
        .strict(),
    slug: Joi
        .string()
        .min(3)
        .trim()
        .strict(),
    _isDeleted: Joi
        .boolean()
        .default(false),
    yearOfBirth: Joi
        .number()
        .min(1900)
        .max(2025),
    address: Joi
        .string()
        .min(3)
        .max(1000)
        .trim()
        .strict(),
    phonenumber: Joi.string()
        .min(9)
        .max(10)
        .trim()
        .strict(),
    email: Joi.string()
        .required()
        .min(6)
        .max(50)
        .trim()
        .strict()
});

const validateBeforeCreate = async (data) => {
    return await AUTHOR_COLLECTION_SCHEMA.validateAsync(
        data,
        { abortEarly: false }
    )
};

const getAll = async () => {
    try {
        return await GET_DB()
            .collection(AUTHOR_COLLECTION_NAME)
            .find({
                _isDeleted: false
            })
            .toArray();
    } catch (error) {
        throw new Error(error);
    }
};

const createNew = async (data) => {
    try {
        // const validData = await validateBeforeCreate(data);
        return await GET_DB()
            .collection(AUTHOR_COLLECTION_NAME)
            .insertOne(await validateBeforeCreate(data))
    } catch (error) {
        throw new Error(error);
    }
};

const getDetails = async (id) => {
    try {
        return await GET_DB()
            .collection(AUTHOR_COLLECTION_NAME)
            .findOne({
                _id: new ObjectId(id),
                _isDeleted: false
            });
    } catch (error) {
        throw new Error(error);
    }
}

const findOneById = async (id) => {
    try {
        return await GET_DB()
            .collection(AUTHOR_COLLECTION_NAME)
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
            .collection(AUTHOR_COLLECTION_NAME)
            .findOne({
                slug: slug
            });;
    } catch (error) {
        throw new Error(error);
    }
};

const findOneByEmail = async (email) => {
    try {
        return await GET_DB()
            .collection(AUTHOR_COLLECTION_NAME)
            .findOne({
                email: email
            })
    } catch (error) {
        throw new Error(error);
    }
}

// const getDetails = async (id) => {
//     try {
//         return await GET_DB()
//             .collection(AUTHOR_COLLECTION_NAME)
//             .findOne({
//                 _id: new ObjectId(id),
//                 _isDeleted: false
//             });
//     } catch (error) {
//         throw new Error(error);
//     }
// };

const updateDetails = async (id, object) => {
    try {
        if (!id) throw new Error("ID is required!");

        const validData = await validateBeforeCreate(object);

        const result = await GET_DB()
            .collection(AUTHOR_COLLECTION_NAME)
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
            .collection(AUTHOR_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(idCategory) },
                { $set: { _isDeleted: true } },
                { returnDocument: "after" }
            );

        if (!result)
            throw new Error("No category found with the given ID!");

        return result;
    } catch (error) {
        throw new Error(error.message || error);
    }
};

export const authorModel = {
    AUTHOR_COLLECTION_NAME,
    AUTHOR_COLLECTION_SCHEMA,
    createNew,
    getAll,
    findOneById,
    findOneByEmail,
    getDetails,
    findOneByName,
    updateDetails,
    softDelete
};