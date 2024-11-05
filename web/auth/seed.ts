/// <reference path="./global.d.ts" />
import { Entities } from '@platformatic/sql-mapper'

const accounts: object[] = [
  { id: 1, email: 'e@mail.com' },
  { id: 2, email: 'fe@mail.com' }
]

const sessions: object[] = [
  { id: 1, account_id: 1 },
  { id: 2, account_id: 2 }
]

export async function seed (opts: { entities: Entities }) {
  for (const input of accounts) {
    await opts.entities.account.save({ input })
  }
  for (const input of sessions) {
    await opts.entities.session.save({ input })
  }
}