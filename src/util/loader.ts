import glob from 'glob';
import { join } from 'path';
import { Logger } from './logger.js';

export function loader<T>(path: string, fn: (...args: Array<Record<string, T>>) => unknown): void {
  glob.sync(join('dist', path, '**', '*.js'), { absolute: true }).forEach(file => {
    return import(file).then(fn).catch(e => new Logger().error(e));
  });
}
