import express from "express";
import cookieParser from "cookie-parser";
import { generateAIContent } from "./utils/utils.js";
import { AISchemaForSummary } from "./utils/schema.js";
import cors from "cors";
 
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.post("/auto-summarize", async (req, res) => {
  const codesnippet = req.body.code;

  const summary = await generateAIContent(
    `Generate title,tags,language and description for this code snippet ${codesnippet}`,
    AISchemaForSummary
  );
  res.status(200).json({ summary: summary });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
