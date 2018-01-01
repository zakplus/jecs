'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _entity = require('./entity');

var _entity2 = _interopRequireDefault(_entity);

var _system = require('./system');

var _system2 = _interopRequireDefault(_system);

var _simulator = require('./simulator');

var _simulator2 = _interopRequireDefault(_simulator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * The jecs module exports the Ecs class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module jecs
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * The Ecs is the main class
 *
 * @class Ecs
 * @constructor
 * @extends EventEmitter
 */
var Ecs = function (_EventEmitter) {
  _inherits(Ecs, _EventEmitter);

  /**
   * Instantiate a new Ecs
   *
   * @method constructor
   */
  function Ecs() {
    _classCallCheck(this, Ecs);

    /**
     * Declared entities
     *
     * @private
     * @attribute entities
     * @type Object
    */
    var _this = _possibleConstructorReturn(this, (Ecs.__proto__ || Object.getPrototypeOf(Ecs)).call(this));

    _this.entities = {};

    /**
     * Declared systems
     *
     * @private
     * @attribute systems
     * @type System[]
     */
    _this.systems = [];

    /**
     * Entities associated to systems
     *
     * @private
     * @attribute systemVsEntities
     * @type Object
     */
    _this.systemVsEntities = {};
    return _this;
  }

  /**
   * Declare a new entity
   *
   * @method entity
   * @param {String} name Name of the new entity
   * @return {Entity} The newly created entity object
   */


  _createClass(Ecs, [{
    key: 'entity',
    value: function entity(name) {
      if (this.entities[name] !== undefined) throw new Error('Entity ' + name + ' already exists');
      var entity = new _entity2.default(this, name);
      this.entities[name] = entity;
      return entity;
    }

    /**
     * Returns existing entity
     *
     * @param {String} name Name of the entity
     * @return {Entity} The entity object or undefined if not found
     */

  }, {
    key: 'getEntity',
    value: function getEntity(name) {
      return this.entities[name];
    }

    /**
     * Remove a entity from the engine instance
     *
     * @param {String} name The name of the entity to be removed
     */

  }, {
    key: 'removeEntity',
    value: function removeEntity(name) {
      delete this.entities[name];

      // update system vs entity associations
      this.updateSystemsVsEntities();
    }

    /**
     * Declare a new system.<br/>
     * The handler function receives two arguments, the name of the entity and a object
     * of components.
     *
     * @method system
     * @param {String} name Name of the new system
     * @param {string[]} components Names of the components the new system will operate on
     * @param {Function} handler System function
     * @return {System} The newly created system object
     */

  }, {
    key: 'system',
    value: function system(name, components, handler) {
      // System is an array instead of a map to guarantee execution order
      if (_lodash2.default.some(this.systems, function (system) {
        return system.name === name;
      })) {
        throw new Error('System ' + name + ' already exists');
      }
      var system = new _system2.default(this, name, components, handler);
      this.systems.push(system);

      // Update system vs entity associations
      this.updateSystemsVsEntities();
      return system;
    }

    /**
     * Returns existing system
     *
     * @param {String} name Name of the system
     * @return {System} The system object or undefined if not found
     */

  }, {
    key: 'getSystem',
    value: function getSystem(name) {
      return _lodash2.default.find(this.systems, function (system) {
        return system.name === name;
      });
    }

    /**
     * Remove a system from the engine instance
     *
     * @param {String} name The name of the system to be removed
     */

  }, {
    key: 'removeSystem',
    value: function removeSystem(name) {
      this.systems = _lodash2.default.filter(this.systems, function (system) {
        return system.name !== name;
      });

      // update system vs entity associations
      this.updateSystemsVsEntities();
    }

    /**
     * Scan systems and search for suitable entities
     * to be associated.
     *
     * @private
     * @method updateSystemsVsEntities
     */

  }, {
    key: 'updateSystemsVsEntities',
    value: function updateSystemsVsEntities() {
      var _this2 = this;

      _lodash2.default.forEach(this.systems, function (system) {
        var systemName = system.name;
        var compatibleEntities = [];
        _this2.systemVsEntities[systemName] = compatibleEntities;

        _lodash2.default.forEach(_this2.entities, function (entity) {
          if (system.isCompatibleEntity(entity)) {
            compatibleEntities.push(entity);
          }
        });
      });
    }

    /**
     * Run a single execution step.<br/>
     * Emit a TICK_BEFORE event before running the systems and a TICK_AFTER event after running them.
     *
     * @method tick
     * @return {Number} Current simulation time
     */

  }, {
    key: 'tick',
    value: function tick() {
      var _this3 = this;

      this.emit('tick-before', this);

      _lodash2.default.forEach(this.systems, function (system) {
        _lodash2.default.forEach(_this3.systemVsEntities[system.name], function (entity) {
          var components = {};
          _lodash2.default.forEach(system.components, function (name) {
            components[name] = entity.components[name];
          });
          system.handler(entity, components);
        });
      });

      this.emit('tick-after', this);
    }
  }]);

  return Ecs;
}(_events2.default);

/**
 * Expose the Entity class
 *
 * @property Entity
 * @type {Entity}
 */


Ecs.Entity = _entity2.default;

/**
 * Expose the System class
 *
 * @property System
 * @type {System}
 */
Ecs.System = _system2.default;

/**
 * Expose the Simulator class
 *
 * @property Simulator
 * @type {Simulator}
 */
Ecs.Simulator = _simulator2.default;

/**
 * Emitted by tick() before running the systems
 *
 * @event TICK_BEFORE
 * @param {Ecs} ecs The Ecs instance that generated the event
 */
Ecs.TICK_BEFORE = 'tick-before';

/**
 * Emitted by tick() after running the systems
 *
 * @event TICK_AFTER
 * @param {Ecs} ecs The Ecs instance that generated the event
 */
Ecs.TICK_AFTER = 'tick-after';

module.exports = Ecs;