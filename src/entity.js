/**
 * The entity module exports the Entity class
 *
 * @module entity
 */

import _ from 'lodash';
import EventEmitter from 'events';

/**
 * The entity class expose methods to associate
 * the entity to components and to get/set components data.<br/>
 * To create a new entity, use the Engine.entity() method.
 *
 * @extends EventEmitter
 */
class Entity extends EventEmitter {
  /**
    * Do not instantiate this class directly, use the Engine.entity() method.
    *
    * @private
    * @param {String} name Entity name
    */
  constructor(name) {
    super();
    if (typeof name !== 'string') throw new Error('name must be a string');

    this.name = name;
    this.components = {};
  }

  /**
   * Returns this entity name
   *
   * @return {String} this entity name
   */
  getName() {
    return _.clone(this.name);
  }

  /**
   * Check if the entity is associated to a component
   *
   * @param {String} componentName Name of the component
   * @return {Boolean} true if the entity has the component associated, false otherwise.
   */
  hasComponent(componentName) {
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
  setComponent(componentName, componentData) {
    if (typeof componentName !== 'string') throw new Error('componentName must be a string');

    // If this is a new association update system vs entity associations
    let newComponent = false;
    if (this.components[componentName] === undefined) {
      newComponent = true;
    }

    // Set component data
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
  getComponent(componentName) {
    if (typeof componentName !== 'string') throw new Error('componentName must be a string');

    return this.components[componentName];
  }

  /**
   * Remove a component association
   *
   * @param {String} componentName
   */
  deleteComponent(componentName) {
    if (typeof componentName !== 'string') throw new Error('componentName must be a string');

    if (this.hasComponent(componentName)) {
      delete this.components[componentName];

      // update system vs entity associations
      this.emit('component:remove', componentName);
    }
  }

  /**
   * Remove this entity from the engine
   */
  destroy() {
    this.emit('entity:remove', this.name);
  }
}

export default Entity;
