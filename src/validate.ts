import { Movie } from './movie';

export class ValidationError extends Error {
    constructor(message: string, readonly code = 400) {
        super(message);
    }
}

export class MovieValidator {
    constructor(private readonly input: any) {}

    validate(): Movie {
        const title = this.getRequired('title');
        this.enforceType('title', title, 'string');

        const year = this.getRequired('year');
        this.enforceType('year', year, 'number');
        if (year < 1900) {
            throw new ValidationError(`Value for 'year' (${year}) should be at least 1900`);
        }

        const poster = this.getOptional('poster');
        if (typeof poster !== 'undefined') {
            this.enforceType('poster', poster, 'string');
        }

        const rating = this.getOptional('rating');
        if (typeof rating !== 'undefined') {
            this.enforceType('rating', rating, 'number');
            if (rating < 0 || rating > 5) {
                throw new ValidationError(`Value for 'rating' (${rating}) should be between 0 and 5`);
            }
            if (rating % 0.5 !== 0) {
                throw new ValidationError(`Value for 'rating' (${rating}) should be a multiple of 0.5`);
            }
        }

        const description = this.getOptional('description');
        if (typeof description !== 'undefined') {
            this.enforceType('description', description, 'string');
            if ((description + '').length > 2048) {
                throw new ValidationError(`Value for 'description' exceeds maximum length of 2048`);
            }
        }

        const credits = this.getOptional('credits');
        if (typeof credits !== 'undefined') {
            if (!Array.isArray(credits)) {
                throw new ValidationError(`Invalid type for 'credits': ${typeof credits}`);
            }
            for (const i in credits) {
                let credit = credits[i];
                let name = this.getRequired('name', credit, `credits[${i}].name`);
                this.enforceType(`credits[${i}].name`, name, 'string');
                let role = this.getRequired('role', credit, `credits[${i}].role`);
                this.enforceType(`credits[${i}].role`, role, 'string');
            }
        }

        const webRef = this.getOptional('webRef');
        if (typeof webRef !== 'undefined') {
            this.enforceType('webRef', webRef, 'object');
            let site = this.getRequired('site', webRef, 'webRef.site');
            this.enforceType('webRef.site', site, 'string');
            let ref = this.getRequired('ref', webRef, 'webRef.ref');
            this.enforceType('webRef.ref', ref, 'string');
        }

        return this.input as Movie;
    }

    private getRequired(name: string, input = this.input, label = name): any {
        const value = input[name];
        if (typeof value === 'undefined') {
            throw new ValidationError(`Missing required body parameter: ${label}`);
        }
        return value;
    }

    private getOptional(name: string, input = this.input): any {
        return input[name];
    }

    private enforceType(label: string, value: any, expected: string) {
        if (typeof value !== expected) {
            throw new ValidationError(`Invalid type for '${label}': ${typeof value}`);
        }
    }
}