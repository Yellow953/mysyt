import React from 'react';
import {Composition} from 'remotion';
import {Mp2Short, TOTAL2} from './Mp2Short';
export const Mp2Root: React.FC = () => (
  <Composition id="Mp2Short" component={Mp2Short} durationInFrames={Math.round(TOTAL2 * 30)} fps={30} width={1080} height={1920} />
);
