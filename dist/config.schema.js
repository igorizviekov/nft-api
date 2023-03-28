"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigValidationSchema = void 0;
const Joi = require("@hapi/joi");
exports.ConfigValidationSchema = Joi.object({
    DB_HOST: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    DB_PORT: Joi.number().default(5432).required(),
});
//# sourceMappingURL=config.schema.js.map