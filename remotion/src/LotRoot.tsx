import React from 'react';
import {Composition} from 'remotion';
import {LotLF, LOT_TOTAL} from './LotLF';

export const LotRoot: React.FC = () => (
  <>
    <Composition id="Lot30" component={LotLF} durationInFrames={Math.round(LOT_TOTAL * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Lot60" component={LotLF} durationInFrames={Math.round(LOT_TOTAL * 60)} fps={60} width={1920} height={1080} />
  </>
);
