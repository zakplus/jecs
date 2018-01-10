import _ from 'lodash';
import Ecs from './ecs';

/**
 * The entity class expose methods to associate
 * the entity to components and to get/set components data
 *
 * @class Entity
 * @constructor
 * @private
 * @method constructor
 * @param {Ecs} ecs Ecs engine object this Entity belongs to
 * @param {String} name Entity name
 */
class Entity {
  constructor(ecs, name) {
    if (!(ecs instanceof Ecs)) throw new Error('ecs must be a Ecs instance');
    if (typeof name !== 'string') throw new Error('name must be a string');

    this.ecs = ecs;
    this.name = name;
    this.components = {};
  }

  /**
   * Returns this entity name
   *
   * @method getName
   * @return {String} this entity name
   */
  getName() {
    return _.clone(this.name);
  }

  /**
   * Check if the entity is associated to a component
   *
   * @method hasComponent
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
   * @method setComponent
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
    if (newComponent) this.ecs.updateSystemsVsEntities();
  }

  /**
   * Remove a component association
   *
   * @method deleteComponent
   * @param {String} componentName
   */
  deleteComponent(componentName) {
    if (typeof componentName !== 'string') throw new Error('componentName must be a string');

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
  destroy() {
    this.ecs.removeEntity(this.name);
  }
}

export default Entity;
