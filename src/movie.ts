import { Query } from './query';

/**
 * Credited cast member.
 */
export interface Credit {
    /**
     * Cast member's name.
     * required
     */
    name: string;
    /**
     * Their role in the production (actor, director).
     * required
     */
    role: string;
}

/**
 * Web reference with movie details.
 */
export interface WebRef {
    /**
     * Movie info site (imdb.com, themoviedb.org).
     * required
     */
    site: string;
    /**
     * The site's reference id for this movie.
     * required
     */
    ref: string;
}

export interface Movie {
    /**
     * Unique id provided by the API.
     * readonly
     */
    id: string;
    /**
     * Movie title.
     * required
     */
    title: string;
    /**
     * Year of release.
     * required, range: 1930-1939
     */
    year: number;
    /**
     * Credited cast members.
     */
    credits?: Credit[];
    /**
     * Poster image file.
     */
    poster?: string;
    /**
     * Movie rating.
     * range: 0-5, in 0.5 increments
     */
    rating?: number;
    /**
     * Description.
     * max len: 2048
     */
    description?: string;
    /**
     * Web reference.
     */
    webRef?: WebRef;
}

export class MovieMatcher {

    constructor(readonly movie: Movie) { }

    isMatch(query: Query): boolean {
        const id = query.filters.get('id');
        if (id && id !== this.movie.id) {
            return false;
        }
        const title = query.filters.get('title');
        if (title && title !== this.movie.title) {
            return false;
        }
        const year = query.filters.get('year');
        if (year && !this.matchNumber(year, this.movie.year)) {
            return false;
        }
        const poster = query.filters.get('poster');
        if (poster && poster !== this.movie.poster) {
            return false;
        }
        const rating = query.filters.get('rating');
        if (rating && (typeof this.movie.rating === 'undefined' || !this.matchNumber(rating, this.movie.rating))) {
            return false;
        }

        if (query.search && !this.matchSearch(query.search.toLowerCase())) {
            return false;
        }

        return true;
    }

    compare(other: Movie, sort: string, descending: boolean): number {
        const direction = descending ? -1 : 1;
        const val1 = (this.movie as any)[sort];
        const val2 = (other as any)[sort];
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
        // secondary sort is always title
        return res ? res : this.movie.title.localeCompare(other.title);
    }

    private matchNumber(filterVal: string, value: number): boolean {
        if (filterVal.startsWith('<=')) {
            return filterVal.length > 2 && parseFloat(filterVal.substring(2)) >= value;
        } else if (filterVal.startsWith('<')) {
            return filterVal.length > 1 && parseFloat(filterVal.substring(1)) > value;
        } else if (filterVal.startsWith('>=')) {
            return filterVal.length > 2 && parseFloat(filterVal.substring(2)) <= value;
        } else if (filterVal.startsWith('>')) {
            return filterVal.length > 1 && parseFloat(filterVal.substring(1)) < value;
        } else if (filterVal.startsWith('=')) {
            return filterVal.length > 1 && parseFloat(filterVal.substring(1)) === value;
        } else {
            return parseFloat(filterVal) === value;
        }
    }

    private matchSearch(search: string): boolean {
        if (this.movie.title.toLowerCase().includes(search)) {
            return true;
        }
        if (this.movie.description && this.movie.description.toLowerCase().includes(search)) {
            return true;
        }
        if (this.movie.credits) {
            for (const credit of this.movie.credits) {
                if (credit.name.toLowerCase().includes(search)) {
                    return true;
                }
            }
        }
        return false;
    }
}
