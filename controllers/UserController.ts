import express from 'express';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import asyncHandler from 'express-async-handler';
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './HandlersFactory';
import { uploadSingleImage } from '../middlewares/uploadImageMiddleware';
import User from '../models/userModel';

// @desc    Upload Single image for User
// @route   POST /api/v1/Users/:id/upload
// @access  Private
export const uploadCategoryImage = uploadSingleImage('profilePic');

// @desc    Resize image for User (image processing)
// @route   POST /api/v1/Users/:id/resize
// @access  Private
export const resizeCategoryImage = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    if (!req.file) return next();

    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file.buffer) {
        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/users/${filename}`);

        req.body.profilePic = filename;
    }

    next();
};

// @desc    Get list of users
// @route   Get /api/v1/users
// @access  Private
export const getUsers = getAll(User);

// @desc    Get specific users by id
// @route   Get /api/v1/users/:id
// @access  Private
export const getUser = getOne(User);

// @desc    Create list of users
// @route   Post /api/v1/users
// @access  Private
export const createUser = createOne(User);

// @desc    Update specific users by id
// @route   PUT /api/v1/users/:id
// @access  Private
export const updateUser = updateOne(User);
// @desc    Delete specific users by id
// @route   DELETE /api/v1/users/:id
// @access  Private
export const deleteUser = deleteOne(User);

// @desc    Delete all users
// @route   DELETE /api/v1/users
// @access  Private
export const deleteUsers = asyncHandler(
    async (req: express.Request, res: express.Response) => {
        await User.deleteMany({});
        res.status(204).send();
    }
);

// @desc  Inactivate specific user by id
// @route   PATCH /api/v1/users/:id/inactivate
// @access  Private
export const inactivateUser = asyncHandler(
    async (req: express.Request, res: express.Response) => {
        await User.findByIdAndUpdate(req.params.id, { active: false });
        res.status(204).send();
    }
);

// @desc  activate specific user by id
// @route   PATCH /api/v1/users/:id/inactivate
// @access  Private
export const activateUser = asyncHandler(
    async (req: express.Request, res: express.Response) => {
        await User.findByIdAndUpdate(req.params.id, { active: true });
        res.status(204).send();
    }
);
