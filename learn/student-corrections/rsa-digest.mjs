const message = document.getElementById('rsa-message');
const result = document.getElementById('rsa-digest-result');

function updateDigest() {
  const bytes = new TextEncoder().encode(message.value);
  let hash = 0xcbf29ce484222325n;
  for (const byte of bytes) {
    hash = BigInt.asUintN(64, (hash ^ BigInt(byte)) * 0x100000001b3n);
  }
  const reduced = hash % 67591n;
  const hexBytes = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join(' ');
  result.textContent = `UTF-8 bytes: ${hexBytes || '(empty)'}. FNV-1a-64: ${hash.toString(16).padStart(16, '0')}. Classroom digest: ${reduced || 1n}.`;
}

message.addEventListener('input', updateDigest);
updateDigest();
