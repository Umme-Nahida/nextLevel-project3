import mongoose from "mongoose";
import app from "./app";

const port = 5000;

let server;



const startServer = async () => {

    try {

        await mongoose.connect('mongodb+srv://book-library:aucOFK9UWShWdgt9@cluster0.ytj0kf8.mongodb.net/booksLibrary?retryWrites=true&w=majority&appName=Cluster0');
        // console.log('connected to mongodb')
        server = app.listen(port, () => {
            console.log(`books library listening on ports ${port}`)
        })


    } catch (error) {
        console.log(error);
        process.exit(1)
    }


}

startServer()