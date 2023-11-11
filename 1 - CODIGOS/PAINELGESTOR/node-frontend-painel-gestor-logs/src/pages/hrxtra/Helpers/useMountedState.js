import React, { useCallback, useEffect, useRef } from "react";

function useMountedState() {
  const mountedRef = useRef(false);
  const isMounted = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    }
  }, [])

  return isMounted;
}

export default React.memo(useMountedState);