import { prismanClient } from "../application/database.js";
import { logger } from "../application/logging.js";
import { ResponseError } from "../error/response-error.js";
import { createContactValidation, createContactWithAddressValidation, getContactValidation, searchContactValidation, updateContactValidation } from "../validation/contact-validation.js"
import { validate } from "../validation/validation.js"

const create = async (user, request) => {

    const contact = validate(createContactValidation, request);
    contact.username = user.username

    return prismanClient.contact.create({
        data : contact,
        select : {
            id : true,
            first_name : true,
            last_name : true,
            email : true,
            phone : true
        }
    })

}

const get = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId)

    const contact = await prismanClient.contact.findFirst({
        where : {
            username : user.username,
            id : contactId
        },
        select : {
            id : true,
            first_name : true,
            last_name : true,
            email : true,
            phone : true
        }
    })

    if(!contact){
        throw new ResponseError(404, "Contact is not found")
    }

    return contact;
}

const update = async (user, request) => {
    
    const contact = validate(updateContactValidation, request);

    const totalContact = await prismanClient.contact.count({
        where : {
            username : user.username,
            id : contact.id
        }
    })

    if(!totalContact){
        throw new ResponseError(404, "Contact is not found")
    }


    return prismanClient.contact.update({
        where : {
            id : contact.id
        },
        data : {
            first_name : contact.first_name,
            last_name : contact.last_name,
            email : contact.email,
            phone : contact.phone
        },
        select : {
            id : true,
            first_name : true,
            last_name : true,
            email : true,
            phone : true
        }
    })

}

const remove = async (user, contactId) => {

    contactId = validate(getContactValidation, contactId)

    const totalData = await prismanClient.contact.count({
        where : {
            username : user.username,
            id : contactId
        }
    })

    if(!totalData){
        throw new ResponseError(404, "Contact is not found")
    }

    return prismanClient.contact.delete({
        where : {
            id : contactId
        }
    })

}

const search = async (user, request) => {
    
    request = validate(searchContactValidation, request)

    const skip = (request.page - 1) * request.size

    const filters = []

    filters.push({
        username : user.username
    })

    if(request.name){
        filters.push({
            OR : [
                {
                    first_name : {
                        contains : request.name
                    }
                },
                {
                    last_name : {
                        contains : request.name
                    }
                }
            ]
        })
    }

    if(request.email){
        filters.push({
            email : {
                contains : request.email
            }
        })
    }

    if(request.phone){
        filters.push({
            phone : {
                contains : request.phone
            }
        })
    }


    const totalItems = await prismanClient.contact.count({
        where : {
            AND : filters
        }
    })

    const contacts = await prismanClient.contact.findMany({
        where : {
            AND : filters
        },
        take : request.size,
        skip : skip
    })

    return {
        data : contacts,
        paging : {
            page : request.page,
            total_item : totalItems,
            total_page : Math.ceil(totalItems / request.size)
        }
    }

}

const createWithAddress = async (user, request) => {

    request = validate(createContactWithAddressValidation, request);
    request.username = user.username

    await prismanClient.contact.create({
        data : {
            ...request,
            addresses : {
                create : request.addresses
            }
        },
        // include: { addresses: true } //agar response address ikut
    })

}


const getWithAddresses = async (user, contactId) => {

    contactId = validate(getContactValidation, contactId)

    const contact = await prismanClient.contact.findFirst({
        where : {
            username : user.username,
            id : contactId
        },
        include : {
            addresses : true
        }
    })

    if(!contact){
        throw new ResponseError(404, "Contact is not found")
    }

    return contact;

}

export default {
    create,
    get,
    update,
    remove,
    search,
    createWithAddress,
    getWithAddresses
}