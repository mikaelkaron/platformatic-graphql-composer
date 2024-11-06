/// <reference path="./global.d.ts" />
import { Entities } from '@platformatic/sql-mapper'

const movies: object[] = [
  { id: '1', title: 'Following', director_id: '101', year: 1998 },
  { id: '2', title: 'Memento', director_id: '101', year: 2000 },
  { id: '3', title: 'Insomnia', director_id: '101', year: 2002 },
  { id: '4', title: 'Batman Begins', director_id: '101', year: 2005 },
  { id: '5', title: 'The Prestige', director_id: '101', year: 2006 },
  { id: '6', title: 'The Dark Knight', director_id: '101', year: 2008 },
  { id: '7', title: 'Inception', director_id: '101', year: 2010 },
  { id: '8', title: 'The Dark Knight Rises', director_id: '101', year: 2012 },
  { id: '9', title: 'Interstellar', director_id: '101', year: 2014 },
  { id: '10', title: 'Dunkirk', director_id: '101', year: 2017 },
  { id: '11', title: 'Tenet', director_id: '101', year: 2020 },
  { id: '12', title: 'Oppenheimer', director_id: '101', year: 2023 },
  { id: '13', title: 'La vita é bella', director_id: '102', year: 1997 },
]

export async function seed (opts: { entities: Entities }) {
  for (const input of movies) {
    await opts.entities.movie.save({ input })
  }
}