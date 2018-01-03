const test = require('tape');
const Ecs = require('../lib/ecs');

test('Testing System class...', (t) => {
  const ecs = new Ecs();
  const system = ecs.system('test', ['foo', 'bar']);

  t.equal(typeof system.isCompatibleEntity, 'function', 'system.isCompatibleEntity should be a function');
  t.equal(typeof system.destroy, 'function', 'system.destroy should be a function');

  const compatible = ecs.entity('compatible');
  compatible.setComponent('foo', 'hello');
  compatible.setComponent('bar', 'world');
  t.true(system.isCompatibleEntity(compatible), 'system.isCompatibleEntity(compatible) should return true');

  const notCompatible = ecs.entity('not compatible');
  t.false(system.isCompatibleEntity(notCompatible), 'system.isCompatibleEntity(notCompatible) should return false');

  system.destroy();
  t.equal(ecs.getSystem('test'), undefined, 'ecs.getSystem(\'test\') should return undefined');

  t.end();
});
