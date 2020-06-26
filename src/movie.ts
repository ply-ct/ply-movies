import { ValidationError } from './validate';

export interface Credit {
    name: string; // required
    role: string; // required
}

export interface WebRef {
    site: string; // required
    ref: string; // required

}

export class Movie {

    id: string;
    title?: string; // required
    year?: number; // required, range: 1900 -
    credits?: Credit[];
    poster?: string;
    rating?: number; // max: 5
    description?: string; // max len: 2048
    webRef?: WebRef;


    /**
     * Copy a movie and assign its id
     */
    constructor(id: string, movie: Movie) {
          this.id = id;
          this.title = movie.title;
          this.year = movie.year;
          this.credits = movie.credits;
          this.poster = movie.poster;
          this.rating = movie.rating;
          this.description = movie.description;
          this.webRef = movie.webRef;
    }


    static validate(input: any): Movie {
        if (!input.title) {
            throw new ValidationError('Missing required body parameter: title');
        }
        return input as Movie;
    }
}