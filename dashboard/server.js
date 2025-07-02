const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.static('public'));

app.get('/api/report', (req, res) => {
  const reportPath = '/app/zap-report/report.json';
  fs.readFile(reportPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send({ error: 'Could not read ZAP report.' });
    }
    res.send(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`Dashboard server listening at http://localhost:${port}`);
});
