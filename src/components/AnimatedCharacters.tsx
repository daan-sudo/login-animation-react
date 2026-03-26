import React, { useEffect, useRef, useState } from 'react';
import { EyeBall } from './EyeBall';
import { Pupil } from './Pupil';
import './AnimatedCharacters.css';

interface AnimatedCharactersProps {
  isTyping?: boolean;
  hasSecret?: boolean;
  secretVisible?: boolean;
}

export const AnimatedCharacters: React.FC<AnimatedCharactersProps> = ({
  isTyping = false,
  hasSecret = false,
  secretVisible = false,
}) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  const [purplePos, setPurplePos] = useState({ faceX: 0, faceY: 0, bodySkew: 0 });
  const [blackPos, setBlackPos] = useState({ faceX: 0, faceY: 0, bodySkew: 0 });
  const [yellowPos, setYellowPos] = useState({ faceX: 0, faceY: 0, bodySkew: 0 });
  const [orangePos, setOrangePos] = useState({ faceX: 0, faceY: 0, bodySkew: 0 });

  const hiding = hasSecret && secretVisible;
  const leaning = isTyping || (hasSecret && !secretVisible);

  const mouseXRef = useRef(mouseX);
  const mouseYRef = useRef(mouseY);

  useEffect(() => {
    mouseXRef.current = mouseX;
    mouseYRef.current = mouseY;
  }, [mouseX, mouseY]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calcPos = (
    el: HTMLDivElement | null,
    setPos: React.Dispatch<React.SetStateAction<{ faceX: number; faceY: number; bodySkew: number }>>
  ) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = mouseXRef.current - (r.left + r.width / 2);
    const dy = mouseYRef.current - (r.top + r.height / 3);
    setPos({
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    });
  };

  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      calcPos(purpleRef.current, setPurplePos);
      calcPos(blackRef.current, setBlackPos);
      calcPos(yellowRef.current, setYellowPos);
      calcPos(orangeRef.current, setOrangePos);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    let t: number;
    const go = (setBlink: React.Dispatch<React.SetStateAction<boolean>>) => {
      t = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => {
          setBlink(false);
          go(setBlink);
        }, 150);
      }, Math.random() * 4000 + 3000);
    };
    go(setIsPurpleBlinking);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let t: number;
    const go = (setBlink: React.Dispatch<React.SetStateAction<boolean>>) => {
      t = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => {
          setBlink(false);
          go(setBlink);
        }, 150);
      }, Math.random() * 4000 + 3000);
    };
    go(setIsBlackBlinking);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  useEffect(() => {
    let peekT: number;
    if (hasSecret && secretVisible) {
      peekT = window.setTimeout(() => {
        setIsPurplePeeking(true);
        setTimeout(() => setIsPurplePeeking(false), 800);
      }, Math.random() * 3000 + 2000);
    } else {
      setIsPurplePeeking(false);
    }
    return () => clearTimeout(peekT);
  }, [hasSecret, secretVisible]);

  // Styles computed
  const purpleStyle = {
    height: leaning ? '440px' : '400px',
    transform: hiding
      ? 'skewX(0deg)'
      : leaning
      ? `skewX(${purplePos.bodySkew - 12}deg) translateX(40px)`
      : `skewX(${purplePos.bodySkew}deg)`,
  };

  const purpleEyesStyle = {
    left: hiding ? '20px' : isLookingAtEachOther ? '55px' : `${45 + purplePos.faceX}px`,
    top: hiding ? '35px' : isLookingAtEachOther ? '65px' : `${40 + purplePos.faceY}px`,
    gap: '32px',
  };

  const purpleLookX = hiding ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined;
  const purpleLookY = hiding ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined;

  const blackStyle = {
    transform: hiding
      ? 'skewX(0deg)'
      : isLookingAtEachOther
      ? `skewX(${blackPos.bodySkew * 1.5 + 10}deg) translateX(20px)`
      : leaning
      ? `skewX(${blackPos.bodySkew * 1.5}deg)`
      : `skewX(${blackPos.bodySkew}deg)`,
  };

  const blackEyesStyle = {
    left: hiding ? '10px' : isLookingAtEachOther ? '32px' : `${26 + blackPos.faceX}px`,
    top: hiding ? '28px' : isLookingAtEachOther ? '12px' : `${32 + blackPos.faceY}px`,
    gap: '24px',
  };

  const blackLookX = hiding ? -4 : isLookingAtEachOther ? 0 : undefined;
  const blackLookY = hiding ? -4 : isLookingAtEachOther ? -4 : undefined;

  const orangeStyle = {
    transform: hiding ? 'skewX(0deg)' : `skewX(${orangePos.bodySkew}deg)`,
  };

  const orangeEyesStyle = {
    left: hiding ? '50px' : `${82 + orangePos.faceX}px`,
    top: hiding ? '85px' : `${90 + orangePos.faceY}px`,
    gap: '32px',
  };

  const yellowStyle = {
    transform: hiding ? 'skewX(0deg)' : `skewX(${yellowPos.bodySkew}deg)`,
  };

  const yellowEyesStyle = {
    left: hiding ? '20px' : `${52 + yellowPos.faceX}px`,
    top: hiding ? '35px' : `${40 + yellowPos.faceY}px`,
    gap: '24px',
  };

  const yellowMouthStyle = {
    left: hiding ? '10px' : `${40 + yellowPos.faceX}px`,
    top: hiding ? '88px' : `${88 + yellowPos.faceY}px`,
  };

  return (
    <div className="characters-container">
      {/* Purple */}
      <div ref={purpleRef} className="char purple" style={purpleStyle}>
        <div className="eyes" style={purpleEyesStyle}>
          {[1, 2].map((i) => (
            <EyeBall
              key={`p${i}`}
              size={18}
              pupilSize={7}
              maxDistance={5}
              eyeColor="white"
              pupilColor="#2D2D2D"
              isBlinking={isPurpleBlinking}
              forceLookX={purpleLookX}
              forceLookY={purpleLookY}
            />
          ))}
        </div>
      </div>
      {/* Black */}
      <div ref={blackRef} className="char black" style={blackStyle}>
        <div className="eyes" style={blackEyesStyle}>
          {[1, 2].map((i) => (
            <EyeBall
              key={`b${i}`}
              size={16}
              pupilSize={6}
              maxDistance={4}
              eyeColor="white"
              pupilColor="#2D2D2D"
              isBlinking={isBlackBlinking}
              forceLookX={blackLookX}
              forceLookY={blackLookY}
            />
          ))}
        </div>
      </div>
      {/* Orange */}
      <div ref={orangeRef} className="char orange" style={orangeStyle}>
        <div className="eyes" style={orangeEyesStyle}>
          {[1, 2].map((i) => (
            <Pupil
              key={`o${i}`}
              size={12}
              maxDistance={5}
              pupilColor="#2D2D2D"
              forceLookX={hiding ? -5 : undefined}
              forceLookY={hiding ? -4 : undefined}
            />
          ))}
        </div>
      </div>
      {/* Yellow */}
      <div ref={yellowRef} className="char yellow" style={yellowStyle}>
        <div className="eyes" style={yellowEyesStyle}>
          {[1, 2].map((i) => (
            <Pupil
              key={`y${i}`}
              size={12}
              maxDistance={5}
              pupilColor="#2D2D2D"
              forceLookX={hiding ? -5 : undefined}
              forceLookY={hiding ? -4 : undefined}
            />
          ))}
        </div>
        <div className="mouth" style={yellowMouthStyle} />
      </div>
    </div>
  );
};
