<h1 align="center">Watchlistr App</h1>

![Watchlistr Login Page](/src/styles/LoginPage.png)
![Watchlistr Popular Movies](/src/styles/PopularMovies.png)
![Watchlistr Top Rated TV Shows](/src/styles/TopRatedTVShows.png)

Watchlistr App is a web application that allows users to search for and discover popular and top-rated movies and TV shows, as well as TV shows airing today. Users can also search for specific movies and TV shows using the app's search functionality.

### Built With
* ReactJS
* Node.js
* Express.js
* Axios
* The Movie Database (TMDB) API

### Getting Started

To get started with the app, follow these steps:

1. Clone the repo to your local machine using ```git clone https://github.com/rubenizag/watchlistr-app.git```
2. Install dependencies using ```npm install```
3. Make sure to have PostgreSQL installed, you can download at https://www.postgresql.org/download/
4. Obtain an API key from TMDB by signing up for an account at https://www.themoviedb.org/account/signup
5. In the ***src*** folder there is a file called ***env*** add your TMDB API key to: ```apiKey=your-api-key```
6. To run the app, server & the database use ```npm run dev```


### Features

* __Popular Movies and TV Shows__ - displays a list of popular movies and TV shows, which users can click on to view more details.
* __Top-Rated Movies and TV Shows__ - displays a list of top-rated movies and TV shows, which users can click on to view more details.
* __TV Shows Airing Today__ - displays a list of TV shows airing today in the US, which users can click on to view more details.
* __Search__ - allows users to search for specific movies and TV shows by entering keywords into the search bar.
* __Watchlist__ - allows users to save the movie or TV show to a watchlist.

### Contributions

Contributions to the app are welcome! If you would like to contribute, please fork the repo and submit a pull request.

### License

The app is licensed under the MIT License.

#### Credits

* The TMDB API for providing movies and tv shows data.
* Running ```create-react-app``` for the initial app setup.