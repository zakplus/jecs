/**
 * The system module exports the System class
 *
 * @module system
 */

import _ from 'lodash';
import EventEmitter from 'events';

/**
 * The system class.
 * To create a new system, use the Engine.system() method.
 *
 * @extends EventEmitter
 */
class System extends EventEmitter {
  /**
    * Do not instantiate this class directly, use the Engine.system() method.
    *
    * @private
    * @param {String} name Name of the system
    * @param {String[]} components Array of component names this system operates on
    * @param {Function} handler System function
    */
  constructor(name, components, handler) {
    super();
    if (typeof name !== 'string') throw new Error('name must be a string');
    if (!(_.isArrayLike(components) && _.every(components, _.isString))) throw new Error('components must be a string array');
    if (typeof handler !== 'function') throw new Error('handler must be a function');

    this.name = name;
    this.components = components;
    this.handler = handler;
  }

  /**
   * Check if the entity is associated to every component this system require.
   *
   * @param {Entity} entity Entity object
   * @return {Boolean} true if the entity is compatible, false otherwise.
   */
  isCompatibleEntity(entity) {
    return _.every(this.components, (component) => entity.hasComponent(component));
  }

  /**
   * Returns this system name
   *
   * @return {String} this system name
   */
  getName() {
    return _.clone(this.name);
  }

  /**
   * Remove this system from engine
   */
  destroy() {
    this.emit('system:remove', this.name);
  }
}

export default System;
