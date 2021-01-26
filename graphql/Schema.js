import { buildSchema } from "graphql";

const Schema = buildSchema(`
    type User {
        handle : String!
        email : String
        _id : ID!
    }

    type AuthData {
        msg:String!
        token : String!
        _id:ID!
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
        updateUser(_id:ID! , email:String! , handle:String) : User!
        deleteUser(_id:ID!):String!
    }
       
`);

export default Schema;
