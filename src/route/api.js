import express from 'express';
import userController from '../controller/user-controller.js';
import contactController from '../controller/contact-controller.js';
import addressController from '../controller/address-controller.js';
import { authMiddleWare } from '../middleware/auth-middleware.js';

const userRouter = new express.Router();
userRouter.use(authMiddleWare)

//user api
userRouter.get('/api/users/current', userController.get)
userRouter.patch('/api/users/update', userController.update)
userRouter.delete('/api/users/logout', userController.logout)

//contact api
userRouter.post('/api/contacts', contactController.create)
userRouter.get('/api/contacts/:contactId', contactController.get)
userRouter.put('/api/contacts/:contactId', contactController.update)
userRouter.delete('/api/contacts/:contactId', contactController.remove)
userRouter.get('/api/contacts', contactController.search)
userRouter.post('/api/contact/address', contactController.createContactWithAddresses)
userRouter.get('/api/contactwithaddress/:contactId', contactController.getContactByIdWithAddresses)

//address api
userRouter.post('/api/contacts/:contactId/addresses', addressController.create)
userRouter.get('/api/contacts/:contactId/addresses/:addressId', addressController.get)
userRouter.put('/api/contacts/:contactId/addresses/:addressId', addressController.update)
userRouter.delete('/api/contacts/:contactId/addresses/:addressId', addressController.remove)
userRouter.get('/api/contacts/:contactId/addresses', addressController.list)

export {
    userRouter
}