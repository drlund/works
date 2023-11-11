/* eslint-disable no-console */
export function devtoolConsole() {
  if (process.env.NODE_ENV === 'development') {
    const matriculasDev = {
      '1GUN': 'F1705347',
      '2GUN': 'F0743483',
      '3GUN': 'F0099222',
      '1GUT': 'F8718628',
      '2GUT': 'F2326178'
    };

    console.group('Matriculas para teste:');
    console.info('Atualizar essas matriculas para teste caso alguma não funcione!');
    console.table(matriculasDev);
    console.groupEnd();
  }
}
