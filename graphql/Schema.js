import { buildSchema } from "graphql";

const Schema = buildSchema(`
    type User {
        handle : String!
        email : String
        _id : ID!
        posts: [Post]!
        msg:String!
    }

    type Comment {
        _id:ID!
        createdAt:String!
        title:String!
        user:User
    }

    type Post {
        title : String!
        _id : ID!
        comments:[Comment]!
        createdAt:String!
        user : User!
        likes: [User]
    }
    
    type AuthData {
        msg:String!
        token : String!
        userId:ID!
    }

    type updateUser {
        user : User!
    }


    type Query {
       showUser(email:String!) : User!
       readPostsOfUser : User!
       readSinglePost(_id:ID!):Post!
       getUserByID(_id:ID!):User!
       getUserByHandle(handle:String!):User!
    }

    type Mutation {
        addUser(email:String! , password:String!) : User!
        loginUser(email:String! , password:String!): AuthData!
        updateUser(email:String! , handle:String) : User!
        deleteUser(_id:ID!):String!


        createPost(title:String!) : Post!
        updatePost(title:String! , _id:ID!) : Post!
        deletePost(_id:ID!) : String!


        addComment(title:String!, _id:ID!):Comment!
        deleteComment(postId:ID! , commentId:ID!):String!
        editComment(commentId:ID! , title:String!):Comment!

        likePost(postId:ID!):ID!
        dislikePost(postId:ID!):ID!
    }
       
`);

export default Schema;
