import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title: {
        type:String,
        required:true
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

} , {timestamps:true})



const Post = mongoose.model('Post' , postSchema);

export default Post;