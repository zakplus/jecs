"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _events = _interopRequireDefault(require("events"));

var _entity = _interopRequireDefault(require("./entity"));

var _system = _interopRequireDefault(require("./system"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * The Engine class
 *
 * @extends EventEmitter
 */
var Engine =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Engine, _EventEmitter);

  function Engine() {
    var _this;

    _classCallCheck(this, Engine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Engine).call(this));
    /**
     * Declared entities
     *
     * @private
     * @type Object
    */

    _this.entities = {};
    /**
     * Declared systems
     *
     * @private
     * @type System[]
     */

    _this.systems = [];
    /**
     * Entities associated to systems
     *
     * @private
     * @type Object
     */

    _this.systemVsEntities = {};
    return _this;
  }
  /**
   * Declare a new entity
   *
   * @param {String} name Name of the new entity
   * @return {Entity} The newly created entity object
   */


  _createClass(Engine, [{
    key: "entity",
    value: function entity(name) {
      var _this2 = this;

      if (typeof name !== 'string') throw new Error('name must be a string');
      if (this.entities[name] !== undefined) throw new Error("Entity ".concat(name, " already exists"));
      var entity = new _entity.default(
      /* this, */
      name);
      entity.on('component:add', function () {
        return _this2.updateSystemsVsEntities();
      });
      entity.on('component:delete', function () {
        return _this2.updateSystemsVsEntities();
      });
      entity.on('entity:remove', function (entityName) {
        return _this2.removeEntity(entityName);
      });
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
    key: "getEntity",
    value: function getEntity(name) {
      if (typeof name !== 'string') throw new Error('name must be a string');
      return this.entities[name];
    }
    /**
     * Remove a entity from the engine instance
     *
     * @param {String} name The name of the entity to be removed
     */

  }, {
    key: "removeEntity",
    value: function removeEntity(name) {
      delete this.entities[name]; // update system vs entity associations

      this.updateSystemsVsEntities();
    }
    /**
     * Declare a new system.<br/>
     * The handler function receives two arguments, the name of the entity and a object
     * of components.
     *
     * @param {String} name Name of the new system
     * @param {string[]} components Names of the components the new system will operate on
     * @param {Function} handler System function
     * @return {System} The newly created system object
     */

  }, {
    key: "system",
    value: function system(name, components, handler) {
      var _this3 = this;

      if (typeof name !== 'string') throw new Error('name must be a string');
      if (!(_lodash.default.isArrayLike(components) && _lodash.default.every(components, _lodash.default.isString))) throw new Error('components must be a string array');
      if (typeof handler !== 'function') throw new Error('handler must be a function'); // Systems is an array instead of a map to guarantee execution order

      if (_lodash.default.some(this.systems, function (system) {
        return system.name === name;
      })) {
        throw new Error("System ".concat(name, " already exists"));
      }

      var system = new _system.default(
      /* this, */
      name, components, handler);
      system.on('system:remove', function (systemName) {
        return _this3.removeSystem(systemName);
      });
      this.systems.push(system); // Update system vs entity associations

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
    key: "getSystem",
    value: function getSystem(name) {
      if (typeof name !== 'string') throw new Error('name must be a string');
      return _lodash.default.find(this.systems, function (system) {
        return system.name === name;
      });
    }
    /**
     * Remove a system from the engine instance
     *
     * @param {String} name The name of the system to be removed
     */

  }, {
    key: "removeSystem",
    value: function removeSystem(name) {
      if (typeof name !== 'string') throw new Error('name must be a string');
      this.systems = _lodash.default.filter(this.systems, function (system) {
        return system.name !== name;
      }); // update system vs entity associations

      this.updateSystemsVsEntities();
    }
    /**
     * Scan systems and search for suitable entities
     * to be associated.
     *
     * @private
     */

  }, {
    key: "updateSystemsVsEntities",
    value: function updateSystemsVsEntities() {
      var _this4 = this;

      _lodash.default.forEach(this.systems, function (system) {
        var systemName = system.name;
        var compatibleEntities = [];
        _this4.systemVsEntities[systemName] = compatibleEntities;

        _lodash.default.forEach(_this4.entities, function (entity) {
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
     * @return {Number} Current simulation time
     */

  }, {
    key: "tick",
    value: function tick() {
      var _this5 = this;

      /**
       * Emitted by the engine just before running the systems.<br/>
       * The payload is the Engine instance that originated the event.
       * @event tick:before
       * @type {Engine}
       */
      this.emit('tick:before', this);

      _lodash.default.forEach(this.systems, function (system) {
        _lodash.default.forEach(_this5.systemVsEntities[system.name], function (entity) {
          var components = {};

          _lodash.default.forEach(system.components, function (name) {
            components[name] = entity.components[name];
          });

          system.handler(entity, components);
        });
      });
      /**
       * Emitted by then engine after running all the systems.<br/>
       * The payload is the Engine instance that originated the event.
       * @event tick:after
       * @type {Engine}
       */


      this.emit('tick:after', this);
    }
  }]);

  return Engine;
}(_events.default);

var _default = Engine;
exports.default = _default;