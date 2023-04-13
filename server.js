const express = require('express');
const routes = [
  require('./routes/signup'),
  require('./routes/login'),
  require('./routes/deleteUser'),
  require('./routes/movieSearch'),
  require('./routes/tvShowSearch'),
  require('./routes/userAddedMovie'),
  require('./routes/userAddedTVShow'),
  require('./routes/userWatchlist'),
  require('./routes/userWatchlistMovie'),
  require('./routes/userWatchlistTVShow'),
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