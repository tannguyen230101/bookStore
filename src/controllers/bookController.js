import { StatusCodes } from "http-status-codes"
import { bookService } from "../services/bookService";

const createNew = async (req, res, next) => {
    try {
        const createdBook = await bookService.createNew(req.body);

        res.status(StatusCodes.CREATED)
            .json(createdBook)
    } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
    try {
        const books = await bookService.getAll();

        res.status(StatusCodes.OK).json(books);
    } catch (error) {
        next(error)
    }
}

const getDetails = async (req, res, next) => {
    try {
        const idBook = req.params.id;
        const book = await bookService.getDetails(idBook);

        res.status(StatusCodes.OK).json(book);
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

export const bookController = {
    createNew,
    getAll,
    getDetails,
    // updateDetails,
    // softDelete
}