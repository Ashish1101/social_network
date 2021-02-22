import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { errorName } from "../../Error/Constant.js";

const userResolver = {
	addUser: async (args) => {
		try {
			let user = await User.findOne({ email: args.email });
			if (user) {
				// throw new Error(errorName.EMAILTAKEN);
				throw new Error('Email already exists')
			} else {
				if (!args.email.endsWith("@gmail.com")) {
					// throw new Error(errorName.GMAILSUPPORT);
					throw new Error('We only support gmail address')
				}
				user = new User({
					email: args.email,
					password: args.password,
					handle:''
				});
				//Task to find out handle if exists then do not create account
				 
				const gethandle = user.email.split('@');
				console.log(gethandle)

				user.handle = `@${gethandle[0]}`;
				const salt = await bcryptjs.genSalt(10);
				user.password = await bcryptjs.hash(args.password, salt);
				await user.save();
				return { ...user._doc, _id: user._id , msg:"Registered successfully." };
			}
		} catch (err) {
			// console.log(err);
			throw err;
		}
	},
	loginUser: async (args) => {
		try {
			const user = await User.findOne({ email: args.email });
			if (!user) {
				throw new Error(errorName.EMAILNOTFOUND);
			} else {
				const isMatch = await bcryptjs.compare(args.password, user.password);
				if (!isMatch) {
					throw new Error(errorName.CREDENTIAL_INVALID);
				}
				
				const payload = {
					userId : user.id
				}
				const token = jwt.sign(
					payload,
					process.env.JWT_SECRET,
					{ expiresIn: "1h" }
				);
				return { msg: "Login successfull", token: token, userId: user.id };
			}
		} catch (err) {
			throw err;
		}
	},
	updateUser: async (args, req) => {
		 if(!req.isAuth) {
		     throw new Error(errorName.UNAUTHORIZED);
         }
        
        //todo change arg._id  with req.userId
		try {
			console.log('user id ', req.userId)
			console.log('isAuth' , req.isAuth)
			const user = await User.findById(req.userId);
			console.log('id' , user._id)
			if (!user) {
				throw new Error(errorName.EMAILNOTFOUND);
			} else {
				 await User.updateOne(
					{ _id: req.userId },
					{
						$set: {
							email: args.email || user.email,
							handle: args.handle || user.handle,
						},
					},
					{ new: true  , upsert:true}
                );
               const newUser = await User.findById(req.userId);
               return {...newUser._doc , _id : newUser._id}
			}
		} catch (err) {
			throw err;
		}
    },
    deleteUser:  async (args) => {
		if(!req.isAuth) {
			throw new Error(errorName.UNAUTHORIZED);
		}
           try {
               const removeUser = await User.findById(args._id);
               if(!removeUser) {
                   throw new Error(errorName.EMAILNOTFOUND)
               }

               await removeUser.remove();

               return "Account Deleted!"
           } catch (err) {
               throw err;
           }
	},
	getUserByID: async (args , req) => {
		if(!req.isAuth) {
			throw new Error(errorName.UNAUTHORIZED);
		}
        try {
			const user = await User.findById(args._id).select('-posts');
			if(!user) {
				throw new Error(errorName.EMAILNOTFOUND)
			}
			console.log(user)
			return {user}
		} catch (err) {
			throw err
		}
	},
	getUserByHandle: async (args , req) => {
		if(!req.isAuth) {
			throw new Error(errorName.UNAUTHORIZED);
		}
		try {
			const user = await User.findOne({handle:args.handle}).populate({
				path:'posts',
				populate: {path:'comments', populate: {path: 'user'}}
			}).select('-password')
			if(!user) {
				throw new Error(errorName.EMAILNOTFOUND)
			}
			return {...user._doc}
		} catch (error) {
			throw error
		}
	}
};

export default userResolver;
