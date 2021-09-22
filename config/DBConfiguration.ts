import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {Application} from "express"

dotenv.config()

const port = process.env.PORT
const DB_URL : string = (process.env.DB_URL as string)

const connectToDB = async () => {
	try {
		await mongoose.connect(DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		})
		console.log('***SUCCESSFULLY CONNECTED TO MONGO_DB***')
	} catch (error) {
		console.log('ERROR WHILE TRY CONNECTING TO DB', error)
		process.exit()
	}
}


const connectToPort = (server:any) => {
	server.listen(port, () => {
		console.log(`__ THE LONELY SERVER IS UP AND RUNNING ON __ ${port}`)
	})
}



export default { connectToDB, connectToPort }
