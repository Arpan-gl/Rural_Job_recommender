import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function signUpUser(req, res) {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ success:false,message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        return res.status(201).json({ success:true, message: "User created successfully", user });
    } catch (error) {
        console.error("Error signing up user:", error);
        return res.status(500).json({ success:false, message: "Internal server error" });
    }
}