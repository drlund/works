import { Button, Col, Divider, Row, Typography } from 'antd';
import { useState } from 'react';
import { useSpinning } from '@/components/SpinningContext';
import { ListaProcuracoes } from './ListaProcuracoes';
import { MatriculaInputSearch } from './MatriculaInputSearch';
import { MatriculasTextArea } from './MatriculasTextArea';
import { ModalLoteRevogacao } from './ModalLoteRevogacao';
import { handleMatriculaSearch } from './handleMatriculaSearch';
import { fetchProcuracoesARevogar } from './handleMatriculaSearch/fetchOutorgados';

export function RevogacaoMassificadaContent() {
  const { setLoading } = useSpinning();

  const [fromPesquisa, setFromPesquisa] = useState(false);
  const [listas, setListas] = useState(/** @type {import('.').ListaRevogacaoMassificada} */({
    outorgados: {},
    fetchingMatriculas: {},
  }));

  /**
   * @param {string} matricula
   * @param {number} idProcuracao
   */
  const handleRemove = (matricula, idProcuracao) => {
    setListas((old) => {
      const outorgado = old.outorgados[matricula];

      if (!outorgado) {
        return old;
      }

      if (!Array.isArray(outorgado) || !idProcuracao) {
        Reflect.deleteProperty(old.outorgados, matricula);
      }

      const newOutorgado = /** @type {import('.').PesquisaOk[]} */ (outorgado).filter((o) => o.idProcuracao !== idProcuracao);

      if (newOutorgado.length === 0) {
        Reflect.deleteProperty(old.outorgados, matricula);
      } else {
        old.outorgados[matricula] = newOutorgado;
      }

      return {
        ...old,
      };
    });
  };

  const handleAdd = (/** @type {import('.').ListaRevogacaoMassificada['outorgados']} */ newOutorgados) => {
    Object.values(newOutorgados).forEach((listaPesquisa) => {
      listaPesquisa.forEach((p) => {
        setListas((old) => {
          const outorgado = old.outorgados[p.matricula];

          if (outorgado) {
            outorgado.push(p);
          } else {
            old.outorgados[p.matricula] = [p];
          }

          return { ...old };
        });

      });
    });

  };

  /**
   * @param {string|string[]} value
   * @param {Function} [cb] para quando terminar a adição
   */
  const handleOnSearch = (value, cb = () => { }) => {
    handleMatriculaSearch(setListas, value, handleAdd);
    cb();
  };

  const handleGetFromPesquisa = async () => {
    setLoading(true);
    fetchProcuracoesARevogar()
      .then(handleAdd)
      .finally(() => setLoading(false));
    setFromPesquisa(true);
  };

  const handleConfirm = () => {
    setListas((old) => {
      Object.entries(old.outorgados).forEach(([m, p]) => {
        const withError = p.filter((i) => /** @type {import('.').PesquisaError} */(i).error);
        if (withError.length === 0) {
          Reflect.deleteProperty(old.outorgados, m);
        } else {
          old.outorgados[m] = withError;
        }
      });

      return { ...old };
    });
  };

  return (
    <Row gutter={[0, 20]} style={{ justifyContent: "space-between" }}>
      <Col style={{ minWidth: '25%', maxWidth: '300px' }}>
        <Button
          onClick={handleGetFromPesquisa}
          style={{ width: '100%' }}
          disabled={fromPesquisa}
        >
          Adicionar de Pesquisa
        </Button>
        <Divider />
        <Typography.Paragraph>
          Cole a lista de matrículas ou adicione um a um:
        </Typography.Paragraph>
        <MatriculasTextArea handleOnSearch={handleOnSearch} />
        <Divider />
        <MatriculaInputSearch handleOnSearch={handleOnSearch} />
        <Divider />
        <ModalLoteRevogacao
          listas={listas}
          cb={handleConfirm}
        />
      </Col>

      <Col style={{ maxWidth: "calc(95% - max(25%, 300px))" }}>
        <ListaProcuracoes
          listas={listas}
          handleRemove={handleRemove}
        />
      </Col>
    </Row>
  );
}
