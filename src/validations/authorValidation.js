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
        slug: Joi
            .string()
            .min(3)
            .trim()
            .strict(),
        yearOfBirth: Joi
            .number()
            .min(1900)
            .max(2025),
        address: Joi
            .string()
            .min(3)
            .max(1000)
            .trim()
            .strict(),
        phonenumber: Joi.string()
            .min(9)
            .max(10)
            .trim()
            .strict(),
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .min(6)
            .max(50)
            .messages({
                'string.email': 'Email phải có định dạng hợp lệ',
                'any.required': 'Email là trường bắt buộc'
            })
            .trim()
            .strict()
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

export const authorValidation = {
    createNew
}