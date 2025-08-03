import genAI from "../config/gemini.js";

export const generateAIContent = async (prompt, schema) => {
  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema.responseSchema,
        thinkingConfig: {
          thinkBudget: 0,
        },
      }
     
    });
    return response.text;
  } catch (error) {
    console.error("Error generating AI content:", error);
    throw error;
  }
};
