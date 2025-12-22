
import { GoogleGenAI, Type } from "@google/genai";

/**
 * TASK: Neural Support Concierge (Astra)
 * MODEL: gemini-3-flash-preview
 */
export const startSupportChat = async (history: {role: 'user' | 'model', parts: {text: string}[]}[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are 'Astra', the Support Oracle for the CopyTrade Platform.
    You are direct and authoritative. 

    CRITICAL PLATFORM KNOWLEDGE:
    1. SIGNUP BONUS: **$1,000 USDT** is added instantly.
    2. REFERRAL: Earn **$500** for every friend who deposits.
    3. WITHDRAWAL REQUIREMENT: To withdraw any funds, users must complete a **$1,000 USDT** Security Deposit to sync their wallet.
    4. INSTANT PAYOUT: Once withdrawal is verified in the dashboard, the user MUST send their verification details to our Telegram Payout Bot for final routing.
    5. DEPOSIT ADDRESS: **0x7592766391918c7d3E7F8Ae72D97e98979F25302** (Network: **TRC-20**).

    RESPONSE STYLE:
    - Use Markdown.
    - Be concise. 
    - Always emphasize the Telegram Bot step for "Instant Payout" after they initiate a withdrawal in the app.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history,
      config: {
        systemInstruction,
        temperature: 0.2, 
        topP: 0.8,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Support Chat Error", error);
    return "• **NETWORK CRITICAL**: Neural sync failed.\n• **ACTION**: Please re-initiate the terminal or check your liquidity connection.";
  }
};

/**
 * TASK: Deep Market Insight
 */
export const deepMarketAnalysis = async (prompt: string, base64Image?: string, mimeType?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = [{ text: prompt }];
  
  if (base64Image && mimeType) {
    parts.push({
      inlineData: { data: base64Image, mimeType: mimeType },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        systemInstruction: `You are an elite financial strategist.
        - Provide deep technical analysis using price action and volume profiles.
        - Focus on risk management.
        - Use professional, concise Markdown formatting.`,
        temperature: 0.2, 
      },
    });
    return response.text;
  } catch (error: any) {
    console.error("AI Analysis Failed", error);
    return "Intelligence Terminal connection lost. Verify API credentials.";
  }
};

/**
 * TASK: Payment Forensic Verification
 */
export const verifyPaymentProof = async (base64Image: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: "Verify this transaction receipt. Look for status 'Success', 'Confirmed', or 'Complete'. Extract the amount. If the image is a generic screenshot, blurred, or an edit, set is_valid to false. Output the detected amount." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_valid: { type: Type.BOOLEAN },
            detected_amount: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ["is_valid", "detected_amount", "confidence", "summary"]
        },
        systemInstruction: "You are a strict financial auditor. Reject any receipt that doesn't clearly show a successful transfer of USDT to our wallet. If valid, extract the exact amount as a number. Provide a brief reason for rejection in summary if is_valid is false."
      },
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { is_valid: false, detected_amount: 0, confidence: 0, summary: "Auditor connection timeout." };
  }
};

/**
 * TASK: Rapid Pulse Engine
 */
export const getInstantMarketPulse = async (asset: string = "Bitcoin") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Quick sentiment scan for ${asset}. JSON output only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            score: { type: Type.NUMBER },
            brief: { type: Type.STRING },
          },
          required: ["sentiment", "score", "brief"]
        }
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return null;
  }
};

/**
 * TASK: Trader Edge Summary
 */
export const getTraderEdgeFast = async (bio: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the unique trading edge for a mentor with this bio: ${bio}`,
      config: {
        systemInstruction: "You are an elite talent scout. Create a one-sentence punchy insight about the trader's edge. Maximum 15 words.",
      },
    });
    return response.text || "Strategy confirmed.";
  } catch (error) {
    console.error("Trader Edge Extraction Failed", error);
    return "Alpha generation verified.";
  }
};
