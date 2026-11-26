const bits = document.querySelector('#oracle-bits');
const result = document.querySelector('#oracle-blocks');
const numbers = new Intl.NumberFormat('en-US');

function describeBlocks(length, size) {
  const count = Math.floor(length / size);
  const remainder = length % size;
  return `${numbers.format(count)} complete ${numbers.format(size)}-bit ${count === 1 ? 'block' : 'blocks'}, ${numbers.format(remainder)} ${remainder === 1 ? 'bit' : 'bits'} left over.`;
}

function showBlocks() {
  if (!bits.validity.valid) {
    result.textContent = 'Enter a whole number of bits from 8 to 1,000,000.';
    return;
  }
  const length = bits.valueAsNumber;
  let longestRun = 'needs at least 128 bits.';
  if (length >= 128) {
    const size = length >= 750000 ? 10000 : length >= 6272 ? 128 : 8;
    longestRun = describeBlocks(length, size);
  }
  const blockFrequency = length >= 128 ? describeBlocks(length, 128) : 'needs one complete 128-bit block at the exhibit’s setting.';
  result.textContent = `Longest Run: ${longestRun} Block Frequency: ${blockFrequency}`;
}

bits.addEventListener('input', showBlocks);
showBlocks();
