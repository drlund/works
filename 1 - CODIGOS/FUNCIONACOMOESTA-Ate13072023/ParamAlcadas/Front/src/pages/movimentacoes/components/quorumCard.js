import React, { useState, useEffect } from 'react';
import {
  Button, InputNumber, Row, Space
} from 'antd';

export function QuorumCard({
  prefixo,
  quorumDoPrefixo,
  saveButton,
  onSalvarMeuPrefixo,
  onUpdatePrefixForm,
  onUpdateQuorumForm,
  prefixInputDisable,
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
    <Space direction="horizontal" size="middle" style={{ display: 'flex' }}>
      <Space direction="horizontal" size="small" style={{ display: 'flex' }}>
        Prefixo:
        <InputNumber
          value={atualPrefixo}
          disabled={prefixInputDisable}
          onBlur={(e) => atualizarPrefixo(e.target.value)}
          min={1}
          max={9999}
          minLength={4}
          maxLength={4}
          />
      </Space>
      <Space direction="horizontal" size="small" style={{ display: 'flex' }}>
        Quórum:
        <InputNumber
          min={1}
          max={6}
          maxLength={1}
          value={atualQuorum}
          onChange={atualizarQuorum}
          />
      </Space>
      {saveButton ? (
        <Row>
          <Button
            disabled={quorumDoPrefixo == atualQuorum}
            type="primary"
            onClick={() => onSalvarMeuPrefixo(atualQuorum)}
            >
            Salvar
          </Button>
        </Row>
      ) : null}
    </Space>
  );
}
