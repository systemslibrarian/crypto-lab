// A 16-byte salt ends with four unused bits. A 23-byte checksum ends with two.
const bcryptBase64 = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function describeRecord(text) {
  const fields = text.split('$');
  if (fields.length !== 4 || fields[0] !== '' || !['2a', '2b', '2y'].includes(fields[1])) {
    return 'Use a bcrypt record with a $2a$, $2b$, or $2y$ prefix.';
  }
  const [, version, cost, encoded] = fields;
  if (!/^\d{2}$/.test(cost) || cost.length !== 2 || Number(cost) < 4 || Number(cost) > 31) {
    return 'The cost must be two decimal digits from 04 through 31.';
  }
  if (encoded.length !== 53 || [...encoded].some(c => !bcryptBase64.includes(c))) {
    return 'After the cost, enter 22 salt characters and 31 checksum characters from the bcrypt alphabet.';
  }
  if (bcryptBase64.indexOf(encoded[21]) % 16 || bcryptBase64.indexOf(encoded[52]) % 4) {
    return 'The last character of the salt or checksum has nonzero padding bits.';
  }
  return `Well-formed $${version}$ record. Cost ${cost}, 22 salt characters, 31 checksum characters. Password match untested.`;
}

if (typeof document !== 'undefined') {
  const input = document.getElementById('bcrypt-record');
  const result = document.getElementById('bcrypt-format-result');
  const update = () => { result.textContent = describeRecord(input.value); };
  input.addEventListener('input', update);
  update();
}
