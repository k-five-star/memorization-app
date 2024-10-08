// src/components/ui/Confetti.js

import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

function ConfettiComponent() {
  const { width, height } = useWindowSize();

  return <Confetti width={width} height={height} />;
}

export default ConfettiComponent;
