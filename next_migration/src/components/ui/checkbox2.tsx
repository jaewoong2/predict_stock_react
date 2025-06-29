import { HTMLMotionProps, motion } from "framer-motion";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { cn } from "@/lib/utils";

interface CheckboxContextProps {
  id: string;
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
  autoCheck?: boolean;
  prevent?: boolean;
  onChecked?: (checked: boolean) => void;
}

const CheckboxContext = createContext<CheckboxContextProps>({
  id: "",
  isChecked: false,
  prevent: false,
  autoCheck: false,
  setIsChecked: () => {},
  onChecked(checked) {},
});

const tickVariants = {
  checked: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      delay: 0.2,
    },
  },
  unchecked: {
    pathLength: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

interface CheckboxProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children?: ReactNode;
  id: string;
  onChecked?: (checked: boolean) => void;
  prevent?: boolean;
  autoCheck?: boolean;
  checked?: boolean;
}

export default function Checkbox({
  children,
  id,
  className,
  onChecked,
  prevent,
  autoCheck,
  defaultChecked,
  checked,
  ...props
}: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked ? true : false);

  useEffect(() => {
    if (!autoCheck) return;

    const timer = setTimeout(() => {
      setIsChecked(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [autoCheck]);

  useEffect(() => {
    setIsChecked(checked ? true : false);
  }, [checked]);

  return (
    <div className={cn("flex items-center", className)} {...props}>
      <CheckboxContext.Provider
        value={{
          id,
          isChecked: typeof checked === "undefined" ? isChecked : checked,
          setIsChecked,
          onChecked,
          prevent,
          autoCheck,
        }}
      >
        {children}
      </CheckboxContext.Provider>
    </div>
  );
}

function CheckboxIndicator({
  className,
  onChange,
  onChangeCapture,
  ...props
}: JSX.IntrinsicElements["input"]) {
  const { id, isChecked, setIsChecked, prevent, onChecked } =
    useContext(CheckboxContext);

  return (
    <button className="relative flex items-center">
      <input
        checked={isChecked}
        type="checkbox"
        className={cn(
          "border-blue-gray-200 relative h-4 w-4 cursor-pointer appearance-none rounded-md border-2 transition-all duration-500 checked:border-blue-500 checked:bg-blue-500",
          className,
        )}
        onChange={(event) => {
          if (prevent) return;
          if (onChange && typeof onChange === "function") {
            onChange(event);
          }
          setIsChecked(!isChecked);

          if (typeof onChecked === "function") {
            onChecked(!isChecked);
          }
        }}
        onChangeCapture={(event) => {
          if (prevent) return;
          if (onChangeCapture && typeof onChangeCapture === "function") {
            onChangeCapture(event);
          }
          setIsChecked(!isChecked);

          if (typeof onChecked === "function") {
            onChecked(!isChecked);
          }
        }}
        id={id}
        {...props}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="3"
          stroke="currentColor"
          className="h-3.5 w-3.5"
          initial={false}
          animate={isChecked ? "checked" : "unchecked"}
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
            variants={tickVariants}
          />
        </motion.svg>
      </div>
    </button>
  );
}

Checkbox.Indicator = CheckboxIndicator;

interface CheckboxLabelProps {
  children: ReactNode;
}

function CheckboxLabel({
  children,
  className,
  ...props
}: CheckboxLabelProps & HTMLMotionProps<"label">) {
  const { id, isChecked } = useContext(CheckboxContext);

  return (
    <motion.label
      animate={{
        x: isChecked ? [0, -4, 0] : [0, 4, 0],
        // color: isChecked ? '#a1a1aa' : '#27272a',
        // textDecorationLine: isChecked ? 'line-through' : 'none',
      }}
      aria-checked={isChecked}
      className={cn(
        "relative ml-2 overflow-hidden text-sm aria-checked:line-through",
        className,
      )}
      htmlFor={id}
      initial={false}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      {...props}
    >
      {children}
    </motion.label>
  );
}

Checkbox.Label = CheckboxLabel;
