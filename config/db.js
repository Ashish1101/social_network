import mongoose from 'mongoose';
import chalk from 'chalk'

const mongoDb = async () => {
    const url = process.env.MONGO_URI
    try {
        const conn = await mongoose.connect(url , {useNewUrlParser:true , useFindAndModify : true,  useUnifiedTopology: true});
        if(conn) {
            
            console.log(chalk.blueBright.bold(`connected to database Port ${conn.connection.port}`))
        }
    } catch (err) {
        throw err
    }
    
}

export default mongoDb;