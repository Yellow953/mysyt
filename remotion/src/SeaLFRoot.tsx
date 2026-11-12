import React from 'react';
import {Composition} from 'remotion';
import {SeaLF, SEALF_TOTAL} from './SeaLF';

export const SeaLFRoot: React.FC = () => (
  <>
    <Composition id="SeaLF30" component={SeaLF} durationInFrames={Math.round(SEALF_TOTAL * 30)} fps={30} width={1920} height={1080} />
    <Composition id="SeaLF60" component={SeaLF} durationInFrames={Math.round(SEALF_TOTAL * 60)} fps={60} width={1920} height={1080} />
  </>
);
