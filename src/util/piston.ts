import type { ALLOWED_LANGS } from './constants.js';
type Langs = keyof typeof ALLOWED_LANGS;

export interface Execute<K extends Langs = Langs> {
  language: K;
  version: typeof ALLOWED_LANGS[K];
  files: [
    {
      content: string;
    },
  ];
}

interface STD {
  stdout: string;
  stderr: string;
  code: number;
  signal: string | null;
  output: string;
}

interface ExecuteOutput {
  compile?: STD;
  run: STD;
  language: string;
  version: string;
}

interface RuntimesOutput {
  language: string;
  version: string;
  aliases: string[];
  runtime?: string;
}

export class Piston {
  public url;

  constructor(url: string) {
    this.url = url;
  }

  async request(path: 'runtimes' | 'execute', body?: Execute) {
    const res = await fetch(`http://${this.url}:2000/api/v2/${path}`, {
      body: JSON.stringify(body),
      method: body ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json() ?? null;
  }

  runtimes(): Promise<RuntimesOutput[]> {
    return this.request('runtimes');
  }

  execute(body: Execute): Promise<ExecuteOutput> {
    return this.request('execute', body);
  }
}
