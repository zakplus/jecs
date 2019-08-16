const test = require('tape');
const { Engine, Simulator } = require('../lib/jecs');
const Entity = require('../lib/entity').default;
const System = require('../lib/system').default;

test('Testing Engine class...', (t) => {
  console.dir(Engine);
  t.equal(typeof Engine, 'function', 'Type of Engine should be \'function\'');

  t.equal(typeof Entity, 'function', 'Engine.Entity should be \'function\'');
  t.equal(typeof System, 'function', 'Engine.System should be \'function\'');
  t.equal(typeof Simulator, 'function', 'Engine.Simulator should be \'function\'');

  const engine = new Engine();
  t.equal(typeof engine.entity, 'function', 'engine.entity should be a function');
  t.equal(typeof engine.system, 'function', 'engine.system should be a function');
  t.equal(typeof engine.getEntity, 'function', 'engine.getEntity should be a function');
  t.equal(typeof engine.getSystem, 'function', 'engine.getSystem should be a function');

  const entity = engine.entity('test');
  t.true(entity instanceof Entity, 'engine.entity() should return an instance of Entity');
  t.equal(engine.getEntity('test'), entity, 'engine.getEntity("test") should return the entity object');

  const system = engine.system('test', ['dummy'], () => {});
  t.true(system instanceof System, 'engine.system() should return an instance of System');
  t.equal(engine.getSystem('test'), system, 'engine.getSystem("test") should return the system object');

  t.equal(typeof engine.tick, 'function', 'engine.tick() should be a function');
  t.end();
});

test('Engine functional test...', (t) => {
  const engine = new Engine();
  const player = engine.entity('player');

  player.setComponent('position', { x: 0, y: 0 });
  player.setComponent('physics', { speedx: 1, speedy: 2 });

  engine.system('move', ['position', 'physics'], (entity, { physics, position }) => {
    position.x += physics.speedx;
    position.y += physics.speedy;
  });

  engine.tick();
  t.equal(player.components.position.x, 1, 'Player x position should be 1');
  t.equal(player.components.position.y, 2, 'Player y position should be 2');

  engine.tick();
  t.equal(player.components.position.x, 2, 'Player x position should be 2');
  t.equal(player.components.position.y, 4, 'Player y position should be 4');

  t.end();
});
