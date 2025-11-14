import * as React from "react";

export const useLoading = (initial = false) => {
  const [isLoading, setIsLoading] = React.useState(initial);

  const start = React.useCallback(() => setIsLoading(true), []);
  const stop = React.useCallback(() => setIsLoading(false), []);
  const toggle = React.useCallback(() => setIsLoading((state) => !state), []);

  return {
    isLoading,
    start,
    stop,
    toggle,
    setLoading: setIsLoading,
  };
};
