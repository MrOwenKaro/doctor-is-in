import mongoose from "mongoose";

const CreatedPostSchema = new mongoose.Schema(
    {
        title:String,
        summary:String,
        content:String,
        cover:String,
        author:{
            type:mongoose.Schema.Types.ObjectId, ref:'User'
        },

    },{timestamps:true}
)

const CreatedPost = mongoose.model('CreatedPost', CreatedPostSchema)

export default CreatedPost