/// <reference path="./global.d.ts" />
import { Entities } from '@platformatic/sql-mapper'

const songs: object[] = [
  { id: '1', title: 'London Bridge is Falling Down', singer_id: '0', year: 1744 },
  { id: '2', title: 'Nessun dorma', singer_id: '201', year: 1992 },
  { id: '3', title: 'Every you every me', singer_id: '301', year: 1998 },
  { id: '4', title: 'The bitter end', singer_id: '301', year: 2003 },
  { id: '5', title: 'Fear of the dark', singer_id: '401', year: 1992 },
  { id: '6', title: 'The trooper', singer_id: '401', year: 1983 },
  { id: '7', title: 'Vieni via con me', singer_id: '102', year: 2012 }
]

export async function seed (opts: { entities: Entities }) {
  for (const input of songs) {
    await opts.entities.song.save({ input })
  }
}