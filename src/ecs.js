/**
 * The jecs module exports the Ecs class
 *
 * @module jecs
 */

import _ from 'lodash';
import EventEmitter from 'events';
import Entity from './entity';
import System from './system';
import Simulator from './simulator';

/**
 * The Ecs is the main class
 *
 * @class Ecs
 * @constructor
 * @extends EventEmitter
 */
class Ecs extends EventEmitter {
  /**
   * Instantiate a new Ecs
   *
   * @method constructor
   */
  constructor() {
    super();

    /**
     * Declared entities
     *
     * @private
     * @attribute entities
     * @type Object
    */
    this.entities = {};

    /**
     * Declared systems
     *
     * @private
     * @attribute systems
     * @type System[]
     */
    this.systems = [];

    /**
     * Entities associated to systems
     *
     * @private
     * @attribute systemVsEntities
     * @type Object
     */
    this.systemVsEntities = {};
  }

  /**
   * Declare a new entity
   *
   * @method entity
   * @param {String} name Name of the new entity
   * @return {Entity} The newly created entity object
   */
  entity(name) {
    if (this.entities[name] !== undefined) throw new Error(`Entity ${name} already exists`);
    const entity = new Entity(this, name);
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
   * @method system
   * @param {String} name Name of the new system
   * @param {string[]} components Names of the components the new system will operate on
   * @param {Function} handler System function
   * @return {System} The newly created system object
   */
  system(name, components, handler) {
    // System is an array instead of a map to guarantee execution order
    if (_.some(this.systems, system => system.name === name)) {
      throw new Error(`System ${name} already exists`);
    }
    const system = new System(this, name, components, handler);
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
    return _.find(this.systems, system => system.name === name);
  }

  /**
   * Remove a system from the engine instance
   *
   * @param {String} name The name of the system to be removed
   */
  removeSystem(name) {
    this.systems = _.filter(this.systems, system => system.name !== name);

    // update system vs entity associations
    this.updateSystemsVsEntities();
  }

  /**
   * Scan systems and search for suitable entities
   * to be associated.
   *
   * @private
   * @method updateSystemsVsEntities
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
   * @method tick
   * @return {Number} Current simulation time
   */
  tick() {
    this.emit('tick-before', this);

    _.forEach(this.systems, (system) => {
      _.forEach(this.systemVsEntities[system.name], (entity) => {
        const components = {};
        _.forEach(system.components, (name) => {
          components[name] = entity.components[name];
        });
        system.handler(entity, components);
      });
    });

    this.emit('tick-after', this);
  }
}

/**
 * Expose the Entity class
 *
 * @property Entity
 * @type {Entity}
 */
Ecs.Entity = Entity;

/**
 * Expose the System class
 *
 * @property System
 * @type {System}
 */
Ecs.System = System;

/**
 * Expose the Simulator class
 *
 * @property Simulator
 * @type {Simulator}
 */
Ecs.Simulator = Simulator;

/**
 * Emitted by tick() before running the systems
 *
 * @event TICK_BEFORE
 * @param {Ecs} ecs The Ecs instance that generated the event
 */
Ecs.TICK_BEFORE = 'tick-before';

/**
 * Emitted by tick() after running the systems
 *
 * @event TICK_AFTER
 * @param {Ecs} ecs The Ecs instance that generated the event
 */
Ecs.TICK_AFTER = 'tick-after';

module.exports = Ecs;
