import React from 'react';
import {Composition} from 'remotion';
import {EmuWar, TOTAL} from './EmuWar';
import {EmuShort, SHORT_TOTAL} from './EmuShort';

export const EmuRoot: React.FC = () => (
  <>
    <Composition id="EmuWar30" component={EmuWar} durationInFrames={Math.round(TOTAL * 30)} fps={30} width={1920} height={1080} />
    <Composition id="EmuWar60" component={EmuWar} durationInFrames={Math.round(TOTAL * 60)} fps={60} width={1920} height={1080} />
    <Composition id="EmuShort30" component={EmuShort} durationInFrames={Math.round(SHORT_TOTAL * 30)} fps={30} width={1080} height={1920} />
    <Composition id="EmuShort60" component={EmuShort} durationInFrames={Math.round(SHORT_TOTAL * 60)} fps={60} width={1080} height={1920} />
  </>
);
