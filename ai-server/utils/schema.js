//https://ai.google.dev/gemini-api/docs/structured-output  - how to define schema for structured output
import { Type } from '@google/genai';
 export const AISchemaForSummary = {
      responseSchema: {
        type: Type.OBJECT,
        properties: {
            title: {
              type: Type.STRING,
            },
            language: {
              type: Type.STRING,
            },
            description: {
              type: Type.STRING,
            },
            tags: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
          },
        },
      };
    