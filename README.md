# Jecs Entity Component System

## ⚠ Version 2.0.0 breaking changes ⚠
Some changes in version 2.0.0 are not backward compatible.  
Please read the migration guide here: [2.0.0 migration guide](#migration_guide_2.0.0)

## Description
ECS or [Entity Component System](https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system) is an architectural pattern particularly suitable for game development.  
Jecs is a javascript ECS engine for Node.js and the browser.  

## Installation
### NodeJs with npm:
```
npm install jecs
```
### NodeJs with yarn:
```
yarn add jecs
```

## Documentation
You can find the documentation [here](https://zakplus.github.io/jecs/) or under the "docs" directory.

## Usage in the browser
You can use jecs in a browser by loading the script in the directory 'browser'.
The library exports the Ecs class as a global Ecs variable (window.Ecs).

```javascript
<script type="text/javascript" src="path/to/jecs_min.js"></script>
```

## Live demo
Included in this package you can find a simple text-based browser game demo using Jecs (actually it's a simulation because there is no user input...).  
See the demo [here](https://zakplus.github.io/jecs/example/mini-game). You can find the source code under the "docs/example" directory.

## Example
In this example we create a "player" entity and assign it the "position" and "speed" components.  
We define also a "move" system requiring "position" and "speed" components.  
Components can be any type of data, they will be passed to the systems without any modification.

The "move" system simply update position values by adding speed values and will be called once for every entity associated to both components (in this case there is only one, "player").  

The Simulator utility will update the engine for us taking care of limiting the maximum fps to 60.  
If you prefer, you can avoid using the simulator and directly call ecs.tick() to start next engine iteration.

```javascript
import { Engine, Simulator } from 'jecs';

// Instantiate a new engine
const engine = new Engine();

// Declare a 'player' entity
const player = engine.entity('player');

// Associate the player entity to components.
// In this case we set 'position' and 'speed'.
player.setComponent('position', { x: 0, y: 0 });
player.setComponent('speed', { x: 0.5, y: 0.7 });

// Define a 'move' system for updating position of
// entities associated to components 'position' and 'speed'
engine.system('move', ['position', 'speed'], (entity, {position, speed}) => {
  position.x += speed.x;
  position.y += speed.y;
});

// Instantiate a simulator
// If you prefer, you can avoid using simulator and start
// engine iterations manually by calling engine.tick() in a loop.
const sim = new Simulator(engine);

// Limit the fps to 60
sim.setFps(60);

// Start simulator
sim.start();
```

## Controlling speed
The simulator fps limiter can limit the maximum frames per second. The limiter, wich is disabled by default, can be activated by calling `Simulator.setFps(<value>)` with value being a integer greater then 0. A value of 0 will disable the limiter.  
The limiter can be handy in some situation but generally what you really want is to run at the maximum possible speed...  
In order to get a consistent animation speed, your systems need to know how much time is passed since the previous call.

### The Timer helper class
You can use the [Timer helper class](https://zakplus.github.io/jecs/api/module-timer-Timer.html) to get timings informations in your systems.  
You just have to instantiate the class passing your engine instance as parameter, then you can call the Timer getTime() method from your systems to get useful timings informations.

```javascript
const engine = new Engine();
const timer = new Timer(engine);

engine.system('mySystem', ['myComponent'], (entity, { myComponent }) => {
  const delta = timer.getTime().delta;
  // Do your magic with delta time!
  // ...
});
```

timer.getTime() returns a object with these properties:

```javascript
{
  ticks,  // Number of ticks (frames)
  start,  // Initial time (milliseconds since the EPOCH)
  now,    // Current time (milliseconds since the EPOCH)
  total,  // Total execution time (milliseconds)
  delta   // Delta time from prev tick (milliseconds)
}
```

You can call timer.reset() method to reset all timing values to zero.

# <a id="migration_guide_2.0.0"></a>Version 2.0.0 migration guide
Version 2.0.0 introduces some non backward compatible changes.  
This guide will help you to update your code.

## Classes location
Versions prior 2.0.0 exported one single class, the `Ecs` class.  
The `Entity`, `System`, `Timer` and `Simulator` classes where exposed by the `Ecs` class.  

In version 2.0.0, the `Ecs` class is renamed to `Engine` and the main module, `jecs`, exports all the classes you are supposed to directly istantiate: `Engine`, `Simulator` and `Timer`.
`Entity` and `System` are not directly available, but they were never meant to be directly istantiated anyway. In order to get a new `Entity` or `System` istance you have to call the Engine `entity()` and `system()` methods.  

Prior 2.0.0:
```javascript
import Ecs from 'jecs';

const ecs = new Ecs();
const simulator = new Ecs.Simulator(ecs);
const timer = new Ecs.Timer(ecs);
```

After 2.0.0:
```javascript
import { Engine, Simulator, Timer } from 'jecs';

const engine = new Engine();
const simulator = new Simulator(engine);
const timer = new Timer(engine);
```

## Events emitted before and after running the systems
Versions prior 2.0.0 exposed the `Ecs` class static string properties `TICK_BEFORE` and `TICK_AFTER`.  
Theese properties vaules represented the names of the events emitted just before and after running the systems, respectively.  
In 2.0.0, the properties have been removed from the new `Engine` class (which replaces the old `Ecs` class). You will have to use the event names directly.  
The event names have been changed to a more standard form too:

* `tick-before` become `tick:before`
* `tick-after` become `tick:after`.

Prior 2.0.0:
```javascript
ecs.on(Ecs.TICK_BEFORE, (ecs) => { /* Do something */ }));
ecs.on('tick-after', (ecs) => { /* Do something */ }));
```

After 2.0.0:
```javascript
engine.on('tick:before', (engine) => { /* Do something */ }));
engine.on('tick:after', (engine) => { /* Do something */ }));
```

## License

```
MIT License

Copyright (c) 2018 Valerio Bianchi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```