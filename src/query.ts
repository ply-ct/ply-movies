import * as express from 'express';

export class Query {

    start = 0;
    max?: number;
    sort?: string;
    descending = false;
    search?: string;

    filters = new Map<string,string>();

    constructor(request: express.Request) {
        for (const param in request.query) {
            const value = request.query[param] + '';
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

    getFilter(name: string): string | undefined {
        return this.filters.get(name);
    }

    intFilter(name: string): number | undefined {
        const val = this.filters.get(name);
        if (val) {
            return parseInt(val);
        }
    }

    floatFilter(name: string): number | undefined {
        const val = this.filters.get(name);
        if (val) {
            return parseFloat(val);
        }
    }
}