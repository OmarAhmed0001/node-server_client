import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import { uploadSingleVideo } from '../middlewares/uploadVideoMiddleware';
import dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });
// import deepfake from '../models/deepfakeModel';

let predict = '';
let frames_cropped = [''];
let faces_cropped = [''];
let DeepfakeVideo = '';

// @desc    Upload Single image for deepfake
// @route   POST /api/v1/deepfake/:id/deepfake
// @access  Private
export const uploaddeepfakeVideo = uploadSingleVideo;

// @desc    Create list of deepfake
// @route   Post /api/v1/deepfake
// @access  Private
export const createdeepfake = asyncHandler(
    async (req: any, res: Response): Promise<void> => {
        // Reset the values to their initial state or empty them
        predict = '';
        frames_cropped = [];
        faces_cropped = [];
        DeepfakeVideo = '';
        axios
            .post(`${process.env.FLASK_URL}`, { video: req.fileName })
            .then((response: { data: any }) => {
                console.log(response.data);
                const { data } = response;
                const { Message, face_list, frame_list } = data;
                DeepfakeVideo = req.fileName;
                predict = Message;
                frames_cropped = frame_list.map(
                    (frame: string) =>
                        `${process.env.FLASK_URL}/frames/${frame}`
                );
                faces_cropped = face_list.map(
                    (face: string) => `${process.env.FLASK_URL}/faces/${face}`
                );

                res.send(response.data);
            })
            .catch((error: any) => {
                console.error(error);
                res.send('Error');
            });
    }
);

// @desc    Get Single video for deepfake
// @route   Get /api/v1/deepfake
// @access  Public

const no_faces = false;
export const getPredict = (req: Request, res: Response, next: NextFunction) => {
    if (!predict || !frames_cropped || !faces_cropped) {
        setTimeout(() => {
            getPredict(req, res, next);
        }, 100);
    } else {
        const folderPath = '../node-server_client/uploads/deepfakeVideos';
        fs.readdir(
            folderPath,
            (err: NodeJS.ErrnoException | null, files: string[]) => {
                if (err) {
                    console.error('Error reading folder:', err);
                    return;
                }

                // Iterate over the files
                files.forEach((file: string) => {
                    const filePath = path.join(folderPath, file);

                    // Remove each file
                    fs.unlink(
                        filePath,
                        (error: NodeJS.ErrnoException | null) => {
                            if (error) {
                                console.error('Error removing file:', error);
                            } else {
                                console.log(
                                    'File removed successfully:',
                                    filePath
                                );
                            }
                        }
                    );
                });
            }
        );
        res.render('deepfake', {
            message: predict,
            preprocessed_images: frames_cropped,
            faces_cropped_images: faces_cropped,
            no_faces,
            video: DeepfakeVideo,
        });
    }
};
