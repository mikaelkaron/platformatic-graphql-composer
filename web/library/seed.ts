/// <reference path="./global.d.ts" />
import { Entities } from '@platformatic/sql-mapper'

const books: object[] = [
  { id: 1, title: 'LOTR', owner_id: 1 },
  { id: 2, title: 'War Games', owner_id: 1 },
  { id: 3, title: 'The great gatsby', owner_id: 2 }
]

const reviews: object[] = [
  { id: 1, content: 'Great story', book_id: 1 },
  { id: 2, content: 'Bilbo rocks', book_id: 1 },
  { id: 3, content: 'WOPR FTW', book_id: 2 }
]

export async function seed (opts: { entities: Entities }) {
  for (const input of books) {
    await opts.entities.book.save({ input })
  }
  for (const input of reviews) {
    await opts.entities.review.save({ input })
  }
}