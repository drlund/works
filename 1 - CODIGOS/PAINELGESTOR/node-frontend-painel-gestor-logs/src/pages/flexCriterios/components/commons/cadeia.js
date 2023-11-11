import React, { useState } from 'react';
import { Button, Modal, Space, Steps, Typography } from 'antd';
import { CardResponsivo } from '../../styles';
import constantes from '../../helpers/constantes';

export default function Cadeia({ acao, pedidoFlex, perfil }) {
  const [modalAberta, setModalAberta] = useState(false);
  const [conteudoModal, setConteudoModal] = useState(null);

  const consultarManifestacao = (manifestacao) => {
    setConteudoModal(manifestacao);
    setModalAberta(true);
  };

  const exibirBotaoConsulta = (manifestacao) => {
    //Back-End filtra e devolve  manifestacao?.parecer =null caso não seja uma manifestação da jurisdição do usuario logado , sem "poderes pra ler"
    return (
      manifestacao?.parecer !== null &&
      (manifestacao.situacao.id === constantes.situacaoRegistrada ||
        manifestacao.situacao.id === constantes.situacaoNaoVigente)
    );
  };

  const formataSituacao = (manifestacao) => {
    console.log('MANIFESTACAO', manifestacao);
    if (manifestacao.acao.nome === 'Cancelamento') {
      return 'Solicitação de encerramento';
    }

    if (/Dispensa/.test(manifestacao.texto)) {
      return `${manifestacao.texto}`;
    }

    if (manifestacao.parecer == 0) {
      return `${manifestacao.acao.nome} Desfavorável ${manifestacao.situacao.nome}`;
    }

    if (
      manifestacao.acao.nome === 'Complemento' &&
      manifestacao.situacao.nome === 'Registrada'
    ) {
      return 'Complemento Registrado';
    }

    if (
      manifestacao.acao.nome === 'Avocar' &&
      manifestacao.situacao.nome === 'Dispensada'
    ) {
      return 'Dispensada por avocação';
    }
    return `${manifestacao.acao.nome} ${manifestacao.situacao.nome}`;
  };

  return (
    <CardResponsivo title="Cadeia de Manifestação">
      <Steps
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
        direction="vertical"
        size="small"
        current={pedidoFlex?.manifestacoes.indexOf(
          pedidoFlex?.manifestacoes.find(
            (manifestacao) => manifestacao.situacao.id === constantes.pendente,
          ),
        )}
        items={pedidoFlex?.manifestacoes.map((manifestacao) => ({
          title: `${manifestacao.nomeFuncao} - ${manifestacao.nomePrefixo}`,
          description: (
            <div
              key={manifestacao.id}
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <span>{formataSituacao(manifestacao)}</span>

              {exibirBotaoConsulta(manifestacao) && (
                <Button
                  style={{ marginTop: -20 }}
                  onClick={() => {
                    consultarManifestacao(manifestacao);
                  }}
                >
                  Consultar
                </Button>
              )}
            </div>
          ),
        }))}
      />

      <Modal
        title={`${conteudoModal?.nomeFuncao} - ${conteudoModal?.nomePrefixo}`}
        open={modalAberta}
        okButtonProps={{ style: { display: 'none' } }}
        onOk={() => {}}
        cancelText="Voltar"
        onCancel={() => setModalAberta(false)}
      >
        <Space direction="vertical">
          <Typography.Text>
            <Typography.Text strong>Responsável</Typography.Text>:{' '}
            {conteudoModal?.matricula} - {conteudoModal?.nome}
          </Typography.Text>
          <Typography.Text>
            <Typography.Text strong>
              {conteudoModal?.acao?.nome}
            </Typography.Text>
            : {conteudoModal?.texto}
          </Typography.Text>
          {conteudoModal?.acao?.nome === 'Complemento' ? (
            <>
              <Typography.Text>
                <Typography.Text strong>
                  {conteudoModal?.acao?.nome} esperado
                </Typography.Text>
                : {conteudoModal?.complementoEsperado}
              </Typography.Text>
              <Typography.Text>
                <Typography.Text strong>Solicitante</Typography.Text>:{' '}
                {conteudoModal?.matComplemento}
              </Typography.Text>
            </>
          ) : null}

          <Typography.Text disabled>
            {conteudoModal?.acao?.nome === 'Complemento'
              ? `registrado em ${conteudoModal?.updatedAt}`
              : `registrada em ${conteudoModal?.updatedAt}`}
          </Typography.Text>
        </Space>
      </Modal>
    </CardResponsivo>
  );
}
