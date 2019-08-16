const test = require('tape');
const { Engine, Simulator } = require('../lib/jecs');

test('Testing Simulator class...', (t) => {
  const engine = new Engine();
  const simulator = new Simulator(engine);

  t.equal(typeof simulator.setFps, 'function', 'simulator.setFps should be a function');
  t.equal(typeof simulator.getFps, 'function', 'simulator.getFps should be a function');
  t.equal(typeof simulator.start, 'function', 'simulator.start should be a function');
  t.equal(typeof simulator.pause, 'function', 'simulator.pause should be a function');
  t.equal(typeof simulator.stop, 'function', 'simulator.stop should be a function');
  t.equal(typeof simulator.isRunning, 'function', 'simulator.isRunning should be a function');
  t.equal(typeof simulator.isPaused, 'function', 'simulator.isPaused should be a function');

  simulator.setFps(14.6);
  t.equal(simulator.getFps(), 15, 'simulator.getFps() should return 15');
  t.false(simulator.isRunning(), 'simulator.isRunning() should return false');

  simulator.start();
  t.true(simulator.isRunning(), 'simulator.isRunning() should return true');

  simulator.pause();
  t.false(simulator.isRunning(), 'simulator.isRunning() should return false');
  t.true(simulator.isPaused(), 'simulator.isPaused() should return true');

  simulator.stop();
  t.false(simulator.isRunning(), 'simulator.isRunning() should return false');
  t.false(simulator.isPaused(), 'simulator.isPaused() should return false');

  t.end();
});

test('Simulator functional test...', (t) => {
  const fps = 60;
  const runTime = 1000;
  const expectedMaxTicks = fps * (runTime / 1000);

  const engine = new Engine();
  const sim = new Simulator(engine);
  sim.setFps(fps);

  const clock = engine.entity('clock');
  clock.setComponent('time', { ticks: 0 });

  engine.system('timer', ['time'], (entity, { time }) => {
    time.ticks += 1;
  });

  setTimeout(() => {
    sim.stop();
    const { ticks } = clock.components.time;
    t.ok(ticks > 0, 'Clock time ticks should be greater than 0');
    t.ok(ticks <= expectedMaxTicks, `Clock time ticks is ${ticks}, it should be equal or less then ${expectedMaxTicks}`);
    t.end();
  }, runTime);

  sim.start();
});
