const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ agents_active: 12, tasks_completed: 450 });
});

app.listen(port, () => {
  console.log(`Dashboard server running on port ${port}`);
});