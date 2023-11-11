import { Input, Typography } from 'antd';
import { useState } from 'react';

import { FeatureFlag } from 'components/FeatureFlag';
import { ProcuracaoFlags } from 'pages/procuracoes/hooks/ProcuracaoFlags';
import { MinutaTemplateEditavel } from '../../innerComponents/MinutaTemplate/Editavel/Template';

export default function TemplateGenerator() {
  const [editTemplate, setEditTemplate] = useState('');
  const [valid, setValid] = useState(false);

  return (
    <FeatureFlag flagName={ProcuracaoFlags.minutaTemplate}>
      <Typography.Text>Valid: {String(valid)}</Typography.Text>
      <Typography.Title level={2}>Cole/Copie o HTML gerado daqui:</Typography.Title>
      <Input.TextArea
        rows={7}
        placeholder={
            `Cole aqui se tiver a versão HTML do template.

Depois de editar do componente abaixo, copie o resultado daqui.
Este componente não é recomendado para editar direto daqui

Se tiver a versão renderizada, cole direto abaixo.
`
          }
        status={valid ? '' : 'warning'}
        value={editTemplate}
        onChange={(e) => setEditTemplate(e.target.value)}
      />
      <div style={{ marginTop: '5em' }}>
        <Typography.Title level={2}>Altere o template aqui:</Typography.Title>
        <MinutaTemplateEditavel
          key={editTemplate}
          templateBase={editTemplate}
          fieldsMap={{
            blocoSubsidiarias: 'bloco de subsidiarias',
            '!idMinuta': 'id da minuta',
            '!idTemplate': 'id do template',
            '!tipoFluxo.idFluxo': 'id do fluxo',
            'outorgado.matricula': 'matricula do outorgado',
            'outorgado.nome': 'nome do outorgado',
            '?outorgado.descCargo': 'cargo do outorgado',
            'outorgado.estCivil': 'estado civil do outorgado',
            'outorgado.rg': 'rg do outorgado',
            'outorgado.cpf': 'cpf do outorgado',
            'outorgado.dependencia.uf': 'uf do outorgado',
            'outorgado.dependencia.municipio': 'municipio do outorgado',
            'outorgado.dependencia.endereco': 'endereço do outorgado',
            'outorgante.matricula': 'matricula do outorgante',
            'outorgante.nome': 'nome do outorgante',
            'outorgante.cpf': 'cpf do outorgante',
            'outorgante.estadoCivil': 'estado civil do outorgante',
            'outorgante.rg': 'rg do outorgante',
            'outorgante.municipio': 'municipio do outorgante',
            'outorgante.uf': 'uf do outorgante',
            'outorgante.endereco': 'endereço do outorgante',
            'cartorio.cidadeUF': 'cidade/uf do cartorio',
            'cartorio.monthToday': 'mês hoje',
            'cartorio.dayToday': 'dia hoje',
            'cartorio.yearToday': 'ano hoje',
            '?validade': 'validade do substalecimento'
          }}
          callback={({ isValid, template }) => {
            setEditTemplate(template);
            setValid(isValid);
          }}
        />
      </div>
    </FeatureFlag>
  );
}
