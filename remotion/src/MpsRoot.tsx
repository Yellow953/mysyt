import React from 'react';
import {Composition} from 'remotion';
import {MpShort, SHORT_TOTAL} from './MpShort';
export const MpsRoot: React.FC = () => (
  <Composition id="MpShort30" component={MpShort} durationInFrames={Math.round(SHORT_TOTAL * 30)} fps={30} width={1080} height={1920} />
);
