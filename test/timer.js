const test = require('tape');
const _ = require('lodash');
const Ecs = require('../lib/ecs');

test('Testing Timer class...', (t) => {
  const ecs = new Ecs();
  const timer = new Ecs.Timer(ecs);

  const dummy = ecs.entity('dummyEntity');
  dummy.setComponent('dummyComponent', {});

  ecs.system('timer-tester', ['dummyComponent'], () => {
    const timings = timer.getTime();
    t.true(timings.ticks > 0, 'timings.ticks should be greater than 0');
    t.true(timings.start > 0, 'timings.start should be greater than 0');
    t.true(timings.now > 0, 'timings.now should be greater than 0');
    if (timings.ticks === 1) {
      t.equal(timings.start, timings.now, 'timings.start should be equal to timings.now');
      t.equal(timings.total, 0, 'timings.total should be 0');
      t.equal(timings.delta, 0, 'timings.delta should be 0');
    } else {
      t.true(timings.now > timings.start, 'timings.now should be greater than timings.start');
      t.true(timings.total > 0, 'timings.total should be greater than 0');
      t.true(timings.delta > 0, 'timings.delta should be greater than 0');
      t.end();
    }
  });

  t.true(_.every(timer.getTime(), value => value === 0), 'Every timer.getTime() properties value is 0');
  ecs.tick();
  setTimeout(() => {
    ecs.tick();
  }, 10);
});
