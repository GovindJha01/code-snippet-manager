import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected...");
    }catch (error) {
        console.error(`Error: ${error.message}`);
    }
  
};

export default connectDB;