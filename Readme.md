// --------------------------------------------------//

import express from "express";
import cors from 'cors';

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import profileRoutes from "./routes/profile.route.js"

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import { verifyJWT } from "./middlewares/auth.middleware.js";

/**
 * @module MainApp
 * @description Sets up the Express application, connects to the database,
 * configures middleware, defines API routes, and starts the server.
 */
const app = express();
const PORT = ENV_VARS.PORT;

/**
 * @middleware express.json()
 * @description Middleware to parse incoming requests with JSON payloads.
 */
app.use(express.json());

/**
 * @middleware express.urlencoded({ extended: true })
 * @description Middleware to parse incoming requests with URL-encoded payloads.
 * `extended: true` allows parsing of rich objects and arrays in the URL-encoded format.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * @middleware cookieParser()
 * @description Middleware to parse and handle cookies in incoming requests.
 * Populates `req.cookies` with an object keyed by the cookie names.
 */
app.use(cookieParser());

/**
 * @route /api/v1/auth
 * @description Routes for user authentication (signup, login, logout, auth check).
 * @uses {@link module:AuthRoutes}
 */
app.use("/api/v1/auth", authRoutes);

/**
 * @route /api/v1/profile
 * @description Routes for managing user profiles (create, read, update, delete).
 * All routes under this path are protected by JWT authentication.
 * @middleware {@link module:AuthMiddleware.verifyJWT}
 * @uses {@link module:ProfileRoutes}
 */
app.use("/api/v1/profile", verifyJWT, profileRoutes);

/**
 * @route /api/v1/movie
 * @description Routes for fetching movie data from TMDB.
 * All routes under this path are protected by JWT authentication.
 * @middleware {@link module:AuthMiddleware.verifyJWT}
 * @uses {@link module:MovieRoutes}
 */
app.use("/api/v1/movie", verifyJWT, movieRoutes);

/**
 * @route /api/v1/tv
 * @description Routes for fetching TV show data from TMDB.
 * All routes under this path are protected by JWT authentication.
 * @middleware {@link module:AuthMiddleware.verifyJWT}
 * @uses {@link module:TvRoutes}
 */
app.use("/api/v1/tv", verifyJWT, tvRoutes);

/**
 * @route /api/v1/search
 * @description Routes for searching movies, TV shows, and people, and managing search history.
 * All routes under this path are protected by JWT authentication.
 * @middleware {@link module:AuthMiddleware.verifyJWT}
 * @uses {@link module:SearchRoutes}
 */
app.use("/api/v1/search", verifyJWT, searchRoutes);

/**
 * @middleware cors()
 * @description Middleware to enable Cross-Origin Resource Sharing (CORS).
 * This allows requests from different domains to access the API.
 */
app.use(cors());

/**
 * @listens {number} PORT
 * @param {function} callback - Function to execute once the server starts listening.
 * @description Starts the Express server and listens for incoming requests on the specified port.
 * It also calls the `connectDB()` function to establish a connection to the MongoDB database.
 */
app.listen(PORT, () => {
    console.log("Server is running at localhost: " + PORT);
    connectDB();
});

This code sets up the main Express application for the AuraStream backend.

import express from "express";: Imports the Express library for creating the web server.

import cors from 'cors';: Imports the cors middleware to handle Cross-Origin Resource Sharing.

import authRoutes from "./routes/auth.route.js";: Imports the authentication routes.

import movieRoutes from "./routes/movie.route.js";: Imports the movie-related routes.

import tvRoutes from "./routes/tv.route.js";: Imports the TV show-related routes.

import searchRoutes from "./routes/search.route.js";: Imports the search-related routes.

import profileRoutes from "./routes/profile.route.js";: Imports the user profile management routes.

import { ENV_VARS } from "./config/envVars.js";: Imports environment variables, including the server port.

import { connectDB } from "./config/db.js";: Imports the function to connect to the MongoDB database.

import cookieParser from "cookie-parser";: Imports the middleware for parsing cookies.

import { verifyJWT } from "./middlewares/auth.middleware.js";: Imports the middleware for verifying JWT tokens for authentication.

const app = express();: Creates an instance of the Express application.

const PORT = ENV_VARS.PORT;: Retrieves the server port from the environment variables.

app.use(express.json());: Middleware to parse incoming JSON requests.

app.use(express.urlencoded({ extended: true }));: Middleware to parse URL-encoded 1  request bodies. extended: true allows for parsing complex data structures.   

// --------------------------------------------------//


import mongoose, { Mongoose } from "mongoose";
import { ENV_VARS } from "./envVars.js";

/**
 * @async
 * @function connectDB
 * @description Establishes a connection to the MongoDB database using the URI provided in the environment variables.
 * @returns {Promise<void>} A Promise that resolves when the database connection is successful or rejects if the connection fails.
 */
export const connectDB = async () => {
    try {
        /**
         * @constant {Mongoose} conn - The Mongoose connection object returned after successfully connecting to MongoDB.
         */
        const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
        console.log("MongoDB connected: " + conn.connection.host);
    } catch (error) {
        console.log("MongoDb connection failed: " + error.message);
        /**
         * @function process.exit
         * @description Terminates the current Node.js process. A non-zero exit code (like 1) indicates an error.
         * @param {number} 1 - The exit code indicating failure.
         */
        process.exit(1); // 0 means successful
    }
};

JavaScript

import mongoose, { Mongoose } from "mongoose";
import { ENV_VARS } from "./envVars.js";

/**
 * @async
 * @function connectDB
 * @description Establishes a connection to the MongoDB database using the URI provided in the environment variables.
 * @returns {Promise<void>} A Promise that resolves when the database connection is successful or rejects if the connection fails.
 */
export const connectDB = async () => {
    try {
        /**
         * @constant {Mongoose} conn - The Mongoose connection object returned after successfully connecting to MongoDB.
         */
        const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
        console.log("MongoDB connected: " + conn.connection.host);
    } catch (error) {
        console.log("MongoDb connection failed: " + error.message);
        /**
         * @function process.exit
         * @description Terminates the current Node.js process. A non-zero exit code (like 1) indicates an error.
         * @param {number} 1 - The exit code indicating failure.
         */
        process.exit(1); // 0 means successful
    }
};
Documentation:

This code defines an asynchronous function connectDB that is responsible for establishing a connection to a MongoDB database.

Imports:

mongoose: The Mongoose library, which provides an elegant way to interact with MongoDB.
Mongoose: A type import from Mongoose for type hinting.
ENV_VARS: An object imported from ./envVars.js, presumably containing environment variables for the application, including the MongoDB connection URI.
connectDB Function:

This is an async function, meaning it uses promises for handling asynchronous operations.
try...catch Block: It uses a try...catch block to handle potential errors during the database connection process.
mongoose.connect(ENV_VARS.MONGO_URI): This line attempts to connect to the MongoDB database. It uses the connect method from the Mongoose library and takes the MongoDB URI as an argument. The URI is expected to be stored in the MONGO_URI property of the ENV_VARS object.
conn: The result of mongoose.connect() is a Mongoose connection object (Mongoose).
console.log("MongoDB connected: " + conn.connection.host): If the connection is successful, this line logs a message to the console indicating that the MongoDB database has been connected and displays the host of the connected database. conn.connection.host provides the hostname of the connected database server.
console.log("MongoDb connection failed: " + error.message): If an error occurs during the connection attempt (caught by the catch block), this line logs an error message to the console, displaying the specific error message from the error object.
process.exit(1): If the database connection fails, this line terminates the Node.js process with an exit code of 1. A non-zero exit code typically signals that the process exited due to an error. This is a common practice to indicate a critical failure during application startup.

// --------------------------------------------------//

import dotenv from "dotenv";

/**
 * @module envVars
 * @description This module loads environment variables from a `.env` file and exports them as an object.
 */

// Load environment variables from the .env file into process.env
dotenv.config();

/**
 * @constant {object} ENV_VARS
 * @description An object containing the environment variables used throughout the application.
 * @property {string} MONGO_URI - The URI string used to connect to the MongoDB database. This is typically read from the `MONGO_URI` environment variable.
 * @property {number} PORT - The port number on which the server will listen for incoming requests. It defaults to `3000` if the `PORT` environment variable is not set.
 * @property {string} JWT_SECRET - The secret key used to sign and verify JSON Web Tokens (JWTs) for authentication. It's crucial for the security of your application.
 * @property {string} NODE_ENV - The environment in which the application is currently running (e.g., 'development', 'production', 'test'). This is often used for environment-specific configurations.
 * @property {string} TMDB_API_KEY - The API key required to authenticate requests to the The Movie Database (TMDB) API.
 */
export const ENV_VARS = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    TMDB_API_KEY: process.env.TMDB_API_KEY,
};

This code module (envVars.js) is responsible for loading environment variables and making them accessible throughout the application.

import dotenv from "dotenv";: This line imports the dotenv library, which allows you to load environment variables from a .env file into process.env.

