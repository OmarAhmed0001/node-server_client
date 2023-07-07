import { body, check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import slugify from 'slugify';
import User from '../../models/userModel';

export const getUserValidator = [
    check('id').isMongoId().withMessage('invalid User id'),
    validatorMiddleware,
];

export const createUserValidator = [
    check('name')
        .notEmpty()
        .withMessage('User required')
        .isLength({ min: 2 })
        .withMessage('Too short name')
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),
    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email')
        .custom((value) =>
            User.findOne({ email: value }).then((user) => {
                if (user) {
                    return Promise.reject('E-mail already in use');
                }
            })
        ),
    check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Too short password'),
    check('profilePic').optional(),
    check('phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone')
        .isLength({ min: 10 })
        .withMessage('Too short phone'),
    check('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Invalid role'),
    validatorMiddleware,
];

export const updateUserValidator = [
    check('id').isMongoId().withMessage('invalid User id'),
    body('name')
        .optional()
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),
    validatorMiddleware,
];

export const deleteUserValidator = [
    check('id').isMongoId().withMessage('invalid User id'),
    validatorMiddleware,
];

// export default UserValidator;
