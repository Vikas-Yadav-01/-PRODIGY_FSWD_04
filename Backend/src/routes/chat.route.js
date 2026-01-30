import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { accessChat, fetchChats } from "../controllers/chat.controller.js";

const router = Router()

router.route("/access-chat").post(verifyJWT, accessChat)
router.route("/fetch-chat").get(verifyJWT, fetchChats)

export default router