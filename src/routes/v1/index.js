import express from "express";
import {categoryRoute } from "~/routes/v1/categoryRoute"
import {authorRoute } from "~/routes/v1/authorRoute"
import { bookRoute } from "./bookRoute";


const Router = express.Router();

Router.use('/category', categoryRoute)
Router.use('/author', authorRoute)
Router.use('/book', bookRoute)

export const APIs_V1 = Router;