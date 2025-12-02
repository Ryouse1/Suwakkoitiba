export default function handler(req, res) {
  const serverTime = new Date(); // サーバー現在時刻
  res.status(200).json({
    now: serverTime.toISOString() // ISO形式で返す
  });
}
