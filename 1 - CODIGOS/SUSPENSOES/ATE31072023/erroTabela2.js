/**
 * Se o tipo retornado for realmente um objeto, então o erro ocorre porque o método `map` é específico para arrays, e não está disponível para objetos. 
 * Para resolver o erro, você precisa garantir que `suspensoes` seja um array e não um objeto. Se o retorno de `getSuspensoes(id)` for um objeto e 
 * você deseja mapear seus valores, é necessário convertê-lo para um array antes de usar o método `map`. 
 * 
 * Uma opção comum para fazer isso é usar o método `Object.values()` para obter um array com os valores do objeto, que você pode usar no lugar de `suspensoes`:
*/

const [suspensoes, setSuspensoes] = useState([]);

useEffect(() => {
  if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
    setFetching(true);
    Promise.all([obterSuspensoes(), getSuspensoes(id)])
      .then(([obterResult, getSuspensoesResult]) => {
        // Convertendo o objeto retornado para um array de valores
        setSuspensoes(Object.values(getSuspensoesResult));
      })
      .catch(() => 'Erro ao obter suspensões!')
      .finally(() => {
        setFetching(false);
      });
  }
}, []);
