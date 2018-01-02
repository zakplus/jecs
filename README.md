# Jecs Entity Component System

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

```<script type="text/javascript" src="path/to/jecs_<version>_min.js>"></script>```

## live demo
Included in this package you can find a simple text-based browser game demo using Jecs (actually it's a simulation because there is no user input...).  
See the demo [here](https://zakplus.github.io/jecs/example/mini-game). You can find the source code under the "docs/example" directory.

## example
In this example we create a "player" entity and assign it the "position" and "speed" components.  
We define also a "move" system requiring "position" and "speed" components.  
Components can be any type of data, they will be passed to the systems without any modification.

The "move" system simply update position values by adding speed values and will be called once for every entity associated to both components (in this case there is only one, "player").  
The Simulator utility will update the engine for us taking care of limiting the maximum fps to 60.

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
const sim = new Ecs.Simulator(ecs);

// Limit the fps to 60
sim.setFps(60);

// Start simulator
sim.start();
```

## controlling speed
The simulator fps limiter can limits the maximum frames per second. The limiter, wich is disabled by default, can be activated by calling ```Simulator.setFps(<value>)``` with value being a integer greater then 0. A value of 0 will disable the limiter.  
The limiter can be handy in some situation but generally what you really want is to run at the maximum possible speed...  
In order to get a consistent animation speed, your systems need to know how much time is passed since the previous call. Jecs does not take care of this for you, instead you can use a dedicated component and system.  
Remember that systems gets called in the same order they are defined so you can define a *time-updater* system which will run before any other systems to calculate all the timing stuff.

```JavaScript
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
  if(time.current > 0) {
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