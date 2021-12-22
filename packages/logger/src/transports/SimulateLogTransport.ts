import {Data, TransportOptions} from '../types';

/**
 * @internal
 * Simulate transport delays
 * @param delay
 * @constructor
 */
export default function SIMULATE_LAG(delay: number) {
  return async function SIMULATE_LAG(data: Data, options: TransportOptions) {
    await options.ready;
    await new Promise(resolve => setTimeout(resolve, delay));
  };
}
