import type { PlatformaticApp, PlatformaticDBMixin, PlatformaticDBConfig, Entity, Entities, EntityHooks } from '@platformatic/db'
import { EntityTypes, Artist,Tag } from './types'

declare module 'fastify' {
  interface FastifyInstance {
    getSchema<T extends 'Artist' | 'Tag'>(schemaId: T): {
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
  artist: Entity<Artist>,
    tag: Entity<Tag>,
}

interface AppEntityHooks {
  addEntityHooks(entityName: 'artist', hooks: EntityHooks<Artist>): any
    addEntityHooks(entityName: 'tag', hooks: EntityHooks<Tag>): any
}

declare module 'fastify' {
  interface FastifyInstance {
    platformatic: PlatformaticApp<PlatformaticDBConfig> &
      PlatformaticDBMixin<AppEntities> &
      AppEntityHooks
  }
}
