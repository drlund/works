function buscarPrefixosSubordinados(cod_dependencia) {
    const codDependenciaEspecifico = '8510'; // Código de dependência específico para teste
  
    if (cod_dependencia.value) {
      setPrefixoDestino(cod_dependencia.value);
      // Verifica se o cod_dependencia é o específico para teste
      if (cod_dependencia.value === codDependenciaEspecifico) {
        // Define manualmente os prefixos subordinados para o cod_dependencia específico
        const jurisdicoes = ['prefixo1', 'prefixo2', 'prefixo3']; // Substitua pelos prefixos desejados
        setPrefixosSubordinados(jurisdicoes);
        console.log(jurisdicoes);
      } else {
        // Consulta os prefixos subordinados normalmente
        getJurisdicoesSubordinadas(cod_dependencia.value)
          .then((result) => {
            const jurisdicoes = result.map((item) => item.prefixo_subordinada);
            setPrefixosSubordinados(jurisdicoes);
            console.log(jurisdicoes);
          })
          .catch(() => {
            setPrefixosSubordinados([]);
          });
      }
    } else {
      setPrefixosSubordinados([]);
    }
  }