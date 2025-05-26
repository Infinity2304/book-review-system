import mongoose from "mongoose";

const connectToMongoDB = async()=>{
    try {
        await mongoose.connect(process.env.DBURL);
        console.log('Connection to mongoDB successful');
        
    } catch (error) {
        console.log('Error connecting to mongoDB',error.message);
    }
}

export default connectToMongoDB;