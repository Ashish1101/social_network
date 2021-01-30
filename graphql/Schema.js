import { buildSchema } from "graphql";

const Schema = buildSchema(`
    type User {
        handle : String!
        email : String
        _id : ID!
        posts: [Post]!
    }

    type Comment {
        title : String!
        user: User!
    }

    type Post {
        title : String!
        _id : ID!
        createdAt:String!
        user : User!
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
       readPostsOfUser: User!
       readSinglePost(_id:ID!):Post!
    }

    type Mutation {
        addUser(email:String! , password:String! , handle:String!) : User!
        loginUser(email:String! , password:String!): AuthData!
        updateUser(email:String! , handle:String) : User!
        deleteUser(_id:ID!):String!
        createPost(title:String!) : Post!
        updatePost(title:String! , _id:ID!) : Post!
        deletePost(_id:ID!) : String!
     
    }
       
`);

export default Schema;
