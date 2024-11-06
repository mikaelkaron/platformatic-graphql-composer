import { suite, test, after } from 'node:test'
import { deepEqual } from 'node:assert/strict'
import { buildServer } from '@platformatic/runtime'
import runtimeConfig from '../platformatic.json'

const graphqlFetch = <T extends object = object>(input: string, query: string, variables?: object) => fetch(input, {
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  },
  body: JSON.stringify({ query, variables })
})
  .then(result => result.json() as Promise<{ data: T }>)
  .then(({ data }) => data)

suite('runtime graphql tests', async s => {
  const runtimeServer: any = await buildServer(runtimeConfig)
  const runtimeUrl = await runtimeServer.start()

  after(async () => await runtimeServer.close())

  test('should use queries and mutations on a single platformatic db service', async () => {
    const requests = [
      {
        query: '{ movies (limit:1) { title, year }}',
        expected: { movies: [{ title: 'Following', year: 1998 }] },
      },
      {
        query: '{ movies (limit:2, orderBy: [{field: year, direction: DESC }]) { title, year }}',
        expected: { movies: [{ title: 'Oppenheimer', year: 2023 }, { title: 'Tenet', year: 2020 }] },
      },
      {
        query: `{ movies (
          where: { title: { like: "The%" } },
          limit: 1, 
          orderBy: [{field: year, direction: DESC },{field: title, direction: ASC }],
        ) { title, year }}`,
        expected: { movies: [{ title: 'The Dark Knight Rises', year: 2012 }] },
      },
      {
        query: 'mutation { saveMovie (input: { id: "a-new-movie", title: "A new movie" }) { id, title } }',
        expected: { saveMovie: { id: 'a-new-movie', title: 'A new movie' } },
      },
      {
        query: 'mutation createMovie($movie: MovieInput!) { saveMovie(input: $movie) { id, title } }',
        variables: { movie: { id: 'a-wonderful-movie', title: 'A wonderful movie' } },
        expected: { saveMovie: { id: 'a-wonderful-movie', title: 'A wonderful movie' } },
      },
    ]

    for (const request of requests) {
      const response = await graphqlFetch(`${runtimeUrl}/graphql`, request.query, request.variables)
      deepEqual(response, request.expected)
    }
  })

  test('should use queries and mutations on multiple platformatic db services', async () => {
    const requests = [
      // query multiple services
      {
        query: '{ songs (orderBy: [{field: title, direction: ASC }], limit: 1) { title, singer { firstName, lastName, profession } } }',
        expected: { songs: [{ title: 'Every you every me', singer: { firstName: 'Brian', lastName: 'Molko', profession: 'Singer' } }] },
      },

      // get all songs by singer
      {
        query: '{ artists (where: { profession: { eq: "Singer" }}) { lastName, songs { title, year } } }',
        expected: {
          artists: [
            {
              lastName: 'Pavarotti',
              songs: [{ title: 'Nessun dorma', year: 1992 }],
            },
            {
              lastName: 'Molko',
              songs: [{ title: 'Every you every me', year: 1998 }, { title: 'The bitter end', year: 2003 }],
            },
            {
              lastName: 'Dickinson',
              songs: [{ title: 'Fear of the dark', year: 1992 }, { title: 'The trooper', year: 1983 }],
            }],
        },
      },

      // query more subgraph on same node
      {
        query: '{ artists (where: { profession: { eq: "Director" }}) { lastName, songs { title }, movies { title } } }',
        expected: {
          artists: [
            {
              lastName: 'Nolan',
              movies: [{ title: 'Following' }, { title: 'Memento' }, { title: 'Insomnia' }, { title: 'Batman Begins' }, { title: 'The Prestige' }, { title: 'The Dark Knight' }, { title: 'Inception' }, { title: 'The Dark Knight Rises' }, { title: 'Interstellar' }, { title: 'Dunkirk' }, { title: 'Tenet' }, { title: 'Oppenheimer' }],
              songs: [],
            },
            {
              lastName: 'Benigni',
              movies: [{ title: 'La vita é bella' }],
              songs: [{ title: 'Vieni via con me' }],
            },
          ],
        },
      },

      // double nested
      {
        query: '{ artists (where: { firstName: { eq: "Brian" } }) { songs { title, singer { firstName, lastName } } } }',
        expected: { artists: [{ songs: [{ title: 'Every you every me', singer: { firstName: 'Brian', lastName: 'Molko' } }, { title: 'The bitter end', singer: { firstName: 'Brian', lastName: 'Molko' } }] }] },
      },

      // nested many times
      {
        query: '{ artists (where: { firstName: { eq: "Brian" } }) { songs { singer { songs { singer { songs { title } }} } } } }',
        expected: { artists: [{ songs: [{ singer: { songs: [{ singer: { songs: [{ title: 'Every you every me' }, { title: 'The bitter end' }] } }, { singer: { songs: [{ title: 'Every you every me' }, { title: 'The bitter end' }] } }] } }, { singer: { songs: [{ singer: { songs: [{ title: 'Every you every me' }, { title: 'The bitter end' }] } }, { singer: { songs: [{ title: 'Every you every me' }, { title: 'The bitter end' }] } }] } }] }] },
      },

      // mutation: create
      {
        query: 'mutation { saveMovie (input: { id: "a-new-movie", title: "A new movie" }) { id, title } }',
        expected: { saveMovie: { id: 'a-new-movie', title: 'A new movie' } },
      },
      {
        query: 'mutation createMovie($movie: MovieInput!) { saveMovie(input: $movie) { title } }',
        variables: { movie: { id: 'a-wonderful-movie', title: 'A wonderful movie' } },
        expected: { saveMovie: { title: 'A wonderful movie' } },
      },
    ]

    for (const request of requests) {
      const response = await graphqlFetch(`${runtimeUrl}/graphql`, request.query, request.variables)
      deepEqual(response, request.expected)
    }
  })
})
