import type { FastifyPluginAsync } from "fastify";

const QUERY_RESULT_LIMIT = 100

const plugin: FastifyPluginAsync = async (app) => {
  app.graphql.extendSchema(`
    type Artist {
      id: ID
      movies: [Movie]
    }

    extend type Movie {
      director: Artist
    }

    extend type Query {
      getArtistsByMovies (ids: [ID!]!): [Artist]
      getMoviesByArtists (ids: [ID!]!): [Movie]
    }
  `)

  app.graphql.defineResolvers({
    Movie: {
      director: (parent) => {
        return parent?.directorId ? { id: parent.directorId } : null
      }
    },
    Artist: {
      movies: async (parent) => {
        const movies = await app.platformatic.entities.movie.find({
          where: { directorId: { eq: parent.id } },
          limit: QUERY_RESULT_LIMIT
        })
        return movies ?? []
      }
    },
    Query: {
      getArtistsByMovies: async (parent, { ids }, context, info) => {
        return ids.map((id: any) => ({ id }))
      },
      getMoviesByArtists: async (parent, args, context, info) => {
        return await app.platformatic.entities.movie.find({
          where: { directorId: { in: args.ids } },
          limit: QUERY_RESULT_LIMIT
        })
      }
    }
  })
}

export default plugin;