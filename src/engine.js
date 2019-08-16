/**
 * The engine module exports the Engine class
 *
 * @module engine
 */

import _ from 'lodash';
import EventEmitter from 'events';
import Entity from './entity';
import System from './system';

/**
 * The Engine class
 *
 * @extends EventEmitter
 */
class Engine extends EventEmitter {
  constructor() {
    super();

    /**
     * Declared entities
     *
     * @private
     * @type Object
    */
    this.entities = {};

    /**
     * Declared systems
     *
     * @private
     * @type System[]
     */
    this.systems = [];

    /**
     * Entities associated to systems
     *
     * @private
     * @type Object
     */
    this.systemVsEntities = {};
  }

  /**
   * Declare a new entity
   *
   * @param {String} name Name of the new entity
   * @return {Entity} The newly created entity object
   */
  entity(name) {
    if (typeof name !== 'string') throw new Error('name must be a string');
    if (this.entities[name] !== undefined) throw new Error(`Entity ${name} already exists`);
    const entity = new Entity(/* this, */ name);
    entity.on('component:add', () => this.updateSystemsVsEntities());
    entity.on('component:delete', () => this.updateSystemsVsEntities());
    entity.on('entity:remove', (entityName) => this.removeEntity(entityName));
    this.entities[name] = entity;
    return entity;
  }

  /**
   * Returns existing entity
   *
   * @param {String} name Name of the entity
   * @return {Entity} The entity object or undefined if not found
   */
  getEntity(name) {
    if (typeof name !== 'string') throw new Error('name must be a string');
    return this.entities[name];
  }

  /**
   * Remove a entity from the engine instance
   *
   * @param {String} name The name of the entity to be removed
   */
  removeEntity(name) {
    delete this.entities[name];

    // update system vs entity associations
    this.updateSystemsVsEntities();
  }

  /**
   * Declare a new system.<br/>
   * The handler function receives two arguments, the name of the entity and a object
   * of components.
   *
   * @param {String} name Name of the new system
   * @param {string[]} components Names of the components the new system will operate on
   * @param {Function} handler System function
   * @return {System} The newly created system object
   */
  system(name, components, handler) {
    if (typeof name !== 'string') throw new Error('name must be a string');
    if (!(_.isArrayLike(components) && _.every(components, _.isString))) throw new Error('components must be a string array');
    if (typeof handler !== 'function') throw new Error('handler must be a function');

    // Systems is an array instead of a map to guarantee execution order
    if (_.some(this.systems, (system) => system.name === name)) {
      throw new Error(`System ${name} already exists`);
    }
    const system = new System(/* this, */ name, components, handler);
    system.on('system:remove', (systemName) => this.removeSystem(systemName));
    this.systems.push(system);

    // Update system vs entity associations
    this.updateSystemsVsEntities();
    return system;
  }

  /**
   * Returns existing system
   *
   * @param {String} name Name of the system
   * @return {System} The system object or undefined if not found
   */
  getSystem(name) {
    if (typeof name !== 'string') throw new Error('name must be a string');
    return _.find(this.systems, (system) => system.name === name);
  }

  /**
   * Remove a system from the engine instance
   *
   * @param {String} name The name of the system to be removed
   */
  removeSystem(name) {
    if (typeof name !== 'string') throw new Error('name must be a string');
    this.systems = _.filter(this.systems, (system) => system.name !== name);

    // update system vs entity associations
    this.updateSystemsVsEntities();
  }

  /**
   * Scan systems and search for suitable entities
   * to be associated.
   *
   * @private
   */
  updateSystemsVsEntities() {
    _.forEach(this.systems, (system) => {
      const systemName = system.name;
      const compatibleEntities = [];
      this.systemVsEntities[systemName] = compatibleEntities;

      _.forEach(this.entities, (entity) => {
        if (system.isCompatibleEntity(entity)) {
          compatibleEntities.push(entity);
        }
      });
    });
  }

  /**
   * Run a single execution step.<br/>
   * Emit a TICK_BEFORE event before running the systems and a TICK_AFTER event after running them.
   *
   * @return {Number} Current simulation time
   */
  tick() {
    /**
     * Emitted by the engine just before running the systems.<br/>
     * The payload is the Engine instance that originated the event.
     * @event tick:before
     * @type {Engine}
     */
    this.emit('tick:before', this);

    _.forEach(this.systems, (system) => {
      _.forEach(this.systemVsEntities[system.name], (entity) => {
        const components = {};
        _.forEach(system.components, (name) => {
          components[name] = entity.components[name];
        });
        system.handler(entity, components);
      });
    });

    /**
     * Emitted by then engine after running all the systems.<br/>
     * The payload is the Engine instance that originated the event.
     * @event tick:after
     * @type {Engine}
     */
    this.emit('tick:after', this);
  }
}

export default Engine;
