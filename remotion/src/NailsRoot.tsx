import React from 'react';
import {Composition} from 'remotion';
import {NailsShort, NAILS_TOTAL} from './NailsShort';

export const NailsRoot: React.FC = () => (
  <>
    <Composition id="NailsShort60" component={NailsShort} durationInFrames={Math.round(NAILS_TOTAL * 60)} fps={60} width={1080} height={1920} />
  </>
);
