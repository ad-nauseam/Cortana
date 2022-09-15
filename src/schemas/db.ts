import postgres from 'postgres';

import type { Starboard } from './Starboard';

export class DB {
  private sql;

  constructor(conn: string) {
    this.sql = postgres(conn);
  }

  async version() {
    const res = await this.sql<{ version: string }[]>`SELECT version()`;
    return res[0].version.replace(/(?<=\d)\s.+/gs, '');
  }

  starboardDeleteBulk(list: string[]) {
    return this.sql<Starboard[]>`DELETE FROM starboard WHERE oid IN ${this.sql(list)} RETURNING *`;
  }

  async starboardDelete(id: string) {
    const res = await this.sql<Starboard[]>`DELETE FROM starboard WHERE oid=${id} RETURNING *`;
    return res[0] ?? null;
  }

  async starboardGet(id: string) {
    const res = await this.sql<Starboard[]>`SELECT * FROM starboard WHERE oid=${id}`;
    return res[0] ?? null;
  }

  starboardAdd(id: string, oid: string) {
    return this.sql<Starboard[]>`
            INSERT INTO starboard(id, oid)
            VALUES(${id}, ${oid})
        `;
  }
}
