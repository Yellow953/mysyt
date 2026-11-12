import React from 'react';
import {Composition} from 'remotion';
import {MedievalPrivacy, TOTAL} from './MedievalPrivacy';

export const MpRoot: React.FC = () => (
  <>
    <Composition id="MedievalPrivacy30" component={MedievalPrivacy} durationInFrames={Math.round(TOTAL * 30)} fps={30} width={1920} height={1080} />
    <Composition id="MedievalPrivacy60" component={MedievalPrivacy} durationInFrames={Math.round(TOTAL * 60)} fps={60} width={1920} height={1080} />
  </>
);
