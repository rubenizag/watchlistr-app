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
const PORT = process.env.PORT || 6227;

app.use(express.json());
routes.forEach((route) => {
  app.use(route)
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = routes;