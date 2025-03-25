/* eslint-disable no-undef */
import express from "express";
<<<<<<< HEAD
import cors from 'cors'
import { env } from "~/config/environment.js";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb.js";
import exitHook from "async-exit-hook";
import { APIs_V1 } from "~/routes/v1"
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";

const START_SERVER = () => {
    const app = express();
=======
import { ENV } from "./lib/configs/env.js";
import { connectDB } from "./lib/db.js";
import { APIs } from "./routes/index.js";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";
import cors from "cors";
import job from "./lib/cron.js";

const START_SERVER = () => {
    const app = express();

    job.start();
    app.use(express.json());
>>>>>>> e3b2d98 (cron)
    app.use(cors());

    // Enable Json
    app.use(express.json());

    app.use('/v1', APIs_V1);

    // Middleware xử lý lỗi tập trung
    app.use(errorHandlingMiddleware)

    app.listen(env.APP_PORT, env.APP_HOST, () => {
        console.log(`Hello ${env.AUTHOR} server http://${env.APP_HOST}:${env.APP_PORT}/`);
    });

    exitHook(() => {
        console.log("Exiting");
        CLOSE_DB();
    });
};

(async () => {
    try {
        console.log("Connecting to MongoDb");
        await CONNECT_DB();
        console.log("Connected to MongoDB.");
        START_SERVER();
    } catch (error) {
        console.error("-- Internal Server Error: ", error);
        process.exit(0);
    }
})()