'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ecs = require('./ecs');

var _ecs2 = _interopRequireDefault(_ecs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function randomId(prefix) {
  return prefix + '-' + Math.floor(Math.random() * 1000);
}

/**
 * The Timer class is a utility class.
 * By creating a new instance of this class, you will be able to retrieve timings
 * informations in your systems.
 *
 * @class Timer
 * @constructor
 * @param {Ecs} ecs Ecs instance this Timer will belong to
 *
 * @example
 * ```javascript
 *
 * const ecs = new Ecs();
 * const timer = new Ecs.Timer(ecs);
 *
 * ecs.system('mySystem', ['myComponent'], (entity, {myComponent}) => {
 *   const delta = timer.getTime().delta;
 *   // Do your magic with delta time!
 *   // ...
 * });
 * ```
 *
 * Object returned by getTime() has this structure:
 * ```javascript
 *
 * {
 *   ticks,  // Number of ticks (frames)
 *   start,  // Initial time (milliseconds since the EPOCH)
 *   now,    // Current time (milliseconds since the EPOCH)
 *   total,  // Total execution time (milliseconds)
 *   delta   // Delta time from prev tick (milliseconds)
 * }
 * ```
 */

var Timer = function () {
  function Timer(ecs) {
    _classCallCheck(this, Timer);

    if (!(ecs instanceof _ecs2.default)) throw new Error('ecs must be a Ecs instance');

    var entityName = randomId('clock');
    var componentName = randomId('time');
    var systemName = randomId('timer');

    // time component
    this.time = {};
    this.reset();

    // clock entity
    this.entity = ecs.entity(entityName);

    // Associate the time component to the clock entity.
    this.entity.setComponent(componentName, this.time);

    // A system for updating the time component
    this.system = ecs.system(systemName, [componentName], function (entity, components) {
      var time = components[componentName];
      var now = Date.now();

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
   *
   * @method reset
   */


  _createClass(Timer, [{
    key: 'reset',
    value: function reset() {
      this.time.ticks = 0; // Number of ticks (frames)
      this.time.start = 0; // initial time
      this.time.now = 0; // Current absolute time
      this.time.total = 0; // total execution time
      this.time.delta = 0; // delta time from prev tick
    }

    /**
     * Returns the time component
     *
     * @method getTime
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

  }, {
    key: 'getTime',
    value: function getTime() {
      return this.time;
    }

    /**
     * Returns the entity used by this timer
     *
     * @method getEntity
     * @return {Entity} The timer entity
     */

  }, {
    key: 'getEntity',
    value: function getEntity() {
      return this.entity;
    }

    /**
     * Returns the system used by this timer
     *
     * @method getSystem
     * @return {System} The timer system
     */

  }, {
    key: 'getSystem',
    value: function getSystem() {
      return this.system;
    }
  }]);

  return Timer;
}();

exports.default = Timer;
module.exports = exports['default'];