/// <reference path="./global.d.ts" />
import { Entities } from '@platformatic/sql-mapper'

const artists: object[] = [
  { id: '101', first_name: 'Christopher', last_name: 'Nolan', profession: 'Director' },
  { id: '201', first_name: 'Luciano', last_name: 'Pavarotti', profession: 'Singer' },
  { id: '301', first_name: 'Brian', last_name: 'Molko', profession: 'Singer' },
  { id: '401', first_name: 'Bruce', last_name: 'Dickinson', profession: 'Singer' },
  { id: '102', first_name: 'Roberto', last_name: 'Benigni', profession: 'Director' }
]

export async function seed (opts: { entities: Entities }) {
  for (const input of artists) {
    await opts.entities.artist.save({ input })
  }
}