'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The Simulator is a utility class, it will setup
 * a main loop and will call Ecs.tick() for you automatically
 * limiting the frame per seconds.
 *
 * @class Simulator
 * @constructor
*/
var Simulator = function () {
  /**
   * Instantiate a new simulator
   *
   * @method constructor
   * @param {Ecs} ecs The Ecs instance this simulator will control
   */
  function Simulator(ecs) {
    _classCallCheck(this, Simulator);

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


  _createClass(Simulator, [{
    key: 'setFps',
    value: function setFps(fps) {
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

  }, {
    key: 'getFps',
    value: function getFps() {
      return this.fps;
    }

    /**
     * Start simulation
     *
     * @method start
     */

  }, {
    key: 'start',
    value: function start() {
      this.started = true;
      this.paused = false;
      this.run();
    }

    /**
     * Pause simulation
     *
     * @method pause
     */

  }, {
    key: 'pause',
    value: function pause() {
      this.paused = true;
    }

    /**
     * Stop simulation and reset simulation time
     *
     * @method stop
     */

  }, {
    key: 'stop',
    value: function stop() {
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

  }, {
    key: 'isRunning',
    value: function isRunning() {
      if (this.started && !this.paused) return true;
      return false;
    }

    /**
     * Check whether the simulation is paused
     *
     * @method isPaused
     * @return {Boolean} true if simulator is paused, false otherwise
     */

  }, {
    key: 'isPaused',
    value: function isPaused() {
      if (this.started && this.paused) return true;
      return false;
    }

    /**
     * Simulation loop
     *
     * @private
     * @method run
     */

  }, {
    key: 'run',
    value: function run() {
      var _this = this;

      var t1 = Date.now();
      this.ecs.tick();
      var t2 = Date.now();

      // FPS limiter
      var sleep = 0;
      if (this.fps > 0) {
        sleep = Math.max(0, this.frameDuration - (t2 - t1));
      }

      // Async loop
      setTimeout(function () {
        if (_this.isRunning()) _this.run();
      }, sleep);
    }
  }]);

  return Simulator;
}();

module.exports = Simulator;