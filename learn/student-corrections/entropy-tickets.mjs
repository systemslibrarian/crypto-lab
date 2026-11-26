const tickets = document.querySelector('#entropy-tickets');
const result = document.querySelector('#entropy-result');

function showDistribution() {
  const counts = tickets.value.split(',').map(Number);
  const total = counts.reduce((sum, count) => sum + count, 0);
  const largest = Math.max(...counts);
  const probability = largest / total;
  const bits = -Math.log2(probability);
  result.textContent = `Most likely value: ${largest} of ${total} tickets (${100 * probability}%). Min-entropy: ${bits} ${bits === 1 ? 'bit' : 'bits'}.`;
}

tickets.addEventListener('change', showDistribution);
showDistribution();