dotenv.config();: This line calls the config() method of the dotenv library. This reads the .env file (if it exists in the project's root directory) and populates the process.env object with the key-value pairs found in the file.

export const ENV_VARS = { ... };: This line defines and exports a constant object named ENV_VARS. This object contains various environment variables that are commonly used within the application.

MONGO_URI: process.env.MONGO_URI: This property holds the MongoDB connection URI. The value is read from the MONGO_URI environment variable that was loaded by dotenv.

PORT: process.env.PORT || 3000: This property determines the port on which the server will run. It first tries to read the value from the PORT environment variable. If the PORT variable is not set, it defaults to 3000.

JWT_SECRET: process.env.JWT_SECRET: This property stores the secret key used for signing and verifying JSON Web Tokens (JWTs). This key is crucial for authentication and should be kept secure. It's read from the JWT_SECRET environment variable.

NODE_ENV: process.env.NODE_ENV: This property indicates the current environment in which the application is running. It's read from the NODE_ENV environment variable (e.g., 'development', 'production', 'test'). This variable is often used for environment-specific configurations or logic.

TMDB_API_KEY: process.env.TMDB_API_KEY: This property holds the API key required to access the The Movie Database (TMDB) API. It's read from the TMDB_API_KEY environment variable.

// --------------------------------------------------//

import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

/**
 * @async
 * @function signup
 * @description Handles the user registration process. It validates user input, checks for existing users,
 * hashes the password, creates a new user in the database, generates a JWT, sets it as a cookie,
 * and returns the user data (excluding the password).
 * @param {Express.Request} req - The Express request object containing user signup data in the body.
 * @param {Express.Response} res - The Express response object used to send the signup status and user data.
 * @returns {Promise<void>}
 */
export async function signup(req, res) {
    try {
        const { email, username, password } = req.body;

        /**
         * @if Checks if any of the required fields (email, username, password) are missing.
         */
        if (!email || !username || !password) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        /**
         * @constant {RegExp} emailRegex - Regular expression to validate the email format.
         */
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        /**
         * @if Checks if the provided email is in a valid format.
         */
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        /**
         * @if Checks if the provided password length is less than 6 characters.
         */
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain atleast 6 characters",
            });
        }

        /**
         * @constant {User | null} existingUserByEmail - Checks if a user with the provided email already exists in the database.
         */
        const existingUserByEmail = await User.findOne({ email: email });

        /**
         * @if Checks if a user with the provided email already exists.
         */
        if (existingUserByEmail) {
            return res
                .status(400)
                .json({ success: false, message: "Email already exists" });
        }

        /**
         * @constant {User | null} existingUserByUsername - Checks if a user with the provided username already exists in the database.
         */
        const existingUserByUsername = await User.findOne({ username: username });

        /**
         * @if Checks if a user with the provided username already exists.
         */
        if (existingUserByUsername) {
            return res
                .status(400)
                .json({ success: false, message: "Username already exists" });
        }

        /**
         * @constant {string} salt - Generates a salt for password hashing.
         */
        const salt = await bcryptjs.genSalt(10);
        /**
         * @constant {string} hashedPassword - Hashes the user's password using the generated salt.
         */
        const hashedPassword = await bcryptjs.hash(password, salt);

        /**
         * @constant {string[]} PROFILE_PICS - An array of default profile picture filenames.
         */
        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
        /**
         * @constant {string} image - Randomly selects a default profile picture.
         */
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        /**
         * @constant {User} newUser - Creates a new User document with the provided data.
         */
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            image,
        });

        /**
         * @function generateTokenAndSetCookie
         * @description Generates a JWT for the new user's ID and sets it as an HTTP-only cookie in the response.
         * @param {mongoose.Types.ObjectId} newUser._id - The ID of the newly created user.
         * @param {Express.Response} res - The Express response object to set the cookie on.
         */
        generateTokenAndSetCookie(newUser._id, res);
        /**
         * @async
         * @method newUser.save
         * @description Saves the new user document to the database.
         */
        await newUser.save();
        res.status(201).json({
            success: true,
            user: {
                ...newUser._doc,
                password: "", // Exclude the password from the response
            },
        });
    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @async
 * @function login
 * @description Handles the user login process. It validates user input, finds the user by email,
 * compares the provided password with the hashed password in the database, generates a JWT,
 * sets it as a cookie, and returns the user data (excluding the password).
 * @param {Express.Request} req - The Express request object containing user login credentials in the body.
 * @param {Express.Response} res - The Express response object used to send the login status and user data.
 * @returns {Promise<void>}
 */
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        /**
         * @if Checks if any of the required fields (email, password) are missing.
         */
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        /**
         * @constant {User | null} user - Finds a user in the database based on the provided email.
         */
        const user = await User.findOne({ email: email });

        /**
         * @if Checks if a user with the provided email exists in the database.
         */
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "Invalid credentials" });
        }

        /**
         * @constant {boolean} isPasswordCorrect - Compares the provided password with the hashed password stored in the user document.
         */
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        /**
         * @if Checks if the provided password matches the stored hashed password.
         */
        if (!isPasswordCorrect) {
            return res
                .status(404)
                .json({ success: false, message: "Invalid credentials" });
        }

        /**
         * @function generateTokenAndSetCookie
         * @description Generates a JWT for the logged-in user's ID and sets it as an HTTP-only cookie in the response.
         * @param {mongoose.Types.ObjectId} user._id - The ID of the logged-in user.
         * @param {Express.Response} res - The Express response object to set the cookie on.
         */
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: "", // Exclude the password from the response
            },
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @async
 * @function logout
 * @description Handles the user logout process by clearing the authentication cookies.
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object used to clear the cookies.
 * @returns {Promise<void>}
 */
