import userResolver from './UserResolvers/userResolver.js'
import postResolver from './PostResolvers/PostResolver.js'
const rootResolver = {
    ...userResolver,
    ...postResolver
}

export default rootResolver