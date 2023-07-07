import express, { NextFunction } from 'express';
import {
    createdeepfake,
    uploaddeepfakeVideo,
    getPredict,
} from '../controllers/DeepfakeController';
import { createdeepfakeValidator } from '../utils/validators/deepfakeValidator';

const router = express.Router();

router
    .route('/')
    .post(uploaddeepfakeVideo, createdeepfakeValidator, createdeepfake)
    .get(getPredict);
export default router;
