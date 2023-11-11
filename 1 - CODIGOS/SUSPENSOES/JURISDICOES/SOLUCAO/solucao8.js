/**
 * Parece que o problema está na obtenção dos nomes dos arrays em `dadosJurisdicoes`. Vamos ajustar o `useEffect` para incluir os nomes 
 * dos arrays e verificar se o valor digitado no campo "tipo" está contido nesses nomes. Aqui está como você pode fazer isso:

useEffect(() => {
  const fetchTiposSuspensao = async () => {
    try {
      const data = await getTipoSuspensao();
      const dadosJurisdicoes = await getTiposJurisdicoes();

      setTiposSuspensao(data);

      // Obter os nomes dos arrays de jurisdição
      const nomesJurisdicoes = Object.keys(dadosJurisdicoes);

      setTiposJurisdicoes(nomesJurisdicoes);
    } catch (error) {
      message.error('Erro ao buscar os tipos de suspensão:', error);
    }
  };

  fetchTiposSuspensao();
}, []);

Depois de ajustar o `useEffect` dessa maneira, o array `tiposJurisdicoes` conterá os nomes dos arrays de jurisdição, como "diretorJuris", "gerevJuris", etc.

Certifique-se de que a estrutura de dados do `dadosJurisdicoes` corresponda a essa nova configuração. Com essas mudanças, a validação deve funcionar corretamente ao verificar se o valor inserido no campo "tipo" está contido nos nomes dos arrays de jurisdição.