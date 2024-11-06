import type { FastifyPluginAsync } from "fastify";

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
          where: { directorId: { eq: parent.id } }
        })
        return movies ?? []
      }
    },
    Query: {
      getArtistsByMovies: async (parent, { ids }, context, info) => {
        return ids.map((id: any) => ({ id }))
      },
      getMoviesByArtists: async (parent, args, context, info) => {
        const movies = await app.platformatic.entities.movie.find({
          where: { directorId: { in: args.ids } }
        })

        return movies.map(s => ({ ...s, directorId: s.directorId }))
      }
    }
  })
}

export default plugin;