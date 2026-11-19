import React from 'react';
import {Composition} from 'remotion';
import {SalLF, SAL_TOTAL} from './SalLF';

export const SalRoot: React.FC = () => (
  <>
    <Composition id="Sal30" component={SalLF} durationInFrames={Math.round(SAL_TOTAL * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Sal60" component={SalLF} durationInFrames={Math.round(SAL_TOTAL * 60)} fps={60} width={1920} height={1080} />
  </>
);
