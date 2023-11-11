import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  Empty,
  Tabs
} from 'antd';
import React, {
  useEffect,
  useState
} from 'react';

import BBSpining from 'components/BBSpinning/BBSpinning';
import CardSecao from 'components/CardSecao';
import { useHistoryPushWithQuery } from 'hooks/useHistoryPushWithQuery';
import useUsuarioLogado from 'hooks/useUsuarioLogado';
import { useCadastroProcuracao } from 'pages/procuracoes/contexts/ProcuracoesContext';
import { useProcuracoesMassificado } from 'pages/procuracoes/hooks/useProcuracoesMassificado';
import { fluxosProcessos } from 'pages/procuracoes/innerComponents/SelecionarTipoFluxo/helpers/fluxosProcessos';

import { SearchInputForTab } from './SearchInputForTab';
import { useListaMinutasCall } from './useListaMinutasCall';
import { useTabItems } from './useTabItems';

export function ListaDeMinutas() {
  const [hideMassificado, setHideMassificado] = useState(true);
  const [activePanel, setActivePanel] = useState(/** @type {"0"|"1"|"2"} */("0"));
  const { fluxoProcesso } = useCadastroProcuracao();
  const { prefixo: prefixoUser } = useUsuarioLogado();
  const hasMassificadoPermission = useProcuracoesMassificado();
  const historyPush = useHistoryPushWithQuery();

  const { dataMap, searching, getListaMinutas } = useListaMinutasCall({ activePanel });

  useEffect(() => {
    getListaMinutas({ prefixo: prefixoUser });
  }, []);

  const tabItems = useTabItems({
    activeData: dataMap[Number(activePanel)],
    showMassificado: !hideMassificado,
    activePanel,
    getListaMinutas,
  });
  const isCadastro = fluxoProcesso === fluxosProcessos.cadastro;

  // adicionando aqui para dar o spread no `ConfigProvider`
  // desta maneira não se sobrescreve o empty já configurado
  const customEmptyIf = (activePanel === "0" && isCadastro) ? {
    renderEmpty() {
      return (
        <Empty description="Nenhuma minuta aqui...">
          <Button
            onClick={() => historyPush('/procuracoes/minuta')}
            type='primary'
          >
            Crie uma agora!
          </Button>
        </Empty>
      );
    }
  } : {};

  /** @type {string} */
  // @ts-expect-error not exaustive pattern matching
  const cardTitle = {
    [fluxosProcessos.cadastro]: 'Ou continuar de uma minuta emitida',
    [fluxosProcessos.minuta]: 'Consultar Minutas Emitidas',
  }[fluxoProcesso] ?? 'Alguma coisa deu errado!';

  return (
    <Col span={24}>
      <CardSecao
        title={cardTitle}
        extra={hasMassificadoPermission
          ? (
            <Checkbox
              checked={hideMassificado}
              onChange={({ target: { checked } }) => setHideMassificado(checked)}
            >
              {`${hideMassificado ? 'Ocultando' : 'Mostrando'} Minutas do Massificado`}
            </Checkbox>
          )
          : null
        }
      >
        <BBSpining spinning={searching}>
          <ConfigProvider {...customEmptyIf}>
            <Tabs
              items={tabItems}
              tabBarExtraContent={(
                <SearchInputForTab
                  key={activePanel}
                  activePanel={activePanel}
                  tabItems={tabItems}
                  searching={searching}
                />
              )}
              // @ts-expect-error string -> "0"|"1"|"2" conversion error
              onTabClick={setActivePanel}
            />
          </ConfigProvider>
        </BBSpining>
      </CardSecao>
    </Col>
  );
}
