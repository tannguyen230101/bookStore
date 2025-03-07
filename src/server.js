/* eslint-disable no-undef */
import express from "express";
import { env } from "~/config/environment.js";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb.js";
import exitHook from "async-exit-hook";
import { APIs_V1 } from "~/routes/v1"
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";


const START_SERVER = () => {
    const app = express();
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