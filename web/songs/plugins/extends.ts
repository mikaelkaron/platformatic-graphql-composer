import type { FastifyPluginAsync } from "fastify";

const QUERY_RESULT_LIMIT = 100

const plugin: FastifyPluginAsync = async (app) => {
  app.graphql.extendSchema(`
    type Artist {
      id: ID
      songs: [Song]
    }

    extend type Song {
      singer: Artist
    }

    extend type Query {
      getArtistsBySongs (ids: [ID!]!): [Artist]
      getSongsByArtists (ids: [ID!]!): [Song]
    }
  `)

  app.graphql.defineResolvers({
    Song: {
      singer: (parent) => {
        return parent?.singerId ? { id: parent.singerId } : null
      },
    },
    Artist: {
      songs: async (parent) => {
        const songs = await app.platformatic.entities.song.find({
          where: { singerId: { eq: parent.id } },
          limit: QUERY_RESULT_LIMIT
        })
        return songs ?? []
      }
    },
    Query: {
      getArtistsBySongs: async (parent, { ids }, context, info) => {
        return ids.map((id: any) => ({ id }))
      },
      getSongsByArtists: async (parent, args, context, info) => {
        return await app.platformatic.entities.song.find({
          where: { singerId: { in: args.ids } },
          limit: QUERY_RESULT_LIMIT
        })
      }
    }
  })
}

export default plugin;