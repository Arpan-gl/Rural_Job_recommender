import jwt from "jsonwebtoken";
import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if(!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error verifying user:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export default verifyUser;