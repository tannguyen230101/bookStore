import express from "express";
import {categoryController} from "~/controllers/categoryController.js"
import { categoryValidation } from "~/validations/categotyValidation";

const Router = express.Router();

Router.route("/")
    .get(categoryController.getAll)
    .post(categoryValidation.createNew ,categoryController.createNew)

Router.route("/:id")
    .get(categoryController.getDetails)
    .put(categoryController.updateDetails)
    .delete(categoryController.softDelete)


export const categoryRoute = Router;