import express from 'express';
import dotenv from 'dotenv'
import morgan from 'morgan'
import {graphqlHTTP} from 'express-graphql'
import chalk from 'chalk'
import Schema from './graphql/Schema.js'
import rootResolver from './graphql/Resolvers.js'
import mongoDb from './config/db.js'
import {getErrorCode} from './Error/Constant.js'
//enviorment var
dotenv.config();
mongoDb();


const app = express();
const PORT = process.env.PORT || 5000;
app.use(morgan('dev'));



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