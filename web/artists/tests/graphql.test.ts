import { suite, test, after } from 'node:test'
import { deepEqual } from 'node:assert/strict'
import { buildServer } from '@platformatic/db'
import dbConfig from '../platformatic.json'

const graphqlFetch = <T extends object = object>(input: string, query: string, variables?: object) => fetch(input, {
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  },
  body: JSON.stringify({ query, variables })
})
  .then(result => result.json() as Promise<{ data: T }>)
  .then(({ data }) => data)

suite('artists graphql tests', async s => {
  const server: any = await buildServer(dbConfig)
  const url = await server.start()

  after(async () => await server.close())

  test('should use where deeply', async () => {
    const requests = [
      {
        query: '{ artists { id tags(where: { id: { eq: "1" }}) { id } }}',
        expected: {
          artists: [
            {
              id: "101",
              tags: [
                {
                  id: "1"
                }
              ]
            },
            {
              "id": "102",
              "tags": []
            },
            {
              "id": "201",
              "tags": []
            },
            {
              "id": "301",
              "tags": []
            },
            {
              "id": "401",
              "tags": []
            }
          ]
        },
      }
    ]


    for (const request of requests) {
      const response = await graphqlFetch(`${url}/graphql`, request.query)
      deepEqual(response, request.expected)
    }
  })
})
