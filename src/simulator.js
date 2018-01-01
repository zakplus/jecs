/**
 * The Simulator is a utility class, it will setup
 * a main loop and will call Ecs.tick() for you automatically
 * limiting the frame per seconds.
 *
 * @class Simulator
 * @constructor
*/
class Simulator {
  /**
   * Instantiate a new simulator
   *
   * @method constructor
   * @param {Ecs} ecs The Ecs instance this simulator will control
   */
  constructor(ecs) {
    this.ecs = ecs;
    this.time = 0;
    this.setFps(0);
    this.stop();
  }

  /**
   * Set simulation fps limiter value.<br/>
   * A value of 0 will disable the fps limiter
   *
   * @method setFps
   * @param {Number} fps
   */
  setFps(fps) {
    this.fps = 0;
    if (fps && typeof fps === 'number' && fps > 0) {
      this.fps = parseInt(Math.round(fps), 10);
    }
    this.frameDuration = 1000 / this.fps;
  }

  /**
   * Return current simulation fps limiter value.
   *
   * @method getFps
   * @see setFps
   */
  getFps() {
    return this.fps;
  }

  /**
   * Start simulation
   *
   * @method start
   */
  start() {
    this.started = true;
    this.paused = false;
    this.run();
  }

  /**
   * Pause simulation
   *
   * @method pause
   */
  pause() {
    this.paused = true;
  }

  /**
   * Stop simulation and reset simulation time
   *
   * @method stop
   */
  stop() {
    this.prevFrameTime = null;
    this.started = false;
    this.paused = false;
  }

  /**
   * Check whether the simulation is running
   *
   * @method isRunning
   * @return {Boolean} true if simulator is running, false otherwise
   */
  isRunning() {
    if (this.started && !this.paused) return true;
    return false;
  }

  /**
   * Check whether the simulation is paused
   *
   * @method isPaused
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
   * @method run
   */
  run() {
    const t1 = Date.now();
    this.ecs.tick();
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

module.exports = Simulator;
