import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function getUser (req, res){
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ success:false,message: "User not found" });
        }
        return res.status(200).json({ success:true,data: user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ success:false,message: "Internal server error" });
    }
}