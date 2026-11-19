import React from 'react';
import {Composition} from 'remotion';
import {IkeaLF, IKEA_TOTAL} from './IkeaLF';

export const IkeaRoot: React.FC = () => (
  <>
    <Composition id="Ikea30" component={IkeaLF} durationInFrames={Math.round(IKEA_TOTAL * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Ikea60" component={IkeaLF} durationInFrames={Math.round(IKEA_TOTAL * 60)} fps={60} width={1920} height={1080} />
  </>
);
