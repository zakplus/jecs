import _ from 'lodash';
import Ecs from './ecs';

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
class System {
  constructor(ecs, name, components, handler) {
    if (!(ecs instanceof Ecs)) throw new Error('ecs must be a Ecs instance');
    if (typeof name !== 'string') throw new Error('name must be a string');
    if (!(_.isArrayLike(components) && _.every(components, _.isString))) throw new Error('components must be a string array');
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
  isCompatibleEntity(entity) {
    return _.every(this.components, component => entity.hasComponent(component));
  }

  /**
   * Returns this system name
   *
   * @method getName
   * @return {String} this system name
   */
  getName() {
    return _.clone(this.name);
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

export default System;
