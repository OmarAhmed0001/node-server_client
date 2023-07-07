import sharp from 'sharp';
import multer, { diskStorage, memoryStorage } from 'multer';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const storage = diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: any) => {
        cb(null, 'uploads/deepfakeVideos/'); // the place which the images will add on it
    },
    filename: (req: any, file: Express.Multer.File, cb: any) => {
        const id: string = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        const fileName: string = `video-${id}-${Date.now()}.${
            file.mimetype.split('/')[1]
        }`;
        req.fileName = fileName;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage }); // the place which the images will add on it

const uploadSingleVideo =
    upload.single(
        'video'
    ); /* "image"  is the name of attribute which sent from the client body Parser*/

export { uploadSingleVideo };
