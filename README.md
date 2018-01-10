# Jecs Entity Component System

## NEWS!
Version 1.1.0 introduces the Timer utility class.  
Read about it in the [controlling speed](#controlling_speed) section.

## description
ECS or [Entity Component System](https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system) is an architectural pattern particularly suitable for game development.  
Jecs is a javascript ECS engine for Node.js and the browser.  

## installation
node-js:  
```npm install --save jecs```

## documentation
You can find the documentation [here](https://zakplus.github.io/jecs/) or under the "docs" directory.

## in the browser
You can use jecs in a browser by loading the script in the directory 'browser'.
The library exports the Ecs class as a global Ecs variable (window.Ecs).

```<script type="text/javascript" src="path/to/jecs_min.js"></script>```

## live demo
Included in this package you can find a simple text-based browser game demo using Jecs (actually it's a simulation because there is no user input...).  
See the demo [here](https://zakplus.github.io/jecs/example/mini-game). You can find the source code under the "docs/example" directory.

## example
In this example we create a "player" entity and assign it the "position" and "speed" components.  
We define also a "move" system requiring "position" and "speed" components.  
Components can be any type of data, they will be passed to the systems without any modification.

The "move" system simply update position values by adding speed values and will be called once for every entity associated to both components (in this case there is only one, "player").  

The Simulator utility will update the engine for us taking care of limiting the maximum fps to 60.  
If you prefer, you can avoid using the simulator and directly call ecs.tick() to start next engine iteration.

``` javascript
import Ecs from 'jecs';

// Instantiate a new ecs engine
const ecs = new Ecs();

// Declare a 'player' entity
const player = ecs.entity('player');

// Associate the player entity to components.
// In this case we set 'position' and 'speed'.
player.setComponent('position', { x: 0, y: 0 });
player.setComponent('speed', { x: 0.5, y: 0.7 });

// Define a 'move' system for updating position of
// entities associated to components 'position' and 'speed'
ecs.system('move', ['position', 'speed'], (entity, {position, speed}) => {
  position.x += speed.x;
  position.y += speed.y;
});

// Instantiate a simulator
// If you prefer, you can avoid using simulator and start
// engine iterations manually by calling ecs.tick() in a loop.
const sim = new Ecs.Simulator(ecs);

// Limit the fps to 60
sim.setFps(60);

// Start simulator
sim.start();
```

## <a id="controlling_speed"></a>controlling speed
The simulator fps limiter can limit the maximum frames per second. The limiter, wich is disabled by default, can be activated by calling ```Simulator.setFps(<value>)``` with value being a integer greater then 0. A value of 0 will disable the limiter.  
The limiter can be handy in some situation but generally what you really want is to run at the maximum possible speed...  
In order to get a consistent animation speed, your systems need to know how much time is passed since the previous call.

### Jecs version 1.1.0 introduces the Timer helper class
Get more informations in the [Timer API docs](https://zakplus.github.io/jecs/api/classes/Timer.html).  
Starting with Jecs vestion 1.1.0 you can use the Timer helper class to solve this problem. You just have to instantiate the class passing your ecs instance object as parameter, then you can call the Timer getTime() method from your systems to get useful timings informations.

```javascript
const ecs = new Ecs();
const timer = new Ecs.Timer(ecs);

ecs.system('mySystem', ['myComponent'], (entity, {myComponent}) => {
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

### How to do with Jecs version < 1.1.0
Jecs version prior 1.1.0 does not calculate time info for you, instead you can use a dedicated component and system.  
Remember that systems get called in the same order they are defined so you can define a *time-updater* system which will run before any other systems to calculate all the timing stuff.

``` javascript
// A time component
const time = {
  start: 0,     // initial time
  total: 0,     // total execution time
  prev: 0,      // previous frame absolute time
  delta: 0      // delta time from prev tick
};

// The clock entity
const clock = ecs.entity('clock');

// Associate the time component to the clock entity.
// You don't want to associate the time component to
// entities other then clock, otherwise the time-update
// system will be called for every those entities.
clock.setComponent('time', time);

// A system for updating the time component
ecs.system('time-updater', ['time'], (entity, {time}) => {
  const now = Date.now();
  
  // Init start time
  if(time.start === 0) time.start = now;

  // Update total time
  time.total = now - time.start;

  // Update delta
  if(time.prev > 0) {
    time.delta = now - time.prev;
  }

  // Update prev time
  time.prev = now;
});

// Other systems can then use the time component.
// Update position based on speed and time passed since previous update
ecs.sistem('move', ['position', 'speed'], (entity, {position, speed}) => {
  position.x += speed.x * time.delta;
  position.y += speed.y * time.delta;
});
```

## license

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