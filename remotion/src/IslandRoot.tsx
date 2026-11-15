import React from 'react';
import {Composition} from 'remotion';
import {IslandLF, ISLAND_TOTAL} from './IslandLF';

export const IslandRoot: React.FC = () => (
  <>
    <Composition id="Island30" component={IslandLF} durationInFrames={Math.round(ISLAND_TOTAL * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Island60" component={IslandLF} durationInFrames={Math.round(ISLAND_TOTAL * 60)} fps={60} width={1920} height={1080} />
  </>
);
