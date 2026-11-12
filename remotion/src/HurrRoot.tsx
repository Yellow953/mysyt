import React from 'react';
import {Composition} from 'remotion';
import {HurrShort, HURR_TOTAL} from './HurrShort';

export const HurrRoot: React.FC = () => (
  <>
    <Composition id="HurrShort60" component={HurrShort} durationInFrames={Math.round(HURR_TOTAL * 60)} fps={60} width={1080} height={1920} />
    <Composition id="HurrShort30" component={HurrShort} durationInFrames={Math.round(HURR_TOTAL * 30)} fps={30} width={1080} height={1920} />
  </>
);
