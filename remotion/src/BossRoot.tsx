import React from 'react';
import {Composition} from 'remotion';
import {BossShort, BOSS_TOTAL} from './BossShort';

export const BossRoot: React.FC = () => (
  <>
    <Composition id="BossShort60" component={BossShort} durationInFrames={Math.round(BOSS_TOTAL * 60)} fps={60} width={1080} height={1920} />
    <Composition id="BossShort30" component={BossShort} durationInFrames={Math.round(BOSS_TOTAL * 30)} fps={30} width={1080} height={1920} />
  </>
);
