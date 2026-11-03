// A declared capability model, not an exploit or a probability estimate.
export function assess({ ciphertext = false, key = false, endpoint = false, traffic = false, identities = false } = {}) {
  const archive = ciphertext && key;
  return {
    archive,
    contents: endpoint || archive,
    relationship: traffic && identities,
    reasons: [endpoint ? 'A readable endpoint copy is assumed accessible.' : '', archive ? 'Both archived ciphertext AND its matching decryption key are assumed copied.' : ''].filter(Boolean),
  };
}
