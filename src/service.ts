import * as fs from 'fs';
import * as path from 'path';
import { Movie, MovieMatcher } from './movie';
import { Query } from './query';

class MoviesServiceImpl {

    private _movies?: Movie[];

    async getMovie(id: string): Promise<Movie | undefined> {
        const movies = await this.getMovies();
        return movies?.find(movie => movie.id === id);
    }

    async getMovies(query?: Query): Promise<Movie[]> {
        if (query) {
            let movies = await this.getMovies();
            // filter
            movies = movies.filter(movie => new MovieMatcher(movie).isMatch(query));
            // sort
            if (query.sort) {
                const sort = query.sort;
                movies = movies.sort((m1, m2) => new MovieMatcher(m1).compare(m2, sort, query.descending));
            }
            // limit
            if (query.max) {
                const end = Math.min(query.start + query.max - 1, movies.length - 1);
                movies = movies.splice(query.start, end);
            } else if (query.start) {
                movies = movies.splice(query.start);
            }
            return movies;
        } else {
            return this._movies || this.loadMovies();
        }
    }

    async loadMovies(): Promise<Movie[]> {
        const moviesFile = 'movies.json'; // TODO env
        let moviesObj;
        if (fs.existsSync(moviesFile)) {
            moviesObj = JSON.parse(fs.readFileSync(moviesFile, 'utf-8'));
        } else {
            // load from distribution
            moviesObj = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'movies.json'), 'utf-8'));
        }
        return moviesObj.movies;
    }
}

export let MoviesService = new MoviesServiceImpl();