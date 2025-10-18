import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function signInUser(req, res) {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(401).json({ success:false,message: "Invalid email or password" });
        }
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success:false,message: "Invalid email or password" });
        }
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        return res.cookie("token",token,{httpOnly: true,secure: true}).status(200).json({ success:true, message: "Sign-in successful", user, token });
    } catch (error) {
        console.error("Error signing in user:", error);
        return res.status(500).json({ success:false,message: "Internal server error" });
    }
}