import React from 'react';
import {Composition} from 'remotion';
import {CrushShort, CRUSH_TOTAL} from './CrushShort';

export const CrushRoot: React.FC = () => (
  <>
    <Composition id="CrushShort30" component={CrushShort} durationInFrames={Math.round(CRUSH_TOTAL * 30)} fps={30} width={1080} height={1920} />
    <Composition id="CrushShort60" component={CrushShort} durationInFrames={Math.round(CRUSH_TOTAL * 60)} fps={60} width={1080} height={1920} />
  </>
);
