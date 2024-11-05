import type { PlatformaticApp, PlatformaticDBMixin, PlatformaticDBConfig, Entity, Entities, EntityHooks } from '@platformatic/db'
import { EntityTypes, Book,Review } from './types'

declare module 'fastify' {
  interface FastifyInstance {
    getSchema<T extends 'Book' | 'Review'>(schemaId: T): {
      '$id': string,
      title: string,
      description: string,
      type: string,
      properties: {
        [x in keyof EntityTypes[T]]: { type: string, nullable?: boolean }
      },
      required: string[]
    };
  }
}

interface AppEntities extends Entities {
  book: Entity<Book>,
    review: Entity<Review>,
}

interface AppEntityHooks {
  addEntityHooks(entityName: 'book', hooks: EntityHooks<Book>): any
    addEntityHooks(entityName: 'review', hooks: EntityHooks<Review>): any
}

declare module 'fastify' {
  interface FastifyInstance {
    platformatic: PlatformaticApp<PlatformaticDBConfig> &
      PlatformaticDBMixin<AppEntities> &
      AppEntityHooks
  }
}
