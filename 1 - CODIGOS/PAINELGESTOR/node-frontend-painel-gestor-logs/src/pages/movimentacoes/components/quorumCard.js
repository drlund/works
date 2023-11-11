import React, { useState, useEffect } from 'react';
import {
  Button, Input, InputNumber, Row, Space
} from 'antd';

export function QuorumCard({
  prefixo,
  quorumDoPrefixo,
  observacao,
  saveButton,
  onSalvarMeuPrefixo,
  onUpdatePrefixForm,
  onUpdateQuorumForm,
  onUpdateObservacao,
  prefixInputDisable,
  title
}) {
  const [atualPrefixo, setNewPrefixo] = useState(prefixo);
  const [atualQuorum, setNewQuorum] = useState(quorumDoPrefixo);

  useEffect(() => {
    setNewQuorum(quorumDoPrefixo);
  }, [quorumDoPrefixo]);

  function atualizarPrefixo(valorDoPrefixoInput) {
    setNewPrefixo(valorDoPrefixoInput);
    onUpdatePrefixForm(valorDoPrefixoInput);
  }

  function atualizarQuorum(ValorDoQuorumInput) {
    setNewQuorum(ValorDoQuorumInput);
    onUpdateQuorumForm(ValorDoQuorumInput);
  }
  return (
    <><Space direction="horizontal" size="middle" style={{ display: 'flex' }}>
      <Space direction="horizontal" size="small" style={{ display: 'flex' }}>
        Prefixo:
        <InputNumber
          value={atualPrefixo}
          disabled={prefixInputDisable}
          onBlur={(e) => atualizarPrefixo(e.target.value)}
          min={1}
          max={9999}
          minLength={4}
          maxLength={4} />
      </Space>
      <Space direction="horizontal" size="small" style={{ display: 'flex' }}>
        Quórum:
        <InputNumber
          min={1}
          max={6}
          maxLength={1}
          value={atualQuorum}
          onChange={atualizarQuorum} />
      </Space>
      {saveButton ? (
        <Row>
          <Button
            disabled={quorumDoPrefixo == atualQuorum}
            type="primary"
            onClick={() => onSalvarMeuPrefixo(atualQuorum, observacao)}
          >
            Salvar
          </Button>
        </Row>
      ) : null}
    </Space>
    <Space hidden={quorumDoPrefixo === atualQuorum  && !title} direction="horizontal" size="middle" style={{ display: 'flex', marginTop: '16px'}}>
      <Space direction="vertical" style={{ display: 'flex' }} >
        Observações:
        <Input.TextArea
          placeholder="Inserir observações sobre alterações de quórum."
          style={{ fontSize: 16, padding: '10px', inlineSize: '400px' }}
          value={observacao}
          onChange={(e) => onUpdateObservacao(e.target.value)} />
      </Space>
    </Space></>
  );
}