const Review = require("../models/Review")
const Product = require("../models/Product")

const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions} = require('../utils')

const createReview = async ( req, res) =>{
    const {product: productId} = req.body;
    
    const isValidProduct = await Product.findOne({_id: productId})

    if(!isValidProduct){
        throw new CustomError.NotFoundError(`No Product with id : ${productId} `);
    }

    const alreadySubmitted = await Review.findOne({Product:productId, user:req.user.userId})

    if(alreadySubmitted){
        throw new CustomError.BadRequestError('Already submitted review for this product')
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({review});

}

const getAllReviews = async ( req, res) =>{
    const reviews = await Review.find({}).populate({ //populate method allows us to get the reference documents in other collections
        path: 'product',
        select: 'name company price',
    });

    res.status(StatusCodes.OK).json({reviews, count: reviews.length})
}

const getSingleReview = async ( req, res) =>{
    const { id: reviewId } = req.params;

    const review = await Review.findOne({_id: reviewId})

    if(!review){
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
    }

    res.status(StatusCodes.OK).json({review})
}

const updateReview = async ( req, res) =>{
    const {id: reviewId} = req.params;
    const {title, rating, comment} = req.body;

    const review = await Review.findOne({_id: reviewId})

    if(!review){
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
    }

    checkPermissions(req.user, review.user);
    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();
    res.status(StatusCodes.OK).json({review})
}

const deleteReview = async ( req, res) =>{
    const {id: reviewId} = req.params;

    const review = await Review.findOne({_id: reviewId})

    if(!review){
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
    }

    checkPermissions(req.user,review.user); // we used this validation to check whether the same user is deleting the review
    await review.remove();
    res.status(StatusCodes.OK).json({msg: "Success! Review removed"});

}

const getSingleProductReviews = async (req, res)=>{
    const {id: productId} = req.params;
    const reviews = await Review.find({product: productId})
    res.status(StatusCodes.OK).json({reviews, count: reviews.length})
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews,
};