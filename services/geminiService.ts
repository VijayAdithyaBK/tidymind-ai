
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ComparisonResult } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    roomType: { type: Type.STRING, description: "The type of room identified (e.g., Bedroom, Kitchen)." },
    mood: { type: Type.STRING, description: "Current atmosphere of the room based on visual cues." },
    declutteringSteps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
        },
        required: ["title", "description", "priority"]
      }
    },
    organizationHacks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING, description: "The specific item or area." },
          suggestion: { type: Type.STRING, description: "Actionable advice on how to organize it." }
        },
        required: ["item", "suggestion"]
      }
    },
    storageSolutions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          productType: { type: Type.STRING, description: "Type of storage product recommended." },
          reason: { type: Type.STRING, description: "Why this product would help." }
        },
        required: ["productType", "reason"]
      }
    },
    aestheticTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["roomType", "declutteringSteps", "organizationHacks", "storageSolutions", "aestheticTips"]
};

const comparisonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isSameRoom: { type: Type.BOOLEAN, description: "True if the after photo is the same room as the before photo. False only if completely unrelated." },
    similarityReason: { type: Type.STRING, description: "Explanation of why it is or isn't the same room." },
    score: { type: Type.INTEGER, description: "Progress score from 0 to 100 based on decluttering steps completed." },
    completedTasks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific tasks from the original plan that were completed." },
    missedTasks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of tasks that still need attention." },
    feedback: { type: Type.STRING, description: "Encouraging feedback on the progress made." }
  },
  required: ["isSameRoom", "similarityReason", "score", "completedTasks", "missedTasks", "feedback"]
};

// Helper: Resize image to avoid payload limits/timeouts (Max 1024px)
const resizeForAI = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      const MAX_DIM = 1024; // Safe limit for Gemini Vision to avoid 500 errors

      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      } else {
        resolve(base64Str);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

const retryOperation = async <T>(operation: () => Promise<T>, maxRetries = 2): Promise<T> => {
  let lastError;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      // Retry on 500 (Internal) or 503 (Unavailable)
      const status = error.status || (error.message && error.message.includes('500') ? 500 : 0);
      if (status === 500 || status === 503) {
        if (i < maxRetries) {
          console.warn(`Attempt ${i + 1} failed with ${status}. Retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
};

export const analyzeRoomImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const resizedImage = await resizeForAI(base64Image);
    const cleanBase64 = resizedImage.split(',')[1] || resizedImage;

    const operation = async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanBase64
              }
            },
            {
              text: "Analyze this room photo. Provide a structured guide on how to declutter, organize, and improve this space. Be specific, encouraging, and practical."
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: analysisSchema,
          systemInstruction: "You are a world-class professional organizer (like Marie Kondo meets The Home Edit). Your tone is kind, non-judgmental, but highly efficient and practical. Focus on maximizing space, reducing visual noise, and creating functional systems."
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text) as AnalysisResult;
    };

    return await retryOperation(operation);

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);

    let friendlyError = "Oops! Something went wrong analyzing your room. Please try again.";
    const msg = (error.message || error.toString()).toLowerCase();

    if (msg.includes("429") || msg.includes("resource_exhausted")) {
      friendlyError = "I'm a bit overwhelmed with requests right now. Please wait a minute and try again.";
    } else if (msg.includes("403") || msg.includes("permission_denied") || msg.includes("api key")) {
      friendlyError = "Access denied. Please check if your API key is valid.";
    } else if (msg.includes("503") || msg.includes("unavailable") || msg.includes("overloaded") || msg.includes("500") || msg.includes("internal")) {
      friendlyError = "The AI service is currently unavailable. Please try again later.";
    } else if (msg.includes("safety") || msg.includes("blocked")) {
      friendlyError = "This image couldn't be processed due to safety settings. Please try a different angle or photo.";
    } else if (msg.includes("json") || msg.includes("parse")) {
      friendlyError = "I had trouble organizing my thoughts (Invalid Response). Please try again.";
    } else if (msg.includes("network") || msg.includes("fetch") || msg.includes("failed to fetch")) {
      friendlyError = "Network connection failed. Please check your internet.";
    }

    throw new Error(friendlyError);
  }
};

export const compareRoomImages = async (
  beforeImageBase64: string,
  afterImageBase64: string,
  previousPlan: AnalysisResult
): Promise<ComparisonResult> => {
  try {
    // Resize both images to minimize payload size
    const [resizedBefore, resizedAfter] = await Promise.all([
      resizeForAI(beforeImageBase64),
      resizeForAI(afterImageBase64)
    ]);

    const cleanBefore = resizedBefore.split(',')[1] || resizedBefore;
    const cleanAfter = resizedAfter.split(',')[1] || resizedAfter;
    const planContext = JSON.stringify(previousPlan.declutteringSteps);

    const operation = async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: cleanBefore } },
            { inlineData: { mimeType: "image/jpeg", data: cleanAfter } },
            {
              text: `Compare these two images. Image 1 is 'Before', Image 2 is 'After'. 
                    The goal was to follow this decluttering plan: ${planContext}.
                    
                    First, check if Image 2 is the same room as Image 1. 
                    **CRITICAL**: Be EXTREMELY LENIENT regarding room identity. 
                    A messy room looks completely different when cleaned. 
                    Furniture might be moved, lighting changed, or camera angles shifted. 
                    Unless it is unequivocally a different room type (e.g. Bathroom vs Kitchen), ASSUME it is the same room.
                    
                    If it is the same room, analyze the progress. Did they complete the steps?`
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: comparisonSchema,
          systemInstruction: "You are a supportive cleaning coach. Prioritize recognizing effort. Be extremely generous when verifying room identity—cleaning changes everything. Focus on the positive progress made."
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text) as ComparisonResult;
    };

    return await retryOperation(operation);

  } catch (error: any) {
    console.error("Gemini Comparison Error:", error);
    // Let the app handle the specific error display, but map 500s if needed
    throw error;
  }
};
