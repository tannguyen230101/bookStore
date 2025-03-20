import express from "express";
import { bookController } from "../../controllers/bookController";
import { bookValidation } from "../../validations/bookvalidation";
const Router = express.Router();

Router.route("/")
    .get(bookController.getAll)
    .post(bookValidation.createNew ,bookController.createNew)

Router.route("/:id")
    .get(bookController.getDetails)
    // .put(categoryController.updateDetails)
    // .delete(categoryController.softDelete)


export const bookRoute = Router;