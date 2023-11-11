import { useEffect, useRef } from 'react';

/**
 * Executa o codigo da callback apenas uma vez.
 * @param {*} cb - callbak a executar
 */
function useEffectOnce(cb) {
  const once = useRef(0);

  useEffect(() => {
    if (!once.current) {
      once.current = 1;
      cb();
    }
  }, [cb])
}

export default useEffectOnce;