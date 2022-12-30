const express = require('express');
// Option mergeParams permet d'avoir accés aux paramètres dans req.params du debut du path (simplifié (id))
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require("../controllers/reviews");



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;