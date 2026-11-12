import React from 'react';
import {Composition} from 'remotion';
import {BlinkShort, BLINK_TOTAL} from './BlinkShort';

export const BlinkRoot: React.FC = () => (
  <>
    <Composition id="BlinkShort30" component={BlinkShort} durationInFrames={Math.round(BLINK_TOTAL * 30)} fps={30} width={1080} height={1920} />
    <Composition id="BlinkShort60" component={BlinkShort} durationInFrames={Math.round(BLINK_TOTAL * 60)} fps={60} width={1080} height={1920} />
  </>
);
