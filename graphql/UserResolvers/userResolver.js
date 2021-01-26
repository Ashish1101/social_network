import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { errorName } from "../../Error/Constant.js";

const userResolver = {
	addUser: async (args) => {
		try {
			let user = await User.findOne({ email: args.email });
			if (user) {
				throw new Error(errorName.EMAILTAKEN);
			} else {
				if (!args.email.endsWith("@gmail.com")) {
					throw new Error(errorName.GMAILSUPPORT);
				}
				user = new User({
					email: args.email,
					password: args.password,
					handle: args.handle,
				});
				const handleFilter = await User.find();
				const existingHandle = handleFilter.find(
					(user) => user.handle === args.handle
				);
				if (existingHandle) {
					throw new Error(errorName.HANDLETAKEN);
				}
				user.handle = `@${user.handle}`;
				const salt = await bcryptjs.genSalt(10);
				user.password = await bcryptjs.hash(args.password, salt);
				await user.save();
				return { ...user._doc, _id: user._id };
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
				const token = jwt.sign(
					{ userId: user._doc.id },
					process.env.JWT_SECRET,
					{ expiresIn: "1h" }
				);
				return { msg: "Login successfull", token: token, _id: user._id };
			}
		} catch (err) {
			throw err;
		}
	},
	updateUser: async (args, req) => {
		//  if(!req.isAuth) {
		//      throw new Error(errorName.UNAUTHORIZED);
        //  }
        
        //todo change arg._id  with req.userId
		try {
			const user = await User.findById(args._id);
			if (!user) {
				throw new Error(errorName.EMAILNOTFOUND);
			} else {
				 await User.updateOne(
					{ _id: args._id },
					{
						$set: {
							email: args.email || user.email,
							handle: args.handle || user.handle,
						},
					},
					{ new: true  , upsert:true}
                );
               const newUser = await User.findById(args._id);
               return {...newUser._doc , _id : newUser._id}
			}
		} catch (err) {
			throw err;
		}
    },
    deleteUser:  async (args) => {
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
    }
};

export default userResolver;
