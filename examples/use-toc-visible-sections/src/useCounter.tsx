import { useCallback, useState } from "react";

type Return = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

export const useCounter = (): Return => {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount((x) => x + 1), []);
  const decrement = useCallback(() => setCount((x) => x - 1), []);
  return { count, increment, decrement };
};
