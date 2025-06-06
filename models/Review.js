const mongoose = require("mongoose")

const ReviewSchema = mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true,"Please provide rating"],
    },
    title:{
        type: String,
        trim: true,
        required: [true,"Please provide review title"],
        maxlength: 100,
    },
    comment:{
        type: String,
        required: [true,"Please provide review text"]
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    product:{
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
    },
},
{timestamps: true}
);
ReviewSchema.index({product: 1, user: 1}, {unique: true}); //we used to get compound index for review that 
// means only one review per product per user

ReviewSchema.statics.calculateAverageRating = async function(productId){  // statics directly indicates the schema
    const result = await this.aggregate([
        { $match: {product: productId} },
        {
            $group:{
                _id: null,
                averageRating: {$avg: "$rating"},
                numOfReviews: { $sum: 1},
            }
        }        
    ])
    console.log(result);
    
    try {
        await this.model('Product').findOneAndUpdate(
            { _id: productId },
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0), // it will check whether averageRating have any 
                // property if it is then it will return smaller integer value otherwise it returns 0
                // ?. is called optional chaining
                numOfReviews: result[0]?.numOfReviews || 0,
            }
        )
    } catch (error) {
        console.log(error);
        
    }
}


ReviewSchema.post('save', async function(){
    await this.constructor.calculateAverageRating(this.product);  
})

ReviewSchema.post('remove', async function(){
    await this.constructor.calculateAverageRating(this.product);
})

module.exports = mongoose.model("Review", ReviewSchema);