import dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });
import mongoose from 'mongoose';
// 1- Create Schema
const DeepfakeSchema = new mongoose.Schema(
    {
        video: {
            type: String,
        },
    },
    { timestamps: true }
);
const { IMAGE_BASE_URL } = process.env;

const setImageURL = (doc: any) => {
    // return image based url + image name
    if (doc.image) {
        doc.image = `${IMAGE_BASE_URL}/deepfake/${doc.image}`;
    }
};

// FindAll , FindById , Update
DeepfakeSchema.post('init', (doc) => {
    setImageURL(doc);
});
//  Create
DeepfakeSchema.post('save', (doc) => {
    setImageURL(doc);
});
// 2- Create Model
const DeepfakeModel = mongoose.model('Deepfake', DeepfakeSchema);

export default DeepfakeModel;
