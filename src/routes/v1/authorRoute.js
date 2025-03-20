import express from "express";
import { authorController } from "../../controllers/authorController";
import { authorValidation } from "../../validations/authorValidation";
const Router = express.Router();

Router.route("/")
    .get(authorController.getAll)
    .post(authorValidation.createNew ,authorController.createNew)

Router.route("/:id")
    .get(authorController.getDetails)
//     .put(categoryController.updateDetails)
//     .delete(categoryController.softDelete)


export const authorRoute = Router;