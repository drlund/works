import { Button, Card, Tooltip, message } from 'antd';
import { Fragment, useEffect, useState } from 'react';

import { BoldLabelDisplay } from '@/components/BoldLabelDisplay/BoldLabelDisplay';
import { useSpinning } from '@/components/SpinningContext';
import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';
import { dateToBRTimezoneString } from '@/utils/dateToBRTimezoneString';

import { StyledEmpty } from '../../StyledEmpty';
import { LoteRevogacaoItems } from './LoteRevogacaoItems';
import { getLabelFromStatus } from './getLabelFromStatus';
import { getStatus } from './getStatus';

/**
 * @typedef {[string,string]} MatriculaTimestamp
 * @typedef {{
 *  loteCriado: MatriculaTimestamp,
 *  assinaturaDigital?: MatriculaTimestamp,
 *  videoconferencia?: MatriculaTimestamp,
 * }} PedidoInfoLote
 *
 * @typedef {{
 *  idPedido: number;
 *  infoLote: PedidoInfoLote;
 *  items: {
 *      idItem: number;
 *      matricula: string;
 *      nome: string;
 *      criado: string;
 *      cartorio: string | null;
 *      viaDigital: string | null;
 *      viaFisica: string | null;
 *  }[];
 * }} LoteRevogacoes
 */

export function ListaRevogacoesMassificada() {
  const [error, setError] = useState(/** @type {string|null} */(null));
  const [lista, setLista] = useState(/** @type {LoteRevogacoes[]|null} */(null));
  const { setLoading } = useSpinning();

  useEffect(() => {
    fetch(FETCH_METHODS.GET, 'procuracoes/solicitacoes/massificado/revogacao')
      .then(setLista)
      .catch(() => setError('Erro ao recuperar lista de revogações.'));
  }, []);

  if (error) {
    return (
      <StyledEmpty
        description={error}
      />
    );
  }

  if (lista === null) {
    return (
      <StyledEmpty
        description="Carregando lista de revogações..."
      />
    );
  }

  /**
   * @param {{
   *  idPedido: number,
   *  tipo: Exclude<keyof PedidoInfoLote, 'loteCriado'>,
   * }} props
   */
  const handleUpdates = ({ tipo, idPedido }) => async () => {
    setLoading(true);
    /** @type {PedidoInfoLote|null} */
    const result = await fetch(
      FETCH_METHODS.PATCH,
      `procuracoes/solicitacoes/massificado/revogacao/${idPedido}`,
      {
        tipo,
      }
    )
      .catch((e) => {
        message.error(`Erro ao atualizar lote: ${e}`);
      })
      .finally(() => setLoading(false));


    if (result) {
      setLista((old) => old?.map(
        (l) => (l.idPedido === idPedido) ? ({
          ...l,
          infoLote: result,
        }) : l) || old
      );

      message.success('Lote atualizado com sucesso.');
    }
  };

  return (
    <div>{
      lista.map((r) => {
        const { status, assinatura, video } = getStatus(r);
        return (
          <Fragment key={r.idPedido}>
            <Card
              title={(
                <div style={{ fontWeight: 'normal', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                    {`Lote criado em ${dateToBRTimezoneString(r.infoLote.loteCriado[1])} por ${r.infoLote.loteCriado[0]}`}
                  </div>
                  <div style={{ width: '40%', textAlign: 'center', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', gap: '0.5em' }}>
                    <BoldLabelDisplay label='Status' style={{ display: 'flex', flexDirection: 'column', flexBasis: '60%' }}>
                      {status}
                    </BoldLabelDisplay>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2em', flexBasis: '40%' }}>
                      <Tooltip
                        title={r.infoLote.assinaturaDigital ? `em ${dateToBRTimezoneString(r.infoLote.assinaturaDigital[1])}` : null}
                      >
                        <Button
                          disabled={!assinatura || Boolean(r.infoLote.assinaturaDigital)}
                          type='ghost'
                          style={{ width: '100%' }}
                          onClick={handleUpdates({
                            tipo: 'assinaturaDigital',
                            idPedido: r.idPedido,
                          })}
                        >
                          {
                            getLabelFromStatus({
                              fieldBool: assinatura,
                              fieldInfo: r.infoLote.assinaturaDigital,
                              falseBool: 'Esperando Envio',
                              withInfoTrue: 'Assinado ✅',
                              withInfoFalse: 'Confirmar Assinatura',
                            })
                          }
                        </Button>
                      </Tooltip>
                      <Tooltip
                        title={r.infoLote.videoconferencia ? `em ${dateToBRTimezoneString(r.infoLote.videoconferencia[1])}` : null}
                      >
                        <Button
                          disabled={!video || Boolean(r.infoLote.videoconferencia)}
                          type='ghost'
                          style={{ width: '100%' }}
                          onClick={handleUpdates({
                            tipo: 'videoconferencia',
                            idPedido: r.idPedido,
                          })}
                        >
                          {
                            getLabelFromStatus({
                              fieldBool: video,
                              fieldInfo: r.infoLote.videoconferencia,
                              falseBool: 'Esperando Assinatura',
                              withInfoTrue: 'Vídeo ✅',
                              withInfoFalse: 'Confirmar vídeo',
                            })
                          }
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              )}
              style={{ marginBottom: '1em' }}
            >
              <LoteRevogacaoItems items={r.items} />
            </Card>
          </Fragment>
        );
      })
    }</div>
  );
}
