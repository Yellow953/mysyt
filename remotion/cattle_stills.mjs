// usage: node mnylf_stills.mjs outdir frame1 frame2 ...  (run from remotion/)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'path';
const [out, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/cattleIndex.ts')});
const browserExecutable = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const composition = await selectComposition({serveUrl, id: 'Cattle30', browserExecutable});
for (const f of frames) {
  await renderStill({composition, serveUrl, frame: Number(f), output: path.join(out, `f${String(f).padStart(5, '0')}.png`), scale: 0.5, browserExecutable, timeoutInMilliseconds: 120000});
  console.log('ok', f);
}
