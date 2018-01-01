/**
 * The entity class expose methods to associate
 * the entity to components and to get/set components data
 *
 * @class Entity
 * @constructor
 */
class Entity {
  /**
   * Instantiate a new Entity
   *
   * @private
   * @method constructor
   * @param {Ecs} ecs Ecs engine object this Entity belongs to
   * @param {String} name Entity name
   */
  constructor(ecs, name) {
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
  hasComponent(componentName) {
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

module.exports = Entity;
