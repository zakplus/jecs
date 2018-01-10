'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ecs = require('./ecs');

var _ecs2 = _interopRequireDefault(_ecs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The system class
 *
 * @class System
 * @constructor
 * @private
 * @param {Ecs} ecs Ecs engine object this system belongs to
 * @param {String} name Name of the system
 * @param {String[]} components Array of component names this system operates on
 * @param {Function} handler System function
 */
var System = function () {
  function System(ecs, name, components, handler) {
    _classCallCheck(this, System);

    if (!(ecs instanceof _ecs2.default)) throw new Error('ecs must be a Ecs instance');
    if (typeof name !== 'string') throw new Error('name must be a string');
    if (!(_lodash2.default.isArrayLike(components) && _lodash2.default.every(components, _lodash2.default.isString))) throw new Error('components must be a string array');
    if (typeof handler !== 'function') throw new Error('handler must be a function');

    this.ecs = ecs;
    this.name = name;
    this.components = components;
    this.handler = handler;
  }

  /**
   * Check if the entity is associated to every component this system require.
   *
   * @method isCompatibleEntity
   * @param {Entity} entity Entity object
   * @return {Boolean} true if the entity is compatible, false otherwise.
   */


  _createClass(System, [{
    key: 'isCompatibleEntity',
    value: function isCompatibleEntity(entity) {
      return _lodash2.default.every(this.components, function (component) {
        return entity.hasComponent(component);
      });
    }

    /**
     * Returns this system name
     *
     * @method getName
     * @return {String} this system name
     */

  }, {
    key: 'getName',
    value: function getName() {
      return _lodash2.default.clone(this.name);
    }

    /**
     * Remove this system from engine
     *
     * @method destroy
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.ecs.removeSystem(this.name);
    }
  }]);

  return System;
}();

exports.default = System;
module.exports = exports['default'];