# ply-movies
A simple, self-contained movies API for REST testing.  
The included data contains horror movies from the 1930s.

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

## Sample queries
All movies:
 - [/movies](http://localhost:3000/movies)

Movies made in 1931:
 - [/movies?year=1931](http://localhost:3000/movies?year=1931)

Movies made after 1935:
 - [/movies?year=>1935](http://localhost:3000/movies?year=>1935)
   (note > is part of query **value**)

Movies sorted by rating in descending order:
 - [/movies?sort=rating&descending=true](http://localhost:3000/movies?sort=rating&descending=true)

Movies with a rating of 3.5 or above, sorted by year:
 - [/movies?rating=>=3.5&sort=year](http://localhost:3000/movies?rating=>=3.5&sort=year)
   (note >= is prepended to query **value**)

Find all movies with Bela Lugosi:
 - [/movies?search=Bela Lugosi](http://localhost:3000/movies?search=Bela Lugosi)

Retrieve the first page of movies, with page size = 25
 - [/movies?max=25&start=0](http://localhost:3000/movies?max=25&start=0)

Retrieve the second page of movies, with page size = 25
 - [/movies?max=25&start=25](http://localhost:3000/movies?max=25&start=25)

Retrieve the first page of movies from a list sorted by year
 - [/movies?max=25&sort=year](http://localhost:3000/movies?max=25&sort=year)

Retrieve the first page of movies featuring Boris Karloff, sorted by year
 - [/movies?max=25&sort=year&search=Boris%20Karloff](http://localhost:3000/movies?max=25&sort=year&search=Boris Karloff)

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
