import express from 'express';
import {
    get_home,
    getScanner,
} from '../controllers/IndexController';

const router = express.Router();

/* GET home page. */
router.route('/').get(get_home);
router
    .route('/scanner')
    .get(getScanner);

export default router;
