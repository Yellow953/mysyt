import React from 'react';
import {Composition} from 'remotion';
import {SunShort, SUN_TOTAL} from './SunShort';

export const SunRoot: React.FC = () => (
  <>
    <Composition id="SunShort30" component={SunShort} durationInFrames={Math.round(SUN_TOTAL * 30)} fps={30} width={1080} height={1920} />
    <Composition id="SunShort60" component={SunShort} durationInFrames={Math.round(SUN_TOTAL * 60)} fps={60} width={1080} height={1920} />
  </>
);
