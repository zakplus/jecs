const test = require('tape');
const Ecs = require('../lib');

test('Testing Entity class...', (t) => {
  const ecs = new Ecs();
  const entity = ecs.entity('test');

  t.equal(typeof entity.hasComponent, 'function', 'entity.hasComponent should be a function');
  t.equal(typeof entity.setComponent, 'function', 'entity.setComponent should be a function');
  t.equal(typeof entity.deleteComponent, 'function', 'entity.deleteComponent should be a function');
  t.equal(typeof entity.destroy, 'function', 'entity.destroy should be a function');

  entity.setComponent('foo', 'bar');
  t.true(entity.hasComponent('foo'), 'entity.hasComponent(\'foo\') should be true');

  entity.deleteComponent('foo');
  t.false(entity.hasComponent('foo'), 'entity.hasComponent(\'foo\') should now be false');

  entity.destroy();
  t.equal(ecs.getEntity('test'), undefined, 'ecs.getEntity(\'test\') should return undefined');

  t.end();
});
