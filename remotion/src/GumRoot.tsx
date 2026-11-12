import React from 'react';
import {Composition} from 'remotion';
import {GumShort, GUM_TOTAL} from './GumShort';

export const GumRoot: React.FC = () => (
  <>
    <Composition id="GumShort30" component={GumShort} durationInFrames={Math.round(GUM_TOTAL * 30)} fps={30} width={1080} height={1920} />
    <Composition id="GumShort60" component={GumShort} durationInFrames={Math.round(GUM_TOTAL * 60)} fps={60} width={1080} height={1920} />
  </>
);
