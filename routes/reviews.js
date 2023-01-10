import express from 'express';
// Option mergeParams permet d'avoir accés aux paramètres dans req.params du debut du path (simplifié (id))
const router = express.Router({ mergeParams: true });
import catchAsync from "../utils/catchAsync.js";
import { validateReview, isLoggedIn, isReviewAuthor } from '../middleware.js';
import * as reviews from "../controllers/reviews.js";



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

export default router;