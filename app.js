
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const searchTerm = req.query.search || '';
  res.send(`
    <h1>Search Results</h1>
    <form action="/" method="get">
      <input type="text" name="search" placeholder="Search...">
      <input type="submit" value="Search">
    </form>
    <p>You searched for: ${searchTerm}</p>
  `);
});

app.listen(port, () => {
  console.log(`Vulnerable app listening at http://localhost:${port}`);
});
