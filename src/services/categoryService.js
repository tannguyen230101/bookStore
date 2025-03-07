import { slugify } from "~/utils/formatter.js"
// import { boardModel } from "../models/boardModel.js";
import ApiError from "~/utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { categoryModel } from "../models/categoryModel";

// import pkg from 'lodash';
// const { cloneDeep } = pkg;
const createNew = async (reqBody) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const newObject = {
            ...reqBody,
            slug: slugify(reqBody.name)
        };

        const nameExist = await categoryModel.findOneByName(newObject.slug);
        if (nameExist)
            throw new ApiError(StatusCodes.BAD_REQUEST, "Name Already Have!")

        const createdCategory = await categoryModel.createNew(newObject);

        return await categoryModel.findOneById(createdCategory.insertedId)
    } catch (error) {
        // throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
        throw error;
    }
}

const getDetails = async (idCategory) => {
    try {
        const category = await categoryModel.getDetails(idCategory);
        if (!category)
            throw new ApiError(StatusCodes.NOT_FOUND, "Category NOT FOUND!");

        return category;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
}

const getAll = async () => {
    try {
        const categories = await categoryModel.getAll();
        if (!categories)
            throw new ApiError(StatusCodes.NOT_FOUND, "Categories NOT FOUND!");
        return categories;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
}

const updateDetails = async (idCategory, reqBody) => {
    try {
        const newObject = {
            ...reqBody,
        };

        if (newObject.name) {
            // Chuyển đổi name thành slug
            newObject.slug = slugify(newObject.name, { lower: true });

            // Kiểm tra xem name mới có bị trùng không
            const nameExist = await categoryModel.findOneByName(newObject.slug);
            if (nameExist && nameExist._id.toString() !== idCategory) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Name already exists!");
            }
        }

        const updatedCategory = await categoryModel.updateDetails(idCategory, newObject);
        if (!updatedCategory) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Category not found!");
        }

        return updatedCategory;
        // return await categoryModel.findOneById(updatedCategory._id)
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
}

const softDelete = async (idCategory) => {
    try {
        const deletedCategory = await categoryModel.softDelete(idCategory);
        
        if (!deletedCategory)
            throw new ApiError(StatusCodes.NOT_FOUND, "Category Not Found");
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
}

export const categoryService = {
    createNew,
    getDetails,
    getAll,
    updateDetails,
    softDelete
}