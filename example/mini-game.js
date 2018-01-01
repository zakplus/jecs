var game = (function () {
  // 'Screen' <div>
  var screen = document.getElementById('screen');

  // Logging <div>
  var logarea = document.getElementById('log');

  // Instantiating engine and simulator
  var ecs = new Ecs();
  var sim = new Ecs.Simulator(ecs);

  // Possible move direction
  var up = { x: 0, y: -1 };
  var down = { x: 0, y: 1 };
  var left = { x: -1, y: 0 };
  var right = { x: 1, y: 0 };
  var stop = { x: 0, y: 0 };

  // Map cell types
  var empty = 0;
  var wall = 1;
  var food = 2;

  // Map size
  var mapw = 50;
  var maph = 10;

  // Map cell array
  var map = [];

  // Calculate initial players energy and food energy
  var initialEnergy = mapw * maph;
  var foodEnergy = Math.floor(Math.sqrt(initialEnergy));

  // Entities
  var clock;
  var knight;
  var ogre;
  
  // Position components (will be associated to entities)
  var knightPosition = {};
  var ogrePosition = {};

  // Time component
  var time = {};

  // Append a line of log
  function log(text) {
    var html = logarea.innerHTML;
    html += (text || '') + '<br/>';
    logarea.innerHTML = html;

    // Scroll log to bottom
    logarea.scrollTop = logarea.scrollHeight;
  }

  // Initialize map
  function initMap() {
    var x,
      y,
      rnd,
      cellType;
    var totalFood,
      totalInnerWalls;

    log('Initializing world map...');

    map = [];
    for (y = 0; y < maph; y += 1) {
      for (x = 0; x < mapw; x += 1) {
        cellType = empty;
        if (x === 0 || y === 0 || x === mapw - 1 || y === maph - 1) {
          // Wall on boundaries
          cellType = wall;
        } else {
          rnd = Math.random();
          if (rnd > 0.7) cellType = food;
          else if (rnd > 0.6) cellType = wall;
        }
        map.push(cellType);
      }
    }
  }

  // Initializes map and components
  function init() {
    log();

    // reset clock
    time.start = 0;     // initial time
    time.total = 0;     // total execution time
    time.prev = 0;      // previous frame absolute time (stored just to calculate delta)
    time.delta = 0;     // delta time from prev tick
    time.fps = {
      sum: 0,           // Sum of calculated instant fps
      sumStartTime: 0,  // fps summing start time
      count: 0,         // Number of fps summed
      avg: 0            // Frames Per Second calculated over one second
    };
    clock.setComponent('time', time);

    // Init knight components
    knightPosition.x = 1 + parseInt(Math.floor(Math.random() * (mapw - 2)), 10);
    knightPosition.y = 1 + parseInt(Math.floor(Math.random() * (maph - 2)), 10);
    knight.setComponent('position', knightPosition);
    knight.setComponent('direction', {x: 0, y: 0});
    knight.setComponent('energy', initialEnergy);

    // Init ogre components
    ogrePosition.x = 1 + parseInt(Math.floor(Math.random() * (mapw - 2)), 10);
    ogrePosition.y = 1 + parseInt(Math.floor(Math.random() * (maph - 2)), 10);
    ogre.setComponent('position', ogrePosition);
    ogre.setComponent('direction', {x: 0, y: 0});
    ogre.setComponent('energy', initialEnergy);

    // Init world map
    initMap();
  }

  // Set a value on the map
  function mapSet(x, y, v) {
    map[(mapw * y) + x] = v;
  }

  // Get a value from the map
  function mapGet(x, y) {
    return map[(mapw * y) + x];
  }

  log('Setup entities...');
  clock = ecs.entity('clock');
  knight = ecs.entity('knight');
  ogre = ecs.entity('ogre');

  // A system for updating the time component
  ecs.system('time-updater', ['time'], function(entity, components) {
    var time = components.time;
    var now = Date.now();
    var fps;

    // Init start if first tick
    if(time.start === 0) time.start = now;

    // Update total time
    time.total = now - time.start;

    // Update delta
    if(time.prev > 0) {
      time.delta = now - time.prev;
    }

    // Update prev time
    time.prev = now;

    // Calculate average FPS over one second
    if(time.delta > 0) {
      fps = 1000 / time.delta;
      if(time.fps.sumStartTime === 0) time.fps.sumStartTime = now;
      time.fps.sum += fps;
      time.fps.count++;
      if(now - time.fps.sumStartTime > 1000) {
        time.fps.avg = time.fps.sum / time.fps.count;
        time.fps.sumStartTime = now;
        time.fps.sum = fps;
        time.fps.count = 1;
      }
    }
  });

  // Think system
  log('Setup think system...');
  ecs.system('think', ['position', 'direction'], function(entity, components) {
    var x = components.position.x;
    var y = components.position.y;
    var direction = components.direction;
    var newDirection = stop;
    
    // Next position if not changing direction
    var nx = x + direction.x;
    var ny = y + direction.y;

    // Directions to food or empty cells
    var foodCellDirections = [];
    var emptyCellDirections = [];

    // Surrounding cell types
    var upType;
    var rightType;
    var downType;
    var leftType;

    // If next cell is a food cell then don't change direction
    if(mapGet(nx, ny) === food) return;

    upType = mapGet(x, y - 1);
    rightType = mapGet(x + 1, y);
    downType = mapGet(x, y + 1);
    leftType = mapGet(x - 1, y);

    // First looks for food cells
    if(upType === food) foodCellDirections.push(up);
    if(rightType === food) foodCellDirections.push(right);
    if(downType === food) foodCellDirections.push(down);
    if(leftType === food) foodCellDirections.push(left);

    // If there's at least a food cell near, then move randomly to one of them
    if(foodCellDirections.length > 0) {
      newDirection = foodCellDirections[Math.floor(Math.random() * foodCellDirections.length)];
      direction.x = newDirection.x;
      direction.y = newDirection.y;
      return;
    }

    // No food cells.
    // If moving and next cell is an empty cell then don't change direction 90% of times.
    // Randomness limits stuck situations.
    if(!_.isEqual(direction, stop) && mapGet(nx, ny) === empty) {
      if(Math.random() < 0.90) return;
    }

    // Looks for empty cells
    if(upType === empty) emptyCellDirections.push(up);
    if(rightType === empty) emptyCellDirections.push(right);
    if(downType === empty) emptyCellDirections.push(down);
    if(leftType === empty) emptyCellDirections.push(left);

    // If there's at least an empty cell near, then move randomly to one of them
    if(emptyCellDirections.length > 0) {
      newDirection = emptyCellDirections[Math.floor(Math.random() * emptyCellDirections.length)];
    }

    direction.x = newDirection.x;
    direction.y = newDirection.y;
  });

  // Move system
  log('Setup move system...');
  ecs.system('move', ['position', 'direction', 'energy'], function(entity, components) {
    var position = components.position;
    var direction = components.direction;
    var energy = components.energy;

    if (energy === 0) {
      // Dead
      sim.stop();
      log(entity.name + ' is dead, game is over!');
      return;
    }

    entity.components.energy -= 1;
    position.x += direction.x;
    position.y += direction.y;
  });

  log('Setup eat system...');
  ecs.system('eat', ['position', 'energy'], function(entity, components) {
    var x = components.position.x;
    var y = components.position.y;

    if (mapGet(x, y) === food) {
      mapSet(x, y, empty);
      entity.components.energy += foodEnergy;
      log(entity.name + ' eats food and raise his energy to ' + entity.components.energy);
    }
  });

  // Draw to 'screen'
  function draw() {
    var buffer = '';
    var x,
      y,
      i,
      row,
      cell;

    buffer += 'Knight (' + knight.components.position.x + ',' + knight.components.position.y + ') energy: ' + knight.components.energy + '<br/>';
    buffer += 'Ogre (' + ogre.components.position.x + ',' + ogre.components.position.y + ') energy: ' + ogre.components.energy + '<br/>';

    i = 0;
    for (y = 0; y < maph; y += 1) {
      row = '';
      for (x = 0; x < mapw; x += 1, i += 1) {
        cell = map[i];
        if (knightPosition.x === x && knightPosition.y === y) row += 'O';
        else if (ogrePosition.x === x && ogrePosition.y === y) row += 'X';
        else if (cell === wall) row += '#';
        else if (cell === food) row += '.';
        else row += '&nbsp;';
      }
      buffer += row + '<br/>';
    }

    buffer += '<br/>';
    buffer += 'FPS: ' + time.fps.avg.toFixed(2) + '<br/>';
    buffer += time.total + ' milliseconds total.';
    screen.innerHTML = buffer;
  }

  // Redraw map each tick
  ecs.on('tick-after', draw);

  // Init map and components
  init();

  // Initial draw
  draw();

  return {
    simulator: sim,
    reset: function() {
      init();
      draw();
    },
  };
}());
