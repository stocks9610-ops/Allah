import { GoogleGenAI, Type } from "@google/genai";

// API key is handled via process.env.API_KEY
// Always use the latest format as per SDK guidelines.
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
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
  
  if (!ai) {
    await new Promise(r => setTimeout(r, 1500));
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
    return "I am Sarah, your Account Manager. The system is currently in high-security simulation mode. I can guide you through strategy selection or funding protocols. What is your objective?";
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
    return "• **CONNECTION ERROR**: Market sync timeout. Please refresh or verify secure connectivity.";
  }
};

/**
 * TASK: Deep Market Insight
 * Fix: Complete the cut-off function logic.
 */
export const deepMarketAnalysis = async (prompt: string, base64Image?: string, mimeType?: string) => {
  const ai = getAIClient();
  
  if (!ai) {
    await new Promise(r => setTimeout(r, 2000));
    const simulatedMsg = SIMULATED_RESPONSES[Math.floor(Math.random() * SIMULATED_RESPONSES.length)];
    return `**SIMULATED ANALYST REPORT**\n\n• **Trend**: Bullish Continuation\n• **Key Level**: Local support verified.\n• **Volume**: Institutional accumulation detected.\n\n${simulatedMsg}`;
  }

  const parts: any[] = [{ text: prompt }];
  if (base64Image && mimeType) {
    parts.unshift({ inlineData: { data: base64Image, mimeType } });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts }],
      config: {
        systemInstruction: "You are a professional financial market analyst. Provide deep technical analysis based on charts or prompts. Focus on price action, volume, and RSI indicators.",
        temperature: 0.1,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Market Analysis Error", error);
    return "• **ANALYSIS ERROR**: Failed to compute market vectors. Verify image quality.";
  }
};

/**
 * TASK: Verify Payment Receipt OCR
 * Fix: Export this function to resolve the Error in Dashboard.tsx line 3.
 */
export const verifyPaymentProof = async (base64Image: string, mimeType: string) => {
  const ai = getAIClient();
  
  if (!ai) {
    // Fallback simulation for local dev without key
    await new Promise(r => setTimeout(r, 2500));
    return { 
      is_valid: true, 
      detected_amount: 1000, 
      summary: "Simulated Success: Institutional Transfer Verified via Node Sync." 
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { inlineData: { data: base64Image, mimeType } },
            { text: "Verify this transaction receipt. Extract the USDT amount and check if the status is successful. Return a JSON object with: 'is_valid' (boolean), 'detected_amount' (number), and 'summary' (string)." }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_valid: { type: Type.BOOLEAN },
            detected_amount: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ["is_valid", "detected_amount", "summary"]
        }
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Payment Verification Error", error);
    return { is_valid: false, detected_amount: 0, summary: "Verification system timeout or parse error." };
  }
};