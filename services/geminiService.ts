import { GoogleGenAI, Type } from "@google/genai";

/**
 * TASK: Senior Account Manager (Sarah)
 * MODEL: gemini-3-flash-preview
 */
export const startSupportChat = async (history: {role: 'user' | 'model', parts: {text: string}[]}[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are 'Sarah', a Senior Account Manager for the CopyTrade Elite Hub.
    You are direct, professional, and entirely focused on institutional results.

    CRITICAL PLATFORM KNOWLEDGE:
    1. SIGNUP BONUS: **$1,000 USDT** is added instantly to new accounts.
    2. REFERRAL: Users earn **$500** for every active referral deposit.
    3. MENTORSHIP: Premium access via **Google Meet** live sessions is available. Access requires a verify deposit.
    4. WITHDRAWAL REQUIREMENT: To activate payout channels, users must complete a **$1,000 USDT** Security Deposit to verify their wallet.
    5. DEPOSIT ADDRESS: **TLY2M8F7p27z97E98979F25302979F25302** (Network: **TRC-20**).
    6. INSTANT PAYOUT: After initiating a withdrawal in the dashboard, the user MUST contact our Telegram Payout Department for final routing.

    RESPONSE STYLE:
    - Professional, "High-Net-Worth" advisor tone.
    - Direct and efficient.
    - Always reference the $1,000 Security Deposit for withdrawals.
    - Guide users to the Telegram Payout link for status updates.
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
    return "• **CONNECTION ERROR**: Market sync timeout.\n• **ACTION**: Please refresh your browser or check your secure wallet connectivity.";
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
        systemInstruction: `You are a Senior Market Analyst.
        - Analyze charts using professional price action and liquidity concepts.
        - Focus on institutional wealth accumulation and risk protocols.
        - Be concise and authoritative.`,
        temperature: 0.2, 
      },
    });
    return response.text;
  } catch (error: any) {
    console.error("AI Analysis Failed", error);
    return "Market Analyst connection lost. Verify secure exchange connectivity.";
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
    return response.text || "Execution strategy confirmed.";
  } catch (error) {
    console.error("Trader Edge Extraction Failed", error);
    return "Market edge verified.";
  }
};