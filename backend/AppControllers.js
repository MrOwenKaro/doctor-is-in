import bcrpyt from 'bcryptjs'
import User from './Model/UserSchema.js'
import pkg from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()
import multer from 'multer'
import fs from 'fs'
import CreatedPost from './Model/CreatedPostSchema.js'
const uploadMiddleware = multer({ dest: 'uploads/' })


export const RegisterUser = async (req,res) => {
    try {
       const {
        username,
        password
    } = req.body

    const salt = await bcrpyt.genSalt()
    const hashedpassword =await bcrpyt.hash(password,salt) 

    const RegUser = new User({
        username,
        password:hashedpassword
    })

    const saveUser = await RegUser.save() 

    res.status(201).json(saveUser)


    } catch (error) {
        res.status(401).json(error.message)
    }
    



}

export const LoginUser = async (req,res) => {
    try {
        const {username} = req.body;
        const user = await User.findOne({username:username})
        if (!user) return res.status(500).json({msg:"The entered user doesnt exist"})

        const verifypassword = await bcrpyt.compare(req.body.password, user.password)
        if(!verifypassword) return res.status(500).json({msg:"Please enter the correct password"})

        const token = pkg.sign({id:user.id}, process.env.SECRET)
        const {password,...others} = user._doc

        res.cookie('token',token,{httpOnly:true , sameSite: 'none', secure:true}).status(201).send(others)
    } catch (error) {
        res.status(401).json(error.message)
    }

}

export const RetrieveAllUsers = async (req,res) => {
    try {
        const fetchedData = await User.find()
        res.status(201).json(fetchedData)
    } catch (error) {
        res.status(401).json(error.message)
    }
}

export const Logout = (res,req) => {
    res.cookie('token','').status(200).json({msg:"User was logged out"})

}

export const CreatePost = async (req,res) => {

    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path,newPath)
    
    const {token} = req.cookies
    pkg.verify(token,process.env.SECRET,{}, async (err,info)=>{
        if(err) throw err


        const {
        title,
        summary,
        content,
        
    } = req.body;

    const POOST = await CreatedPost.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id
    })
        res.json(POOST)
       
    })
   
    
    
    

    

   
   

}

export const RetreiveAllPosts = async (req,res) => {
     res.json(await CreatedPost.find().populate('author',['username']).sort({createdAt:-1}).limit(12))
    
}

export const SinglePost = async (req,res) => {
    try {
        const {id} = req.params
        const Singular = await CreatedPost.findById(id).populate('author',['username'])
        res.status(201).json(Singular)  
    } catch (error) {
        res.status(401).json(error.message)
    }
   


}

export const EditArticle = async (req,res) => {
    let newPath = null;
    if (req.file) {
        const {originalname,path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path+'.'+ext;
        fs.renameSync(path,newPath)
    }

    const {token} = req.cookies
    pkg.verify(token,process.env.SECRET,{}, async (err,info)=>{
        if(err) throw err
        

        const {
        id,
        title,
        summary,
        content,
        
    } = req.body;
    const postDoc = await CreatedPost.findById(id)
    const isAuhtor = await JSON.stringify(postDoc?.author) === JSON.stringify(info.id)
    if (!isAuhtor){
        return res.status(400).json('You are Not Permitted to Edit This Document')
    }

    await postDoc.updateOne({
        title,
        summary,
        content,
        cover:newPath ? newPath : postDoc.cover
    })
    
         res.json(postDoc)
       
    })
    
}