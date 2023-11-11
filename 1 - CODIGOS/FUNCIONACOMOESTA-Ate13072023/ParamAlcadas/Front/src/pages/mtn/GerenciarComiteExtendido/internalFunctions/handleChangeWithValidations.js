/**
 * Funcao responsavel por validar os campos do formulario
 *
 * Se houver max ou min, verifica se o valor esta dentro do range e seta para o max ou min
 *
 * Se for um input de texto, verifica as validações (required, maxLength, minLength, pattern)
 * e é possível usar data-custom-validation="Erro customizado" para customizar o erro
 * ou então, será usado o "validationMessage" do input
 * neste caso, é necessário um label htmlFor="ex-input-name" para o input
 *
 * setDados: funcao que seta os dados do state com os novos valores, é necessário usar o attributo "name" do input
 * quando validando texto, e havendo um label, adiciona ao state o valor "error" como true ou false
 */
export function handleChangeWithValidations(setDados) {
  return ({ target }) => {
    if (target.max !== "" || target.min !== "") {
      if (Number(target.value) > Number(target.max)) {
        target.value = target.max;
      }
      if (Number(target.value) < Number(target.min)) {
        target.value = target.min;
      }
    }

    const label = document.querySelector('label[for="' + target.name + '"]');
    if (label) {
      if (target.validationMessage) {
        label.innerHTML = target.dataset.customValidation || target.validationMessage;
        setDados(dados => ({ ...dados, error: true }));
      } else {
        label.innerHTML = "";
        setDados(dados => ({ ...dados, error: false }));
      }
    }

    setDados(dados => ({ ...dados, [target.name]: target.value }));
  };
}
