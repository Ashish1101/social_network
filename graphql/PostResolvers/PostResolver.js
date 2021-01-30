import { errorName } from '../../Error/Constant.js';
import Post from '../../models/Post.js';
import User from '../../models/User.js';
import {timeFormat} from '../../utils/time.js'

export default  {
    //mutation
    createPost : async (args , req) => {
        if(!req.isAuth) {
            throw new Error(errorName.UNAUTHORIZED)
        }
       try {
           const user = await User.findById(req.userId);
           console.log('user' , req.userId)
           
           if(!user) {
               throw new Error(errorName.UNAUTHORIZED)
           } else {
               let post = new Post({
                   title: args.title,
                   user : req.userId
               })

               console.log('before saving' , post.id)
               user.posts.push(post.id);
               await post.save();
               await user.save();
               

               console.log('after saving' , post.id)


               return {...post._doc , _id : post.id , user : user._doc }
           }
       } catch (err) {
           throw err
       }
    },
    //mutation
    updatePost : async (args , req) => {
        if(!req.isAuth) {
            throw new Error(errorName.UNAUTHORIZED)
        }
         try {
            const post = await Post.findById(args._id).populate('user').select('-password')
            if(!post) {
                throw new Error(errorName.POST_NOT_FOUND)
            }
            if(!post) {
                throw new Error(errorName.POST_NOT_FOUND)
            }
            
            await Post.updateOne({_id:post.id} , {$set:{title:args.title}} , {new:true})
            return {...post._doc}
         } catch (err) {
             throw err;
         }
    },
    //mutation
    deletePost: async (args , req) => {
        if(!req.isAuth) {
            throw new Error(errorName.UNAUTHORIZED)
        }
        try {
            const post = await Post.findById(args._id);
            const user = await User.findById(req.userId);
            if(!post) {
                throw new Error(errorName.POST_NOT_FOUND)
            }
            //removingg the post from user list
            await user.posts.pull({_id:args._id});
            await user.save();

            //deleting post from database
            await post.remove();

            return "Post deleted!"
        } catch (error) {
            throw error
        }
    },
    readPostsOfUser: async (args, req) => {
         if(!req.isAuth)  throw new Error(errorName.UNAUTHORIZED)
            
         try {
             const user = await User.findById(req.userId).populate('posts').select('-password');
             if(!user) {
                 throw new Error(errorName.EMAILNOTFOUND)
             }
             await user.save();
             return {...user._doc}
         } catch (err) {
             throw err
         }
    },
    
    //query 
    readSinglePost : async (args , req) => {
        if(!req.isAuth)  throw new Error(errorName.UNAUTHORIZED)
        try {
            const post = await Post.findById(args._id).populate('user');
            if(!post) {
                throw new Error(errorName.POST_NOT_FOUND)
            }
            
            return {...post._doc , createdAt:timeFormat(post.createdAt)}
        } catch (err) {
             
        }
    }
}