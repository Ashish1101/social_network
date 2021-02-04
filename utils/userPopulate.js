import User from '../models/User.js'
import Post from '../models/Post.js'

export const userDetails = async (userID) => {
    try {
        const user = await User.findById(userID);
        return {...user._doc}
    } catch (err) {
        throw err
    }
}

export const commentDetails = async (postId) => {
        try {
            const post = await Post.findById(postId).populate('comments')
            return post
        } catch (err) {
            throw err
        }
}