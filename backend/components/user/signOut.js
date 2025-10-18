export async function signOutUser(req, res) {
    try {
        return res.clearCookie("token").status(200).json({success: true,message: 'Logged out successfully'});
    } catch (error) {
        console.error("Error signing out user:", error);
        return res.status(500).json({ success:false,message: "Internal server error" });
    }
}