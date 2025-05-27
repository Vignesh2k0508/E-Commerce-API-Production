require('dotenv').config()
require('express-async-errors')

// express app


const express = require('express')
const app = express()

// rest of the package
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')

// Database 
const connectDB = require('./db/connect')

// Routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')


// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')


app.use(morgan("tiny"))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(cors())

app.use(fileUpload())

app.get('/api/v1',(req,res)=>{
    // console.log(req.cookies);
    console.log(req.signedCookies);
    
    res.send('E-Commerce API')
})

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/products',productRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
const start = async ()=>{
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port,console.log(`Server is listening on port ${port}`));
        
    }catch(error){
        console.log(error);
    }
}

start()