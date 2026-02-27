// Simple demo script for Webnative SDK (ES Module)
import * as webnative from 'webnative';

async function main() {
  console.log('Webnative demo starting...');
  console.log('Webnative version:', webnative.VERSION);
  const supported = await webnative.isSupported();
  console.log('isSupported():', supported);

  // program() requires a browser-like environment; skip it here.
  console.log('Skipping program() call in Node');
}

main().catch(console.error);
