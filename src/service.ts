import * as fs from 'fs';
import * as path from 'path';
import { Movie } from './movie';
import { MovieQuery } from './query';

class MoviesServiceSingleton {

    private _movies?: Movie[];

    async getMovie(id: string): Promise<Movie | undefined> {
        const movies = await this.getMovies();
        return movies?.find(movie => movie.id === id);
    }

    async getMovies(query?: MovieQuery): Promise<Movie[]> {
        if (query) {
            let movies = await this.getMovies();
            return query.limit(movies.filter(query.filter).sort(query.compare));
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

export let MoviesService = new MoviesServiceSingleton();