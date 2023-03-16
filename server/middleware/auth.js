import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const authenticationMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(StatusCodes.FORBIDDEN).json({ msg: "Access Denied" });
        }

        const token = authHeader.split(' ')[1]; // object : {Bearer, token}
        const verified = jwt.verify(token, process.env.JWT_SECRET); // decodes my token like jwt debugger
        req.user = verified;
        next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Not authorized to access this route" });
    }
}