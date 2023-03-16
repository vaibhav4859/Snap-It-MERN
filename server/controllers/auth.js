import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import { StatusCodes } from 'http-status-codes';

export const register = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(); // random salt provided by bcrypt and we use this salt to encrypt our password
        const passwordHash = await bcrypt.hash(req.body.password, salt); // then this random salt is hashed with our password and it is encrypted and a random encrypted string is generated

        const newUser = new User({
            ...req.body,
            password: passwordHash,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000)
        });

        const savedUser = await newUser.save();
        res.status(StatusCodes.CREATED).json(savedUser);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) return res.status(StatusCodes.BAD_REQUEST).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid credentials. " });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password; // delete user password so it doesn't get sent back to frontend
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}



// https://www.npmjs.com/package/bcrypt
// A library to help you hash passwords. BCrypt Algorithm is used to hash and salt passwords securely.
// to guard against dangers or threats in the long run, like attackers having the computing power to guess passwords twice as quickly.

// https://jwt.io/
// https://github.com/vaibhav4859/Node-Practice-Session/tree/main/JWT
// Visit these links for jwt understanding and verfication / authentication