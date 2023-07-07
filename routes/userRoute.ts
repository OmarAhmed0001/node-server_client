import express from 'express';
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    resizeCategoryImage,
    uploadCategoryImage,
} from '../controllers/UserController';
import {
    createUserValidator,
    deleteUserValidator,
    getUserValidator,
    updateUserValidator,
} from '../utils/validators/userValidator';

const router = express.Router();

router
    .route('/')
    .get(getUsers)
    .post(
        uploadCategoryImage,
        resizeCategoryImage,
        createUserValidator,
        createUser
    );
router
    .route('/:id')
    .get(getUserValidator, getUser)
    .put(
        uploadCategoryImage,
        resizeCategoryImage,
        updateUserValidator,
        updateUser
    )
    .delete(deleteUserValidator, deleteUser);
export default router;
