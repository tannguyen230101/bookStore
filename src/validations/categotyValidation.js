import Joi from "joi";
import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
    const condition = Joi.object({
        name: Joi.string()
            .required()
            .min(3)
            .max(50)
            .trim()
            .strict(),
        description: Joi.string()
            .min(3)
            .max(2000)
            .trim()
            .strict(),
    })

    try {
        await condition.validateAsync(
            req.body,
            {
                abortEarly: false
            } 
        );
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
}

export const categoryValidation = {
    createNew
}