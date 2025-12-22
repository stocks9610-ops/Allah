
// BACKEND DISABLED
// The application has been converted to a Client-Side SPA (Single Page Application).
// All logic is now handled in services/authService.ts using LocalStorage.
// This file is preserved only as a placeholder to prevent import errors during transition.

export default function handler(req: any, res: any) {
  return res.status(200).json({ message: "Backend Disabled. Use Client-Side Logic." });
}
