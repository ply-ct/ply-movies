import * as fs from 'fs';
import * as path from 'path';
import { Movie, MovieMatcher } from './movie';
import { Query } from './query';
import { ValidationError } from './validate';

class MoviesServiceImpl {

    private _moviesFile = 'movies.json';
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
            if (typeof query.max === 'number') {
                const end = Math.min(query.start + query.max, movies.length + 1);
                movies = movies.splice(query.start, end);
            } else if (query.start) {
                movies = movies.splice(query.start);
            }
            return movies;
        } else {
            return this._movies || this.load();
        }
    }

    async randomId(): Promise<string> {
        // only movies with descriptions and 6 credits
        const movies = (await this.getMovies()).filter(m => m.description && m.credits?.length === 6);
        const i = Math.floor(Math.random() * movies.length - 1);
        return movies[i].id;
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
            throw new ValidationError(`Movie already exists with id: ${id}`, 409);
        }
        movie.id = id;
        movies.push(movie);
        this.save(movies);
    }

    /**
     * Expects movie.id to be populated.
     */
    async updateMovie(movie: Movie): Promise<void> {
        const movies = await this.load();
        const idx = movies.findIndex(m => m.id === movie.id);
        if (idx === -1) {
            throw new ValidationError(`Movie not found with id: ${movie.id}`, 404);
        }
        movies[idx] = movie;
        this.save(movies);
    }

    async deleteMovie(id: string): Promise<void> {
        const movies = await this.load();
        const idx = movies.findIndex(m => m.id === id);
        if (idx === -1) {
            throw new ValidationError(`Movie not found with id: ${id}`, 404);
        }
        movies.splice(idx, 1);
        this.save(movies);
    }

    async save(movies: Movie[]): Promise<void> {
        const contents = JSON.stringify({'movies': movies}, null, 2);
        fs.writeFileSync(this.moviesFile, contents);
    }

    /**
     * This is the writeable movies file.
     */
    get moviesFile(): string {
        return this._moviesFile;
    }
    set moviesFile(file: string) {
        this._moviesFile = file;
    }

    /**
     * Compatible with Java's hashCode
     * https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
     */
    hashCode(s: string) {
        let h = 0;
        for (let i = 0; i < s.length; i++) {
            h = Math.imul(31, h) + s.charCodeAt(i) | 0;
        }
        return h;
    }

}

export const MoviesService = new MoviesServiceImpl();