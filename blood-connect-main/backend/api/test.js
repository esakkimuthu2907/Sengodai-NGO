module.exports = (req, res) => {
  res.status(200).json({ 
    message: 'API test working',
    method: req.method,
    path: req.url 
  });
};
