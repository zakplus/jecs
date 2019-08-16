/**
 * The simulator module exports the Simulator class.
 *
 * @module simulator
 */

import Engine from './engine';

/**
 * The Simulator is a utility class, it will setup
 * a loop and call Engine.tick() for you automatically, optionally
 * limiting the frames per second.
 */
class Simulator {
  /**
   * @param {Engine} engine The Engine instance this simulator will control
   */
  constructor(engine) {
    if (!(engine instanceof Engine)) throw new Error('engine must be a Engine instance');

    this.engine = engine;
    this.time = 0;
    this.setFps(0);
    this.stop();
  }

  /**
   * Set simulation fps limiter value.<br/>
   * A value of 0 will disable the fps limiter
   *
   * @param {Number} fps
   */
  setFps(fps) {
    if (typeof fps !== 'number') throw new Error('fps must be a number');

    this.fps = 0;
    if (fps && typeof fps === 'number' && fps > 0) {
      this.fps = parseInt(Math.round(fps), 10);
    }
    this.frameDuration = 1000 / this.fps;
  }

  /**
   * Return current simulation fps limiter value.
   *
   * @see setFps
   */
  getFps() {
    return this.fps;
  }

  /**
   * Start simulation
   */
  start() {
    this.started = true;
    this.paused = false;
    this.run();
  }

  /**
   * Pause simulation
   */
  pause() {
    this.paused = true;
  }

  /**
   * Stop simulation and reset simulation time
   */
  stop() {
    this.prevFrameTime = null;
    this.started = false;
    this.paused = false;
  }

  /**
   * Check whether the simulation is running
   *
   * @return {Boolean} true if simulator is running, false otherwise
   */
  isRunning() {
    if (this.started && !this.paused) return true;
    return false;
  }

  /**
   * Check whether the simulation is paused
   *
   * @return {Boolean} true if simulator is paused, false otherwise
   */
  isPaused() {
    if (this.started && this.paused) return true;
    return false;
  }

  /**
   * Simulation loop
   *
   * @private
   */
  run() {
    const t1 = Date.now();
    this.engine.tick();
    const t2 = Date.now();

    // FPS limiter
    let sleep = 0;
    if (this.fps > 0) {
      sleep = Math.max(0, this.frameDuration - (t2 - t1));
    }

    // Async loop
    setTimeout(() => {
      if (this.isRunning()) this.run();
    }, sleep);
  }
}

export default Simulator;
