import { request } from 'express'
import {prismanClient} from '../application/database.js'
import { ResponseError } from '../error/response-error.js'
import { createAddressValidation, getAddressValidation, updateAddressValidation } from '../validation/address-validation.js'
import { getContactValidation } from '../validation/contact-validation.js'
import { validate } from '../validation/validation.js'

const checkContactMustExists = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId)

    const totalContact = await prismanClient.contact.count({
        where : {
            username : user.username,
            id : contactId
        }
    })

    if(!totalContact){
        throw new ResponseError(404, "Contact is not found")
    }

    return contactId

}

const create = async (user, contactId, request) => {

    contactId = await checkContactMustExists(user, contactId)

    const address = validate(createAddressValidation, request)
    address.contact_id = contactId

    return prismanClient.address.create({
        data : address,
        select : {
            id : true,
            street : true,
            city : true,
            province : true,
            country : true,
            postal_code : true
        }
    })

}

const get = async (user, contactId, addressId) => {
    contactId = await checkContactMustExists(user, contactId)
    addressId = await validate(getAddressValidation, addressId)

    const address = await prismanClient.address.findFirst({
        where : {
            contact_id : contactId,
            id : addressId
        }
    })

    if(!address){
        throw new ResponseError(404, "Address is not found")
    }

    return address;
}

const update = async (user, contactId, request) => {
    contactId = await checkContactMustExists(user, contactId)
    const address = validate(updateAddressValidation, request)

    const totalAddress = await prismanClient.address.findFirst({
        where : {
            contact_id : contactId,
            id : address.id
        }
    })

    if(!totalAddress){
        throw new ResponseError(404, "Address is not found")
    }

    return prismanClient.address.update({
        where : {
            id : address.id
        },
        data : {
            street : address.street,
            city : address.city,
            province : address.province,
            country : address.country,
            postal_code : address.postal_code
        },
        select : {
            id : true,
            street : true,
            city : true,
            province : true,
            country : true,
            postal_code : true
        }
    })
}

const remove = async (user, contactId, addressId) => {
    contactId = await checkContactMustExists(user, contactId)
    addressId = validate(getAddressValidation, addressId)

    const countAddress = await prismanClient.address.count({
        where : {
            contact_id : contactId,
            id : addressId
        }
    })

    if(!countAddress){
        throw new ResponseError(404, "Address is not found")
    }

    return prismanClient.address.delete({
        where : {
            id : addressId
        }
    })
}

const list = async (user, contactId) => {
    contactId = await checkContactMustExists(user, contactId)
    
    return prismanClient.address.findMany({
        where : {
            contact_id : contactId
        },
        select : {
            id : true,
            street : true,
            city : true,
            province : true,
            country : true,
            postal_code : true
        }
    })

}

export default {
    create,
    get,
    update,
    remove,
    list
}