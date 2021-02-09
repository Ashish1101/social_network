import express from 'express';
import dotenv from 'dotenv'
import morgan from 'morgan'
import {graphqlHTTP} from 'express-graphql'
import chalk from 'chalk'
import Schema from './graphql/Schema.js'
import rootResolver from './graphql/Resolvers.js'
import mongoDb from './config/db.js'
import cors from 'cors'
import {getErrorCode} from './Error/Constant.js'
import isAuth from './config/auth.js'
//enviorment var
dotenv.config();
mongoDb();


const app = express();
const PORT = process.env.PORT || 5000;
app.use(morgan('dev'));
app.use(cors({
   origin:'http://localhost:3000',
   optionsSuccessStatus:200
}))
app.use(isAuth)
app.use(express.json());
app.use(express.urlencoded({extended:true}))


//graphql server
app.use('/graphql' , graphqlHTTP({
    schema:Schema,
    rootValue: rootResolver,
    graphiql: true,
    customFormatErrorFn : (err) => {
        const error = getErrorCode(err.message)
        console.log(chalk.red('custom error message') , err.message)
        return ({message:error.message , statusCode:error.statusCode})
    }
}));





app.listen(PORT , () => console.log(chalk.yellowBright.bold(`server is running on ${PORT}`)))