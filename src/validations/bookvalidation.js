import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";

const createNew = async (req, res, next) => {
  const condition = Joi.object({
    name: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(2000).trim().strict(),
    price: Joi.number().required(),
    numberOfPage: Joi.number().required().integer(),
    categoryId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
  });

  try {
    await condition.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

export const bookValidation = {
  createNew,
};
