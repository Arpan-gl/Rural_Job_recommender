import express from "express";
import { signOutUser } from "../components/user/signOut.js";
import { signUpUser } from "../components/user/signUp.js";
import {getUser} from "../components/user/getUser.js";
import { signInUser } from "../components/user/signIn.js";
import { getUserSkills } from "../components/user/getUserSkills.js";
import verifyUser from "../verifyUserMiddleware.js";


const router = express.Router();

router.post("/signup", signUpUser);
router.post("/signin", signInUser);
router.get("/user_detail", verifyUser, getUser);
router.get("/skills", verifyUser, getUserSkills);
router.get("/signout", signOutUser);

export default router;