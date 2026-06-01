// Plain Node.js handler for Vercel
module.exports = (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Plain handler works',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
};
