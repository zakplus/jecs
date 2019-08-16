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
 * The system class.
 * To create a new system, use the Engine.system() method.
 *
 * @extends EventEmitter
 */
var System =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(System, _EventEmitter);

  /**
    * Do not instantiate this class directly, use the Engine.system() method.
    *
    * @private
    * @param {String} name Name of the system
    * @param {String[]} components Array of component names this system operates on
    * @param {Function} handler System function
    */
  function System(name, components, handler) {
    var _this;

    _classCallCheck(this, System);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(System).call(this));
    if (typeof name !== 'string') throw new Error('name must be a string');
    if (!(_lodash.default.isArrayLike(components) && _lodash.default.every(components, _lodash.default.isString))) throw new Error('components must be a string array');
    if (typeof handler !== 'function') throw new Error('handler must be a function');
    _this.name = name;
    _this.components = components;
    _this.handler = handler;
    return _this;
  }
  /**
   * Check if the entity is associated to every component this system require.
   *
   * @param {Entity} entity Entity object
   * @return {Boolean} true if the entity is compatible, false otherwise.
   */


  _createClass(System, [{
    key: "isCompatibleEntity",
    value: function isCompatibleEntity(entity) {
      return _lodash.default.every(this.components, function (component) {
        return entity.hasComponent(component);
      });
    }
    /**
     * Returns this system name
     *
     * @return {String} this system name
     */

  }, {
    key: "getName",
    value: function getName() {
      return _lodash.default.clone(this.name);
    }
    /**
     * Remove this system from engine
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.emit('system:remove', this.name);
    }
  }]);

  return System;
}(_events.default);

var _default = System;
exports.default = _default;