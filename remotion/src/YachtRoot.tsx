import React from 'react';
import {Composition} from 'remotion';
import {YachtLF, YACHT_TOTAL} from './YachtLF';

export const YachtRoot: React.FC = () => (
  <>
    <Composition id="Yacht30" component={YachtLF} durationInFrames={Math.round(YACHT_TOTAL * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Yacht60" component={YachtLF} durationInFrames={Math.round(YACHT_TOTAL * 60)} fps={60} width={1920} height={1080} />
  </>
);
