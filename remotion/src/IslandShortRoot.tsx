import React from 'react';
import {Composition} from 'remotion';
import {IslandShort, ISHORT_TOTAL} from './IslandShort';
export const IslandShortRoot: React.FC = () => (
  <>
    <Composition id="IslandShort30" component={IslandShort} durationInFrames={Math.round(ISHORT_TOTAL * 30)} fps={30} width={1080} height={1920} />
    <Composition id="IslandShort60" component={IslandShort} durationInFrames={Math.round(ISHORT_TOTAL * 60)} fps={60} width={1080} height={1920} />
  </>
);
