import _ from 'lodash';

/**
 * The system class
 *
 * @class System
 * @constructor
 */
class System {
  /**
   * Instantiate a new System
   *
   * @private
   * @method constructor
   * @param {Ecs} ecs Ecs engine object this system belongs to
   * @param {String} name Name of the system
   * @param {String[]} components Array of component names this system operates on
   * @param {Function} handler System function
   */
  constructor(ecs, name, components, handler) {
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
  isCompatibleEntity(entity) {
    return _.every(this.components, component => entity.hasComponent(component));
  }

  /**
   * Remove this system from engine
   *
   * @method destroy
   */
  destroy() {
    this.ecs.removeSystem(this.name);
  }
}

module.exports = System;
