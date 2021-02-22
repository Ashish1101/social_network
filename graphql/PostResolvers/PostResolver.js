import { errorName } from "../../Error/Constant.js";
import Post from "../../models/Post.js";
import User from "../../models/User.js";
import Comment from "../../models/Comment.js";
import { userDetails } from "../../utils/userPopulate.js";
import { timeFormat } from "../../utils/time.js";
import mongoosePkg  from 'mongoose';


export default {
	//mutation add post
	createPost: async (args, req) => {
		if (!req.isAuth) {
			throw new Error(errorName.UNAUTHORIZED);
		}
		try {
			const user = await User.findById(req.userId);
			console.log("user", req.userId);

			if (!user) {
				throw new Error(errorName.UNAUTHORIZED);
			} else {
				let post = new Post({
					title: args.title,
					user: req.userId,
				});

				console.log("before saving", post.id);
				user.posts.push(post.id);
				await post.save();
				await user.save();

				console.log("after saving", post.id);

				return { ...post._doc, _id: post.id, user: user._doc };
			}
		} catch (err) {
			throw err;
		}
	},
	//mutation update post
	updatePost: async (args, req) => {
		if (!req.isAuth) {
			throw new Error(errorName.UNAUTHORIZED);
		}
		try {
			const post = await Post.findById(args._id)
				.populate("user")
				.select("-password");
			if (!post) {
				throw new Error(errorName.POST_NOT_FOUND);
			}
			if (!post) {
				throw new Error(errorName.POST_NOT_FOUND);
			}

			await Post.updateOne(
				{ _id: post.id },
				{ $set: { title: args.title } },
				{ new: true }
			);
			return { ...post._doc };
		} catch (err) {
			throw err;
		}
	},
	//mutation delete a post
	deletePost: async (args, req) => {
		if (!req.isAuth) {
			throw new Error(errorName.UNAUTHORIZED);
		}
		try {
			const post = await Post.findById(args._id);
			const user = await User.findById(req.userId);
			if (!post) {
				throw new Error(errorName.POST_NOT_FOUND);
			}
			//removingg the post from user list
			await user.posts.pull({ _id: args._id });
			await user.save();

			//deleting post from database
			await post.remove();

			return "Post deleted!";
		} catch (error) {
			throw error;
		}
	},

	//query read all post by a user
	readPostsOfUser: async (args, req) => {
		if (!req.isAuth) throw new Error(errorName.UNAUTHORIZED);

		try {
			const user = await User.findById(req.userId) //req.userId
				.populate({
					path:'posts',
					populate: {path: 'comments' , populate:  {path:'user'}}
				})
				.select("-password");
			
			//task fetch all post by user and show thier comment and like also
			console.log(...user.posts);

			if (!user) {
				throw new Error(errorName.EMAILNOTFOUND);
			}

			//  await user.save();
			// , comments:[...user._doc.posts.map(post => post.comments)]
			return { ...user._doc, posts: user.posts };
		} catch (err) {
			throw err;
		}
	},

	//query readSingle post data
	readSinglePost: async (args, req) => {
		if (!req.isAuth) throw new Error(errorName.UNAUTHORIZED);
		try {
			const post = await Post.findById(args._id).populate({
				path:'comments',
				populate: {path:'user'}
			}).populate({
				path:'likes',
				populate: {path: 'user'}
			})

			console.log('user ', post.user)

			if (!post) {
				throw new Error(errorName.POST_NOT_FOUND);
			}


			return { ...post._doc, createdAt: timeFormat(post.createdAt) , user:userDetails(post.user)};
		} catch (err) {
			throw err
		}
	},

	//mutation addComment
    addComment: async (args , req) => {
		if (!req.isAuth) throw new Error(errorName.UNAUTHORIZED);
		try {
			const post = await Post.findById(args._id);
			const user = await User.findById(req.userId);
			if(!post) throw new Error(errorName.POST_NOT_FOUND);
			else {
				const comment = new Comment({
					title:args.title,
					user: user._id
				});
				console.log(comment.user);
				// console.log(comment.commentUser?._id)
				await post.comments.push(comment._id);
				await post.save();
				await comment.save();
				return {_id : comment._id , title:comment.title , user:userDetails(comment.user)};
			}
		} catch (err) {
			throw err
		}
	},

	//mutation delete Comment
	deleteComment: async (args , req) => {
        if(!req.isAuth) {
			throw new Error(errorName.UNAUTHORIZED);
		}
		try {
			const post = await Post.findById(args.postId);
			if(!post) {
				throw new Error(errorName.POST_NOT_FOUND);
			}
			const commentTodelete = await Comment.findById(args.commentId);
			console.log('commentId' ,typeof mongoosePkg.Types.ObjectId(args.commentId))
			console.log('post id' ,typeof args.postId)
			const comment = mongoosePkg.Types.ObjectId(args.commentId)
			post.comments.pull({_id:comment});
			await post.save();
			await commentTodelete.remove();
			return "Comment deleted";
		} catch (err) {
			throw err;
		}
	},

	//mutation edit Comment

	editComment: async (args , req) => {
           if(!req.isAuth) {
			   throw new Error(errorName.UNAUTHORIZED);
		   }
		   try {
			   const comment = await Comment.findById(args.commentId);
			   if(!comment) {
				   throw new Error(errorName.COMMENT_NOT_FOUND);
			   }
			   
			   await Comment.updateOne(
				   {_id:args.commentId},
				   {$set:{title:args.title}},
				   {new:true}
			   );
			   console.log('comment!' , comment)
			   return {...comment._doc , _id:comment._id}
		   } catch (err) {
			   throw err;
		   }
	},
	//mutation  Like
	likePost: async (args , req) => {
         if(!req.isAuth) {
			 throw new Error(errorName.UNAUTHORIZED);
		 }
		 try {
			 const post = await Post.findById(args.postId);
			 if(!post) {
				 throw new Error(errorName.POST_NOT_FOUND);
			 }
             if(post.likes.includes(req.userId)) {
				 post.likes.pull({_id:req.userId})
			 } else {
				post.likes.push(req.userId);
			 }
			 
			
			 const returnId = mongoosePkg.Types.ObjectId(req.userId)

			//check weather the user already likes the post or not
			
			 await post.save();
			 return returnId;
		 } catch (err) {
			 throw err
		 }
	},

	dislikePost: async (args , req) => {
		if(!req.isAuth) {
			throw new Error(errorName.UNAUTHORIZED);
		}
		try {
			const post = await Post.findById(args.postId);
			 if(!post) {
				 throw new Error(errorName.POST_NOT_FOUND);
			 }
			 post.likes.pull({_id:req.userId});
			 await post.save();
			 return true;
		} catch (err) {
			throw err;
		}
	}

};
