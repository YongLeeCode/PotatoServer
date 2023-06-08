import express from 'express';
import 'express-async-errors';
import * as communityController from '../controller/community.js'

const router = express.Router();

router.get('/', communityController.getPosts);
router.post('/', communityController.create);
router.get('/:id', communityController.getPost);

export default router;

