import React from 'react';
import {Composition} from 'remotion';
import {Boss2LF, BOSS2_TOTAL} from './Boss2LF';

export const Boss2Root: React.FC = () => (
  <>
    <Composition id="Boss230" component={Boss2LF} durationInFrames={Math.round(BOSS2_TOTAL * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Boss260" component={Boss2LF} durationInFrames={Math.round(BOSS2_TOTAL * 60)} fps={60} width={1920} height={1080} />
  </>
);
