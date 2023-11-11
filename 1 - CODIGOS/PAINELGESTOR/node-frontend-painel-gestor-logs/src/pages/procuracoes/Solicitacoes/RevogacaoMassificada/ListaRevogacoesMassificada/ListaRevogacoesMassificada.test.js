/* eslint-disable no-lone-blocks */
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SpinningContext } from '@/components/SpinningContext';
import { FETCH_METHODS } from '@/services/apis/GenericFetch';
import { ListaRevogacoesMassificada } from '.';

describe('<ListaRevogacoesMassificada>', () => {
  it('renders lote criado', async () => {
    const mockLoteCriado = /** @type {import('.').LoteRevogacoes[]} */([{
      idPedido: 123,
      infoLote: {
        loteCriado: ['mock matricula 1', new Date('2021-01-01T00:00:00.000Z').toISOString()],
      },
      items: [{
        idItem: 999,
        matricula: 'mock matricula',
        nome: 'mock nome',
        criado: new Date('2021-01-01T00:00:00.000Z').toISOString(),
        cartorio: null,
        viaDigital: null,
        viaFisica: null,
      }]
    }]);

    await doRender(mockLoteCriado);

    // header do item
    {
      // diferenciador
      expect(screen.getByText(new RegExp(`lote criado em 01/01/2021 por ${mockLoteCriado[0]?.infoLote.loteCriado[0]}`, 'i'))).toBeInTheDocument();
      // status do lote
      expect(screen.getByText(/aguardando envio ao cartório/i)).toBeInTheDocument();

      // botões para atualização do lote
      expect(screen.getByRole('button', { name: /esperando envio/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /esperando assinatura/i })).toBeDisabled();
    }

    // @ts-ignore
    const itemsValues = within(screen.getAllByRole('list')[1]).getAllByRole('listitem');

    // itens do lote
    {
      // diferenciador
      expect(itemsValues[0]).toHaveTextContent(`${mockLoteCriado[0]?.items[0]?.matricula} ${mockLoteCriado[0]?.items[0]?.nome}`);
      // criado
      expect(itemsValues[1]).toHaveTextContent('✅');
      // cartório
      expect(itemsValues[2]).toHaveTextContent('☐');
      // via digital
      expect(itemsValues[3]).toHaveTextContent('☐');
      // via fisica
      expect(itemsValues[4]).toHaveTextContent('☐');
    }
  });

  it('renders lote cartorio', async () => {
    const mockLoteCartorio = /** @type {import('.').LoteRevogacoes[]} */([{
      idPedido: 123,
      infoLote: {
        loteCriado: ['mock matricula 1', new Date('2021-01-01T00:00:00.000Z').toISOString()],
      },
      items: [{
        idItem: 999,
        matricula: 'mock matricula',
        nome: 'mock nome',
        criado: new Date('2021-01-01T00:00:00.000Z').toISOString(),
        cartorio: new Date('2021-01-01T00:00:00.000Z').toISOString(),
        viaDigital: null,
        viaFisica: null,
      }]
    }]);

    await doRender(mockLoteCartorio);

    // header do item
    {
      // diferenciador
      expect(screen.getByText(new RegExp(`lote criado em 01/01/2021 por ${mockLoteCartorio[0]?.infoLote.loteCriado[0]}`, 'i'))).toBeInTheDocument();
      // status do lote
      expect(screen.getByText(/aguardando assinatura/i)).toBeInTheDocument();

      // botões para atualização do lote
      expect(screen.getByRole('button', { name: /confirmar assinatura/i })).toBeEnabled();
      expect(screen.getByRole('button', { name: /esperando assinatura/i })).toBeDisabled();
    }
    // @ts-ignore
    const itemsValues = within(screen.getAllByRole('list')[1]).getAllByRole('listitem');

    // itens do lote
    {
      // diferenciador
      expect(itemsValues[0]).toHaveTextContent(`${mockLoteCartorio[0]?.items[0]?.matricula} ${mockLoteCartorio[0]?.items[0]?.nome}`);
      // criado
      expect(itemsValues[1]).toHaveTextContent('✅');
      // cartório
      expect(itemsValues[2]).toHaveTextContent('✅');
      // via digital
      expect(itemsValues[3]).toHaveTextContent('☐');
      // via fisica
      expect(itemsValues[4]).toHaveTextContent('☐');
    }

    // ao confirmar assinatura
    {
      const newInfoLote = /** @type {import('.').PedidoInfoLote} */({
        ...mockLoteCartorio[0]?.infoLote,
        assinaturaDigital: ['mock matricula 2', new Date('2021-01-01T00:00:00.000Z').toISOString()],
      });

      globalThis.fetchSpy.mockResolvedValue(newInfoLote);
      await userEvent.click(screen.getByRole('button', { name: /confirmar assinatura/i }));

      // calls the api
      expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
        FETCH_METHODS.PATCH,
        `procuracoes/solicitacoes/massificado/revogacao/${mockLoteCartorio[0]?.idPedido}`,
        { tipo: 'assinaturaDigital' }
      );

      // assinatura button changes
      expect(screen.queryByRole('button', { name: /confirmar assinatura/i })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /assinado ✅/i })).toBeInTheDocument();

      // video button changes
      expect(screen.queryByRole('button', { name: /esperando assinatura/i })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirmar vídeo/i })).toBeEnabled();
    }
  });

  it('renders lote com assinatura', async () => {
    const mockLoteAssinatura = /** @type {import('.').LoteRevogacoes[]} */([{
      idPedido: 123,
      infoLote: {
        loteCriado: ['mock matricula 1', new Date('2021-01-01T00:00:00.000Z').toISOString()],
        assinaturaDigital: ['mock matricula 2', new Date('2021-01-01T00:00:00.000Z').toISOString()],
      },
      items: [{
        idItem: 999,
        matricula: 'mock matricula',
        nome: 'mock nome',
        criado: new Date('2021-01-01T00:00:00.000Z').toISOString(),
        cartorio: new Date('2021-01-01T00:00:00.000Z').toISOString(),
        viaDigital: null,
        viaFisica: null,
      }]
    }]);

    await doRender(mockLoteAssinatura);

    // header do item
    {
      // diferenciador
      expect(screen.getByText(new RegExp(`lote criado em 01/01/2021 por ${mockLoteAssinatura[0]?.infoLote.loteCriado[0]}`, 'i'))).toBeInTheDocument();
      // status do lote
      expect(screen.getByText(/aguardando videoconferência/i)).toBeInTheDocument();

      // botões para atualização do lote
      expect(screen.getByRole('button', { name: /assinado ✅/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /confirmar vídeo/i })).toBeEnabled();
    }
    // @ts-ignore
    const itemsValues = within(screen.getAllByRole('list')[1]).getAllByRole('listitem');

    // itens do lote
    {
      // diferenciador
      expect(itemsValues[0]).toHaveTextContent(`${mockLoteAssinatura[0]?.items[0]?.matricula} ${mockLoteAssinatura[0]?.items[0]?.nome}`);
      // criado
      expect(itemsValues[1]).toHaveTextContent('✅');
      // cartório
      expect(itemsValues[2]).toHaveTextContent('✅');
      // via digital
      expect(itemsValues[3]).toHaveTextContent('☐');
      // via fisica
      expect(itemsValues[4]).toHaveTextContent('☐');
    }

    // ao confirmar video
    {
      const newInfoLote = /** @type {import('.').PedidoInfoLote} */({
        ...mockLoteAssinatura[0]?.infoLote,
        videoconferencia: ['mock matricula 3', new Date('2021-01-01T00:00:00.000Z').toISOString()],
      });

      globalThis.fetchSpy.mockResolvedValue(newInfoLote);
      await userEvent.click(screen.getByRole('button', { name: /confirmar vídeo/i }));

      // calls the api
      expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
        FETCH_METHODS.PATCH,
        `procuracoes/solicitacoes/massificado/revogacao/${mockLoteAssinatura[0]?.idPedido}`,
        { tipo: 'videoconferencia' }
      );

      // video button changes
      expect(screen.queryByRole('button', { name: /confirmar vídeo/i })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /vídeo ✅/i })).toBeDisabled();
    }
  });

  it('renders lote com video', async () => {
    const mockLoteVideo = /** @type {import('.').LoteRevogacoes[]} */([{
      idPedido: 123,
      infoLote: {
        loteCriado: ['mock matricula 1', new Date('2021-01-01T00:00:00.000Z').toISOString()],
        assinaturaDigital: ['mock matricula 2', new Date('2021-01-01T00:00:00.000Z').toISOString()],
        videoconferencia: ['mock matricula 3', new Date('2021-01-01T00:00:00.000Z').toISOString()],
      },
      items: [{
        idItem: 999,
        matricula: 'mock matricula',
        nome: 'mock nome',
        criado: new Date('2021-01-01T00:00:00.000Z').toISOString(),
        cartorio: new Date('2021-01-01T00:00:00.000Z').toISOString(),
        viaDigital: null,
        viaFisica: null,
      }]
    }]);

    await doRender(mockLoteVideo);

    // header do item
    {
      // diferenciador
      expect(screen.getByText(new RegExp(`lote criado em 01/01/2021 por ${mockLoteVideo[0]?.infoLote.loteCriado[0]}`, 'i'))).toBeInTheDocument();
      // status do lote
      expect(screen.getByText(/aguardando cadastros/i)).toBeInTheDocument();

      // botões para atualização do lote
      expect(screen.getByRole('button', { name: /assinado ✅/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /vídeo ✅/i })).toBeDisabled();
    }
    // @ts-ignore
    const itemsValues = within(screen.getAllByRole('list')[1]).getAllByRole('listitem');

    // itens do lote
    {
      // diferenciador
      expect(itemsValues[0]).toHaveTextContent(`${mockLoteVideo[0]?.items[0]?.matricula} ${mockLoteVideo[0]?.items[0]?.nome}`);
      // criado
      expect(itemsValues[1]).toHaveTextContent('✅');
      // cartório
      expect(itemsValues[2]).toHaveTextContent('✅');
      // via digital
      expect(itemsValues[3]).toHaveTextContent('☐');
      // via fisica
      expect(itemsValues[4]).toHaveTextContent('☐');
    }
  });

  it('renders lote com via digital', async () => {
    const mockLoteViaDigital = /** @type {import('.').LoteRevogacoes[]} */([{
      idPedido: 123,
      infoLote: {
        loteCriado: ['mock matricula 1', new Date('2021-01-01T00:00:00.000Z').toISOString()],
        assinaturaDigital: ['mock matricula 2', new Date('2021-01-01T00:00:00.000Z').toISOString()],
        videoconferencia: ['mock matricula 3', new Date('2021-01-01T00:00:00.000Z').toISOString()],
      },
      items: [{
        idItem: 999,
        matricula: 'mock matricula',
        nome: 'mock nome',
        criado: new Date('2021-01-01T00:00:00.000Z').toISOString(),
        cartorio: new Date('2021-01-01T00:00:00.000Z').toISOString(),
        viaDigital: new Date('2021-01-01T00:00:00.000Z').toISOString(),
        viaFisica: null,
      }]
    }]);

    await doRender(mockLoteViaDigital);

    // header do item
    {
      // diferenciador
      expect(screen.getByText(new RegExp(`lote criado em 01/01/2021 por ${mockLoteViaDigital[0]?.infoLote.loteCriado[0]}`, 'i'))).toBeInTheDocument();
      // status do lote
      expect(screen.getByText(/aguardando cadastros/i)).toBeInTheDocument();

      // botões para atualização do lote
      expect(screen.getByRole('button', { name: /assinado ✅/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /vídeo ✅/i })).toBeDisabled();
    }
    // @ts-ignore
    const itemsValues = within(screen.getAllByRole('list')[1]).getAllByRole('listitem');

    // itens do lote
    {
      // diferenciador
      expect(itemsValues[0]).toHaveTextContent(`${mockLoteViaDigital[0]?.items[0]?.matricula} ${mockLoteViaDigital[0]?.items[0]?.nome}`);
      // criado
      expect(itemsValues[1]).toHaveTextContent('✅');
      // cartório
      expect(itemsValues[2]).toHaveTextContent('✅');
      // via digital
      expect(itemsValues[3]).toHaveTextContent('✅');
      // via fisica
      expect(itemsValues[4]).toHaveTextContent('☐');
    }
  });

  it('renders lote finalizado', async () => {
    const mockLoteFinal = /** @type {import('.').LoteRevogacoes[]} */([{
      idPedido: 123,
      infoLote: {
        loteCriado: ['mock matricula 1', new Date('2021-01-01T00:00:00.000Z').toISOString()],
        assinaturaDigital: ['mock matricula 2', new Date('2021-01-01T00:00:00.000Z').toISOString()],
        videoconferencia: ['mock matricula 3', new Date('2021-01-01T00:00:00.000Z').toISOString()],
      },
      items: [{
        idItem: 999,
        matricula: 'mock matricula',
        nome: 'mock nome',
        criado: new Date('2021-01-01T00:00:00.000Z').toISOString(),
        cartorio: new Date('2021-01-01T00:00:00.000Z').toISOString(),
        viaDigital: new Date('2021-01-01T00:00:00.000Z').toISOString(),
        viaFisica: new Date('2021-01-01T00:00:00.000Z').toISOString(),
      }]
    }]);

    await doRender(mockLoteFinal);

    // header do item
    {
      // diferenciador
      expect(screen.getByText(new RegExp(`lote criado em 01/01/2021 por ${mockLoteFinal[0]?.infoLote.loteCriado[0]}`, 'i'))).toBeInTheDocument();
      // status do lote
      expect(screen.getByText(/finalizado/i)).toBeInTheDocument();

      // botões para atualização do lote
      expect(screen.getByRole('button', { name: /assinado ✅/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /vídeo ✅/i })).toBeDisabled();
    }
    // @ts-ignore
    const itemsValues = within(screen.getAllByRole('list')[1]).getAllByRole('listitem');

    // itens do lote
    {
      // diferenciador
      expect(itemsValues[0]).toHaveTextContent(`${mockLoteFinal[0]?.items[0]?.matricula} ${mockLoteFinal[0]?.items[0]?.nome}`);
      // criado
      expect(itemsValues[1]).toHaveTextContent('✅');
      // cartório
      expect(itemsValues[2]).toHaveTextContent('✅');
      // via digital
      expect(itemsValues[3]).toHaveTextContent('✅');
      // via fisica
      expect(itemsValues[4]).toHaveTextContent('✅');
    }
  });

  async function doRender(/** @type {import('.').LoteRevogacoes[]} */ mockLote) {
    globalThis.fetchSpy.mockResolvedValue(mockLote);

    render(
      <SpinningContext>
        <ListaRevogacoesMassificada />
      </SpinningContext>
    );

    await waitFor(() => {
      expect(screen.queryByText(/carregando lista de revogações\.\.\./i)).not.toBeInTheDocument();
    });
  }
});
