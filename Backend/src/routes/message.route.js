import { Router } from "express"
import verifyJWT from "../middleware/auth.middleware.js"
import { sendMessage, fetchMessages } from "../controllers/message.controller.js"

const router = Router()

router.route("/send-message").post(verifyJWT, sendMessage)
router.route("/fetch-message/:chatId").get(verifyJWT, fetchMessages)

export default router