export async function logout(req, res) {
    try {
        /**
         * @method res.clearCookie
         * @description Clears the HTTP-only cookie named "jwt-aurastream".
         * @param {string} "jwt-aurastream" - The name of the authentication cookie.
         */
        res.clearCookie("jwt-aurastream");
        /**
         * @method res.clearCookie
         * @description Clears the HTTP-only cookie named "jwt-aurastream-profile".
         * @param {string} "jwt-aurastream-profile" - The name of the profile selection cookie.
         */
        res.clearCookie("jwt-aurastream-profile");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @async
 * @function authCheck
 * @description Middleware/controller to check if the user is authenticated. It relies on the `authenticate` middleware
 * to populate the `req.user` object with the authenticated user's information.
 * @param {Express.Request} req - The Express request object, which should contain the authenticated user data in `req.user`.
 * @param {Express.Response} res - The Express response object used to send the authentication status and user data.
 * @returns {Promise<void>}
 */
export async function authCheck(req, res) {
    try {
        res.status(200).json({
            success: true,
            user: req.user, // The authenticated user object populated by the middleware
        });
    } catch (error) {
        console.log("Error in authCheck controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// --------------------------------------------------//

import { fetchFromTMDB } from "../services/tmbd.service.js";

/**
 * @async
 * @function getTrendingMovie
 * @description Fetches the trending movies of the day from TMDB and returns a random movie from the results.
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object used to send the trending movie data.
 * @returns {Promise<void>}
 */
export async function getTrendingMovie(req, res) {
    try {
        /**
         * @async
         * @function fetchFromTMDB
         * @description Asynchronously fetches data from the TMDB API.
         * @param {string} url - The URL to fetch from the TMDB API.
         * @returns {Promise<object>} A Promise that resolves to the JSON response from the TMDB API.
         */
        const data = await fetchFromTMDB(
            "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
        );

        /**
         * @constant {object | undefined} randomMovie - Selects a random movie object from the `results` array of the fetched data.
         * The `?.` operator is used for optional chaining to avoid errors if `data.results` is undefined or null.
         */
        const randomMovie =
            data.results[Math.floor(Math.random() * (data.results?.length || 0))];

        /**
         * @returns {Express.Response} 200 OK with a success status and a random trending movie object in the `content` property.
         */
        res.json({ success: true, content: randomMovie });
    } catch (error) {
        console.log("Error in movie controller: ", error);
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message.
         */
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

/**
 * @async
 * @function getMovieTrailers
 * @description Fetches the trailers for a specific movie ID from TMDB.
 * @param {Express.Request} req - The Express request object containing the movie ID in the route parameters.
 * @param {Express.Response} res - The Express response object used to send the movie trailers data.
 * @returns {Promise<void>}
 */
export async function getMovieTrailers(req, res) {
    /**
     * @constant {string} id - The ID of the movie obtained from the route parameters.
     */
    const { id } = req.params;
    try {
        /**
         * @async
         * @function fetchFromTMDB
         * @description Asynchronously fetches data from the TMDB API.
         * @param {string} url - The URL to fetch the movie trailers for the given ID.
         * @returns {Promise<object>} A Promise that resolves to the JSON response from the TMDB API containing the trailers.
         */
        const data = await fetchFromTMDB(
            `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
        );
        /**
         * @returns {Express.Response} 200 OK with a success status and an array of trailers in the `trailers` property.
         */
        res.json({ success: true, trailers: data.results });
    } catch (error) {
        /**
         * @if Checks if the error message indicates a 404 Not Found error from TMDB.
         * @returns {Express.Response} 404 Not Found with a null body if the movie ID is invalid or no trailers are found.
         */
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message for other errors.
         */
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @async
 * @function getMovieDetails
 * @description Fetches the detailed information for a specific movie ID from TMDB.
 * @param {Express.Request} req - The Express request object containing the movie ID in the route parameters.
 * @param {Express.Response} res - The Express response object used to send the movie details data.
 * @returns {Promise<void>}
 */
export async function getMovieDetails(req, res) {
    /**
     * @constant {string} id - The ID of the movie obtained from the route parameters.
     */
    const { id } = req.params;
    try {
        /**
         * @async
         * @function fetchFromTMDB
         * @description Asynchronously fetches data from the TMDB API.
         * @param {string} url - The URL to fetch the details for the given movie ID.
         * @returns {Promise<object>} A Promise that resolves to the JSON response from the TMDB API containing the movie details.
         */
        const data = await fetchFromTMDB(
            `https://api.themoviedb.org/3/movie/${id}?language=en-US`
        );
        /**
         * @returns {Express.Response} 200 OK with a success status and the movie details in the `content` property.
         */
        res.status(200).json({
            success: true,
            content: data,
        });
    } catch (error) {
        /**
         * @if Checks if the error message indicates a 404 Not Found error from TMDB.
         * @returns {Express.Response} 404 Not Found with a null body if the movie ID is invalid or the movie is not found.
         */
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }
        console.log("Error in get movie details controller");
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message for other errors.
         */
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

/**
 * @async
 * @function getSimilarMovies
 * @description Fetches the similar movies for a specific movie ID from TMDB.
 * @param {Express.Request} req - The Express request object containing the movie ID in the route parameters.
 * @param {Express.Response} res - The Express response object used to send the similar movies data.
 * @returns {Promise<void>}
 */
export async function getSimilarMovies(req, res) {
    /**
     * @constant {string} id - The ID of the movie obtained from the route parameters.
     */
    const { id } = req.params;
    try {
        /**
         * @async
         * @function fetchFromTMDB
         * @description Asynchronously fetches data from the TMDB API.
         * @param {string} url - The URL to fetch the similar movies for the given movie ID.
         * @returns {Promise<object>} A Promise that resolves to the JSON response from the TMDB API containing the similar movies.
         */
        const data = await fetchFromTMDB(
            `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
        );
        /**
         * @returns {Express.Response} 200 OK with a success status and the similar movies data in the `similar` property.
         */
        res.status(200).json({
            success: true,
            similar: data,
        });
    } catch (error) {
        /**
         * @if Checks if the error message indicates a 404 Not Found error from TMDB.
         * @returns {Express.Response} 404 Not Found with a null body if the movie ID is invalid or similar movies are not found.
         */
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }
        console.log("Error in get similar movies controller");
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message for other errors.
         */
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

/**
 * @async
 * @function getMoviesByCategory
 * @description Fetches movies based on a specific category from TMDB.
 * @param {Express.Request} req - The Express request object containing the category in the route parameters.
 * @param {Express.Response} res - The Express response object used to send the movies by category data.
 * @returns {Promise<void>}
 */
export async function getMoviesByCategory(req, res) {
    /**
     * @constant {string} category - The category of movies to fetch, obtained from the route parameters (e.g., 'popular', 'top_rated').
     */
    const { category } = req.params;

    try {
        /**
         * @async
         * @function fetchFromTMDB
         * @description Asynchronously fetches data from the TMDB API.
         * @param {string} url - The URL to fetch movies for the given category.
         * @returns {Promise<object>} A Promise that resolves to the JSON response from the TMDB API containing the movies in the specified category.
         */
        const data = await fetchFromTMDB(
            `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`
        );
        /**
         * @returns {Express.Response} 200 OK with a success status and an array of movies in the `content` property.
         */
        res.status(200).json({
            success: true,
            content: data.results,
        });
    } catch (error) {
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message for any errors during the API call.
         */
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// --------------------------------------------------//

import { Profile } from "../models/profile.model.js";
import { generateTokenAndSetCookieOnProfileSelection } from "../utils/generateToken.js";

/**
 * @async
 * @function createProfile
 * @description Handles the creation of a new user profile. It validates the profile name,
 * checks if the user has reached the maximum number of profiles (5), creates the new profile,
 * generates a new token and sets a cookie specific to the selected profile, and returns
 * the created profile details.
 * @param {Express.Request} req - The Express request object containing the profile name and image in the body.
 * The `req.user._id` is expected to be populated by an authentication middleware.
 * @param {Express.Response} res - The Express response object used to send the creation status and profile data.
 * @returns {Promise<void>}
 */
export async function createProfile(req, res) {
    try {
        /**
         * @constant {object} req.body - The request body containing profile creation details.
         * @property {string} profileName - The desired name for the new profile.
         * @property {string} [profileImage] - Optional URL or path to the profile image.
         */
        const { profileName, profileImage } = req.body;
        /**
         * @constant {mongoose.Types.ObjectId} userId - The ID of the authenticated user, obtained from the `req.user` object.
         */
        const userId = req.user._id;

        /**
         * @if Checks if the `profileName` is missing.
         * @returns {Express.Response} 400 Bad Request with an error message if the profile name is not provided.
         */
        if (!profileName) {
            return res.status(400).json({ success: false, message: "Profile name is required" });
        }

        /**
         * @async
         * @method Profile.countDocuments
         * @description Counts the number of profiles associated with the authenticated user.
         * @param {object} { userId } - The query object to count profiles for the specific user.
         * @returns {Promise<number>} A Promise that resolves to the number of profiles belonging to the user.
         */
        const profileCount = await Profile.countDocuments({ userId });
        /**
         * @if Checks if the user has already created the maximum allowed number of profiles (5).
         * @returns {Express.Response} 400 Bad Request with an error message if the user has reached the profile limit.
         */
        if (profileCount >= 5) {
            return res
                .status(400)
                .json({ message: "User cannot have more than 5 profiles." });
        }

        /**
         * @constant {Profile} profile - Creates a new instance of the Profile model with the provided data.
         */
        const profile = new Profile({
            userId,
            profileName,
            profileImage,
        });
        /**
         * @async
         * @method profile.save
         * @description Saves the new profile document to the database.
         * @returns {Promise<Profile>} A Promise that resolves to the saved Profile document.
         */
        await profile.save();
        /**
         * @function generateTokenAndSetCookieOnProfileSelection
         * @description Generates a new JWT specific to the user and the newly created profile ID,
         * and sets it as an HTTP-only cookie in the response.
         * This function is assumed to be defined in the `../utils/generateToken.js` file.
         * @param {string} userIdString - The string representation of the user's ID.
         * @param {string} profileIdString - The string representation of the newly created profile's ID.
         * @param {Express.Response} res - The Express response object on which to set the cookie.
         * @returns {void}
         */
        generateTokenAndSetCookieOnProfileSelection(userId.toString(), profile._id.toString(), res);
        /**
         * @returns {Express.Response} 201 Created with a success status, a success message, and the newly created profile data.
         */
        res.status(201).json({
            success: true,
            message: "Profile created successfully",
            profile: {
                ...profile._doc
            },
        });

    } catch (error) {
        console.error("Error creating profile:", error);
        /**
         * @returns {Express.Response} 500 Internal Server Error with a generic error message.
         */
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @async
 * @function getUserProfiles
 * @description Retrieves all profiles associated with a specific user ID. It also verifies
 * that the requested user ID matches the ID of the authenticated user.
 * @param {Express.Request} req - The Express request object containing the user ID in the URL parameters.
 * The `req.user._id` is expected to be populated by an authentication middleware.
 * @param {Express.Response} res - The Express response object used to send the list


 // --------------------------------------------------//

 import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmbd.service.js";
import mongoose from "mongoose";

/**
 * @async
 * @function searchPerson
 * @description Searches for a person on TMDB based on the provided query and saves the first result to the user's search history for a specific profile.
 * @param {Express.Request} req - The Express request object containing the search query in the URL parameters and the profile ID in the query parameters.
 * The `req.user._id` is expected to be populated by an authentication middleware.
 * @param {Express.Response} res - The Express response object used to send the search results.
 * @returns {Promise<void>}
 */
export async function searchPerson(req, res) {
    /**
     * @constant {string} query - The search query for the person, obtained from the URL parameters.
     */
    const { query } = req.params;
    console.log("req.query", req.query);
    /**
     * @constant {string} profileId - The ID of the profile for which to save the search history, obtained from the query parameters.
     */
    const { profileId } = req.query;
    /**
     * @if Checks if the `profileId` is missing in the query parameters.
     * @returns {Express.Response} 400 Bad Request with an error message if `profileId` is not provided.
     */
    if (!profileId) {
        return res
            .status(400)
            .json({ success: false, message: "profileId is required" });
    }
    try {
        /**
         * @async
         * @function fetchFromTMDB
         * @description Asynchronously fetches data from the TMDB API to search for a person.
         * @param {string} url - The URL to fetch from the TMDB API for person search.
         * @returns {Promise<object>} A Promise that resolves to the JSON response from the TMDB API containing the search results.
         */
        const response = await fetchFromTMDB(
            `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
        );

        /**
         * @if Checks if the search results from TMDB are empty.
         * @returns {Express.Response} 404 Not Found if no results are found for the search query.
         */
        if (response.results.length === 0) {
            return res.status(404).send(null);
        }

        /**
         * @async
         * @method User.findByIdAndUpdate
         * @description Updates the user document by pushing the first search result to the `searchHistory` array.
         * @param {mongoose.Types.ObjectId} req.user._id - The ID of the authenticated user.
         * @param {object} update - The update operation to perform on the document.
         * @param {object} update.$push.searchHistory - The object to push into the `searchHistory` array.
         * @param {number} update.$push.searchHistory.id - The ID of the searched person from TMDB.
         * @param {string | null} update.$push.searchHistory.image - The profile path of the searched person from TMDB.
         * @param {string} update.$push.searchHistory.title - The name of the searched person from TMDB.
         * @param {string} update.$push.searchHistory.searchType - The type of search ("person").
         * @param {Date} update.$push.searchHistory.createdAt - The timestamp of when the search was performed.
         * @param {string} update.$push.searchHistory.profileId - The ID of the profile for which the search was performed.
         * @returns {Promise<object>} A Promise that resolves to the result of the update operation.
         */
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: response.results[0].id,
                    image: response.results[0].profile_path,
                    title: response.results[0].name,
                    searchType: "person",
                    createdAt: new Date(),
                    profileId: profileId,
                },
            },
        });

        /**
         * @returns {Express.Response} 200 OK with a success status and the array of search results from TMDB.
         */
        res.status(200).json({ success: true, content: response.results });
    } catch (error) {
        console.log("Error in searchPerson controller: ", error);
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message.
         */
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @async
 * @function searchMovie
 * @description Searches for a movie on TMDB based on the provided query and saves the first result to the user's search history for a specific profile.
 * @param {Express.Request} req - The Express request object containing the search query in the URL parameters and the profile ID in the query parameters.
 * The `req.user._id` is expected to be populated by an authentication middleware.
 * @param {Express.Response} res - The Express response object used to send the search results.
 * @returns {Promise<void>}
 */
export async function searchMovie(req, res) {
    console.log("req.query", req.query);
    /**
     * @constant {string} query - The search query for the movie, obtained from the URL parameters.
     */
    const { query } = req.params;
    /**
     * @constant {string} profileId - The ID of the profile for which to save the search history, obtained from the query parameters.
     */
    const { profileId } = req.query;
    /**
     * @if Checks if the `profileId` is missing in the query parameters.
     * @returns {Express.Response} 400 Bad Request with an error message if `profileId` is not provided.
     */
    if (!profileId) {
        return res
            .status(400)
            .json({ success: false, message: "profileId is required" });
    }

    try {
        /**
         * @async
         * @function fetchFromTMDB
         * @description Asynchronously fetches data from the TMDB API to search for a movie.
         * @param {string} url - The URL to fetch from the TMDB API for movie search.
         * @returns {Promise<object>} A Promise that resolves to the JSON response from the TMDB API containing the search results.
         */
        const response = await fetchFromTMDB(
            `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
        );

        /**
         * @if Checks if the search results from TMDB are empty.
         * @returns {Express.Response} 404 Not Found if no results are found for the search query.
         */
        if (response.results.length === 0) {
            return res.status(404).send(null);
        }

        /**
         * @async
         * @method User.findByIdAndUpdate
         * @description Updates the user document by pushing the first search result to the `searchHistory` array.
         * @param {mongoose.Types.ObjectId} req.user._id - The ID of the authenticated user.
         * @param {object} update - The update operation to perform on the document.
         * @param {object} update.$push.searchHistory - The object to push into the `searchHistory` array.
         * @param {number} update.$push.searchHistory.id - The ID of the searched movie from TMDB.
         * @param {string | null} update.$push.searchHistory.image - The poster path of the searched movie from TMDB.
         * @param {string} update.$push.searchHistory.title - The title of the searched movie from TMDB.
         * @param {string} update.$push.searchHistory.searchType - The type of search ("movie").
         * @param {Date} update.$push.searchHistory.createdAt - The timestamp of when the search was performed.
         * @param {string} update.$push.searchHistory.profileId - The ID of the profile for which the search was performed.
         * @returns {Promise<object>} A Promise that resolves to the result of the update operation.
         */
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: response.results[0].id,
                    image: response.results[0].poster_path,
                    title: response.results[0].title,
                    searchType: "movie",
                    createdAt: new Date(),
                    profileId: profileId
                },
            },
        });
        /**
         * @returns {Express.Response} 200 OK with a success status and the array of search results from TMDB.
         */
        res.status(200).json({ success: true, content: response.results });
    } catch (error) {
        console.error("Error in searchMovie controller:", error);
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message.
         */
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @async
 * @function searchTv
 * @description Searches for a TV show on TMDB based on the provided query and saves the first result to the user's search history for a specific profile.
 * @param {Express.Request} req - The Express request object containing the search query in the URL parameters and the profile ID in the query parameters.
 * The `req.user._id` is expected to be populated by an authentication middleware.
 * @param {Express.Response} res - The Express response object used to send the search results.
 * @returns {Promise<void>}
 */
export async function searchTv(req, res) {
    /**
     * @constant {string} query - The search query for the TV show, obtained from the URL parameters.
     */
    const { query } = req.params;
    console.log("req.query", req.query);
    /**
     * @constant {string} profileId - The ID of the profile for which to save the search history, obtained from the query parameters.
     */
    const { profileId } = req.query;
    /**
     * @if Checks if the `profileId` is missing in the query parameters.
     * @returns {Express.Response} 400 Bad Request with an error message if `profileId` is not provided.
     */
    if (!profileId) {
        return res
            .status(400)
            .json({ success: false, message: "profileId is required" });
    }

    try {
        /**
         * @async
         * @function fetchFromTMDB
         * @description Asynchronously fetches data from the TMDB API to search for a TV show.
         * @param {string} url - The URL to fetch from the TMDB API for TV show search.
         * @returns {Promise<object>} A Promise that resolves to the JSON response from the TMDB API containing the search results.
         */
        const response = await fetchFromTMDB(
            `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
        );

        /**
         * @if Checks if the search results from TMDB are empty.
         * @returns {Express.Response} 404 Not Found if no results are found for the search query.
         */
        if (response.results.length === 0) {
            return res.status(404).send(null);
        }

        /**
         * @async
         * @method User.findByIdAndUpdate
         * @description Updates the user document by pushing the first search result to the `searchHistory` array.
         * @param {mongoose.Types.ObjectId} req.user._id - The ID of the authenticated user.
         * @param {object} update - The update operation to perform on the document.
         * @param {object} update.$push.searchHistory - The object to push into the `searchHistory` array.
         * @param {number} update.$push.searchHistory.id - The ID of the searched TV show from TMDB.
         * @param {string | null} update.$push.searchHistory.image - The profile path of the searched TV show from TMDB.
         * @param {string} update.$push.searchHistory.title - The name of the searched TV show from TMDB.
         * @param {string} update.$push.searchHistory.searchType - The type of search ("tv").
         * @param {Date} update.$push.searchHistory.createdAt - The timestamp of when the search was performed.
         * @param {string} update.$push.searchHistory.profileId - The ID of the profile for which the search was performed.
         * @returns {Promise<object>} A Promise that resolves to the result of the update operation.
         */
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: response.results[0].id,
                    image: response.results[0].profile_path,
                    title: response.results[0].name,
                    searchType: "tv",
                    createdAt: new Date(),
                    profileId: profileId,
                },
            },
        });

        /**
         * @returns {Express.Response} 200 OK with a success status and the array of search results from TMDB.
         */
        res.status(200).json({ success: true, content: response.results });
    } catch (error) {
        console.log("Error in searchTv controller: ", error);
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message.
         */
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @async
 * @function getSearchHistory
 * @description Retrieves the search history for the authenticated user, filtered by a specific profile ID.
 * @param {Express.Request} req - The Express request object. The `req.user._id` is expected to be populated by an authentication middleware.
 * @param {Express.Response} res - The Express response object used to send the search history.
 * @returns {Promise<void>}
 */
export async function getSearchHistory(req, res) {
    console.log("req.query:", req.query); // Log the query parameters
    console.log("req.user._id", req.user._id);

    /**
     * @constant {string} profileId - The ID of the profile whose search history is being requested, obtained from the query parameters.
     */
    const { profileId } = req.query;

    /**
     * @if Checks if the `profileId` is missing in the query parameters.
     * @returns {Express.Response} 400 Bad Request with an error message if `profileId` is not provided.
     */
    if (!profileId) {
        return res.status(400).json({ success: false, message: "profileId is required" });
    }

    try {
        /**
         * @async
         * @method User.findById
         * @description Queries the database to find the user document by their ID.
         * @param {mongoose.Types.ObjectId} req.user._id - The ID of the authenticated user.
         * @returns {Promise<User | null>} A Promise that resolves to the found User document or null if no user is found.
         */
        const user = await User.findById(req.user._id);

        /**
         * @if Checks if the user document was found.
         * @returns {Express.Response} 404 Not Found with an error message if the user is not found.
         */
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        /**
         * @constant {Array<object>} profileSearchHistory - Filters the user's `searchHistory` array to include only items belonging to the specified `profileId`.
         */
        const profileSearchHistory = user.searchHistory.filter((item) => {
            return item.profileId.toString() === profileId;
        });


        /**
         * @returns {Express.Response} 200 OK with a success status and the filtered search history for the specified profile.
         */
        res.status(200).json({ success: true, content: profileSearchHistory });
    } catch (error) {
        console.error("Error in getSearchHistory:", error);
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message.
         */
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

/**
 * @async
 * @function removeItemFrom


 // --------------------------------------------------//

 import { fetchFromTMDB } from "../services/tmbd.service.js";

/**
 * @async
 * @function getTrendingTv
 * @description Fetches the trending TV shows of the day from TMDB and returns a random TV show from the results.
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object used to send the trending TV show data.
 * @returns {Promise<void>}
 */
export async function getTrendingTv(req, res) {
    try {
        /**
         * @async
         * @function fetchFromTMDB
         * @description Asynchronously fetches data from the TMDB API.
         * @param {string} url - The URL to fetch from the TMDB API.
         * @returns {Promise<object>} A Promise that resolves to the JSON response from the TMDB API.
         */
        const data = await fetchFromTMDB(
            "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
        );
        /**
         * @constant {object | undefined} randomMovie - Selects a random TV show object from the `results` array of the fetched data.
         * The `?.` operator is used for optional chaining to avoid errors if `data.results` is undefined or null.
         */
        const randomMovie =
            data.results[Math.floor(Math.random() * (data.results?.length || 0))];
        /**
         * @returns {Express.Response} 200 OK with a success status and a random trending TV show object in the `content` property.
         */
        res.json({ success: true, content: randomMovie });
    } catch (error) {
        console.log("Error in tv controller");
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message.
         */
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

/**
 * @async
 * @function getTvTrailers
 * @description Fetches the trailers for a specific TV show ID from TMDB.
 * @param {Express.Request} req - The Express request object containing the TV show ID in the route parameters.
 * @param {Express.Response} res - The Express response object used to send the TV show trailers data.
 * @returns {Promise<void>}
 */
export async function getTvTrailers(req, res) {
    /**
     * @constant {string} id - The ID of the TV show obtained from the route parameters.
     */
    const { id } = req.params;
    try {
        /**
         * @async
         * @function fetchFromTMDB
         * @description Asynchronously fetches data from the TMDB API.
         * @param {string} url - The URL to fetch the TV show trailers for the given ID.
         * @returns {Promise<object>} A Promise that resolves to the JSON response from the TMDB API containing the trailers.
         */
        const data = await fetchFromTMDB(
            `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`
        );
        /**
         * @returns {Express.Response} 200 OK with a success status and an array of trailers in the `trailers` property.
         */
        res.json({ success: true, trailers: data.results });
    } catch (error) {
        /**
         * @if Checks if the error message indicates a 404 Not Found error from TMDB.
         * @returns {Express.Response} 404 Not Found with a null body if the TV show ID is invalid or no trailers are found.
         */
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message for other errors.
         */
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @async
 * @function getTvDetails
 * @description Fetches the detailed information for a specific TV show ID from TMDB.
 * @param {Express.Request} req - The Express request object containing the TV show ID in the route parameters.
 * @param {Express.Response} res - The Express response object used to send the TV show details data.
 * @returns {Promise<void>}
 */
export async function getTvDetails(req, res) {
    /**
     * @constant {string} id - The ID of the TV show obtained from the route parameters.
     */
    const { id } = req.params;
    try {
        /**
         * @async
         * @function fetchFromTMDB
         * @description Asynchronously fetches data from the TMDB API.
         * @param {string} url - The URL to fetch the details for the given TV show ID.
         * @returns {Promise<object>} A Promise that resolves to the JSON response from the TMDB API containing the TV show details.
         */
        const data = await fetchFromTMDB(
            `https://api.themoviedb.org/3/tv/${id}?language=en-US`
        );
        /**
         * @returns {Express.Response} 200 OK with a success status and the TV show details in the `content` property.
         */
        res.status(200).json({
            success: true,
            content: data,
        });
    } catch (error) {
        /**
         * @if Checks if the error message indicates a 404 Not Found error from TMDB.
         * @returns {Express.Response} 404 Not Found with a null body if the TV show ID is invalid or the TV show is not found.
         */
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }
        console.log("Error in get movie details controller");
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message for other errors.
         */
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

/**
 * @async
 * @function getSimilarTvs
 * @description Fetches the similar TV shows for a specific TV show ID from TMDB.
 * @param {Express.Request} req - The Express request object containing the TV show ID in the route parameters.
 * @param {Express.Response} res - The Express response object used to send the similar TV shows data.
 * @returns {Promise<void>}
 */
export async function getSimilarTvs(req, res) {
    /**
     * @constant {string} id - The ID of the TV show obtained from the route parameters.
     */
    const { id } = req.params;
    try {
        /**
         * @async
         * @function fetchFromTMDB
         * @description Asynchronously fetches data from the TMDB API.
         * @param {string} url - The URL to fetch the similar TV shows for the given TV show ID.
         * @returns {Promise<object>} A Promise that resolves to the JSON response from the TMDB API containing the similar TV shows.
         */
        const data = await fetchFromTMDB(
            `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`
        );
        /**
         * @returns {Express.Response} 200 OK with a success status and the similar TV shows data in the `similar` property.
         */
        res.status(200).json({
            success: true,
            similar: data,
        });
    } catch (error) {
        /**
         * @if Checks if the error message indicates a 404 Not Found error from TMDB.
         * @returns {Express.Response} 404 Not Found with a null body if the TV show ID is invalid or similar TV shows are not found.
         */
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }
        console.log("Error in get similar tvs controller");
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message for other errors.
         */
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

/**
 * @async
 * @function getTvsByCategory
 * @description Fetches TV shows based on a specific category from TMDB.
 * @param {Express.Request} req - The Express request object containing the category in the route parameters.
 * @param {Express.Response} res - The Express response object used to send the TV shows by category data.
 * @returns {Promise<void>}
 */
export async function getTvsByCategory(req, res) {
    /**
     * @constant {string} category - The category of TV shows to fetch, obtained from the route parameters (e.g., 'popular', 'top_rated').
     */
    const { category } = req.params;

    try {
        /**
         * @async
         * @function fetchFromTMDB
         * @description Asynchronously fetches data from the TMDB API.
         * @param {string} url - The URL to fetch TV shows for the given category.
         * @returns {Promise<object>} A Promise that resolves to the JSON response from the TMDB API containing the TV shows in the specified category.
         */
        const data = await fetchFromTMDB(
            `https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`
        );
        /**
         * @returns {Express.Response} 200 OK with a success status and an array of TV shows in the `content` property.
         */
        res.status(200).json({
            success: true,
            content: data.results,
        });
    } catch (error) {
        /**
         * @returns {Express.Response} 500 Internal Server Error with a success status set to false and an error message for any errors during the API call.
         */
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// --------------------------------------------------//

// auth.middleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";
import { Profile } from "../models/profile.model.js";

/**
 * @async
 * @function verifyJWT
 * @description Middleware to verify the JWT token stored in the `jwt-aurastream` cookie.
 * If the token is valid, it decodes the token, finds the corresponding user and profile (if `profileId` exists in the token),
 * and attaches them to the `req` object. It handles cases where the token is missing, invalid, expired, or if the user or profile is not found.
 * @param {Express.Request} req - The Express request object. It expects the JWT to be present in the `jwt-aurastream` cookie.
 * @param {Express.Response} res - The Express response object used to send unauthorized or error responses.
 * @param {Express.NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Promise<void>}
 */
export const verifyJWT = async (req, res, next) => {
    try {
        /**
         * @constant {string | undefined} token - Retrieves the `jwt-aurastream` cookie from the request.
         */
        const token = req.cookies["jwt-aurastream"];


        /**
         * @if Checks if the JWT token is missing in the cookie.
         * @returns {Express.Response} 401 Unauthorized with an error message if no token is provided.
         */
        if (!token) {
            console.log("No user token");
            return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
        }


        try {
            /**
             * @constant {object} decoded - Verifies the JWT token using the `JWT_SECRET` from the environment variables.
             * If verification is successful, it contains the decoded payload (userId and optionally profileId).
             * @throws {jwt.TokenExpiredError} If the token has expired.
             * @throws {jwt.JsonWebTokenError} If the token is invalid.
             */
            const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
            /**
             * @async
             * @method User.findById
             * @description Finds a user in the database by their ID, which is extracted from the decoded JWT.
             * The `-password` part of the query ensures that the password field is excluded from the returned user object.
             * @param {mongoose.Types.ObjectId} decoded.userId - The user ID extracted from the JWT payload.
             * @returns {Promise<User | null>} A Promise that resolves to the found User document (without the password) or null if no user exists with that ID.
             */
            const user = await User.findById(decoded.userId).select("-password");

            /**
             * @if Checks if a user with the ID from the token exists in the database.
             * @returns {Express.Response} 404 Not Found with an error message if the user is not found.
             */
            if (!user) {
                console.log('No user');
                return res.status(404).json({ success: false, message: "User not found" });
            }
            /**
             * @member {User} req.user - Attaches the found user object to the `req` object, making it accessible in subsequent middleware and route handlers.
             */
            req.user = user;

            /**
             * @if Checks if a `profileId` exists in the decoded JWT payload. This indicates that a specific profile was selected.
             */
            if (decoded.profileId) {
                /**
                 * @async
                 * @method Profile.findById
                 * @description Finds a profile in the database by its ID, which is extracted from the decoded JWT.
                 * @param {mongoose.Types.ObjectId} decoded.profileId - The profile ID extracted from the JWT payload.
                 * @returns {Promise<Profile | null>} A Promise that resolves to the found Profile document or null if no profile exists with that ID.
                 */
                const profile = await Profile.findById(decoded.profileId);
                /**
                 * @if Checks if a profile with the ID from the token exists in the database.
                 * @returns {Express.Response} 404 Not Found with an error message if the profile is not found.
                 */
                if (!profile) {
                    console.log("No profile");
                    return res.status(404).json({ success: false, message: "Profile not found" });
                }
                /**
                 * @member {Profile} req.profile - Attaches the found profile object to the `req` object, making it accessible in subsequent middleware and route handlers.
                 */
                req.profile = profile;
            }

            /**
             * @function next
             * @description Passes control to the next middleware function in the chain.
             */
            next();
        } catch (jwtError) {
            /**
             * @if Checks if the error is an instance of `jwt.TokenExpiredError`.
             * @returns {Express.Response} 401 Unauthorized with a token expired message.
             */
            if (jwtError instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ success: false, message: "Unauthorized - Token expired" });
            } else if (jwtError instanceof jwt.JsonWebTokenError) {
                /**
                 * @if Checks if the error is an instance of `jwt.JsonWebTokenError` (for invalid tokens).
                 * @returns {Express.Response} 401 Unauthorized with an invalid token message.
                 */
                return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
            } else {
                /**
                 * @returns {Express.Response} 401 Unauthorized with a generic invalid token message for other JWT related errors.
                 */
                return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
            }
        }
    } catch (error) {
        console.error("Error in verifyJWT middleware:", error);
        /**
         * @returns {Express.Response} 500 Internal Server Error with a generic error message for errors within the middleware.
         */
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// --------------------------------------------------//

import mongoose from "mongoose";

/**
 * @typedef {object} ProfileSchemaDefinition
 * @property {mongoose.Schema.Types.ObjectId} userId - The ID of the user to whom this profile belongs.
 * It is a reference to the 'User' model and is required.
 * @property {string} profileName - The name of the profile. This field is required.
 * @property {string} profileImage - The URL or path to the profile image. It has a default value of an empty string.
 * @property {Date} createdAt - The timestamp indicating when the profile was created. It defaults to the current date and time.
 * @property {Date} updatedAt - The timestamp indicating when the profile was last updated. It defaults to the current date and time.
 */

/**
 * @constant {mongoose.Schema<ProfileSchemaDefinition>} profileSchema
 * @description Defines the schema for the 'Profile' model in MongoDB.
 */
const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        /**
         * @description Indicates that the `userId` field should be indexed for faster querying.
         */
        index: true,
    },
    profileName: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

/**
 * @constant {mongoose.Model<mongoose.Document<ProfileSchemaDefinition>>} Profile
 * @description Represents the Mongoose model for the 'Profile' collection in MongoDB, based on the `profileSchema`.
 */
export const Profile = mongoose.model("Profile", profileSchema);

This code defines the Mongoose schema and model for user profiles.

import mongoose from "mongoose";: This line imports the Mongoose library, which provides tools for interacting with MongoDB.

profileSchema: This constant holds the definition of the schema for the Profile documents in the MongoDB collection. It's an instance of mongoose.Schema.

userId:

type: mongoose.Schema.Types.ObjectId: Specifies that this field will store MongoDB ObjectIds.
ref: 'User': Creates a reference to the User model. This allows you to easily access the associated user's information using Mongoose's population feature.
required: true: Ensures that every profile document must have a userId.
index: true: Creates an index on the userId field. This will improve the performance of queries that filter or sort by userId, which is likely to be a common operation (e.g., finding all profiles for a given user).
profileName:

type: String: Specifies that this field will store a string value, representing the name of the profile.
required: true: Ensures that every profile document must have a profileName.
profileImage:

type: String: Specifies that this field will store a string value, representing the URL or file path to the profile image.
default: "": Sets a default value of an empty string if no profile image is provided when creating a new profile.
createdAt:

type: Date: Specifies that this field will store a Date object, representing the creation timestamp of the profile.
default: Date.now: Sets the default value to the current date and time when a new profile is created.
updatedAt:

type: Date: Specifies that this field will store a Date object, representing the last update timestamp of the profile.
default: Date.now: Sets the default value to the current date and time when a new profile is created. This field will likely be updated whenever the profile information is modified.
export const Profile = mongoose.model("Profile", profileSchema);: This line creates and exports the Mongoose model named Profile. This model is associated with the profileSchema and will be used to interact with the 'profiles' collection in the MongoDB database. You can use this model to perform CRUD (Create, Read, Update, Delete) operations on profile documents.

// --------------------------------------------------//

import mongoose from "mongoose";

/**
 * @typedef {object} UserSchemaDefinition
 * @property {string} username - The unique username of the user. This field is required and must be unique.
 * @property {string} email - The unique email address of the user. This field is required and must be unique.
 * @property {string} password - The hashed password of the user. This field is required.
 * @property {string} image - The URL or path to the user's profile image. It has a default value of an empty string.
 * @property {boolean} isAdmin - A boolean indicating if the user is an administrator. It defaults to `false`.
 * @property {Array<object>} searchHistory - An array storing the user's search history. Each element is an object with details about a search.
 * @property {mongoose.Schema.Types.ObjectId} searchHistory.profileId - The ID of the profile under which the search was performed.
 * It is a reference to the 'Profile' model and is required.
 * @property {string} searchHistory.searchType - The type of content searched (e.g., "movie", "person", "tv"). This field is required.
 * @property {Date} searchHistory.createdAt - The timestamp indicating when the search was performed. It defaults to the current date and time.
 * @property {number} searchHistory.id - The ID of the searched item from the external API (e.g., TMDB). This field is required.
 * @property {string} searchHistory.image - The URL or path to the image of the searched item. This field is required.
 * @property {string} searchHistory.title - The title or name of the searched item. This field is required.
 */

/**
 * @constant {mongoose.Schema<UserSchemaDefinition>} userSchema
 * @description Defines the schema for the 'User' model in MongoDB.
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        /**
         * @description Indicates that the `username` field should be indexed for faster querying and to enforce uniqueness.
         */
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        /**
         * @description Indicates that the `email` field should be indexed for faster querying and to enforce uniqueness.
         */
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    searchHistory: [
        {
            profileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Profile",
                required: true,
                /**
                 * @description Indicates that the `profileId` field within the `searchHistory` array should be indexed for faster querying.
                 */
                index: true,
            },
            searchType: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            id: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
        },
    ],
});

/**
 * @constant {mongoose.Model<mongoose.Document<UserSchemaDefinition>>} User
 * @description Represents the Mongoose model for the 'users' collection in MongoDB, based on the `userSchema`.
 */
export const User = mongoose.model("User", userSchema);

This code defines the Mongoose schema and model for user accounts.

import mongoose from "mongoose";: Imports the Mongoose library.

userSchema: This constant holds the definition of the schema for the User documents.

username:

type: String: Specifies that the username will be a string.
required: true: Ensures that a username must be provided.
unique: true: Enforces that each user must have a unique username.
index: true: Creates an index on the username field for faster lookups and to support the unique constraint.
email:

type: String: Specifies that the email will be a string.
required: true: Ensures that an email must be provided.
unique: true: Enforces that each user must have a unique email address.
index: true: Creates an index on the email field for faster lookups and to support the unique constraint.
password:

type: String: Specifies that the password (which will be hashed) will be a string.
required: true: Ensures that a password must be provided.
image:

type: String: Specifies that the profile image path/URL will be a string.
default: "" : Sets an empty string as the default value if no image is provided.
isAdmin:

type: Boolean: Specifies that this field will be a boolean value indicating if the user is an administrator.
default: false: Sets the default value to false for new users.
searchHistory:

type: Array<Object>: Defines an array to store the user's search history. Each element in the array is an object with the following properties:
profileId:
type: mongoose.Schema.Types.ObjectId: Stores the ID of the profile under which the search was performed.
ref: "Profile": Creates a reference to the Profile model, allowing you to access profile information.
required: true: Ensures that each search history item is associated with a profile.
index: true: Creates an index on the profileId within the searchHistory for efficient querying of search history by profile.
searchType:
type: String: Specifies the type of content searched (e.g., "movie", "person", "tv").
required: true: Ensures that the search type is recorded.
createdAt:
type: Date: Stores the timestamp of when the search occurred.
default: Date.now: Sets the default to the current date and time.
id:
type: Number: Stores the ID of the searched item from the external API (like TMDB).
required: true: Ensures that the external ID is recorded.
image:
type: String: Stores the image path/URL of the searched item.
required: true: Ensures that the image information is recorded.
title:
type: String: Stores the title or name of the searched item.
required: true: Ensures that the title is recorded.
export const User = mongoose.model("User", userSchema);: Creates and exports the Mongoose model named User based on the userSchema. This model will be used to interact with the 'users' collection in the MongoDB database.

// --------------------------------------------------//

import express from "express";
import { authCheck, login, logout, signup } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

/**
 * @module AuthRoutes
 * @description Defines the routes for user authentication (signup, login, logout) and authentication checking.
 */
const router = express.Router();

/**
 * @route POST /api/auth/signup
 * @description Handles user registration.
 * @controller {@link module:AuthControllers.signup}
 */
router.post("/signup", signup);

/**
 * @route POST /api/auth/login
 * @description Handles user login.
 * @controller {@link module:AuthControllers.login}
 */
router.post("/login", login);

/**
 * @route POST /api/auth/logout
 * @description Handles user logout.
 * @controller {@link module:AuthControllers.logout}
 */
router.post("/logout", logout);

/**
 * @route GET /api/auth/authCheck
 * @description Checks if the user is currently authenticated using JWT.
 * @middleware {@link module:AuthMiddleware.verifyJWT} - Protects this route by verifying the JWT token.
 * @controller {@link module:AuthControllers.authCheck} - Returns the authenticated user information if the token is valid.
 */
router.get("/authCheck", verifyJWT , authCheck);

export default router;

This code defines the routes for user authentication using the Express Router.

import express from "express";: Imports the Express library.
import { authCheck, login, logout, signup } from "../controllers/auth.controller.js";: Imports the controller functions responsible for handling signup, login, logout, and authentication check requests. These functions contain the core logic for user authentication.
import { verifyJWT } from "../middlewares/auth.middleware.js";: Imports the verifyJWT middleware. This middleware is used to protect routes by verifying the JSON Web Token (JWT) sent in the request cookies.
const router = express.Router();: Creates a new router instance from Express. This router will be used to define the authentication routes.
Route Definitions:

router.post("/signup", signup);:

HTTP Method: POST
Route Path: /api/auth/signup
Description: This route handles user registration. When a POST request is made to this path, the signup controller function will be executed.
Controller: signup (imported from ../controllers/auth.controller.js)
router.post("/login", login);:

HTTP Method: POST
Route Path: /api/auth/login
Description: This route handles user login. When a POST request is made to this path, the login controller function will be executed.
Controller: login (imported from ../controllers/auth.controller.js)
router.post("/logout", logout);:

HTTP Method: POST
Route Path: /api/auth/logout
Description: This route handles user logout. When a POST request is made to this path, the logout controller function will be executed.
Controller: logout (imported from ../controllers/auth.controller.js)
router.get("/authCheck", verifyJWT , authCheck);:

HTTP Method: GET
Route Path: /api/auth/authCheck
Description: This route checks if the user is currently authenticated.
Middleware: verifyJWT (imported from ../middlewares/auth.middleware.js). This middleware will be executed before the authCheck controller. It verifies the JWT token present in the request cookies. If the token is invalid or missing, the request will be rejected with an unauthorized error.
Controller: authCheck (imported from ../controllers/auth.controller.js). If the verifyJWT middleware successfully verifies the token, the authCheck controller will be executed, typically returning the authenticated user's information.
export default router;: Exports the configured router, making these authentication routes available to be used by the main Express application.

// --------------------------------------------------//

import express from "express";
import {
    getTrendingMovie,
    getMovieTrailers,
    getMovieDetails,
    getSimilarMovies,
    getMoviesByCategory,
} from "../controllers/movie.contoller.js";

/**
 * @module MovieRoutes
 * @description Defines the routes for fetching movie-related data from the TMDB API.
 */
const router = express.Router();

/**
 * @route GET /api/movies/trending
 * @description Fetches a random trending movie of the day.
 * @controller {@link module:MovieControllers.getTrendingMovie}
 */
router.get("/trending", getTrendingMovie);

/**
 * @route GET /api/movies/:id/trailers
 * @description Fetches the trailers for a specific movie ID.
 * @param {string} id - The ID of the movie.
 * @controller {@link module:MovieControllers.getMovieTrailers}
 */
router.get("/:id/trailers", getMovieTrailers);

/**
 * @route GET /api/movies/:id/details
 * @description Fetches the detailed information for a specific movie ID.
 * @param {string} id - The ID of the movie.
 * @controller {@link module:MovieControllers.getMovieDetails}
 */
router.get("/:id/details", getMovieDetails);

/**
 * @route GET /api/movies/:id/similar
 * @description Fetches similar movies for a specific movie ID.
 * @param {string} id - The ID of the movie.
 * @controller {@link module:MovieControllers.getSimilarMovies}
 */
router.get("/:id/similar", getSimilarMovies);

/**
 * @route GET /api/movies/:category
 * @description Fetches movies based on a specific category (e.g., 'popular', 'top_rated').
 * @param {string} category - The category of movies to retrieve.
 * @controller {@link module:MovieControllers.getMoviesByCategory}
 */
router.get("/:category", getMoviesByCategory);

export default router;

This code defines the routes for accessing movie data using the Express Router.

import express from "express";: Imports the Express library.
import { getTrendingMovie, getMovieTrailers, getMovieDetails, getSimilarMovies, getMoviesByCategory, } from "../controllers/movie.contoller.js";: Imports the controller functions responsible for handling requests related to trending movies, movie trailers, movie details, similar movies, and movies by category. These functions interact with the TMDB API to retrieve the data.
const router = express.Router();: Creates a new router instance from Express to define the movie-related routes.
Route Definitions:

router.get("/trending", getTrendingMovie);:

HTTP Method: GET
Route Path: /api/movies/trending
Description: This route fetches a random trending movie of the day. When a GET request is made to this path, the getTrendingMovie controller function will be executed.
Controller: getTrendingMovie (imported from ../controllers/movie.contoller.js)
router.get("/:id/trailers", getMovieTrailers);:

HTTP Method: GET
Route Path: /api/movies/:id/trailers
Description: This route fetches the trailers for a specific movie. The :id is a URL parameter that represents the ID of the movie.
Path Parameter: id (string) - The ID of the movie for which to retrieve trailers.
Controller: getMovieTrailers (imported from ../controllers/movie.contoller.js)
router.get("/:id/details", getMovieDetails);:

HTTP Method: GET
Route Path: /api/movies/:id/details
Description: This route fetches the detailed information for a specific movie. The :id is a URL parameter representing the movie's ID.
Path Parameter: id (string) - The ID of the movie for which to retrieve details.
Controller: getMovieDetails (imported from ../controllers/movie.contoller.js)
router.get("/:id/similar", getSimilarMovies);:

HTTP Method: GET
Route Path: /api/movies/:id/similar
Description: This route fetches movies that are similar to a specific movie. The :id is a URL parameter representing the movie's ID.
Path Parameter: id (string) - The ID of the movie for which to retrieve similar movies.
Controller: getSimilarMovies (imported from ../controllers/movie.contoller.js)
router.get("/:category", getMoviesByCategory);:

HTTP Method: GET
Route Path: /api/movies/:category
Description: This route fetches movies belonging to a specific category. The :category is a URL parameter representing the movie category (e.g., 'popular', 'top_rated').
Path Parameter: category (string) - The category of movies to retrieve.
Controller: getMoviesByCategory (imported from ../controllers/movie.contoller.js)
export default router;: Exports the configured router, making these movie-related routes available to be used by the main Express application.

// --------------------------------------------------//

import express from "express";
import {
    createProfile,
    deleteProfile,
    getUserProfiles,
    updateProfile,
} from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

/**
 * @module ProfileRoutes
 * @description Defines the routes for managing user profiles (create, read, update, delete).
 * All routes in this module are protected by the {@link module:AuthMiddleware.verifyJWT} middleware.
 */
const router = express.Router();

/**
 * @route POST /api/profiles
 * @description Creates a new user profile.
 * @middleware {@link module:AuthMiddleware.verifyJWT} - Protects this route, ensuring only authenticated users can create profiles.
 * @controller {@link module:ProfileControllers.createProfile}
 */
router.post("/", verifyJWT, createProfile);

/**
 * @route GET /api/profiles/:userId
 * @description Retrieves all profiles associated with a specific user ID.
 * @middleware {@link module:AuthMiddleware.verifyJWT} - Protects this route, ensuring only authenticated users can access their own profiles.
 * @param {string} userId - The ID of the user whose profiles are being requested.
 * @controller {@link module:ProfileControllers.getUserProfiles}
 */
router.get("/:userId", verifyJWT, getUserProfiles);

/**
 * @route PUT /api/profiles/:profileId
 * @description Updates an existing user profile.
 * @middleware {@link module:AuthMiddleware.verifyJWT} - Protects this route, ensuring only the owner of the profile can update it.
 * @param {string} profileId - The ID of the profile to be updated.
 * @controller {@link module:ProfileControllers.updateProfile}
 */
router.put("/:profileId", verifyJWT, updateProfile);

/**
 * @route DELETE /api/profiles/:profileId
 * @description Deletes a user profile.
 * @middleware {@link module:AuthMiddleware.verifyJWT} - Protects this route, ensuring only the owner of the profile can delete it.
 * @param {string} profileId - The ID of the profile to be deleted.
 * @controller {@link module:ProfileControllers.deleteProfile}
 */
router.delete("/:profileId", verifyJWT, deleteProfile);

export default router;

This code defines the routes for managing user profiles using the Express Router.

import express from "express";: Imports the Express library.
import { createProfile, deleteProfile, getUserProfiles, updateProfile, } from "../controllers/profile.controller.js";: Imports the controller functions for handling profile creation, deletion, retrieval, and updating.
import { verifyJWT } from "../middlewares/auth.middleware.js";: Imports the verifyJWT middleware, which is used to protect these routes and ensure that only authenticated users can access them.
const router = express.Router();: Creates a new router instance from Express.
Route Definitions:

router.post("/", verifyJWT, createProfile);:

HTTP Method: POST
Route Path: /api/profiles
Description: Creates a new user profile.
Middleware: verifyJWT - Ensures that only authenticated users can create profiles.
Controller: createProfile
router.get("/:userId", verifyJWT, getUserProfiles);:

HTTP Method: GET
Route Path: /api/profiles/:userId
Description: Retrieves all profiles associated with a specific user.
Path Parameter: userId (string) - The ID of the user whose profiles are being requested.
Middleware: verifyJWT - Ensures that only authenticated users can access their own profiles.
Controller: getUserProfiles
router.put("/:profileId", verifyJWT, updateProfile);:

HTTP Method: PUT
Route Path: /api/profiles/:profileId
Description: Updates an existing user profile.
Path Parameter: profileId (string) - The ID of the profile to be updated.
Middleware: verifyJWT - Ensures that only the owner of the profile can update it.
Controller: updateProfile
router.delete("/:profileId", verifyJWT, deleteProfile);:

HTTP Method: DELETE
Route Path: /api/profiles/:profileId
Description: Deletes a user profile.
Path Parameter: profileId (string) - The ID of the profile to be deleted.
Middleware: verifyJWT - Ensures that only the owner of the profile can delete it.
Controller: deleteProfile
export default router;: Exports the router, making these profile-related routes available to the main Express application.


// --------------------------------------------------//

import express from "express";
import {
    getSearchHistory,
    removeItemFromSearchHistory,
    searchMovie,
    searchPerson,
    searchTv,
} from "../controllers/search.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

/**
 * @module SearchRoutes
 * @description Defines the routes for searching movies, TV shows, and people, as well as managing search history.
 * All routes in this module are protected by the {@link module:AuthMiddleware.verifyJWT} middleware.
 */
const router = express.Router();

/**
 * @middleware {@link module:AuthMiddleware.verifyJWT}
 * @description Applies JWT verification to all routes defined in this router, ensuring that only authenticated users can access them.
 */
router.use(verifyJWT);

/**
 * @route GET /api/search/person/:query
 * @description Searches for a person on TMDB based on the provided query. Requires a `profileId` in the query parameters.
 * @param {string} query - The search query for the person's name.
 * @queryparam {string} profileId - The ID of the profile for which to save the search history.
 * @controller {@link module:SearchControllers.searchPerson}
 */
router.get("/person/:query", searchPerson);

/**
 * @route GET /api/search/movie/:query
 * @description Searches for a movie on TMDB based on the provided query. Requires a `profileId` in the query parameters.
 * @param {string} query - The search query for the movie title.
 * @queryparam {string} profileId - The ID of the profile for which to save the search history.
 * @controller {@link module:SearchControllers.searchMovie}
 */
router.get("/movie/:query", searchMovie);

/**
 * @route GET /api/search/tv/:query
 * @description Searches for a TV show on TMDB based on the provided query. Requires a `profileId` in the query parameters.
 * @param {string} query - The search query for the TV show title.
 * @queryparam {string} profileId - The ID of the profile for which to save the search history.
 * @controller {@link module:SearchControllers.searchTv}
 */
router.get("/tv/:query", searchTv);

/**
 * @route GET /api/search/history
 * @description Retrieves the search history for the authenticated user, filtered by the `profileId` in the query parameters.
 * @queryparam {string} profileId - The ID of the profile whose search history to retrieve.
 * @controller {@link module:SearchControllers.getSearchHistory}
 */
router.get("/history", getSearchHistory);

/**
 * @route DELETE /api/search/history/:id
 * @description Removes a specific item from the authenticated user's search history. Requires the `profileId` in the query parameters.
 * @param {string} id - The ID of the search history item to remove.
 * @queryparam {string} profileId - The ID of the profile from whose search history the item should be removed.
 * @controller {@link module:SearchControllers.removeItemFromSearchHistory}
 */
router.delete("/history/:id", removeItemFromSearchHistory);

export default router;

This code defines the routes for handling search functionalities using the Express Router.

import express from "express";: Imports the Express library.
import { getSearchHistory, removeItemFromSearchHistory, searchMovie, searchPerson, searchTv, } from "../controllers/search.controller.js";: Imports the controller functions responsible for handling search requests for movies, people, and TV shows, as well as retrieving and removing items from the search history.
import { verifyJWT } from "../middlewares/auth.middleware.js";: Imports the verifyJWT middleware, which is used to protect all these routes, ensuring that only authenticated users can access them.
const router = express.Router();: Creates a new router instance from Express.
router.use(verifyJWT);: This line applies the verifyJWT middleware to all routes defined in this router. This means that before any of the search-related route handlers are executed, the verifyJWT middleware will run to authenticate the user based on their JWT token.
Route Definitions:

router.get("/person/:query", searchPerson);:

HTTP Method: GET
Route Path: /api/search/person/:query
Description: Searches for a person based on the :query. Requires a profileId to be passed as a query parameter to associate the search with a specific user profile.
Path Parameter: query (string) - The search term for the person's name.
Query Parameter: profileId (string) - The ID of the user profile performing the search.
Controller: searchPerson
router.get("/movie/:query", searchMovie);:

HTTP Method: GET
Route Path: /api/search/movie/:query
Description: Searches for a movie based on the :query. Requires a profileId query parameter.
Path Parameter: query (string) - The search term for the movie title.
Query Parameter: profileId (string) - The ID of the user profile performing the search.
Controller: searchMovie
router.get("/tv/:query", searchTv);:

HTTP Method: GET
Route Path: /api/search/tv/:query
Description: Searches for a TV show based on the :query. Requires a profileId query parameter.
Path Parameter: query (string) - The search term for the TV show title.
Query Parameter: profileId (string) - The ID of the user profile performing the search.
Controller: searchTv
router.get("/history", getSearchHistory);:

HTTP Method: GET
Route Path: /api/search/history
Description: Retrieves the search history for the authenticated user. Requires a profileId query parameter to filter the history by a specific profile.
Query Parameter: profileId (string) - The ID of the user profile whose search history is being requested.
Controller: getSearchHistory
router.delete("/history/:id", removeItemFromSearchHistory);:

HTTP Method: DELETE
Route Path: /api/search/history/:id
Description: Removes a specific item from the authenticated user's search history based on its :id. Requires a profileId query parameter to ensure the item belongs to the correct profile.
Path Parameter: id (string) - The ID of the search history item to be removed.
Query Parameter: profileId (string) - The ID of the user profile from whose search history the item should be removed.
Controller: removeItemFromSearchHistory
export default router;: Exports the configured router for use in the main Express application.

// --------------------------------------------------//

import express from "express";
import {
    getSimilarTvs,
    getTrendingTv,
    getTvDetails,
    getTvsByCategory,
    getTvTrailers,
} from "../controllers/tv.controller.js";

/**
 * @module TvRoutes
 * @description Defines the routes for fetching TV show-related data from the TMDB API.
 */
const router = express.Router();

/**
 * @route GET /api/tv/trending
 * @description Fetches a random trending TV show of the day.
 * @controller {@link module:TvControllers.getTrendingTv}
 */
router.get("/trending", getTrendingTv);

/**
 * @route GET /api/tv/:id/trailers
 * @description Fetches the trailers for a specific TV show ID.
 * @param {string} id - The ID of the TV show.
 * @controller {@link module:TvControllers.getTvTrailers}
 */
router.get("/:id/trailers", getTvTrailers);

/**
 * @route GET /api/tv/:id/details
 * @description Fetches the detailed information for a specific TV show ID.
 * @param {string} id - The ID of the TV show.
 * @controller {@link module:TvControllers.getTvDetails}
 */
router.get("/:id/details", getTvDetails);

/**
 * @route GET /api/tv/:id/similar
 * @description Fetches similar TV shows for a specific TV show ID.
 * @param {string} id - The ID of the TV show.
 * @controller {@link module:TvControllers.getSimilarTvs}
 */
router.get("/:id/similar", getSimilarTvs);

/**
 * @route GET /api/tv/:category
 * @description Fetches TV shows based on a specific category (e.g., 'popular', 'top_rated').
 * @param {string} category - The category of TV shows to retrieve.
 * @controller {@link module:TvControllers.getTvsByCategory}
 */
router.get("/:category", getTvsByCategory);

export default router;

This code defines the routes for accessing TV show data using the Express Router.

import express from "express";: Imports the Express library.
import { getSimilarTvs, getTrendingTv, getTvDetails, getTvsByCategory, getTvTrailers, } from "../controllers/tv.controller.js";: Imports the controller functions responsible for handling requests related to trending TV shows, TV show trailers, TV show details, similar TV shows, and TV shows by category. These functions interact with the TMDB API to retrieve the data.
const router = express.Router();: Creates a new router instance from Express to define the TV show-related routes.
Route Definitions:

router.get("/trending", getTrendingTv);:

HTTP Method: GET
Route Path: /api/tv/trending
Description: This route fetches a random trending TV show of the day. When a GET request is made to this path, the getTrendingTv controller function will be executed.
Controller: getTrendingTv (imported from ../controllers/tv.controller.js)
router.get("/:id/trailers", getTvTrailers);:

HTTP Method: GET
Route Path: /api/tv/:id/trailers
Description: This route fetches the trailers for a specific TV show. The :id is a URL parameter that represents the ID of the TV show.
Path Parameter: id (string) - The ID of the TV show for which to retrieve trailers.
Controller: getTvTrailers (imported from ../controllers/tv.controller.js)
router.get("/:id/details", getTvDetails);:

HTTP Method: GET
Route Path: /api/tv/:id/details
Description: This route fetches the detailed information for a specific TV show. The :id is a URL parameter representing the TV show's ID.
Path Parameter: id (string) - The ID of the TV show for which to retrieve details.
Controller: getTvDetails (imported from ../controllers/tv.controller.js)
router.get("/:id/similar", getSimilarTvs);:

HTTP Method: GET
Route Path: /api/tv/:id/similar
Description: This route fetches TV shows that are similar to a specific TV show. The :id is a URL parameter representing the TV show's ID.
Path Parameter: id (string) - The ID of the TV show for which to retrieve similar TV shows.
Controller: getSimilarTvs (imported from ../controllers/tv.controller.js)
router.get("/:category", getTvsByCategory);:

HTTP Method: GET
Route Path: /api/tv/:category
Description: This route fetches TV shows belonging to a specific category. The :category is a URL parameter representing the TV show category (e.g., 'popular', 'top_rated').
Path Parameter: category (string) - The category of TV shows to retrieve.
Controller: getTvsByCategory (imported from ../controllers/tv.controller.js)
export default router;: Exports the configured router, making these TV show-related routes available to be used by the main Express application.

// --------------------------------------------------//

import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

/**
 * @async
 * @function fetchFromTMDB
 * @description Asynchronously fetches data from the TMDB API using the provided URL.
 * It includes the TMDB API key from environment variables in the Authorization header.
 * Throws an error if the API request fails (status code is not 200).
 * @param {string} url - The URL to fetch from the TMDB API.
 * @returns {Promise<object>} A Promise that resolves to the JSON response data from the TMDB API.
 * @throws {Error} If the HTTP status code of the response is not 200, indicating a failed API request.
 */
export const fetchFromTMDB = async (url) => {
    /**
     * @constant {object} options - Configuration object for the Axios GET request.
     * @property {string} method - The HTTP method to use ('GET').
     * @property {object} headers - The HTTP headers to include in the request.
     * @property {string} headers.accept - Specifies that the client can accept JSON responses.
     * @property {string} headers.Authorization - Contains the Bearer token for API authentication, retrieved from the `TMDB_API_KEY` environment variable.
     */
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: "Bearer " + ENV_VARS.TMDB_API_KEY,
        },
    };

    /**
     * @async
     * @method axios.get
     * @description Sends an asynchronous GET request to the specified URL with the provided options.
     * @param {string} url - The URL to fetch.
     * @param {object} options - The request configuration.
     * @returns {Promise<axios.AxiosResponse<any>>} A Promise that resolves to the Axios response object.
     */
    const response = await axios.get(url, options);

    /**
     * @if Checks if the HTTP status code of the response is not 200 (OK).
     * @throws {Error} If the status code indicates a failure, an error is thrown with a message including the status text.
     */
    if (response.status !== 200) {
        throw new Error("Failed to fetch data from TMDB: " + response.statusText);
    }

    /**
     * @returns {object} The `data` property of the Axios response, which contains the JSON data from the TMDB API.
     */
    return response.data;
};

This code defines an asynchronous function fetchFromTMDB that handles fetching data from the The Movie Database (TMDB) API.

import axios from "axios";: Imports the axios library, a promise-based HTTP client for making API requests.

import { ENV_VARS } from "../config/envVars.js";: Imports the ENV_VARS object from the specified file, which is expected to contain environment variables, including the TMDB API key.

export const fetchFromTMDB = async (url) => { ... };: Defines an asynchronous function named fetchFromTMDB that takes a url as an argument. This URL is the specific TMDB API endpoint to be called.

const options = { ... };: Creates a configuration object for the axios.get request.

method: "GET": Specifies that the HTTP GET method will be used to retrieve data.
headers: { ... }: Defines the headers to be included in the API request.
accept: "application/json": Indicates that the client expects the response to be in JSON format.
Authorization: "Bearer " + ENV_VARS.TMDB_API_KEY: Sets the authorization header using a Bearer token. The actual API key is retrieved from the TMDB_API_KEY property of the ENV_VARS object. This key is necessary to authenticate with the TMDB API.
const response = await axios.get(url, options);: Uses axios.get to make an asynchronous GET request to the provided url with the configured options. The await keyword pauses the execution of the function until the API request is complete and the response is received.

if (response.status !== 200) { throw new Error(...); }: Checks the HTTP status code of the API response. If the status code is not 200 (which indicates a successful request), it throws a new Error with a message indicating that the data fetching from TMDB failed, along with the status text from the response for more context.

return response.data;: If the API request is successful (status code 200), this line returns the data property of the response object. The response.data typically contains the JSON payload returned by the TMDB API.

// --------------------------------------------------//

import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

/**
 * @function generateTokenAndSetCookie
 * @description Generates a new JWT token containing the user ID and sets it as an HTTP-only cookie in the response.
 * This cookie has a lifespan of 15 days.
 * @param {mongoose.Types.ObjectId | string} userId - The ID of the user to embed in the JWT.
 * @param {Express.Response} res - The Express response object on which to set the cookie.
 * @returns {string} The generated JWT token.
 */
export const generateTokenAndSetCookie = (userId, res) => {
    /**
     * @constant {string} token - Creates a new JWT token.
     * @param {object} payload - The payload to include in the token (in this case, the `userId`).
     * @param {string} secretOrPrivateKey - The secret key used to sign the token, retrieved from environment variables.
     * @param {object} options - Options for token generation, including the expiration time.
     * @param {string} options.expiresIn - Sets the token expiration time to 15 days.
     */
    const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" });

    /**
     * @method res.cookie
     * @description Sets an HTTP-only cookie named "jwt-aurastream" in the response.
     * @param {string} name - The name of the cookie ("jwt-aurastream").
     * @param {string} value - The value of the cookie (the generated JWT token).
     * @param {object} options - Options for the cookie.
     * @param {number} options.maxAge - The maximum age of the cookie in milliseconds (15 days).
     * @param {boolean} options.httpOnly - Makes the cookie accessible only by the server, not by client-side JavaScript.
     * @param {string} options.sameSite - Controls whether the cookie is sent with cross-site requests ('strict' ensures it's only sent for same-site requests).
     * @param {boolean} options.secure - Ensures the cookie is only sent over HTTPS in non-development environments.
     */
    res.cookie("jwt-aurastream", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: ENV_VARS.NODE_ENV !== "development",
    });
    return token;
};

/**
 * @function generateTokenAndSetCookieOnProfileSelection
 * @description Generates a new JWT token containing the user ID and the selected profile ID, and sets it as an HTTP-only cookie in the response.
 * This cookie has a lifespan of 10 days.
 * @param {mongoose.Types.ObjectId | string} userId - The ID of the user.
 * @param {mongoose.Types.ObjectId | string} profileId - The ID of the selected profile.
 * @param {Express.Response} res - The Express response object on which to set the cookie.
 * @returns {string} The generated JWT token.
 */
export const generateTokenAndSetCookieOnProfileSelection = (userId, profileId, res) => {
    /**
     * @constant {string} token - Creates a new JWT token.
     * @param {object} payload - The payload to include in the token (`userId` and `profileId`). Both are converted to strings for consistency.
     * @param {string} secretOrPrivateKey - The secret key used to sign the token, retrieved from environment variables.
     * @param {object} options - Options for token generation, including the expiration time.
     * @param {string} options.expiresIn - Sets the token expiration time to 10 days.
     */
    const token = jwt.sign({ userId: userId.toString(), profileId: profileId.toString() }, ENV_VARS.JWT_SECRET, { expiresIn: "10d" });
    console.log(token);

    /**
     * @method res.cookie
     * @description Sets an HTTP-only cookie named "jwt-aurastream" in the response.
     * @param {string} name - The name of the cookie ("jwt-aurastream" - using the same name as the user authentication cookie).
     * @param {string} value - The value of the cookie (the generated JWT token containing user and profile IDs).
     * @param {object} options - Options for the cookie.
     * @param {number} options.maxAge - The maximum age of the cookie in milliseconds (10 days).
     * @param {boolean} options.httpOnly - Makes the cookie accessible only by the server.
     * @param {string} options.sameSite - Controls whether the cookie is sent with cross-site requests ('strict').
     * @param {boolean} options.secure - Ensures the cookie is only sent over HTTPS in non-development environments.
     */
    res.cookie("jwt-aurastream", token, { //use the same cookie name.
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: ENV_VARS.NODE_ENV !== "development",
    });
    return token;
};

This code defines two utility functions for generating JWT tokens and setting them as HTTP-only cookies in the Express response.

1. generateTokenAndSetCookie(userId, res):

Purpose: Generates a JWT token containing only the user's ID and sets it as a cookie. This is likely used during user registration or initial login to establish a session.
Parameters:
userId (mongoose.Types.ObjectId | string): The unique identifier of the user.
res (Express.Response): The Express response object to which the cookie will be attached.
Token Payload: The JWT payload includes a single claim: { userId: userId }.
Token Expiration: The token is set to expire in 15 days ("15d").
Cookie Settings:
Name: "jwt-aurastream"
maxAge: 15 days in milliseconds.
httpOnly: true: The cookie cannot be accessed by client-side JavaScript, enhancing security against XSS attacks.
sameSite: "strict": The cookie will only be sent with requests originating from the same site, providing protection against CSRF attacks.
secure: ENV_VARS.NODE_ENV !== "development": The cookie will only be sent over HTTPS in production environments, ensuring secure transmission.
Return Value: The generated JWT token (string).
2. generateTokenAndSetCookieOnProfileSelection(userId, profileId, res):

Purpose: Generates a JWT token containing both the user's ID and the ID of a selected profile. This is likely used when a user chooses a specific profile to use within the application. It also sets this token as a cookie.
Parameters:
userId (mongoose.Types.ObjectId | string): The unique identifier of the user.
profileId (mongoose.Types.ObjectId | string): The unique identifier of the selected profile.
res (Express.Response): The Express response object to which the cookie will be attached.
Token Payload: The JWT payload includes two claims: { userId: userId.toString(), profileId: profileId.toString() }. Both IDs are explicitly converted to strings to ensure consistency in the token.
Token Expiration: The token is set to expire in 10 days ("10d").
Cookie Settings: The cookie settings are the same as in generateTokenAndSetCookie, using the same cookie name "jwt-aurastream", but with a maxAge of 10 days. This implies that selecting a profile refreshes the authentication token with a slightly shorter lifespan.
Return Value: The generated JWT token (string).
Both functions follow secure practices by making the cookie HTTP-only and secure in production. They also implement sameSite: "strict" for CSRF protection. Using the same cookie name "jwt-aurastream" suggests that the profile selection effectively updates the user's authentication context.


// --------------------------------------------------//









