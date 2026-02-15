const express = require('express');
const router = express.Router();

router.get('/metrics', (req, res) => {
  res.send('Agent performance metrics');
});

module.exports = router;