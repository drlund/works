import { Button } from 'antd';
import React, { useRef } from 'react';
import { handleCopyToClipboard } from './handleCopyToClipboard';

/** @param {Procuracoes.SolicitacoesListaCartorio.ListaReturn[number]['envelopes']} envelopes */

export function useCreateEmailTemplate(envelopes) {
  const emailRef = /** @type {typeof useRef<import('react').ElementRef<'div'>>} */ (useRef)(null);

  const template = (
    <div ref={emailRef}>
      <p style={{ fontWeight: 'bold' }}>Lista de Pedidos:</p>
      <br />

      <p>Prezados,</p>
      <p>Solicitamos que sejam emitidas, para cada envelope, os seguintes documentos:</p>
      <br />

      {
        Object.values(envelopes).map((envelope) => (
          <div key={envelope.dados.prefixo}>
            <div>
              <span style={{ fontWeight: 'bold' }}>Dados para envelope:</span>
              {` ${envelope.dados.prefixo} - ${envelope.dados.nome} - ${envelope.dados.municipio}/${envelope.dados.uf}`}
            </div>
            <div>
              <span style={{ fontWeight: 'bold' }}>Dados do Pedido:</span>
              {
                Object.entries(envelope.procuracoes).map(([id, procuracao]) => (
                  <ul key={id}>
                    <li>
                      Para procuração: Folha: {procuracao.info.folha} / Livro: {procuracao.info.livro}
                      <ol>
                        {Boolean(procuracao.pedido.manifesto) && (
                          <li>Certidão física e digital - quantidade: {procuracao.pedido.manifesto}</li>
                        )}
                        {Boolean(procuracao.pedido.copia) && (
                          <li>Cópia Autenticada - quantidade: {procuracao.pedido.copia}</li>
                        )}
                        {Boolean(procuracao.pedido.revogacao) && (
                          <li>Revogação desta procuração</li>
                        )}
                      </ol>
                    </li>
                  </ul>
                ))
              }
            </div>
          </div>
        ))
      }

      <br />
      <div>
        <p>Banco do Brasil S.A.</p>
        <p>Superintendência Administrativa de Varejo</p>
        <p>Núcleo Administrativo</p>
      </div>
    </div>
  );

  /**
   * @param {{
   *  cb: () => void
   * }} props
   */
  const CopyButton = ({ cb }) => (
    <Button
      type='primary'
      onClick={() => {
        handleCopyToClipboard(emailRef.current?.innerHTML)()
          .then(cb);
      }}
    >
      Copiar Email
    </Button>
  );

  return {
    template,
    CopyButton,
  };
}
