import { buildSchema } from "graphql";

const Schema = buildSchema(`
    type User {
        handle : String!
        email : String
        _id : ID!
    }

    type Comment {
        title : String!
        user: User!
    }

    type Post {
        title : String!
        _id : ID!
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
     
    }

    type Mutation {
        addUser(email:String! , password:String! , handle:String!) : User!
        loginUser(email:String! , password:String!): AuthData!
        updateUser(email:String! , handle:String) : User!
        deleteUser(_id:ID!):String!
        createPost(title:String!) : Post!
        updatePost(title:String! , _id:ID!) : Post!
    }
       
`);

export default Schema;
