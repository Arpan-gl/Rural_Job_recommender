import express from "express";
import { analyzeUserQuery, getUserMatches } from "../components/recommender/analyzeQuery.js";
import verifyUser from "../verifyUserMiddleware.js";

const router = express.Router();

router.post("/analyze", verifyUser, analyzeUserQuery);
router.get("/matches", verifyUser, getUserMatches);

export default router;
