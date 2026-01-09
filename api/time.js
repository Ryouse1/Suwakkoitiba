module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ now: new Date().toISOString() });
};
