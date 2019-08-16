const test = require('tape');
const { Engine } = require('../lib/jecs');

test('Testing System class...', (t) => {
  const engine = new Engine();
  const system = engine.system('test', ['foo', 'bar'], () => {});

  t.equal(typeof system.isCompatibleEntity, 'function', 'system.isCompatibleEntity should be a function');
  t.equal(typeof system.destroy, 'function', 'system.destroy should be a function');

  const compatible = engine.entity('compatible');
  compatible.setComponent('foo', 'hello');
  compatible.setComponent('bar', 'world');
  t.true(system.isCompatibleEntity(compatible), 'system.isCompatibleEntity(compatible) should return true');

  const notCompatible = engine.entity('not compatible');
  t.false(system.isCompatibleEntity(notCompatible), 'system.isCompatibleEntity(notCompatible) should return false');

  system.destroy();
  t.equal(engine.getSystem('test'), undefined, 'engine.getSystem(\'test\') should return undefined');

  t.end();
});
