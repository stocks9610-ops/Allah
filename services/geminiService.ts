
import { GoogleGenAI, Type } from "@google/genai";

// SAFE API KEY EXTRACTION
// This block is designed to never crash the app, even if 'process' is missing.
let API_KEY = '';

try {
  // We check for the specific replaced string from Vite first
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    // @ts-ignore
    API_KEY = process.env.API_KEY;
  }
} catch (e) {
  console.warn("API Key extraction fell back to simulation mode.");
}

const getAIClient = () => {
  if (!API_KEY || API_KEY === 'undefined') {
    return null;
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

// --- SIMULATION DATA ---
const SIMULATED_RESPONSES = [
  "Based on the current institutional order flow, we are seeing a strong accumulation zone. I recommend increasing exposure.",
  "Volatility is elevated. My algorithms suggest a conservative approach for the next 4 hours.",
  "The 4-hour RSI is showing a bullish divergence. This is a prime entry point for our 'Alpha Bridge' strategy.",
  "Market liquidity is deepening. It's a safe environment to deploy capital into the 'Whale Wealth Path'."
];

/**
 * TASK: Senior Account Manager (Sarah)
 * MODEL: gemini-3-flash-preview
 */
export const startSupportChat = async (history: {role: 'user' | 'model', parts: {text: string}[]}[]) => {
  const ai = getAIClient();
  
  // SIMULATION MODE
  if (!ai) {
    await new Promise(r => setTimeout(r, 1500)); // Fake network delay
    const lastUserMsg = history[history.length - 1]?.parts[0]?.text.toLowerCase() || "";
    
    if (lastUserMsg.includes("deposit") || lastUserMsg.includes("fund")) {
      return "To activate your account, please copy the TRC-20 address from the Dashboard. Once you send USDT, upload the screenshot and I will verify it instantly.";
    }
    if (lastUserMsg.includes("withdraw") || lastUserMsg.includes("money")) {
      return "Withdrawals are processed instantly for verified accounts. Ensure you have completed the $1,000 security deposit requirement to unlock the payout channel.";
    }
    if (lastUserMsg.includes("bonus") || lastUserMsg.includes("referral")) {
      return "You receive a $1,000 Signup Bonus instantly! For referrals, you earn $200 per active user. Share your link from the terminal.";
    }
    return "I am operating in Simulation Mode. I can help you navigate the platform, explain strategies, or guide you through the deposit process. What do you need?";
  }

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
  const ai = getAIClient();
  
  // SIMULATION MODE
  if (!ai) {
    await new Promise(r => setTimeout(r, 2000));
    return `**SIMULATED ANALYST REPORT**\n\n• **Trend**: Bullish Continuation\n• **Key Level**: Support established at local lows.\n• **Volume**: Institutional buying detected.\n\n${SIMULATED_RESPONSES[Math.floor(Math.random() * SIMULATED_RESPONSES.length)]}`;
  }

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
  const ai = getAIClient();
  
  // SIMULATION MODE
  if (!ai) {
    await new Promise(r => setTimeout(r, 2500));
    // Always approve in demo mode for UX testing
    return {
      is_valid: true,
      detected_amount: 1000,
      confidence: 0.99,
      summary: "SIMULATION: Receipt validated successfully. Funds released."
    };
  }
  
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

export const getInstantMarketPulse = async (asset: string = "Bitcoin") => { return null; }
export const getTraderEdgeFast = async (bio: string) => { return "Execution strategy confirmed."; }
