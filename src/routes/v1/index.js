import express from "express";
import {categoryRoute} from "~/routes/v1/categoryRoute"

const Router = express.Router();

Router.use('/category', categoryRoute)

export const APIs_V1 = Router;