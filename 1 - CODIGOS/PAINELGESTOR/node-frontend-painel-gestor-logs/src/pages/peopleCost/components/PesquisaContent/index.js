import { Col, Row, Typography } from 'antd';
import { usePeopleCost } from '../PeopleCostContext';
import { EmailsTextArea } from './EmailsTextArea';
import { ListaPorEmail } from './ListaPorEmail';
import { handleFuncisSearch } from './handleFuncisSearch';

export function PesquisaContent() {
  const { setListas } = usePeopleCost();

  /**
   * @param {string} email
   */
  const handleRemove = (email) => {
    setListas((old) => {
      const funci = old.funcis[email];

      if (!funci) {
        return old;
      }

      Reflect.deleteProperty(old.funcis, email);

      return {
        ...old,
      };
    });
  };

  const handleAdd = (/** @type {PeopleCost.ListaEmails['funcis']} */ newFuncis) => {
    Object.values(newFuncis).forEach((funci) => {
      setListas((old) => {
        old.funcis[funci.email] = funci;

        return { ...old };
      });
    });

  };

  /**
   * @param {string|string[]} value
   * @param {Function} [cb] para quando terminar a adição
   */
  const handleOnSearch = (value, cb = () => { }) => {
    handleFuncisSearch(setListas, value, handleAdd);
    cb();
  };

  return (
    <Row gutter={[0, 20]} style={{ justifyContent: "space-between" }}>
      <Col style={{ minWidth: '25%', maxWidth: '300px' }}>
        <Typography.Paragraph>
          Cole a lista de emails ou adicione um a um:
        </Typography.Paragraph>
        <EmailsTextArea handleOnSearch={handleOnSearch} />
      </Col>

      <Col style={{ maxWidth: "calc(95% - max(25%, 300px))" }}>
        <ListaPorEmail
          handleRemove={handleRemove}
        />
      </Col>
    </Row>
  );
}
