import { errorName } from '../../Error/Constant.js';
import Post from '../../models/Post.js';
import User from '../../models/User.js';

export default  {
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


               return {...post._doc , _id : post.id , user : user._doc}
           }
       } catch (err) {
           throw err
       }
    }
}