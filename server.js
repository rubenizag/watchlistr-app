const express = require('express');
const routes = [
  require('./routes/signup'),
  require('./routes/login'),
  require('./routes/deleteUser'),
  require('./routes/mediaSearch'),
  require('./routes/userAddedMedia'),
  require('./routes/userWatchlist'),
  require('./routes/userWatchlistMedia'),
  require('./routes/deleteMedia'),
];

const app = express();
const port = 6227;

app.use(express.json());
routes.forEach((route) => {
  app.use(route)
});

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});

module.exports = routes;