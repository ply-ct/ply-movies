import * as fs from 'fs';
import * as path from 'path';
import { Movie, MovieMatcher } from './movie';
import { Query } from './query';
import { ValidationError } from './validate';

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
            return this._movies || this.load();
        }
    }

    async load(): Promise<Movie[]> {
        let moviesObj;
        if (fs.existsSync(this.moviesFile)) {
            moviesObj = JSON.parse(fs.readFileSync(this.moviesFile, 'utf-8'));
        } else {
            // load from distribution
            moviesObj = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'movies.json'), 'utf-8'));
        }
        this._movies = moviesObj.movies;
        if (!this._movies) {
            throw new Error('Movies file does not contain "movies" object');
        }
        return this._movies;
    }

    /**
     * Populates the id field.
     */
    async createMovie(movie: Movie): Promise<void> {
        const movies = await this.load();
        const unique = movie.title + " (" + movie.year + ")";
        const id = this.hashCode(unique).toString(16);
        const exist = movies.find(m => m.id === id);
        if (exist) {
            throw new ValidationError(`Movie already exists with id: ${id}`);
        }
        movie.id = id;
        movies.push(movie);
        this.save(movies);
    }

    async save(movies: Movie[]): Promise<void> {
        const contents = JSON.stringify({'movies': movies}, null, 2);
        fs.writeFileSync(this.moviesFile, contents);
    }

    /**
     * This is the writeable movies file.
     */
    private get moviesFile() {
        return 'movies.json'; // TODO env
    }

    /**
     * Compatible with Java's hashCode
     * https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
     */
    hashCode(s: string) {
        for (var i = 0, h = 0; i < s.length; i++) {
            h = Math.imul(31, h) + s.charCodeAt(i) | 0;
        }
        return h;
    }

}

export let MoviesService = new MoviesServiceImpl();