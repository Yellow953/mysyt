import React from 'react';
import {Composition} from 'remotion';
import {CattleLF, CATTLE_TOTAL} from './CattleLF';

export const CattleRoot: React.FC = () => (
  <>
    <Composition id="Cattle30" component={CattleLF} durationInFrames={Math.round(CATTLE_TOTAL * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Cattle60" component={CattleLF} durationInFrames={Math.round(CATTLE_TOTAL * 60)} fps={60} width={1920} height={1080} />
  </>
);
