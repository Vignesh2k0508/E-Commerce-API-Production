const getAllUsers = async(req,res)=>{
    res.send('get all users route')
}

const getSingleUser = async(req,res)=>{
    res.send("Get single user")
}

const ShowCurrentUser = async(req, res)=>{
    res.send("Show current user")
}

const updateUser = async (req,res)=>{
    res.send(req.body)
}

const updateUserPassword = async (req,res) => {
    res.send(req.body)
}

module.exports ={
    getAllUsers,
    getSingleUser,
    ShowCurrentUser,
    updateUser,
    updateUserPassword
}