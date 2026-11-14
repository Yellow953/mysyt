import React from 'react';
import {Composition} from 'remotion';
import {MnyLF, MNYLF_TOTAL} from './MnyLF';

export const MnyLFRoot: React.FC = () => (
  <>
    <Composition id="MnyLF30" component={MnyLF} durationInFrames={Math.round(MNYLF_TOTAL * 30)} fps={30} width={1920} height={1080} />
    <Composition id="MnyLF60" component={MnyLF} durationInFrames={Math.round(MNYLF_TOTAL * 60)} fps={60} width={1920} height={1080} />
  </>
);
