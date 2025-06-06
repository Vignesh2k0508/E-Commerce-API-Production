const mongoose = require("mongoose")

const SingleOrderItemSchema = mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    amount: {type: Number, required: true},
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
})


const OrderSchema = mongoose.Schema({
    tax:{
        type: Number,
        require: true,
    },
    shippingFee:{
        type: Number,
        require: true,
    },
    subtotal:{
        type: Number,
        require: true,
    },
    total:{
        type: Number,
        require: true,
    },
    orderItems: [SingleOrderItemSchema],
    status:{
        type: String,
        enum: ['pending','failed','paid','delivered','canceled'],
        default: 'pending'
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true,
    },
    clientSecret: {
        type: String,
        required: true,
    },
    paymentIntentId:{
        type: String,
    },
},
{ timestamps: true }
);

module.exports= mongoose.model('Order', OrderSchema);