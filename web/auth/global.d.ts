import type { PlatformaticApp, PlatformaticDBMixin, PlatformaticDBConfig, Entity, Entities, EntityHooks } from '@platformatic/db'
import { EntityTypes, Account,Session } from './types'

declare module 'fastify' {
  interface FastifyInstance {
    getSchema<T extends 'Account' | 'Session'>(schemaId: T): {
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
  account: Entity<Account>,
    session: Entity<Session>,
}

interface AppEntityHooks {
  addEntityHooks(entityName: 'account', hooks: EntityHooks<Account>): any
    addEntityHooks(entityName: 'session', hooks: EntityHooks<Session>): any
}

declare module 'fastify' {
  interface FastifyInstance {
    platformatic: PlatformaticApp<PlatformaticDBConfig> &
      PlatformaticDBMixin<AppEntities> &
      AppEntityHooks
  }
}
