import { StatusCodes } from "http-status-codes"
import { authorService } from "../services/authorservice";

const createNew = async (req, res, next) => {
    try {
        const createdCategory = await authorService.createNew(req.body);

        res.status(StatusCodes.CREATED)
            .json(createdCategory)
    } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
    try {
        const categories = await authorService.getAll();

        res.status(StatusCodes.OK).json(categories);
    } catch (error) {
        next(error)
    }
}

const getDetails = async (req, res, next) => {
    try {
        const idCategory = req.params.id;
        const category = await authorService.getDetails(idCategory);

        res.status(StatusCodes.OK).json(category);
    } catch (error) {
        next(error)
    }
}

// const updateDetails = async (req, res, next) => {
//     try {
//         const idCategory = req.params.id;

//         const updatedCategory = await categoryService.updateDetails(idCategory, req.body)
//         res.status(StatusCodes.OK).json(updatedCategory);
//     } catch (error) {
//         next(error)
//     }
// }

// const softDelete = async (req, res, next) => {
//     try {
//         const idCategory = req.params.id;
//         await categoryService.softDelete(idCategory)
//         res.status(StatusCodes.OK).json("Delete successfully!");
//     } catch (error) {
//         next(error)
//     }
// }

export const authorController = {
    createNew,
    getAll,
    getDetails,
    // updateDetails,
    // softDelete
}