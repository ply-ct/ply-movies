# ply-movies
A simple, self-contained movies API for REST service testing.  
The included data contains horror movies from the 1930s.

The ply-movies API is used by [Ply](https://github.com/ply-ct/ply#readme) 
in its automated tests and tutorials.

Install:  
`npm install -g ply-movies`

Start:  
`ply-movies start`  

Stop:  
`ply-movies stop`

## Configuration
| CLI Option | Environment Variable | Default | Usage |
| ---------- | -------------------- | ------- | ------|
| --port | SERVER_PORT | 3000 | API server should listen on this port |
| --indent | RESPONSE_INDENT | 0 | Format JSON response with this number of spaces |
| --file | MOVIES_FILE | movies.json | Location of writeable movies JSON file (created on first update) |
| --readonly | READONLY_API | false | Disallow POST, PUT, PATCH and DELETE requests |

## Sample queries
These URLs point against ply-ct.com.  However, the main point of ply-movies is to be hosted locally
so that during development you can exercise all API methods, including POST, PUT, PATCH and DELETE.

All movies:
 - [/movies](https://ply-ct.com/movies)

Movies made in 1931:
 - [/movies?year=1931](https://ply-ct.com/movies?year=1931)

Movies made after 1935:
 - [/movies?year=>1935](https://ply-ct.com/movies?year=>1935)
   (note: > is part of query **value**)

Movies sorted by rating in descending order:
 - [/movies?sort=rating&descending=true](https://ply-ct.com/movies?sort=rating&descending=true)

Movies with a rating of 3.5 or above, sorted by year:
 - [/movies?rating=>=3.5&sort=year](https://ply-ct.com/movies?rating=>=3.5&sort=year)
   (note: >= is prepended to query **value**)

Find all movies with Bela Lugosi:
 - [/movies?search=Bela%20Lugosi](https://ply-ct.com/movies?search=Bela%20Lugosi)

Retrieve the first page of movies, with page size = 25
 - [/movies?max=25&start=0](https://ply-ct.com/movies?max=25&start=0)

Retrieve the second page of movies, with page size = 25
 - [/movies?max=25&start=25](https://ply-ct.com/movies?max=25&start=25)

Retrieve the first page of movies from a list sorted by year
 - [/movies?max=25&sort=year](https://ply-ct.com/movies?max=25&sort=year)

Retrieve the first page of movies featuring Boris Karloff, sorted by year
 - [/movies?max=25&sort=year&search=Boris%20Karloff](https://ply-ct.com/movies?max=25&sort=year&search=Boris%20Karloff)

## Sample POST
Create a movie by posting to `/movies`:
```json
{
  "title": "The Case of the Howling Dog",
  "year": 1934,
  "credits": [
    {
      "name": "Alan Crosland",
      "role": "director"
    },
    {
      "name": "Warren William",
      "role": "actor"
    },
    {
      "name": "Mary Astor",
      "role": "actor"
    },
    {
      "name": "Allen Jenkins",
      "role": "actor"
    },
    {
      "name": "Grant Mitchell",
      "role": "actor"
    },
    {
      "name": "Helen Trenholme",
      "role": "actor"
    }
  ],
  "webRef": {
    "ref": "tt0024958",
    "site": "imdb.com"
  }
}
```
## More examples
See Ply tests in the [ply-demo](https://github.com/ply-ct/ply-demo) repository.
