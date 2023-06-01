import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import * as dotenv from 'dotenv'
import Router from './Routes.js'
import cookieParser from 'cookie-parser';
import path from 'path';
import {fileURLToPath} from 'url';
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = process.env.PORT
const atlas = process.env.ATLAS


app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser())
app.use('/Uploads', express.static(__dirname + '/Uploads'))
app.use(express.static(__dirname + '/public'));
app.use(cors({origin:"https://6478beeba1897d22ccdefc05--ephemeral-starburst-109f59.netlify.app", credentials:true}))

app.use('/api',Router)

app.listen(port,()=>{
    console.log(`Server is live on port ${port}`)
})

mongoose.connect(atlas,{useNewUrlParser:true})
const connect = mongoose.connection
connect.once('open',()=>{
    console.log('Mongo is now listening')
})
