import * as process from 'process';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { StatusResponse } from './response';
import { MoviesService } from './service';
import { Query } from './query';

export namespace server {
    const app = express();
    const port = process.env.SERVER_PORT || 3000;

    app.use(bodyParser.json());
    app.set('json spaces', process.env.RESPONSE_SPACES || 0);

    const notFound = async (request: express.Request, response: express.Response) => {
        response.send(new StatusResponse(404, `Invalid path: ${request.path}`));
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

    });
    app.post('*', notFound);

    app.put('/movies/:id', async (request, response) => {

    });
    app.put('*', notFound);

    app.delete('/movies/:id', async (request, response) => {

    });
    app.delete('*', notFound);

    app.all('*', async (request, response) => {
        response.set('Allow', 'GET, POST, PUT, DELETE');
        response.send(new StatusResponse(405, `Unsupported method: ${request.method}`));
    });

    app.listen(port, () => console.log(`Movies API server listening at http://localhost:${port}`));
}