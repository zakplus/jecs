/**
 * The timer module exports the Timer class
 *
 * @module timer
 */

import Engine from './engine';

function randomId(prefix) {
  return `${prefix}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * The Timer class is a utility class.
 * By creating a new instance of this class, you will be able to retrieve timings
 * informations in your systems.
 *
 * @example
 * import { Engine, Timer } from 'jecs';
 *
 * const engine = new Engine();
 * const timer = new Timer(engine);
 *
 * engine.system('mySystem', ['myComponent'], (entity, { myComponent }) => {
 *   const delta = timer.getTime().delta;
 *   // Do your magic with delta time!
 *   // ...
 * });
 *
 * @example
 * // Object returned by getTime() has this structure:
 * {
 *   ticks,  // Number of ticks (frames)
 *   start,  // Initial time (milliseconds since the EPOCH)
 *   now,    // Current time (milliseconds since the EPOCH)
 *   total,  // Total execution time (milliseconds)
 *   delta   // Delta time from prev tick (milliseconds)
 * }
 */
class Timer {
  /**
   * @param {Engine} engine Engine instance this Timer will belong to
   */
  constructor(engine) {
    if (!(engine instanceof Engine)) throw new Error('engine must be a Engine instance');

    const entityName = randomId('clock');
    const componentName = randomId('time');
    const systemName = randomId('timer');

    // time component
    this.time = {};
    this.reset();

    // clock entity
    this.entity = engine.entity(entityName);

    // Associate the time component to the clock entity.
    this.entity.setComponent(componentName, this.time);

    // A system for updating the time component
    this.system = engine.system(systemName, [componentName], (entity, components) => {
      const time = components[componentName];
      const now = Date.now();

      // Update ticks counter
      time.ticks += 1;

      // Init start time
      if (time.start === 0) time.start = now;

      // Update total time
      time.total = now - time.start;

      // Update delta
      if (time.now > 0) {
        time.delta = now - time.now;
      }

      // Update now time
      time.now = now;
    });
  }

  /**
   * Reset all timing values to 0
   */
  reset() {
    this.time.ticks = 0; // Number of ticks (frames)
    this.time.start = 0; // initial time
    this.time.now = 0; // Current absolute time
    this.time.total = 0; // total execution time
    this.time.delta = 0; // delta time from prev tick
  }

  /**
   * Returns the time component
   *
   * @return {Object} A time component object
   * @example
   * The time object contains these properties:<br/>
   * <table>
   * <tr><th>start</td><td>initial time</td>
   * <tr><th>total</td><td>total execution time</td>
   * <tr><th>prev</td><td>previous frame absolute time</td>
   * <tr><th>delta</td><td>delta time from prev tick</td>
   * </table>
   */
  getTime() {
    return this.time;
  }

  /**
   * Returns the entity used by this timer
   *
   * @return {Entity} The timer entity
   */
  getEntity() {
    return this.entity;
  }

  /**
   * Returns the system used by this timer
   *
   * @return {System} The timer system
   */
  getSystem() {
    return this.system;
  }
}

export default Timer;
