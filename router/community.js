import express from 'express';
import 'express-async-errors';
import * as communityController from '../controller/community.js'
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import {body, param, validationResult} from 'express-validator';

const router = express.Router();

const validateCredential = [
  body('mainText').trim().isLength({min: 3}).withMessage('Sould be at least 3 characters'),
  body('title').trim().isLength({min: 2}).withMessage('Sould be at least 2 characters'),
  validate,
];



export default function communityRouter(communityController){
  router.get('/', communityController.getPosts);
  router.post('/',isAuth, validateCredential, communityController.create);
  router.get('/:id', communityController.getPost);
  router.put('/:id',isAuth, validateCredential, communityController.updatePost);
  router.delete('/:id',isAuth, communityController.deletePost);
  router.put('/view/:id', communityController.increaseView);
  router.put('/num/:id', communityController.changeNumComments);

  return router;
}

// router.get('/', communityController.getPosts);
// router.post('/',isAuth, communityController.create);
// router.get('/:id', communityController.getPost);
// router.put('/:id',isAuth, communityController.updatePost);
// router.delete('/:id',isAuth, communityController.deletePost);

// export default router;

