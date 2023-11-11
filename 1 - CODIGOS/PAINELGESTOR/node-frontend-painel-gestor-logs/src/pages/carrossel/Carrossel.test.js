// @ts-nocheck
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, within } from '@testing-library/react';
import moment from 'moment';
import { FETCH_METHODS } from 'services/apis/GenericFetch';
import { mockFormData } from '../../../test/mockFormData';
import Carrossel from '.';
import { selectInDatePicker } from '../../../test/antdTestUtils';

const brlDateToDateString = (date) => moment(date).format('DD/MM/YYYY');

// isso evita falhar alguns testes que as vezes são timeout
jest.setTimeout(60000);

describe('<Carrossel>', () => {

  beforeEach(() => {
    mockFormData();
    render(<Carrossel />);
  });

  afterEach(() => {
    // resetando conteúdo renderizado
    // alguns dialogs e modais estavam persistindo no documento de teste
    document.body.innerHTML = "";
  });

  describe('pagina inicial', () => {
    it('renderiza a pagina', async () => {
      expect(screen.getByRole('heading', {
        name: /Gestão do Carrossel de Notícias/i
      })).toBeInTheDocument();
    });

    it('renderiza menu', async () => {
      expect(screen.getByRole('button', {
        name: /Principal/i
      })).toBeInTheDocument();

      expect(screen.getByRole('button', {
        name: /Listar Programação/i
      })).toBeInTheDocument();

      expect(screen.getByRole('button', {
        name: /Incluir Vídeo/i
      })).toBeInTheDocument();
    });

    it('renderiza texto de apresentação', async () => {
      expect(screen.getByText(/Nesta ferramenta você poderá incluir e programar os vídeos que são disponibilizados através das televisões da Sede da Super ADM./)).toBeInTheDocument();
    });
  });

  describe('lista programação', () => {
    const mockListaVideos = [
      {
        id: 1,
        urlVideo: "mock1.mp4",
        dataInicioReproducao: "2023-01-30T03:00:00.000Z",
        dataFimReproducao: "2023-01-30T03:00:00.000Z",
        matriculaFunci: "mock matricula 1",
        nomeFunci: "mock nome 1",
        ativo: "1",
        createdAt: "2023-01-27 17:07:45",
        updatedAt: "2023-01-27 17:07:45"
      },
      {
        id: 2,
        urlVideo: "mock2.mp4",
        dataInicioReproducao: "2022-10-23T03:00:00.000Z",
        dataFimReproducao: "2022-10-20T03:00:00.000Z",
        matriculaFunci: "mock matricula 2",
        nomeFunci: "mock nome 2",
        ativo: "1",
        createdAt: "2022-10-20 16:34:11",
        updatedAt: "2022-10-20 16:34:11"
      },
    ];

    describe('usuário com acesso', () => {
      beforeEach(async () => {
        globalThis.fetchSpy.mockResolvedValue(mockListaVideos);
        await userEvent.click(
          screen.getByRole('button', {
            name: /Listar Programação/i
          })
        );
      });

      it('renderiza lista de vídeos', async () => {
        expect(screen.queryByRole('heading', {
          name: /Gestão do Carrossel de Notícias/i
        })).not.toBeInTheDocument();
        expect(screen.getByRole('heading', {
          name: /Listar Programação/i
        })).toBeInTheDocument();

        mockListaVideos.forEach((video) => {
          const cols = [
            brlDateToDateString(video.dataInicioReproducao),
            video.urlVideo,
            video.nomeFunci,
            brlDateToDateString(video.createdAt),
          ];

          cols.forEach((col) => {
            expect(screen.getByRole('cell', {
              name: col
            })).toBeInTheDocument();
          });
        });
      });

      describe('edita um video', () => {
        const modal = () => screen.getByRole('dialog');
        const getDataInput = () => within(screen.getByRole('dialog')).getByRole('textbox', {
          name: /Data de Reprodução do Vídeo/i
        });

        beforeEach(async () => {
          const primeiroBotaoEditar = screen.getAllByRole('button', {
            name: /Editar/i
          })[0];
          await userEvent.click(primeiroBotaoEditar);
        });

        it('renderiza modal', async () => {
          expect(modal()).toBeInTheDocument();
        });

        it('carrega a data de reprodução do vídeo', async () => {
          expect(getDataInput()).toHaveValue(brlDateToDateString(mockListaVideos[0].dataInicioReproducao));

        });

        describe('atualiza data de reprodução do vídeo', () => {
          beforeEach(async () => {
            await selectInDatePicker(getDataInput, '11/11/2222');

            expect(getDataInput()).toHaveValue('11/11/2222');

            globalThis.fetchSpy.mockResolvedValue({
              ...mockListaVideos[0],
              dataInicioReproducao: "2222-11-11T03:00:00.000Z",
            });
          });

          describe('clica em salvar', () => {
            beforeEach(async () => {
              await userEvent.click(screen.getByRole('button', {
                name: /Salvar/i
              }));
            });

            it('fecha modal', async () => {
              await waitFor(() => {
                expect(screen.queryByRole('dialog', {
                  name: /Editar Vídeo/i
                })).not.toBeInTheDocument();
              });
            });

            it('chama api updateVideo', async () => {
              expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
                FETCH_METHODS.POST,
                "/carrossel/updateVideo",
                { id: 1, novaDataInicioReproducao: "2222-11-11" }
              );
            });
          });
        });
      });

      describe('deleta um video', () => {
        beforeEach(async () => {
          const primeiroBotaoExcluir = screen.getAllByRole('button', {
            name: /Excluir/i
          })[0];
          await userEvent.click(primeiroBotaoExcluir);

          await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
          });
        });

        it('renderiza modal', async () => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('renderiza texto de confirmação', async () => {
          expect(screen.getByText(`Confirma a exclusão do vídeo ${mockListaVideos[0].urlVideo}?`)).toBeInTheDocument();
        });

        describe('clica em confirmar', () => {
          beforeEach(async () => {
            await userEvent.click(screen.getByRole('button', {
              name: /Sim/i
            }));

            await waitFor(() => {
              expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            });
          });

          it('renderiza apenas uma linha da tabela', async () => {
            const tbody = screen.getAllByRole('rowgroup')[1];
            const newLength = mockListaVideos.length - 1;
            expect(within(tbody).getAllByRole('row')).toHaveLength(newLength);
          });

          it('fecha modal', async () => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
          });

          it('chama api deleteVideo', async () => {
            expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
              FETCH_METHODS.POST,
              "/carrossel/deleteVideo",
              { id: 1 });
          });
        });
      });
    });

    describe('usuário sem acesso', () => {
      beforeEach(async () => {
        globalThis.fetchSpy.mockRejectedValue(true);
        await userEvent.click(
          screen.getByRole('button', {
            name: /Listar Programação/i
          })
        );
      });

      it('apresenta aviso', async () => {
        await waitFor(() => {
          expect(screen.getByText('Você não tem permissão para acessar esta funcionalidade.')).toBeInTheDocument();
        });
      });
    });
  });

  describe('inclui novo vídeo', () => {
    beforeEach(async () => {
      await userEvent.click(
        screen.getByRole('button', {
          name: /Incluir Vídeo/i
        })
      );
    });

    it('renderiza formulário de inclusão', async () => {
      expect(screen.queryByRole('heading', {
        name: /Gestão do Carrossel de Notícias/i
      })).not.toBeInTheDocument();
      expect(screen.getByRole('heading', {
        name: /Incluir Vídeo/i
      })).toBeInTheDocument();
    });

    describe('inclui informações no formulário', () => {
      const getDataInput = () => screen.getByRole('textbox', {
        name: /data de reprodução do vídeo/i
      });

      beforeEach(async () => {
        await selectInDatePicker(getDataInput, '06/02/2023');
        await userEvent.upload(
          screen.getByTestId('uploadCarrossel'),
          new File(['mockFile'], 'mock99.mp4', { type: 'video/mp4' }),
        );
      });

      it('seleciona data', async () => {
        expect(getDataInput()).toHaveValue('06/02/2023');
      });

      it('faz upload do vídeo', async () => {
        expect(screen.getByText('mock99.mp4'));
      });

      describe('clica em enviar', () => {
        beforeEach(async () => {
          await userEvent.click(
            screen.getByRole('button', {
              name: /enviar/i
            })
          );
        });

        describe('usuário com acesso', () => {
          it('chama api postVideo', async () => {
            expect(globalThis.fetchSpy).toHaveBeenCalledTimes(1);
            expect(globalThis.fetchSpy).toHaveBeenCalledWith(
              FETCH_METHODS.POST,
              'carrossel/postVideo',
              expect.objectContaining({
                formData: {
                  dataInicioReproducao: new Date('2023-02-06 00:00'),
                  file: expect.objectContaining({
                    uid: expect.stringContaining('rc-upload')
                  })
                }
              }),
              { headers: { "Content-Type": "multipart/form-data; boundary=500;" } }
            );
          });

          it.todo('renderiza mensagem de sucesso');
        });

        describe('usuário sem acesso', () => {
          it.todo('renderiza mensagem de usuário sem acesso');
        });
      });
    });
  });
});