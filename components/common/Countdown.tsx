"use client";
import { useState, useEffect, useCallback } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  style?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  targetDate?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  style = 1,
  targetDate = "2026-07-15T23:59:59",
}) => {
  const [showTimer, setShowTimer] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setShowTimer(true);
    }, 0);
  }, []);

  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null; // Time is up
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    calculateTimeLeft(),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, [calculateTimeLeft, targetDate]);

  if (!timeLeft) {
    return <div>Time&apos;s up!</div>;
  }

  return (
    <>
      {showTimer ? (
        <>
          {style == 1 && (
            <div aria-hidden="true" className="countdown__timer">
              <span className="countdown__item">
                <span className="countdown__value countdown__value--0 js-countdown__value--0">
                  {timeLeft.days}
                </span>
                <span className="countdown__label">D : </span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--1 js-countdown__value--1">
                  {timeLeft.hours}
                </span>
                <span className="countdown__label">H : </span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--2 js-countdown__value--2">
                  {timeLeft.minutes}
                </span>
                <span className="countdown__label">M : </span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--3 js-countdown__value--3">
                  {timeLeft.seconds}
                </span>
                <span className="countdown__label">S</span>
              </span>
            </div>
          )}
          {style == 2 && (
            <div aria-hidden="true" className="countdown__timer">
              <span className="countdown__item">
                <span className="countdown__value countdown__value--0 js-countdown__value--0">
                  {timeLeft.days}
                </span>
                <span className="countdown__label">Days</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--1 js-countdown__value--1">
                  {timeLeft.hours}
                </span>
                <span className="countdown__label">Hours</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--2 js-countdown__value--2">
                  {timeLeft.minutes}
                </span>
                <span className="countdown__label">Mins</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--3 js-countdown__value--3">
                  {timeLeft.seconds}
                </span>
                <span className="countdown__label">Secs</span>
              </span>
            </div>
          )}

          {style == 3 && (
            <div aria-hidden="true" className="countdown__timer">
              <span className="countdown__item">
                <span className="countdown__value countdown__value--0 js-countdown__value--0">
                  {timeLeft.days}
                </span>
                <span className="countdown__label">:</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--1 js-countdown__value--1">
                  {timeLeft.hours}
                </span>
                <span className="countdown__label">:</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--2 js-countdown__value--2">
                  {timeLeft.minutes}
                </span>
                <span className="countdown__label">:</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--3 js-countdown__value--3">
                  {timeLeft.seconds}
                </span>
                <span className="countdown__label"></span>
              </span>
            </div>
          )}
          {style == 4 && (
            <div aria-hidden="true" className="countdown__timer">
              <span className="countdown__item">
                <span className="countdown__value countdown__value--2 js-countdown__value--2">
                  {timeLeft.minutes}
                </span>
                <span className="countdown__label">:</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--3 js-countdown__value--3">
                  {timeLeft.seconds}
                </span>
                <span className="countdown__label"></span>
              </span>
            </div>
          )}

          {style == 5 && (
            <div aria-hidden="true" className="countdown__timer">
              <span className="countdown__item">
                <span className="countdown__value countdown__value--0 js-countdown__value--0">
                  {timeLeft.days}
                </span>
                <span className="countdown__label">d :</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--1 js-countdown__value--1">
                  {timeLeft.hours}
                </span>
                <span className="countdown__label">h :</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--2 js-countdown__value--2">
                  {timeLeft.minutes}
                </span>
                <span className="countdown__label">m :</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--3 js-countdown__value--3">
                  {timeLeft.seconds}
                </span>
                <span className="countdown__label">s</span>
              </span>
            </div>
          )}
          {style == 6 && (
            <div aria-hidden="true" className="countdown__timer">
              <span className="countdown__item">
                <span className="countdown__value countdown__value--0 js-countdown__value--0">
                  {timeLeft.days}
                </span>
                <span className="countdown__label">D</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--1 js-countdown__value--1">
                  {timeLeft.hours}
                </span>
                <span className="countdown__label">H</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--2 js-countdown__value--2">
                  {timeLeft.minutes}
                </span>
                <span className="countdown__label">M</span>
              </span>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--3 js-countdown__value--3">
                  {timeLeft.seconds}
                </span>
                <span className="countdown__label">S</span>
              </span>
            </div>
          )}
          {style == 7 && (
            <div aria-hidden="true" className="countdown__timer">
              <span className="countdown__item">
                <span className="countdown__value countdown__value--0 js-countdown__value--0">
                  {timeLeft.days}
                </span>
                <span className="countdown__label">Days</span>
              </span>
              <div className="countdown__custom">:</div>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--1 js-countdown__value--1">
                  {timeLeft.hours}
                </span>
                <span className="countdown__label">Hours</span>
              </span>
              <div className="countdown__custom">:</div>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--2 js-countdown__value--2">
                  {timeLeft.minutes}
                </span>
                <span className="countdown__label">Mins</span>
              </span>
              <div className="countdown__custom">:</div>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--3 js-countdown__value--3">
                  {timeLeft.seconds}
                </span>
                <span className="countdown__label">Secs</span>
              </span>
            </div>
          )}
          {style == 8 && (
            <div aria-hidden="true" className="countdown__timer">
              <span className="countdown__item">
                <span className="countdown__value countdown__value--0 js-countdown__value--0">
                  {timeLeft.days}
                </span>
              </span>
              <div className="countdown__custom">:</div>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--1 js-countdown__value--1">
                  {timeLeft.hours}
                </span>
              </span>
              <div className="countdown__custom">:</div>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--2 js-countdown__value--2">
                  {timeLeft.minutes}
                </span>
              </span>
              <div className="countdown__custom">:</div>
              <span className="countdown__item">
                <span className="countdown__value countdown__value--3 js-countdown__value--3">
                  {timeLeft.seconds}
                </span>
              </span>
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default CountdownTimer;
