import express from "express"
import {register, login, profile, logout} from "../controllers/auth.js"
import { authMiddlewear } from "../middlewear/authMiddlewear.js"


const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/profile", authMiddlewear, profile)
router.post("/logout", logout)

export default router