export default function handler(req, res) {
  // サーバーの現在時刻
  const serverTime = new Date();
  res.status(200).json({ now: serverTime.toISOString() });
}
