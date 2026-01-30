import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { fetchUser, login, logout, signup } from "../controllers/user.controller.js";

const router = Router()

router.route("/sign-up").post(signup)
router.route("/login").post(login)
router.route("/fetch-user").get(verifyJWT, fetchUser)
router.route("/logout").get(verifyJWT, logout)

export default router