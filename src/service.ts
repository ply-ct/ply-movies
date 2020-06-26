import * as fs from 'fs';
import * as path from 'path';
import { Movie } from './movie';
import { Query } from './query';

class MoviesServiceSingleton {

    private _movies?: Movie[];

    async getMovie(id: string): Promise<Movie | undefined> {
        const movies = await this.getMovies();
        return movies?.find(movie => movie.id === id);
    }

    async getMovies(query?: Query): Promise<Movie[]> {
        if (query) {
            let movies = await this.getMovies();
            // filter
            movies = movies.filter(movie => {
                return true;
            });

            // sort
            if (query.sort) {
                const sort = query.sort;
                const direction = query.descending ? -1 : 1;
                movies = movies.sort((movie1, movie2) => {
                    let val1 = (movie1 as any)[sort];
                    let val2 = (movie2 as any)[sort];
                    let res = 0;
                    if (typeof val1 === 'undefined') {
                        res = direction * (typeof val2 === 'undefined' ? 0 : -1);
                    } else {
                        if (typeof val2 === 'undefined') {
                            res = direction;
                        } else {
                            if (typeof val1 === 'number') {
                                res = direction * (val1 - val2);
                            } else if (typeof val1 === 'string') {
                                res = direction * (val1.localeCompare(val2));
                            }
                        }
                    }
                    return res ? res : movie1.title.localeCompare(movie2.title);
                });
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

export let MoviesService = new MoviesServiceSingleton();