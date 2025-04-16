import express from "express";
import auth from "../middleware/auth.js";
import {
  createSnippet,
  getAllSnippet,
  singleUserSnippet,
  singleSnippet,
  deleteSnippet,
  updateSnippet
} from "../controllers/snippet-controller.js";

const router = express.Router();

router.post("/create", auth, createSnippet);
router.get("/all", auth, getAllSnippet);
router.get("/:id", auth, singleSnippet);
router.get("/user/:id", auth, singleUserSnippet);
router.patch("/:id", auth, updateSnippet);
router.delete("/:id", auth, deleteSnippet);

export default router;
