const test = require('tape');
const { Engine } = require('../lib/jecs');

test('Testing Entity class...', (t) => {
  const engine = new Engine();
  const entity = engine.entity('test');

  t.equal(typeof entity.hasComponent, 'function', 'entity.hasComponent should be a function');
  t.equal(typeof entity.setComponent, 'function', 'entity.setComponent should be a function');
  t.equal(typeof entity.deleteComponent, 'function', 'entity.deleteComponent should be a function');
  t.equal(typeof entity.destroy, 'function', 'entity.destroy should be a function');

  entity.setComponent('foo', 'bar');
  t.true(entity.hasComponent('foo'), 'entity.hasComponent(\'foo\') should be true');

  entity.deleteComponent('foo');
  t.false(entity.hasComponent('foo'), 'entity.hasComponent(\'foo\') should now be false');

  entity.destroy();
  t.equal(engine.getEntity('test'), undefined, 'engine.getEntity(\'test\') should return undefined');

  t.end();
});
