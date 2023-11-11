import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';

export function usePermissoesUsuario() {
  const [perfil, setPerfil] = useState([]);
  const authState = useSelector(({ app }) => app.authState);

  useEffect(() => {
    if (authState.perms) {
      setPerfil(getPermissoesUsuario('Flex Critérios', authState));
    }
  }, [authState]);

  return perfil;
}
