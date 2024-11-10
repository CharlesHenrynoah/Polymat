import React, { useState } from 'react';
import { SignupLevel1 } from './SignupLevel1';
import { SignupLevel2 } from './SignupLevel2';

interface SignupFlowProps {
  onBack: () => void;
  onComplete: (data: any) => void;
}

export const SignupFlow: React.FC<SignupFlowProps> = ({ onBack, onComplete }) => {
  const [level, setLevel] = useState(1);
  const [level1Data, setLevel1Data] = useState<any>(null);

  const handleLevel1Complete = (data: any) => {
    setLevel1Data(data);
    setLevel(2);
  };

  const handleLevel2Complete = (data: any) => {
    onComplete({ ...level1Data, ...data });
  };

  if (level === 1) {
    return <SignupLevel1 onNext={handleLevel1Complete} onBack={onBack} />;
  }

  return <SignupLevel2 onComplete={handleLevel2Complete} onBack={() => setLevel(1)} />;
};