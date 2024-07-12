import {Router} from 'express';
import tokenController from '../controllers/tokenController';

const router = new Router();

router.post('/', tokenController.store); //.store

export default router;