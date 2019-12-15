const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');


const settings = {
  dimensions: [2048, 2048]
};

const sketchNoiseLines = () => {
  const palette = random.shuffle(random.pick(palettes)).slice(0, 3);


  const createGrid = () => {
    const points = [];
    const count = 50;

    for (let x = 0; x < count; x++) {
      const u = count <= 1 ? 0.5 : x / (count - 1);
      for (let y = 0; y < count; y++) {
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v) / 2 + .5) * 0.2;
        points.push({
          position: [u, v],
          radius,
          rotation: random.noise2D(u, v),
          color: random.pick(palette)
        });
      }
    }
    return points;
  }

  const points = createGrid().filter(() => random.gaussian() > 0.6);
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach(point => {
      const { rotation, radius, position: [u, v], color } = point;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false);

      // context.fillStyle = color;
      // context.fill();

      context.save();
      context.fillStyle = color;
      context.translate(x, y);
      context.rotate(rotation);
      context.font = `${radius * width}px "Arial"`
      context.fillText('=', 0, 0);

      context.restore();
    })
  };
};

const sketch = () => {
  const palette = random.pick(palettes)
  const count = 6;

  const createGrid = () => {
    const points = [];

    for (let x = 0; x < count; x++) {
      const u = count <= 1 ? 0.5 : x / (count - 1);
      for (let y = 0; y < count; y++) {
        const v = count <= 1 ? 0.5 : y / (count - 1);
        points.push({
          position: [u, v],
          color: random.pick(palette)
        });
      }
    }
    return points;
  }

  const points = createGrid();
  const margin = 400;
  const trapezoids = [];
  let copyPoints = [...points];

  while (copyPoints.length) {
    let pos = random.rangeFloor(0, copyPoints.length);
    const from = copyPoints.splice(pos, 1)[0];
    pos = random.rangeFloor(0, copyPoints.length);
    const to = copyPoints.splice(pos, 1)[0];
    trapezoids.push({
      from: from.position,
      to: to.position,
      color: random.pick(palette),
      avg: (from[1] + to[2]) / 2
    })
  }


  trapezoids.sort((a, b) => a - b);
  return ({ context, width, height }) => {


    context.fillStyle = "white";
    context.strokeStyle = "white";
    context.lineWidth = 20;
    context.fillRect(0, 0, width, height);

    const bottom = lerp(margin, width - margin, 1);

    trapezoids.forEach(trapezoid => {
      let { from, to, color } = trapezoid;
      from = from.map(val => lerp(margin, width - margin, val));
      to = to.map(val => lerp(margin, width - margin, val));

      context.fillStyle = color;


      context.beginPath();

      context.moveTo(from[0], bottom);
      context.lineTo(...from);
      context.lineTo(...to);
      context.lineTo(to[0], bottom);

      context.stroke();
      context.fill();
    })
  };
};


canvasSketch(sketch, settings);
