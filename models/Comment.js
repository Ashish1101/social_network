import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    commentUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    }
})

const Comment = mongoose.model('Comment' , commentSchema);

export default Comment;