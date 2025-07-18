import express from "express";
import auth from "../middleware/auth.js";
import {
  handleLogin,
  handleLogout,
  handleSignup,
  fetchUser,
  handleUpdateUser
} from "../controllers/user-controller.js";

const router = express.Router();

router.get("/me", auth, fetchUser);
router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.post("/logout", auth, handleLogout);
router.patch("/update", auth, handleUpdateUser);

export default router;
