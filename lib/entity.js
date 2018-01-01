"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The entity class expose methods to associate
 * the entity to components and to get/set components data
 *
 * @class Entity
 * @constructor
 */
var Entity = function () {
  /**
   * Instantiate a new Entity
   *
   * @private
   * @method constructor
   * @param {Ecs} ecs Ecs engine object this Entity belongs to
   * @param {String} name Entity name
   */
  function Entity(ecs, name) {
    _classCallCheck(this, Entity);

    this.ecs = ecs;
    this.name = name;
    this.components = {};
  }

  /**
   * Check if the entity is associated to a component
   *
   * @method hasComponent
   * @param {String} componentName Name of the component
   * @return {Boolean} true if the entity has the component associated, false otherwise.
   */


  _createClass(Entity, [{
    key: "hasComponent",
    value: function hasComponent(componentName) {
      return this.components[componentName] !== undefined;
    }

    /**
     * Associate the entity to a component.
     * The component can be any type.
     *
     * @method setComponent
     * @param {String} componentName The component name
     * @param {*} componentData The component data
     */

  }, {
    key: "setComponent",
    value: function setComponent(componentName, componentData) {
      // If this is a new association update system vs entity associations
      var newComponent = false;
      if (this.components[componentName] === undefined) {
        newComponent = true;
      }

      // Set component data
      this.components[componentName] = componentData;
      if (newComponent) this.ecs.updateSystemsVsEntities();
    }

    /**
     * Remove a component association
     *
     * @method deleteComponent
     * @param {String} componentName
     */

  }, {
    key: "deleteComponent",
    value: function deleteComponent(componentName) {
      if (this.hasComponent(componentName)) {
        delete this.components[componentName];

        // update system vs entity associations
        this.ecs.updateSystemsVsEntities();
      }
    }

    /**
     * Remove this entity from the engine
     *
     * @method destroy
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.ecs.removeEntity(this.name);
    }
  }]);

  return Entity;
}();

module.exports = Entity;