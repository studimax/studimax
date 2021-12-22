import {Data, Transport, TransportOptions} from '../types';
import * as path from 'path';
import * as fs from 'fs';

/**
 * @internal
 * A transport that writes to a file. file name is specified in the options.
 * @param subFolders
 * @constructor
 */
export default function NAMED_LOG(...subFolders: string[]): Transport {
  return async function NAMED_LOG(data: Data, options: TransportOptions) {
    const file = path.join(process.cwd(), options.logFolder, ...subFolders, `${options.name ?? 'default'}`);
    await fs.promises.mkdir(path.dirname(file), {recursive: true});
    await options.transportReady;
    await fs.promises.appendFile(file, `${data.output}\n`);
  };
}
