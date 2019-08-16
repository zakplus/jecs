"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _events = _interopRequireDefault(require("events"));

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
 * The entity class expose methods to associate
 * the entity to components and to get/set components data.<br/>
 * To create a new entity, use the Engine.entity() method.
 *
 * @extends EventEmitter
 */
var Entity =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Entity, _EventEmitter);

  /**
    * Do not instantiate this class directly, use the Engine.entity() method.
    *
    * @private
    * @param {String} name Entity name
    */
  function Entity(name) {
    var _this;

    _classCallCheck(this, Entity);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Entity).call(this));
    if (typeof name !== 'string') throw new Error('name must be a string');
    _this.name = name;
    _this.components = {};
    return _this;
  }
  /**
   * Returns this entity name
   *
   * @return {String} this entity name
   */


  _createClass(Entity, [{
    key: "getName",
    value: function getName() {
      return _lodash.default.clone(this.name);
    }
    /**
     * Check if the entity is associated to a component
     *
     * @param {String} componentName Name of the component
     * @return {Boolean} true if the entity has the component associated, false otherwise.
     */

  }, {
    key: "hasComponent",
    value: function hasComponent(componentName) {
      if (typeof componentName !== 'string') throw new Error('componentName must be a string');
      return this.components[componentName] !== undefined;
    }
    /**
     * Associate the entity to a component.
     * The component can be any type.
     *
     * @param {String} componentName The component name
     * @param {*} componentData The component data
     */

  }, {
    key: "setComponent",
    value: function setComponent(componentName, componentData) {
      if (typeof componentName !== 'string') throw new Error('componentName must be a string'); // If this is a new association update system vs entity associations

      var newComponent = false;

      if (this.components[componentName] === undefined) {
        newComponent = true;
      } // Set component data


      this.components[componentName] = componentData;

      if (newComponent) {
        this.emit('component:add', newComponent);
      }
    }
    /**
     * Retrieve a component by name
     *
     * @param {String} componentName The component name
     */

  }, {
    key: "getComponent",
    value: function getComponent(componentName) {
      if (typeof componentName !== 'string') throw new Error('componentName must be a string');
      return this.components[componentName];
    }
    /**
     * Remove a component association
     *
     * @param {String} componentName
     */

  }, {
    key: "deleteComponent",
    value: function deleteComponent(componentName) {
      if (typeof componentName !== 'string') throw new Error('componentName must be a string');

      if (this.hasComponent(componentName)) {
        delete this.components[componentName]; // update system vs entity associations

        this.emit('component:remove', componentName);
      }
    }
    /**
     * Remove this entity from the engine
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.emit('entity:remove', this.name);
    }
  }]);

  return Entity;
}(_events.default);

var _default = Entity;
exports.default = _default;