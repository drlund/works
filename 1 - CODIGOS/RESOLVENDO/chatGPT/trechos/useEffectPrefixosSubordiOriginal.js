
const [, setJurisdicaoUsuario] = useState('');

useEffect(() => {
    if (![null, undefined, 'NaN'].includes()) {
      getJurisdicoesSubordinadas(prefixoDestino)
        .then((jurisdicoes) => {
          setJurisdicaoUsuario(jurisdicoes[0]);
        })
        .catch(() => {
          setJurisdicaoUsuario('');
        });
    }
  }, []);