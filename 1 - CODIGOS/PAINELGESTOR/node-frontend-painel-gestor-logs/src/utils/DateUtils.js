import moment from "moment";

const primeiroSemestre = [
  moment().month(0).date(1).minutes(0).seconds(0).milliseconds(0),
  moment().month(5).date(30).minutes(0).seconds(0).milliseconds(0),
];

const segundoSemestre = [
  moment().month(6).date(1).minutes(0).seconds(0).milliseconds(0),
  moment().month(11).date(31).minutes(0).seconds(0).milliseconds(0),
];

const arrayMesAtual = [moment().startOf("month"), moment().endOf("month")];

const getSemestreAtual = () => {
  const trimestre = moment().quarter();
  if (trimestre > 2) {
    return segundoSemestre;
  } else {
    return primeiroSemestre;
  }
};

const commonDateRanges = {
  Hoje: [moment(), moment()],
  "Mês Atual": arrayMesAtual,
  "1º Semestre": primeiroSemestre,
  "2º Semestre": segundoSemestre,
  "Semestre Atual": getSemestreAtual(),
};

export {
  getSemestreAtual,
  primeiroSemestre,
  segundoSemestre,
  arrayMesAtual,
  commonDateRanges,
};
