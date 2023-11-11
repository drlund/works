/**
 * Para criar uma função nos moldes da função `gravaEditaProvisao()` que inclua as ações "gravarSuspensao" e 
 * "patchSuspensao" como ações diferentes na chamada do formulário, você pode seguir uma abordagem semelhante. 
 * 
 * Aqui está um exemplo de como você pode fazer isso:
 */

import React, { useState } from 'react';
import {
  Button,
  Form,
  // ...importações restantes
} from 'antd';

// ...resto do código

function FormParamSuspensao({ location }) {
  const [modoEdicao, setModoEdicao] = useState(false);

  // ...resto do código

  const gravaSuspensao = (dadosSuspensao) => {
    // Lógica para gravar a suspensão usando a função gravarSuspensao da API
    if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
      form.validateFields().then(() => {
        gravarSuspensao({ ...dadosSuspensao })
          .then((dadosSuspensoesForm) => {
            setDadosSuspensoesForm(dadosSuspensoesForm);
            history.goBack();
          })
          .catch(() => message.error('Falha ao gravar suspensão! Verifique!'));
      });
    }
  };

  const patchSuspensaoEdicao = (dadosSuspensao) => {
    // Lógica para atualizar a suspensão usando a função patchSuspensao da API
    if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
      form.validateFields().then(() => {
        patchSuspensao(dadosSuspensao)
          .then((dadosSuspensoesForm) => {
            setDadosSuspensoesForm(dadosSuspensoesForm);
            history.goBack();
          })
          .catch(() => message.error('Falha ao editar suspensão! Verifique!'));
      });
    }
  };

  const handleSubmit = () => {
    const dadosForm = form.getFieldsValue();

    const dadosSuspensao = {
      ...dadosForm,
      [tipoSelecionado]: dadosForm.tipo,
      tipo: undefined,
      matriculaResponsavel: dadosDoUsuario.matricula,
      validade: moment(dadosForm.validade).format('YYYY-MM-DD'),
    };

    const tipos = [
      'vicePresi',
      'diretoria',
      'supers',
      'gerev',
      'prefixo',
      'matriculas',
    ];
    for (const tipo of tipos) {
      if (tipo !== tipoSelecionado) {
        dadosSuspensao[tipo] = '0';
      }
    }

    if (modoEdicao) {
      // Modo de Edição: Chamar a função patchSuspensaoEdicao
      patchSuspensaoEdicao(dadosSuspensao);
    } else {
      // Modo de Criação: Chamar a função gravaSuspensao
      gravaSuspensao(dadosSuspensao);
    }
  };

  // ...resto do código

  return (
    <>
      {/* ...resto do código */}
      <Form
        form={form}
        {...layout}
        name="control-ref"
        onFinish={handleSubmit} {/* Chamar a função handleSubmit */}
      >
      {/* ...resto do código */}
    </>
  );
}
</>

export default FormParamSuspensao;
}

/**
 * Neste exemplo, eu extrai as partes da lógica que executam as ações de gravação e atualização de suspensão em duas 
 * funções separadas: `gravaSuspensao` e `patchSuspensaoEdicao`. A função `handleSubmit` verifica o `modoEdicao` e 
 * decide qual das duas funções chamar com base nesse modo. Certifique-se de adaptar as chamadas de API e a lógica de 
 * acordo com a estrutura e os detalhes específicos do seu projeto.
 */