import {Data, Transport, TransportOptions} from '../types';
import * as path from 'path';
import {format} from 'fecha';
import * as fs from 'fs';

/**
 * @internal
 * A transport that writes to a file. file name is current date.
 * @param dateFormat default YYYY-MM-DD
 * @param subFolders
 * @constructor
 */
export default function DATED_LOG(dateFormat = 'YYYY-MM-DD', ...subFolders: string[]): Transport {
  return async function DATED_LOG(data: Data, options: TransportOptions) {
    const filePrefix = options.name ? `${options.name}-` : '';
    const file = path.join(
      process.cwd(),
      options.logFolder,
      ...subFolders,
      `${filePrefix}${format(data.date, dateFormat)}.log`
    );
    await fs.promises.mkdir(path.dirname(file), {recursive: true});
    await options.transportReady; // wait for transport to be ready to keep right order
    await fs.promises.appendFile(file, `${data.output}\n`);
  };
}
