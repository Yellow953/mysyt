import React from 'react';
import {Composition} from 'remotion';
import {SeaShort, SEA_TOTAL} from './SeaShort';

export const SeaRoot: React.FC = () => (
  <>
    <Composition id="SeaShort30" component={SeaShort} durationInFrames={Math.round(SEA_TOTAL * 30)} fps={30} width={1080} height={1920} />
    <Composition id="SeaShort60" component={SeaShort} durationInFrames={Math.round(SEA_TOTAL * 60)} fps={60} width={1080} height={1920} />
  </>
);
