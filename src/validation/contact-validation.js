import Joi from "joi"
import { createAddressValidation } from "./address-validation.js"

const createContactValidation = Joi.object({
    first_name : Joi.string().max(100).required(),
    last_name : Joi.string().max(100).optional(),
    email : Joi.string().max(200).optional(),
    phone : Joi.string().max(100).optional()
})

const createContactWithAddressValidation = Joi.object({
    first_name : Joi.string().max(100).required(),
    last_name : Joi.string().max(100).optional(),
    email : Joi.string().max(200).optional(),
    phone : Joi.string().max(100).optional(),
    addresses : Joi.array().items(createAddressValidation).min(1).required(),
})

const getContactValidation = Joi.number().positive().required()

const updateContactValidation = Joi.object({
    id : Joi.number().positive().required(),
    first_name : Joi.string().max(100).required(),
    last_name : Joi.string().max(100).optional(),
    email : Joi.string().max(200).optional(),
    phone : Joi.string().max(100).optional()
})

const searchContactValidation = Joi.object({
    page : Joi.number().min(1).positive().default(1),
    size : Joi.number().min(1).positive().default(10),
    name : Joi.string().optional(),
    email : Joi.string().optional(),
    phone : Joi.string().optional()
})

export {
    createContactValidation,
    getContactValidation,
    updateContactValidation,
    searchContactValidation,
    createContactWithAddressValidation
}