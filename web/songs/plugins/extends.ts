import type { FastifyPluginAsync } from "fastify";

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
          where: { singerId: { eq: parent.id } }
        })
        return songs ?? []
      }
    },
    Query: {
      getArtistsBySongs: async (parent, { ids }, context, info) => {
        return ids.map((id: any) => ({ id }))
      },
      getSongsByArtists: async (parent, args, context, info) => {
        const songs = await app.platformatic.entities.song.find({
          where: { singerId: { in: args.ids } }
        })

        return songs.map(s => ({ ...s, singerId: s.singerId }))
      }
    }
  })
}

export default plugin;