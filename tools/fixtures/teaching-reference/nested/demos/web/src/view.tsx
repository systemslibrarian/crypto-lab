import React from 'react';
const notCopy = 'deadbeef';
// "Commented explanation must remain absent."
export function Lesson({ result }: { result: string }) {
  const feedback = `Observed output: ${result}`;
  return <section><p>Compare the two outputs.</p><button title="Next explanation">Next</button>
    <p>{result ? 'Correct answer.' : 'Try again.'}</p></section>;
}
