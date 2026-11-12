import React from 'react';
import {Composition} from 'remotion';
import {WaveShort, WAVE_TOTAL} from './WaveShort';

export const WaveRoot: React.FC = () => (
  <>
    <Composition id="WaveShort30" component={WaveShort} durationInFrames={Math.round(WAVE_TOTAL * 30)} fps={30} width={1080} height={1920} />
    <Composition id="WaveShort60" component={WaveShort} durationInFrames={Math.round(WAVE_TOTAL * 60)} fps={60} width={1080} height={1920} />
  </>
);
