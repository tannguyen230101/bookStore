import { slugify } from "~/utils/formatter.js"
import ApiError from "~/utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { authorModel } from "../models/authorModel";

// import pkg from 'lodash';
// const { cloneDeep } = pkg;
const createNew = async (reqBody) => {
    try {
        const newObject = {
            ...reqBody,
            slug: slugify(reqBody.name)
        };

        const nameExist = await authorModel.findOneByName(newObject.slug);
        if (nameExist)
            throw new ApiError(StatusCodes.BAD_REQUEST, "Name Already Have!")

        const emailExist = await authorModel.findOneByEmail(newObject.email);
        if (emailExist)
            throw new ApiError(StatusCodes.BAD_REQUEST, "Email Already Have!")

        const createdAuthor = await authorModel.createNew(newObject);

        return await authorModel.findOneById(createdAuthor.insertedId)
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
}

const getAll = async () => {
    try {
        const authors = await authorModel.getAll();
        if (!authors)
            throw new ApiError(StatusCodes.NOT_FOUND, "Authors NOT FOUND!");
        return authors;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
}

const getDetails = async (idAuthor) => {
    try {
        const category = await authorModel.getDetails(idAuthor);
        if (!category)
            throw new ApiError(StatusCodes.NOT_FOUND, "Category NOT FOUND!");

        return category;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
}

const updateDetails = async (idAuthor, reqBody) => {
    try {
        const newObject = {
            ...reqBody,
        };

        if (newObject.name) {
            // Chuyển đổi name thành slug
            newObject.slug = slugify(newObject.name, { lower: true });

            // Kiểm tra xem name mới có bị trùng không
            const nameExist = await authorModel.findOneByName(newObject.slug);
            if (nameExist && nameExist._id.toString() !== idAuthor) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Name already exists!");
            }
        }

        if (newObject.email) {
            // Kiểm tra xem email mới có bị trùng không
            const emailExist = await authorModel.findOneByEmail(newObject.email);
            if (emailExist && emailExist._id.toString() !== idAuthor) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Email already exists!");
            }
        }

        const updatedCategory = await authorModel.updateDetails(idAuthor, newObject);
        if (!updatedCategory) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Category not found!");
        }

        return updatedCategory;
        // return await categoryModel.findOneById(updatedCategory._id)
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
}

const softDelete = async (idAuthor) => {
    try {
        const deletedCategory = await authorModel.softDelete(idAuthor);
        
        if (!deletedCategory)
            throw new ApiError(StatusCodes.NOT_FOUND, "Author Not Found");
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
}

export const authorService = {
    createNew,
    getAll,
    getDetails,
    updateDetails,
    softDelete
}