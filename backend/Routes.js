import express from 'express'
import { CreatePost, EditArticle, LoginUser, Logout, RegisterUser, RetreiveAllPosts, RetrieveAllUsers, SinglePost } from './AppControllers.js'
import multer from 'multer'
const uploadMiddleware = multer({ dest: 'Uploads/' })

const Router = express.Router()

Router.post('/RegisterUser', RegisterUser)
Router.post('/Login', LoginUser)
Router.get('/RetrieveAllUsers', RetrieveAllUsers)
Router.post('/Logout', Logout)
Router.post('/CreatePost',uploadMiddleware.single('file'), CreatePost)
Router.get('/RetrieveAllPosts', RetreiveAllPosts)
Router.get('/SinglePost/:id', SinglePost )
Router.put('/EditArticle',uploadMiddleware.single('file'), EditArticle)

export default Router
