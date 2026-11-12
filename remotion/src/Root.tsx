import React from 'react';
import {Composition} from 'remotion';
import {TrashVolcano, DURATION, FPS} from './TrashVolcano';

export const Root: React.FC = () => (
  <Composition id="TrashVolcano" component={TrashVolcano} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={1080} height={1920} />
);
