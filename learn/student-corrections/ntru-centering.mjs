// The lab uses (-q/2, q/2] and therefore keeps the positive half at a tie.
export function centeredCoefficient(integer) {
  const residue = ((integer % 2048) + 2048) % 2048;
  return residue > 1024 ? residue - 2048 : residue;
}

if (typeof document !== 'undefined') {
  const input = document.getElementById('ntru-coefficient');
  const answer = document.getElementById('ntru-centering-result');

  function update() {
    if (!input.validity.valid) {
      answer.textContent = 'Enter a whole number from −4096 to 4096.';
      return;
    }
    const integer = input.valueAsNumber;
    const centered = centeredCoefficient(integer);
    const distance = 1024 - Math.abs(centered);
    const verdict = integer === centered ? 'stayed inside the interval' : 'wrapped';
    answer.textContent = `The integer ${integer} ${verdict}. Its centered value is ${centered}, at distance ${distance} from the nearest edge.`;
  }

  input.addEventListener('input', update);
  update();
}
