import * as process from 'process';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { StatusResponse } from './response';
import { MoviesService } from './service';
import { Query } from './query';
import { MovieValidator, ValidationError } from './validate';

export namespace server {
    const app = express();
    const port = parseInt(process.env.SERVER_PORT || '3000');

    app.use(bodyParser.json());
    app.set('json spaces', process.env.RESPONSE_SPACES || 0);

    const notFound = async (request: express.Request, response: express.Response) => {
        response.send(new StatusResponse(404, `Invalid path for ${request.method}: ${request.path}`));
    };

    app.get('/movies/:id?', async (request, response) => {
        try {
            if (request.params.id) {
                const movie = await MoviesService.getMovie(request.params.id);
                if (movie) {
                    response.send(movie);
                } else {
                    response.status(404).send(new StatusResponse(404, `Movie not found: ${request.params.id}`));
                }
            } else {
                const movies = await MoviesService.getMovies(new Query(request));
                response.send({ movies });
            }
        } catch (error) {
            console.error(error);
            response.status(500).send(new StatusResponse(500, `Server Error: ${error.message}`));
        }
    });
    app.get('*', notFound);

    app.post('/movies', async (request, response) => {
        try {
            let movie = new MovieValidator(request.body).validate();
            await MoviesService.createMovie(movie);
            console.log(`Movie created with id: ${movie.id}`);
            let base = request.protocol + '://' + request.get('host');
            if (port !== 80 && port !== 443) {
                base += ':' + port;
            }
            response.set('Location', `${base}/movies/${movie.id}`);
            response.status(201).send(movie);
        } catch (error) {
            if (error instanceof ValidationError) {
                response.status(400).send(new StatusResponse(400, error.message));
            } else {
                console.error(error);
                response.status(500).send(new StatusResponse(500, `Server Error: ${error.message}`));
            }
        }
    });
    app.post('*', notFound);

    app.put('/movies/:id', async (request, response) => {
        try {
            let existing = await MoviesService.getMovie(request.params.id);
            if (existing) {
                let movie = new MovieValidator(request.body).validate();
                if (movie.id) {
                    if (movie.id !== existing.id) {
                        throw new ValidationError(`Cannot modify id: ${existing.id}`);
                    }
                }
                else {
                    movie.id = existing.id;
                }
                await MoviesService.updateMovie(movie);
                response.send(new StatusResponse());
            }
            else {
                response.status(404).send(new StatusResponse(404, `Movie not found: ${request.params.id}`));
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                response.status(400).send(new StatusResponse(400, error.message));
            } else {
                console.error(error);
                response.status(500).send(new StatusResponse(500, `Server Error: ${error.message}`));
            }
        }
    });
    app.put('*', notFound);

    app.patch('/movies/:id', async (request, response) => {
        try {
            let existing = await MoviesService.getMovie(request.params.id);
            if (existing) {
                let movie = { ...existing, ...request.body };
                movie = new MovieValidator(movie).validate();
                if (movie.id) {
                    if (movie.id !== existing.id) {
                        throw new ValidationError(`Cannot modify id: ${existing.id}`);
                    }
                }
                else {
                    movie.id = existing.id;
                }
                await MoviesService.updateMovie(movie);
                response.send(new StatusResponse());
            }
            else {
                response.status(404).send(new StatusResponse(404, `Movie not found: ${request.params.id}`));
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                response.status(400).send(new StatusResponse(400, error.message));
            } else {
                console.error(error);
                response.status(500).send(new StatusResponse(500, `Server Error: ${error.message}`));
            }
        }
    });
    app.patch('*', notFound);

    app.delete('/movies/:id', async (request, response) => {
        try {
            let existing = await MoviesService.getMovie(request.params.id);
            if (existing) {
                await MoviesService.deleteMovie(request.params.id);
                response.send(new StatusResponse());
            }
            else {
                response.status(404).send(new StatusResponse(404, `Movie not found: ${request.params.id}`));
            }
        } catch (error) {
            console.error(error);
            response.status(500).send(new StatusResponse(500, `Server Error: ${error.message}`));
        }
    });
    app.delete('*', notFound);

    app.all('*', async (request, response) => {
        response.set('Allow', 'GET, POST, PUT, PATCH, DELETE');
        response.status(405).send(new StatusResponse(405, `Unsupported method: ${request.method}`));
    });

    app.listen(port, () => console.log(`Movies API server listening at http://localhost:${port}`));
}