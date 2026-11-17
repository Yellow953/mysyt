import React from 'react';
import {Composition} from 'remotion';
import {ZombieLF, ZOMBIE_TOTAL} from './ZombieLF';

export const ZombieRoot: React.FC = () => (
  <>
    <Composition id="Zombie30" component={ZombieLF} durationInFrames={Math.round(ZOMBIE_TOTAL * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Zombie60" component={ZombieLF} durationInFrames={Math.round(ZOMBIE_TOTAL * 60)} fps={60} width={1920} height={1080} />
  </>
);
