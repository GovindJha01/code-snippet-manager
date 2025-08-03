import axios from "axios";
const AI_SERVER = process.env.AI_SERVER || "http://localhost:3001";

export const fetchFromAIServer = async (code) => {
  try {
    const response = await axios.post( `${AI_SERVER}/auto-summarize`, { code });
    return response.data.summary;
  } catch (error) {
    console.error("Error fetching AI summary:", error);
    throw error;
  }
};
