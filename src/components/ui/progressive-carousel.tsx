"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type ProgressSliderContextType = {
  active: string;
  progress: number;
  handleButtonClick: (value: string) => void;
  vertical: boolean;
};

type ProgressSliderProps = {
  children: ReactNode;
  duration?: number;
  fastDuration?: number;
  vertical?: boolean;
  activeSlider: string;
  className?: string;
};

type SliderContentProps = {
  children: ReactNode;
  className?: string;
};

type SliderWrapperProps = {
  children: ReactNode;
  value: string;
  className?: string;
};

type SliderBtnGroupProps = {
  children: ReactNode;
  className?: string;
};

type SliderBtnProps = {
  children: ReactNode;
  value: string;
  className?: string;
  progressBarClass?: string;
};

const ProgressSliderContext = createContext<
  ProgressSliderContextType | undefined
>(undefined);

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function useProgressSliderContext(): ProgressSliderContextType {
  const context = useContext(ProgressSliderContext);
  if (!context) {
    throw new Error(
      "useProgressSliderContext must be used within a ProgressSlider"
    );
  }
  return context;
}

export function ProgressSlider({
  children,
  duration = 5000,
  fastDuration = 400,
  vertical = false,
  activeSlider,
  className,
}: ProgressSliderProps) {
  const [active, setActive] = useState(activeSlider);
  const [progress, setProgress] = useState(0);
  const [isFastForward, setIsFastForward] = useState(false);
  const frame = useRef<number>(0);
  const firstFrameTime = useRef(0);
  const targetValue = useRef<string | null>(null);
  const [sliderValues, setSliderValues] = useState<string[]>([]);

  useEffect(() => {
    firstFrameTime.current = performance.now();
  }, []);

  useEffect(() => {
    const content = React.Children.toArray(children).find(
      (child) =>
        React.isValidElement(child) && child.type === SliderContent
    ) as React.ReactElement<SliderContentProps> | undefined;

    if (!content) return;

    const values = React.Children.toArray(content.props.children)
      .filter(
        (child): child is React.ReactElement<SliderWrapperProps> =>
          React.isValidElement(child)
      )
      .map((child) => child.props.value);

    setSliderValues(values);
  }, [children]);

  useEffect(() => {
    if (!sliderValues.length) return;

    const animate = (now: number) => {
      const currentDuration = isFastForward ? fastDuration : duration;
      const elapsedTime = now - firstFrameTime.current;
      const timeFraction = elapsedTime / currentDuration;

      if (timeFraction <= 1) {
        setProgress((currentProgress) =>
          isFastForward
            ? currentProgress + (100 - currentProgress) * timeFraction
            : timeFraction * 100
        );
        frame.current = requestAnimationFrame(animate);
        return;
      }

      if (isFastForward) {
        setIsFastForward(false);
        if (targetValue.current !== null) {
          setActive(targetValue.current);
          targetValue.current = null;
        }
      } else {
        const currentIndex = sliderValues.indexOf(active);
        const nextIndex = (currentIndex + 1) % sliderValues.length;
        setActive(sliderValues[nextIndex]);
      }

      setProgress(0);
      firstFrameTime.current = performance.now();
    };

    frame.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame.current);
    };
  }, [active, duration, fastDuration, isFastForward, sliderValues]);

  const handleButtonClick = (value: string) => {
    if (value === active) return;

    const elapsedTime = performance.now() - firstFrameTime.current;
    setProgress((elapsedTime / duration) * 100);
    targetValue.current = value;
    setIsFastForward(true);
    firstFrameTime.current = performance.now();
  };

  return (
    <ProgressSliderContext.Provider
      value={{ active, progress, handleButtonClick, vertical }}
    >
      <div className={cn("relative", className)}>{children}</div>
    </ProgressSliderContext.Provider>
  );
}

export function SliderContent({ children, className }: SliderContentProps) {
  return <div className={cn(className)}>{children}</div>;
}

export function SliderWrapper({
  children,
  value,
  className,
}: SliderWrapperProps) {
  const { active } = useProgressSliderContext();

  return (
    <AnimatePresence mode="popLayout">
      {active === value ? (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className={cn(className)}
          exit={{ opacity: 0, scale: 0.985 }}
          initial={{ opacity: 0, scale: 1.015 }}
          key={value}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function SliderBtnGroup({ children, className }: SliderBtnGroupProps) {
  return <div className={cn(className)}>{children}</div>;
}

export function SliderBtn({
  children,
  value,
  className,
  progressBarClass,
}: SliderBtnProps) {
  const { active, progress, handleButtonClick, vertical } =
    useProgressSliderContext();

  return (
    <button
      className={cn(
        "relative overflow-hidden text-left transition",
        active === value ? "opacity-100" : "opacity-55",
        className
      )}
      onClick={() => handleButtonClick(value)}
      type="button"
    >
      <span className="relative z-10 block">{children}</span>
      <span
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={active === value ? progress : 0}
        className="absolute inset-0 z-0 overflow-hidden"
        role="progressbar"
      >
        <span
          className={cn("absolute left-0 top-0", progressBarClass)}
          style={{
            [vertical ? "height" : "width"]:
              active === value ? `${progress}%` : "0%",
          }}
        />
      </span>
    </button>
  );
}
