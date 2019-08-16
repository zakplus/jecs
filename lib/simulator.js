"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _engine = _interopRequireDefault(require("./engine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The Simulator is a utility class, it will setup
 * a loop and call Engine.tick() for you automatically, optionally
 * limiting the frames per second.
 */
var Simulator =
/*#__PURE__*/
function () {
  /**
   * @param {Engine} engine The Engine instance this simulator will control
   */
  function Simulator(engine) {
    _classCallCheck(this, Simulator);

    if (!(engine instanceof _engine.default)) throw new Error('engine must be a Engine instance');
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


  _createClass(Simulator, [{
    key: "setFps",
    value: function setFps(fps) {
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

  }, {
    key: "getFps",
    value: function getFps() {
      return this.fps;
    }
    /**
     * Start simulation
     */

  }, {
    key: "start",
    value: function start() {
      this.started = true;
      this.paused = false;
      this.run();
    }
    /**
     * Pause simulation
     */

  }, {
    key: "pause",
    value: function pause() {
      this.paused = true;
    }
    /**
     * Stop simulation and reset simulation time
     */

  }, {
    key: "stop",
    value: function stop() {
      this.prevFrameTime = null;
      this.started = false;
      this.paused = false;
    }
    /**
     * Check whether the simulation is running
     *
     * @return {Boolean} true if simulator is running, false otherwise
     */

  }, {
    key: "isRunning",
    value: function isRunning() {
      if (this.started && !this.paused) return true;
      return false;
    }
    /**
     * Check whether the simulation is paused
     *
     * @return {Boolean} true if simulator is paused, false otherwise
     */

  }, {
    key: "isPaused",
    value: function isPaused() {
      if (this.started && this.paused) return true;
      return false;
    }
    /**
     * Simulation loop
     *
     * @private
     */

  }, {
    key: "run",
    value: function run() {
      var _this = this;

      var t1 = Date.now();
      this.engine.tick();
      var t2 = Date.now(); // FPS limiter

      var sleep = 0;

      if (this.fps > 0) {
        sleep = Math.max(0, this.frameDuration - (t2 - t1));
      } // Async loop


      setTimeout(function () {
        if (_this.isRunning()) _this.run();
      }, sleep);
    }
  }]);

  return Simulator;
}();

var _default = Simulator;
exports.default = _default;