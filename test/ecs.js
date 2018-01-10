const test = require('tape');
const Ecs = require('../lib/ecs');

test('Testing Ecs class...', (t) => {
  t.equal(typeof Ecs, 'function', 'Type of Ecs should be \'function\'');

  t.equal(typeof Ecs.Entity, 'function', 'Ecs.Entity should be \'function\'');
  t.equal(typeof Ecs.System, 'function', 'Ecs.System should be \'function\'');
  t.equal(typeof Ecs.Simulator, 'function', 'Ecs.Simulator should be \'function\'');

  const ecs = new Ecs();
  t.equal(typeof ecs.entity, 'function', 'ecs.entity should be a function');
  t.equal(typeof ecs.system, 'function', 'ecs.system should be a function');
  t.equal(typeof ecs.getEntity, 'function', 'ecs.getEntity should be a function');
  t.equal(typeof ecs.getSystem, 'function', 'ecs.getSystem should be a function');

  const entity = ecs.entity('test');
  t.true(entity instanceof Ecs.Entity, 'ecs.entity() should return an instance of Entity');
  t.equal(ecs.getEntity('test'), entity, 'ecs.getEntity("test") should return the entity object');

  const system = ecs.system('test', ['dummy'], () => {});
  t.true(system instanceof Ecs.System, 'ecs.system() should return an instance of System');
  t.equal(ecs.getSystem('test'), system, 'ecs.getSystem("test") should return the system object');

  t.equal(typeof ecs.tick, 'function', 'ecs.tick() should be a function');
  t.end();
});

test('Ecs functional test...', (t) => {
  const ecs = new Ecs();
  const player = ecs.entity('player');

  player.setComponent('position', { x: 0, y: 0 });
  player.setComponent('physics', { speedx: 1, speedy: 2 });

  ecs.system('move', ['position', 'physics'], (entity, { physics, position }) => {
    position.x += physics.speedx;
    position.y += physics.speedy;
  });

  ecs.tick();
  t.equal(player.components.position.x, 1, 'Player x position should be 1');
  t.equal(player.components.position.y, 2, 'Player y position should be 2');

  ecs.tick();
  t.equal(player.components.position.x, 2, 'Player x position should be 2');
  t.equal(player.components.position.y, 4, 'Player y position should be 4');

  t.end();
});
