const shortBasis = [[32, 4], [-4, 30]];
const skewedBasis = [[60, 38], [28, 34]];

function roundedPoint(x, y, [[ax, ay], [bx, by]]) {
  const determinant = ax * by - ay * bx;
  const i = Math.round((by * x - bx * y) / determinant);
  const j = Math.round((ax * y - ay * x) / determinant);
  return [i * ax + j * bx, i * ay + j * by];
}

function squaredDistance(x, y, [px, py]) {
  return (x - px) ** 2 + (y - py) ** 2;
}

export function compareRounding(x, y) {
  const short = roundedPoint(x, y, shortBasis);
  const skewed = roundedPoint(x, y, skewedBasis);
  let minimum = Infinity;
  let closest = [];
  // Rounding in the short basis gives a point within 32 units. For targets
  // within ±140, inversion of that basis bounds both nearest coefficients by 7.
  for (let i = -7; i <= 7; i++) {
    for (let j = -7; j <= 7; j++) {
      const point = [32 * i - 4 * j, 4 * i + 30 * j];
      const squared = squaredDistance(x, y, point);
      if (squared < minimum) {
        minimum = squared;
        closest = [point];
      } else if (squared === minimum) {
        closest.push(point);
      }
    }
  }
  return { short, skewed, minimum, closest };
}

if (typeof document !== 'undefined') {
  const xInput = document.getElementById('falcon-x');
  const yInput = document.getElementById('falcon-y');
  const answer = document.getElementById('falcon-answer');
  const pointLabel = ([x, y]) => `(${x}, ${y})`;

  function update() {
    if (!xInput.validity.valid || !yInput.validity.valid) {
      answer.textContent = 'Enter two whole numbers from −140 to 140.';
      return;
    }
    const x = xInput.valueAsNumber;
    const y = yInput.valueAsNumber;
    const { short, skewed, minimum, closest } = compareRounding(x, y);
    const describe = (basis, point) => {
      const squared = squaredDistance(x, y, point);
      const verdict = squared === minimum ? 'a closest point' : 'a miss';
      return `The ${basis} basis rounds to ${pointLabel(point)}, squared distance ${squared} (${verdict}).`;
    };
    answer.textContent = [
      `At ${pointLabel([x, y])}, the minimum squared distance is ${minimum} at ${closest.map(pointLabel).join(' and ')}.`,
      describe('short', short), describe('skewed', skewed)
    ].join(' ');
  }

  document.getElementById('falcon-target').addEventListener('input', update);
  update();
}
