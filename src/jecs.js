/**
 * The jecs module is the main module.<br/>
 * It exports the classes you are supposed to instantiate directly.
 * @module jecs
 * @example
 * import { Engine, Timer } from 'jecs';
*/

import Engine from './engine';
import Timer from './timer';
import Simulator from './simulator';

export {
  /**
   * The Engine class
   * @property Engine
   * @type {Engine}
  */
  Engine,

  /**
   * The Simulator class
   * @property Simulator
   * @type {Simulator}
  */
  Simulator,

  /**
   * The Timer class
   * @property Timer
   * @type {Timer}
  */
  Timer,
};
