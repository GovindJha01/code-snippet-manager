import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    trim: true,
  },
});

const Snippet = mongoose.model("Snippet", snippetSchema);
export default Snippet;
