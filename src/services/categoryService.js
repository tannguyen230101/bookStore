import { slugify } from "~/utils/formatter.js"
// import { boardModel } from "../models/boardModel.js";
import ApiError from "~/utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { categoryModel } from "../models/categoryModel";

import pkg from 'lodash';
import { bookModel } from "../models/bookModel";
const { cloneDeep } = pkg;

const createNew = async (reqBody) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const newObject = {
            ...reqBody,
            slug: slugify(reqBody.name),
        };

        const nameExist = await categoryModel.findOneByName(newObject.slug);
        if (nameExist)
            throw new ApiError(StatusCodes.BAD_REQUEST, "Name Already Have!")

        console.log(categoryModel.totalPosition());
        const position = categoryModel.totalPosition();
        newObject.position = position + 1;
        
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

        const books = await bookModel.getAll({
            categoryId: idCategory,
            _isDeleted: false
        });

        const resCategory = cloneDeep(category);

        resCategory.books = books

        resCategory.books.forEach(book => {
            // Ví dụ: thêm hoặc định dạng lại dữ liệu của book
            book.categoryName = resCategory.name; // Thêm tên category vào mỗi book
            // Nếu bạn muốn xóa hoặc thêm field nào đó, hãy làm ở đây
            // Ví dụ: xóa field _isDeleted nếu không cần
        });
        return resCategory;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
}
// const getDetails = async (boardId) => {
//     try {
//         const board = await boardModel.getDetails(boardId);
//         if (!board)
//             throw new ApiError(StatusCodes.NOT_FOUND, "Board not found!");

//         const resBoard = cloneDeep(board);

//         resBoard.columns.forEach(column => {
//             // column.cards = resBoard.card.filter(card =>
//             //     card.columnId.toString() === column._id.toString())
//             column.cards = resBoard.card.filter(card =>
//                 card.columnId.equals(column._id))
//         })

//         delete resBoard.cards;

//         return resBoard;
//     } catch (error) {
//         throw error;
//     }
// }
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