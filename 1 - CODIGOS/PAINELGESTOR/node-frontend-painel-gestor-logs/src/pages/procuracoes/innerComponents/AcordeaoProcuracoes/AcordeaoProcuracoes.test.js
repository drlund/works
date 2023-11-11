import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { cloneDeep } from 'lodash';
import { MemoryRouter } from 'react-router-dom';

import { renderWithRedux } from '@test-utils';
import { PesquisasContext } from 'pages/procuracoes/Pesquisar/PesquisaContext';
import { getButtonWithName } from 'pages/procuracoes/tests/utils';
import { FETCH_METHODS } from 'services/apis/GenericFetch';

import { AcordeaoProcuracoes } from '.';
import { ItemAcordeao } from './ItemAcordeaoPesquisa';
import {
  outorgadoComProcuracaoCompleta,
  outorgadoComProcuracaoNaoAgregada,
  outorgadoSemProcuracao,
} from './__mocks__/mockData';
import { extractAcordeaoItemData } from './helpers/extractAcordeaoItemData';

describe('Pesquisa/<AcordeaoProcuracoes />', () => {
  describe('when without outorgados', () => {
    beforeEach(() => {
      // @ts-ignore
      globalThis.fetchSpy.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <AcordeaoProcuracoes outorgados={[]} ItemAcordeao={ItemAcordeao} />,
        </MemoryRouter>,
      );
    });

    it('never calls the API', () => {
      expect(globalThis.fetchSpy).toHaveBeenCalledTimes(0);
    });

    it('dont render the accordion', () => {
      expect(
        screen.queryByText('Procurações cadastradas'),
      ).not.toBeInTheDocument();
    });
  });

  describe('when with one outorgado', () => {
    const getDialog = () =>
      screen.getByRole('dialog', {
        name: /histórico/i,
      });
    const getTextInDialog = (
      /** @type {import('@testing-library/react').Matcher} */ s,
    ) => within(getDialog()).getByText(s);

    describe('with procuracao agregada', () => {
      beforeEach(() => {
        // @ts-ignore
        globalThis.fetchSpy.mockResolvedValue([]);

        renderWithRedux(
          <PesquisasContext>
            <AcordeaoProcuracoes
              outorgados={[cloneDeep(outorgadoComProcuracaoCompleta)]}
              ItemAcordeao={ItemAcordeao}
            />
          </PesquisasContext>,
          { withMemoryRouter: true },
        );
      });

      it('calls the gerenciar/acessos API', async () => {
        expect(globalThis.fetchSpy).toHaveBeenCalledWith(
          FETCH_METHODS.GET,
          'procuracoes/gerenciar/acessos',
        );
      });

      it('calls the solicitacoes api', async () => {
        expect(globalThis.fetchSpy).toHaveBeenCalledWith(
          FETCH_METHODS.GET,
          `procuracoes/solicitacoes/${outorgadoComProcuracaoCompleta.procuracao[0].procuracaoAgregada.procuracaoId}`,
          {},
        );
      });

      it('render the table', async () => {
        const { CollapsePanelHeader } = extractAcordeaoItemData(
          // @ts-ignore
          outorgadoComProcuracaoCompleta,
        );
        expect(screen.getByText(CollapsePanelHeader)).toBeInTheDocument();
      });

      describe('within the rendered table', () => {
        it('renders rows of data plus header', () => {
          const table = screen.getByRole('table');
          const rows = within(table).getAllByRole('row');
          expect(rows.length).toBe(
            outorgadoComProcuracaoCompleta.procuracao.length + 1,
          );
        });

        it('renders the table rows', () => {
          const table = screen.getByRole('table');
          const rows = within(table).getAllByRole('row');

          /**
           * testes com snapshot quebram facilmente
           *
           * se houver erro, verifique as diferenças do snapshot se é algo vindo de components
           * do antd ou se é algo que não está sendo renderizado ou sendo renderizado a mais
           */
          expect(rows[0]).toMatchInlineSnapshot(`
            <tr>
              <th
                class="ant-table-cell"
              >
                Funci
              </th>
              <th
                class="ant-table-cell"
              >
                Cargo
              </th>
              <th
                class="ant-table-cell"
              >
                Subsidiárias
              </th>
              <th
                class="ant-table-cell"
              >
                Vencimento
              </th>
              <th
                class="ant-table-cell"
              >
                Manifesto
              </th>
              <th
                class="ant-table-cell"
              >
                Ações
              </th>
            </tr>
          `);
          expect(rows[1]).toMatchInlineSnapshot(`
            .c0 {
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: flex;
              -webkit-align-items: center;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              -webkit-flex-wrap: wrap;
              -ms-flex-wrap: wrap;
              flex-wrap: wrap;
              gap: 0.5em;
            }

            <tr
              class="ant-table-row ant-table-row-level-0"
              data-row-key="F1111141undefined40"
            >
              <td
                class="ant-table-cell"
              >
                nome teste4.1
              </td>
              <td
                class="ant-table-cell"
              >
                cargo teste4.1
              </td>
              <td
                class="ant-table-cell"
              >
                BB, BB CARTOES e BB CONSÓRCIOS
              </td>
              <td
                class="ant-table-cell"
              >
                01/12/2021
              </td>
              <td
                class="ant-table-cell"
              >
                23/05/2022
              </td>
              <td
                class="ant-table-cell"
              >
                <div
                  class="c0"
                >
                  <a
                    download=""
                    href="teste4?token=mock token"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <button
                      class="ant-btn ant-btn-default ant-btn-sm"
                      type="button"
                    >
                      <span
                        aria-label="download"
                        class="anticon anticon-download"
                        role="img"
                      >
                        <svg
                          aria-hidden="true"
                          data-icon="download"
                          fill="currentColor"
                          focusable="false"
                          height="1em"
                          viewBox="64 64 896 896"
                          width="1em"
                        >
                          <path
                            d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
                          />
                        </svg>
                      </span>
                      <span>
                        Baixar Procuração
                      </span>
                    </button>
                  </a>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="clock-circle"
                      class="anticon anticon-clock-circle"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="clock-circle"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="64 64 896 896"
                        width="1em"
                      >
                        <path
                          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                        />
                        <path
                          d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"
                        />
                      </svg>
                    </span>
                    <span>
                      Histórico
                    </span>
                  </button>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
                    disabled=""
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="form"
                      class="anticon anticon-form"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="form"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="64 64 896 896"
                        width="1em"
                      >
                        <path
                          d="M904 512h-56c-4.4 0-8 3.6-8 8v320H184V184h320c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-4.4-3.6-8-8-8z"
                        />
                        <path
                          d="M355.9 534.9L354 653.8c-.1 8.9 7.1 16.2 16 16.2h.4l118-2.9c2-.1 4-.9 5.4-2.3l415.9-415c3.1-3.1 3.1-8.2 0-11.3L785.4 114.3c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-415.8 415a8.3 8.3 0 00-2.3 5.6zm63.5 23.6L779.7 199l45.2 45.1-360.5 359.7-45.7 1.1.7-46.4z"
                        />
                      </svg>
                    </span>
                    <span>
                      Gerenciar
                    </span>
                  </button>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="shopping-cart"
                      class="anticon anticon-shopping-cart"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="shopping-cart"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="0 0 1024 1024"
                        width="1em"
                      >
                        <path
                          d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 00-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 100 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 00-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 00-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6z"
                        />
                      </svg>
                    </span>
                    <span>
                      Solicitações
                    </span>
                  </button>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost ant-btn-dangerous"
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="warning"
                      class="anticon anticon-warning"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="warning"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="64 64 896 896"
                        width="1em"
                      >
                        <path
                          d="M464 720a48 48 0 1096 0 48 48 0 10-96 0zm16-304v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8zm475.7 440l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zm-783.5-27.9L512 239.9l339.8 588.2H172.2z"
                        />
                      </svg>
                    </span>
                    <span>
                      Pedir Revogação
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          `);
          expect(rows[2]).toMatchInlineSnapshot(`
            .c0 {
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: flex;
              -webkit-align-items: center;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              -webkit-flex-wrap: wrap;
              -ms-flex-wrap: wrap;
              flex-wrap: wrap;
              gap: 0.5em;
            }

            <tr
              class="ant-table-row ant-table-row-level-0"
              data-row-key="F111114243,38,42undefined"
            >
              <td
                class="ant-table-cell"
              >
                nome teste4.2
              </td>
              <td
                class="ant-table-cell"
              >
                cargo teste4.2
              </td>
              <td
                class="ant-table-cell"
              >
                BB, BB CARTOES e BB CONSÓRCIOS
              </td>
              <td
                class="ant-table-cell"
              >
                01/12/2021
              </td>
              <td
                class="ant-table-cell"
              >
                01/12/2021
              </td>
              <td
                class="ant-table-cell"
              >
                <div
                  class="c0"
                >
                  <a
                    download=""
                    href="teste4.2.3?token=mock token"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <button
                      class="ant-btn ant-btn-default ant-btn-sm"
                      type="button"
                    >
                      <span
                        aria-label="download"
                        class="anticon anticon-download"
                        role="img"
                      >
                        <svg
                          aria-hidden="true"
                          data-icon="download"
                          fill="currentColor"
                          focusable="false"
                          height="1em"
                          viewBox="64 64 896 896"
                          width="1em"
                        >
                          <path
                            d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
                          />
                        </svg>
                      </span>
                      <span>
                        BB
                      </span>
                    </button>
                  </a>
                  <a
                    download=""
                    href="teste4.2.1?token=mock token"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <button
                      class="ant-btn ant-btn-default ant-btn-sm"
                      type="button"
                    >
                      <span
                        aria-label="download"
                        class="anticon anticon-download"
                        role="img"
                      >
                        <svg
                          aria-hidden="true"
                          data-icon="download"
                          fill="currentColor"
                          focusable="false"
                          height="1em"
                          viewBox="64 64 896 896"
                          width="1em"
                        >
                          <path
                            d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
                          />
                        </svg>
                      </span>
                      <span>
                        BB CARTOES
                      </span>
                    </button>
                  </a>
                  <a
                    download=""
                    href="teste4.2.2?token=mock token"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <button
                      class="ant-btn ant-btn-default ant-btn-sm"
                      type="button"
                    >
                      <span
                        aria-label="download"
                        class="anticon anticon-download"
                        role="img"
                      >
                        <svg
                          aria-hidden="true"
                          data-icon="download"
                          fill="currentColor"
                          focusable="false"
                          height="1em"
                          viewBox="64 64 896 896"
                          width="1em"
                        >
                          <path
                            d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
                          />
                        </svg>
                      </span>
                      <span>
                        BB CONSÓRCIOS
                      </span>
                    </button>
                  </a>
                </div>
              </td>
            </tr>
          `);
        });
      });

      describe('when clicking historico', () => {
        beforeEach(async () => {
          await userEvent.click(getButtonWithName(/histórico/i));
        });

        it('renders a historico dialog', () => {
          expect(getTextInDialog(/histórico/i)).toBeInTheDocument();
        });

        describe('inside the historico dialog', () => {
          it('renders a dados da procuração block', () => {
            expect(getTextInDialog(/dados da procuração/i)).toBeInTheDocument();
          });

          it('renders tipo da procuracao', () => {
            expect(getTextInDialog('PÚBLICA')).toBeInTheDocument();
          });

          it('renders cartorio da procuracao', () => {
            expect(getTextInDialog('cartorio teste4')).toBeInTheDocument();
          });

          it('renders livro da procuracao', () => {
            expect(getTextInDialog('livro teste4')).toBeInTheDocument();
          });

          it('renders folha da procuracao', () => {
            expect(getTextInDialog('folha teste4')).toBeInTheDocument();
          });

          it('renders vigencia da procuracao', () => {
            expect(
              getTextInDialog('23/05/2022 a 01/12/2021'),
            ).toBeInTheDocument();
          });

          it('renders subsidiarias da procuracao', () => {
            expect(
              getTextInDialog('BB, BB CARTOES e BB CONSÓRCIOS'),
            ).toBeInTheDocument();
          });

          it('renders outorgante da procuracao', () => {
            expect(
              getTextInDialog('F1111142 - nome teste4.2 (cargo teste4.2)'),
            ).toBeInTheDocument();
          });
        });
      });
    });

    describe('with procuracao nao agregada', () => {
      beforeEach(() => {
        // @ts-ignore
        globalThis.fetchSpy.mockResolvedValue([]);

        renderWithRedux(
          <PesquisasContext>
            <AcordeaoProcuracoes
              outorgados={[cloneDeep(outorgadoComProcuracaoNaoAgregada)]}
              ItemAcordeao={ItemAcordeao}
            />
          </PesquisasContext>,
          { withMemoryRouter: true },
        );
      });

      it('calls the gerenciar/acessos API', async () => {
        expect(globalThis.fetchSpy).toHaveBeenCalledWith(
          FETCH_METHODS.GET,
          'procuracoes/gerenciar/acessos',
        );
      });

      it('calls the solicitacoes api for each subsidiaria', async () => {
        const callAcessos = 1;
        const callsSolicitacoes =
          outorgadoComProcuracaoNaoAgregada.procuracao[0].subsidiarias.map(
            (s) => s.procuracaoId,
          );
        expect(globalThis.fetchSpy).toHaveBeenCalledTimes(
          callAcessos + callsSolicitacoes.length,
        );
        callsSolicitacoes.forEach((id) =>
          expect(globalThis.fetchSpy).toHaveBeenCalledWith(
            FETCH_METHODS.GET,
            `procuracoes/solicitacoes/${id}`,
            {},
          ),
        );
      });

      it('renders the table', async () => {
        const { CollapsePanelHeader } = extractAcordeaoItemData(
          // @ts-ignore
          outorgadoComProcuracaoNaoAgregada,
        );
        expect(screen.getByText(CollapsePanelHeader)).toBeInTheDocument();
      });

      describe('within the rendered table', () => {
        it('renders rows of data plus header', () => {
          const table = screen.getByRole('table');
          const rows = within(table).getAllByRole('row');
          expect(rows.length).toBe(
            outorgadoComProcuracaoNaoAgregada.procuracao[0].subsidiarias
              .length + 1,
          );
        });

        it('renders the table rows', () => {
          const table = screen.getByRole('table');
          const rows = within(table).getAllByRole('row');
          /**
           * testes com snapshot quebram facilmente
           *
           * se houver erro, verifique as diferenças do snapshot se é algo vindo de components
           * do antd ou se é algo que não está sendo renderizado ou sendo renderizado a mais
           */
          expect(rows[0]).toMatchInlineSnapshot(`
            <tr>
              <th
                class="ant-table-cell"
              >
                Subsidiária Representada
              </th>
              <th
                class="ant-table-cell"
              >
                Vencimento
              </th>
              <th
                class="ant-table-cell"
              >
                Outorgante
              </th>
              <th
                class="ant-table-cell"
              >
                Manifesto
              </th>
              <th
                class="ant-table-cell"
              >
                Ações
              </th>
            </tr>
          `);
          expect(rows[1]).toMatchInlineSnapshot(`
            .c0 {
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: flex;
              -webkit-align-items: center;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              -webkit-flex-wrap: wrap;
              -ms-flex-wrap: wrap;
              flex-wrap: wrap;
              gap: 0.5em;
            }

            <tr
              class="ant-table-row ant-table-row-level-0"
              data-row-key="43"
            >
              <td
                class="ant-table-cell"
              >
                BB
              </td>
              <td
                class="ant-table-cell"
              >
                01/12/2021
              </td>
              <td
                class="ant-table-cell"
              >
                BANCO DO BRASIL S.A.
              </td>
              <td
                class="ant-table-cell"
              >
                24/05/2022
              </td>
              <td
                class="ant-table-cell"
              >
                <div
                  class="c0"
                >
                  <a
                    download=""
                    href="teste3.1.3?token=mock token"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <button
                      class="ant-btn ant-btn-default ant-btn-sm"
                      type="button"
                    >
                      <span
                        aria-label="download"
                        class="anticon anticon-download"
                        role="img"
                      >
                        <svg
                          aria-hidden="true"
                          data-icon="download"
                          fill="currentColor"
                          focusable="false"
                          height="1em"
                          viewBox="64 64 896 896"
                          width="1em"
                        >
                          <path
                            d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
                          />
                        </svg>
                      </span>
                      <span>
                        BB
                      </span>
                    </button>
                  </a>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="clock-circle"
                      class="anticon anticon-clock-circle"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="clock-circle"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="64 64 896 896"
                        width="1em"
                      >
                        <path
                          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                        />
                        <path
                          d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"
                        />
                      </svg>
                    </span>
                    <span>
                      Histórico
                    </span>
                  </button>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
                    disabled=""
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="form"
                      class="anticon anticon-form"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="form"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="64 64 896 896"
                        width="1em"
                      >
                        <path
                          d="M904 512h-56c-4.4 0-8 3.6-8 8v320H184V184h320c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-4.4-3.6-8-8-8z"
                        />
                        <path
                          d="M355.9 534.9L354 653.8c-.1 8.9 7.1 16.2 16 16.2h.4l118-2.9c2-.1 4-.9 5.4-2.3l415.9-415c3.1-3.1 3.1-8.2 0-11.3L785.4 114.3c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-415.8 415a8.3 8.3 0 00-2.3 5.6zm63.5 23.6L779.7 199l45.2 45.1-360.5 359.7-45.7 1.1.7-46.4z"
                        />
                      </svg>
                    </span>
                    <span>
                      Gerenciar
                    </span>
                  </button>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="shopping-cart"
                      class="anticon anticon-shopping-cart"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="shopping-cart"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="0 0 1024 1024"
                        width="1em"
                      >
                        <path
                          d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 00-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 100 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 00-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 00-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6z"
                        />
                      </svg>
                    </span>
                    <span>
                      Solicitações
                    </span>
                  </button>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost ant-btn-dangerous"
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="warning"
                      class="anticon anticon-warning"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="warning"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="64 64 896 896"
                        width="1em"
                      >
                        <path
                          d="M464 720a48 48 0 1096 0 48 48 0 10-96 0zm16-304v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8zm475.7 440l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zm-783.5-27.9L512 239.9l339.8 588.2H172.2z"
                        />
                      </svg>
                    </span>
                    <span>
                      Pedir Revogação
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          `);
          expect(rows[2]).toMatchInlineSnapshot(`
            .c0 {
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: flex;
              -webkit-align-items: center;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              -webkit-flex-wrap: wrap;
              -ms-flex-wrap: wrap;
              flex-wrap: wrap;
              gap: 0.5em;
            }

            <tr
              class="ant-table-row ant-table-row-level-0"
              data-row-key="38"
            >
              <td
                class="ant-table-cell"
              >
                BB CARTOES
              </td>
              <td
                class="ant-table-cell"
              >
                01/12/2021
              </td>
              <td
                class="ant-table-cell"
              >
                BB ADMINISTRADORA DE CARTOES DE CREDITO S.A.
              </td>
              <td
                class="ant-table-cell"
              >
                01/12/2021
              </td>
              <td
                class="ant-table-cell"
              >
                <div
                  class="c0"
                >
                  <a
                    download=""
                    href="teste3.1.1?token=mock token"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <button
                      class="ant-btn ant-btn-default ant-btn-sm"
                      type="button"
                    >
                      <span
                        aria-label="download"
                        class="anticon anticon-download"
                        role="img"
                      >
                        <svg
                          aria-hidden="true"
                          data-icon="download"
                          fill="currentColor"
                          focusable="false"
                          height="1em"
                          viewBox="64 64 896 896"
                          width="1em"
                        >
                          <path
                            d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
                          />
                        </svg>
                      </span>
                      <span>
                        BB CARTOES
                      </span>
                    </button>
                  </a>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="clock-circle"
                      class="anticon anticon-clock-circle"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="clock-circle"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="64 64 896 896"
                        width="1em"
                      >
                        <path
                          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                        />
                        <path
                          d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"
                        />
                      </svg>
                    </span>
                    <span>
                      Histórico
                    </span>
                  </button>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
                    disabled=""
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="form"
                      class="anticon anticon-form"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="form"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="64 64 896 896"
                        width="1em"
                      >
                        <path
                          d="M904 512h-56c-4.4 0-8 3.6-8 8v320H184V184h320c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-4.4-3.6-8-8-8z"
                        />
                        <path
                          d="M355.9 534.9L354 653.8c-.1 8.9 7.1 16.2 16 16.2h.4l118-2.9c2-.1 4-.9 5.4-2.3l415.9-415c3.1-3.1 3.1-8.2 0-11.3L785.4 114.3c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-415.8 415a8.3 8.3 0 00-2.3 5.6zm63.5 23.6L779.7 199l45.2 45.1-360.5 359.7-45.7 1.1.7-46.4z"
                        />
                      </svg>
                    </span>
                    <span>
                      Gerenciar
                    </span>
                  </button>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="shopping-cart"
                      class="anticon anticon-shopping-cart"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="shopping-cart"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="0 0 1024 1024"
                        width="1em"
                      >
                        <path
                          d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 00-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 100 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 00-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 00-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6z"
                        />
                      </svg>
                    </span>
                    <span>
                      Solicitações
                    </span>
                  </button>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost ant-btn-dangerous"
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="warning"
                      class="anticon anticon-warning"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="warning"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="64 64 896 896"
                        width="1em"
                      >
                        <path
                          d="M464 720a48 48 0 1096 0 48 48 0 10-96 0zm16-304v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8zm475.7 440l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zm-783.5-27.9L512 239.9l339.8 588.2H172.2z"
                        />
                      </svg>
                    </span>
                    <span>
                      Pedir Revogação
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          `);
          expect(rows[3]).toMatchInlineSnapshot(`
            .c0 {
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: flex;
              -webkit-align-items: center;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              -webkit-flex-wrap: wrap;
              -ms-flex-wrap: wrap;
              flex-wrap: wrap;
              gap: 0.5em;
            }

            <tr
              class="ant-table-row ant-table-row-level-0"
              data-row-key="42"
            >
              <td
                class="ant-table-cell"
              >
                BB CONSÓRCIOS
              </td>
              <td
                class="ant-table-cell"
              >
                01/12/2021
              </td>
              <td
                class="ant-table-cell"
              >
                BB CONSÓRCIOS S.A.
              </td>
              <td
                class="ant-table-cell"
              >
                24/04/2022
              </td>
              <td
                class="ant-table-cell"
              >
                <div
                  class="c0"
                >
                  <a
                    download=""
                    href="teste3.1.2?token=mock token"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <button
                      class="ant-btn ant-btn-default ant-btn-sm"
                      type="button"
                    >
                      <span
                        aria-label="download"
                        class="anticon anticon-download"
                        role="img"
                      >
                        <svg
                          aria-hidden="true"
                          data-icon="download"
                          fill="currentColor"
                          focusable="false"
                          height="1em"
                          viewBox="64 64 896 896"
                          width="1em"
                        >
                          <path
                            d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
                          />
                        </svg>
                      </span>
                      <span>
                        BB CONSÓRCIOS
                      </span>
                    </button>
                  </a>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="clock-circle"
                      class="anticon anticon-clock-circle"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="clock-circle"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="64 64 896 896"
                        width="1em"
                      >
                        <path
                          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                        />
                        <path
                          d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"
                        />
                      </svg>
                    </span>
                    <span>
                      Histórico
                    </span>
                  </button>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
                    disabled=""
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="form"
                      class="anticon anticon-form"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="form"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="64 64 896 896"
                        width="1em"
                      >
                        <path
                          d="M904 512h-56c-4.4 0-8 3.6-8 8v320H184V184h320c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-4.4-3.6-8-8-8z"
                        />
                        <path
                          d="M355.9 534.9L354 653.8c-.1 8.9 7.1 16.2 16 16.2h.4l118-2.9c2-.1 4-.9 5.4-2.3l415.9-415c3.1-3.1 3.1-8.2 0-11.3L785.4 114.3c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-415.8 415a8.3 8.3 0 00-2.3 5.6zm63.5 23.6L779.7 199l45.2 45.1-360.5 359.7-45.7 1.1.7-46.4z"
                        />
                      </svg>
                    </span>
                    <span>
                      Gerenciar
                    </span>
                  </button>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="shopping-cart"
                      class="anticon anticon-shopping-cart"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="shopping-cart"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="0 0 1024 1024"
                        width="1em"
                      >
                        <path
                          d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 00-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 100 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 00-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 00-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6z"
                        />
                      </svg>
                    </span>
                    <span>
                      Solicitações
                    </span>
                  </button>
                  <button
                    class="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost ant-btn-dangerous"
                    style="background-color: white;"
                    type="button"
                  >
                    <span
                      aria-label="warning"
                      class="anticon anticon-warning"
                      role="img"
                    >
                      <svg
                        aria-hidden="true"
                        data-icon="warning"
                        fill="currentColor"
                        focusable="false"
                        height="1em"
                        viewBox="64 64 896 896"
                        width="1em"
                      >
                        <path
                          d="M464 720a48 48 0 1096 0 48 48 0 10-96 0zm16-304v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8zm475.7 440l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zm-783.5-27.9L512 239.9l339.8 588.2H172.2z"
                        />
                      </svg>
                    </span>
                    <span>
                      Pedir Revogação
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          `);
        });
      });

      describe('when clicking historico', () => {
        beforeEach(async () => {
          const firstDataRow = screen.getAllByRole('row')[1];
          await userEvent.click(
            within(firstDataRow).getByRole('button', { name: /histórico/i }),
          );
        });

        it('renders a historico dialog', () => {
          expect(getTextInDialog(/histórico/i)).toBeInTheDocument();
        });

        describe('inside the historico dialog', () => {
          it('renders a dados da procuração block', () => {
            expect(getTextInDialog(/dados da procuração/i)).toBeInTheDocument();
          });

          it('renders tipo da procuracao', () => {
            expect(getTextInDialog('PÚBLICA')).toBeInTheDocument();
          });

          it('renders cartorio da procuracao', () => {
            expect(getTextInDialog('cartorio teste3.1.3')).toBeInTheDocument();
          });

          it('renders livro da procuracao', () => {
            expect(getTextInDialog('livro teste3.1.3')).toBeInTheDocument();
          });

          it('renders folha da procuracao', () => {
            expect(getTextInDialog('folha teste3.1.3')).toBeInTheDocument();
          });

          it('renders vigencia da procuracao', () => {
            expect(
              getTextInDialog('24/05/2022 a 01/12/2021'),
            ).toBeInTheDocument();
          });

          it('dont render subsidiarias da procuracao', () => {
            expect(
              screen.queryByText(/subsidiárias:/i),
            ).not.toBeInTheDocument();
          });

          it('dont render outorgante da procuracao', () => {
            expect(screen.queryByText(/outorgante:/i)).not.toBeInTheDocument();
          });
        });
      });
    });
  });

  describe('<ItemAcordeao />', () => {
    describe('when item without procuracao', () => {
      beforeEach(() => {
        // usando o mockImplementation porque estava resolvendo muito rápido
        globalThis.fetchSpy.mockImplementation(
          async () =>
            // @ts-ignore
            new Promise((resolve) => {
              setTimeout(
                // @ts-ignore
                () => resolve(outorgadoComProcuracaoNaoAgregada.procuracao),
                0,
              );
            }),
        );

        renderWithRedux(
          <PesquisasContext>
            <AcordeaoProcuracoes
              outorgados={[cloneDeep(outorgadoSemProcuracao)]}
              ItemAcordeao={ItemAcordeao}
            />
          </PesquisasContext>,
          { withMemoryRouter: true },
        );
      });

      it('had the loading component', async () => {
        await waitFor(() => {
          expect(screen.getByLabelText('loading')).toBeInTheDocument();
        });
      });

      it('has the header already rendered', async () => {
        await waitFor(() => {
          const { CollapsePanelHeader } = extractAcordeaoItemData(
            // @ts-ignore
            outorgadoSemProcuracao,
          );
          expect(screen.getByText(CollapsePanelHeader)).toBeInTheDocument();
        });
      });

      it('has called the API', async () => {
        await waitFor(() => {
          expect(globalThis.fetchSpy).toHaveBeenCalledTimes(2);
        });

        expect(globalThis.fetchSpy).toHaveBeenNthCalledWith(
          1,
          FETCH_METHODS.GET,
          '/procuracoes/pesquisa',
          {
            idProxy: outorgadoSemProcuracao.idProxy,
            idProcuracao: outorgadoSemProcuracao.idProcuracao,
          },
        );

        expect(globalThis.fetchSpy).toHaveBeenNthCalledWith(
          2,
          FETCH_METHODS.GET,
          'procuracoes/gerenciar/acessos',
        );
      });

      describe('adter the API finish calling', () => {
        beforeEach(async () => {
          await waitFor(() => {
            expect(screen.queryByLabelText('loading')).not.toBeInTheDocument();
          });
        });

        it('renders the table rows with header', () => {
          const table = screen.getByRole('table');
          const rows = within(table).getAllByRole('row');
          expect(rows.length).toBe(
            outorgadoComProcuracaoNaoAgregada.procuracao[0].subsidiarias
              .length + 1,
          );
        });
      });
    });

    describe('when an error happens while loading', () => {
      const errorMessage = 'my error';
      beforeEach(() => {
        // usando o mockImplementation porque estava resolvendo muito rápido
        globalThis.fetchSpy.mockImplementation(
          async () =>
            // @ts-ignore
            new Promise((_, reject) => {
              setTimeout(() => reject(errorMessage), 0);
            }),
        );

        render(
          <AcordeaoProcuracoes
            outorgados={[cloneDeep(outorgadoSemProcuracao)]}
            ItemAcordeao={ItemAcordeao}
          />,
        );
      });

      it('has the loading component', async () => {
        await waitFor(() => {
          expect(screen.getByLabelText('loading')).toBeInTheDocument();
        });
      });

      it('has the header already rendered', async () => {
        await waitFor(() => {
          const { CollapsePanelHeader } = extractAcordeaoItemData(
            // @ts-ignore
            outorgadoSemProcuracao,
          );
          expect(screen.getByText(CollapsePanelHeader)).toBeInTheDocument();
        });
      });

      it('has called the API', async () => {
        await waitFor(() => {
          expect(globalThis.fetchSpy).toHaveBeenCalledTimes(1);
        });
        expect(globalThis.fetchSpy).toHaveBeenCalledWith(
          FETCH_METHODS.GET,
          '/procuracoes/pesquisa',
          {
            idProxy: outorgadoSemProcuracao.idProxy,
            idProcuracao: outorgadoSemProcuracao.idProcuracao,
          },
        );
      });

      describe('adter the API finish calling', () => {
        beforeEach(async () => {
          await waitFor(() => {
            expect(screen.queryByLabelText('loading')).not.toBeInTheDocument();
          });
        });

        it('renders the error message', () => {
          expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
      });
    });
  });
});
