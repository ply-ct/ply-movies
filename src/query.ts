import * as express from 'express';
import { Movie } from './movie';

export class MovieQuery {

    start = 0;
    max?: number;
    sort = 'title';
    descending = false;
    search?: string;

    filters = new Map<string,string>();

    constructor(request: express.Request) {
        for (const param in request.query) {
            let value = request.query[param] + '';
            if (param === 'start') {
                this.start = parseInt(value);
            } else if (param === 'max') {
                this.max = parseInt(value);
            } else if (param === 'sort') {
                this.sort = value;
            } else if (param === 'descending') {
                this.descending = value.toLowerCase() === 'true';
            } else if (param === 'search') {
                this.search = value;
            } else {
                this.filters.set(param, value);
            }
        }
    }

    filter(movie: Movie, index: number): boolean {
        return false;
    }

    compare(movie1: Movie, movie2: Movie): number {
        let val1 = (movie1 as any)[this.sort];
        let val2 = (movie2 as any)[this.sort];

        return 0;
    }

    limit(movies: Movie[]): Movie[] {
        return this.max ? movies.slice(this.start, this.start + this.max) : movies.slice(this.start);
    }
}