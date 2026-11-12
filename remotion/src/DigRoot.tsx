import React from 'react';
import {Composition} from 'remotion';
import {DigShort, DIG_TOTAL} from './DigShort';

export const DigRoot: React.FC = () => (
  <>
    <Composition id="DigShort30" component={DigShort} durationInFrames={Math.round(DIG_TOTAL * 30)} fps={30} width={1080} height={1920} />
    <Composition id="DigShort60" component={DigShort} durationInFrames={Math.round(DIG_TOTAL * 60)} fps={60} width={1080} height={1920} />
  </>
);
