const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {createJWT} = require('../utils')


const register = async (req,res)=>{
    const {email,name,password} = req.body

    const emailAlreadyExists = await User.findOne({email})
    if(emailAlreadyExists){
        throw new CustomError.BadRequestError("Email already exists")
    }
    
    // first registered user is admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';


    const user = await User.create({name, email, password, role})
    const tokenUser = {name:user.name, userId:user._id, role:user.role}

    const token = createJWT({payload: tokenUser}) // createJWT method comes from utils under jwt.js, we are passing payload in it.

    const oneDay = 1000 * 60 * 60 * 24

    //setting the cookie -- we are connecting the token with cookie and sending back as response in the browser
    res.cookie('token',token,{httpOnly:true, expires:new Date(Date.now() + oneDay)})

    res.status(StatusCodes.CREATED).json({user: tokenUser}) // status code for CREATED is 201

    
}

const login = async (req,res)=>{
    res.send('login user')
}

const logout = async (req,res)=>{
    res.send('logout user')
}

module.exports = {
    register,
    login,
    logout
}