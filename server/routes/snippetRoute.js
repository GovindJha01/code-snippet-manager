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

router.post("/create", auth, createSnippet);  // Create a new snippet
router.get("/all", auth, getAllSnippet);  // Get all snippets 
router.get("/:id", auth, singleSnippet); // Get a single snippet by ID  
router.get("/user/:id", auth, singleUserSnippet); // Get all snippets by user ID
router.patch("/:id", auth, updateSnippet); // Update a snippet by ID
router.delete("/:id", auth, deleteSnippet); // Delete a snippet by ID

export default router;
