import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import multer from "multer";
import { fileURLToPath } from "url";
import { register, login, update } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { authenticationMiddleware } from "./middleware/auth.js";
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

// Configurations
const app = express();
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// File Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

// Routes
app.post('/auth/register', upload.single('picture'), register); // upload is middleware here so without going to real logic, i.e, register our middleware runs, i.e, we upload that file
app.patch('/auth/update/:id', upload.single('picture'), update);
app.post('/posts', authenticationMiddleware, upload.single('picture'), createPost);
app.post('/auth/login', login);

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// Mongoose Setup
const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => console.log('Connected'));

        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();


// https://www.npmjs.com/package/helmet
// Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!

// Cross-origin resource sharing (CORS) is a mechanism that allows a client application to request restricted resources hosted on server from a different origin.
// These resources may include; web fonts, videos, scripts, iframes, images and stylesheets.
// https://www.geeksforgeeks.org/use-of-cors-in-node-js/
// CORS is an HTTP-header based mechanism implemented by the browser which allows a server or an API to indicate any origins other than its origin from which the unknown origin gets permission to access and load resources.
// The cors package available in the npm registry is used to tackle CORS errors in a Node.js application.

// https://www.npmjs.com/package/morgan
// Morgan is HTTP request logger middleware for node.js

// https://www.npmjs.com/package/body-parser
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

// https://www.npmjs.com/package/multer
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
// multer.diskStorage:
// The disk storage engine gives you full control on storing files to disk locally.
// There are two options available, destination and filename. They are both functions that determine where the file should be stored.
// destination is used to determine within which folder the uploaded files should be stored. This can also be given as a string (e.g. '/tmp/uploads').
// If no destination is given, the operating system's default directory for temporary files is used.
// filename is used to determine what the file should be named inside the folder.
// If no filename is given, each file will be given a random name that doesn't include any file extension.
