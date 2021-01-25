import { buildSchema } from "graphql";

const Schema = buildSchema(`
    type User {
        handle : String!
        email : String!
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
        addUser(email:String! , password:String! , handle:String!) : User!
        loginUser(email:String! , password:String!): AuthData!
    }
       
`);

export default Schema;
