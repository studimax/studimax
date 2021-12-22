import * as chalk from 'chalk';
import {Transport} from '../types';

/**
 * @internal
 * Console transport.
 * @constructor
 */
export default function CONSOLE_LOG(): Transport {
  return function CONSOLE_LOG(data, options) {
    if (data.level.level < options.level) return;
    const color = chalk.hex(data.level.color);
    if (data.level.name === 'warn') console.warn(color(data.output));
    else if (data.level.name === 'error') console.error(color(data.output));
    else console.log(color(data.output));
  };
}
