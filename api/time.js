// api/time.js
module.exports = (req, res) => {
  res.json({
    now: new Date().toISOString()
  });
};
