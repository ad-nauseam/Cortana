import postgres from 'postgres';

import type { Starboard } from './Starboard';

export class DB {
  private sql;

  constructor(conn: string) {
    this.sql = postgres(conn);
  }

  starboardDeleteBulk(list: string[]) {
    return this.sql<Starboard[]>`DELETE FROM starboard WHERE oid IN ${this.sql(list)} RETURNING *`;
  }

  starboardDelete(id: string) {
    return this.sql<Starboard[]>`DELETE FROM starboard WHERE oid=${id} RETURNING *`;
  }

  starboardExists(id: string) {
    return this.sql<Starboard[]>`SELECT * FROM starboard WHERE oid=${id}`;
  }

  starboardAdd(id: string, oid: string) {
    return this.sql<Starboard[]>`
            INSERT INTO starboard(id, oid)
            VALUES(${id}, ${oid})
        `;
  }
}