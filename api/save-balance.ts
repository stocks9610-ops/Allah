
// BACKEND DISABLED
// Balance synchronization is now handled locally in services/authService.ts.

export default function handler(req: any, res: any) {
  return res.status(200).json({ success: true, mode: "offline" });
}
