/**
 * @param {{[key: string]: string}} fieldsMap
 */
export function makeToolbar(fieldsMap) {
  /**
   * @param {string} tools
   */
  return (tools) => {
    // agrupa com base nas chaves
    // se tem o ! ou não é parte de um objeto fica num grupo
    // o resto é segundo o grupo do objetos (outorgado, outorgante...)
    const reduced = Object
      .entries(fieldsMap)
      .reduce((acc, entry) => {
        const [key] = entry;
        /** chaves que não podem ser alteradas (!) */
        const immutableKey = key.includes('!');
        /** chaves que são opcionais (?) */
        const optionalKey = key.includes('?');
        const objectKey = key.includes('.');

        if (immutableKey || optionalKey) {
          acc.rest.push(entry);
        } else if (objectKey) {
          const [field] = key.split('.');
          if (!acc[field]) {
            acc[field] = [entry];
          } else {
            acc[field].push(entry);
          }
        } else {
          acc.rest.push(entry);
        }

        return acc;
      },
        /**
         * @type {{
         *  rest: [string,string][],
         *  [key: string]: [string,string][]
         * }}
         */ ({
          rest: []
        })
      );

    // retorna uma string para cada grupo
    // fazendo a ordenação pelo nome mostrado
    // cada string gerada vira um row de buttons
    const fieldsMapBlocks = Object
      .values(reduced)
      .map((block) => block
        .sort((a, b) => a[1] > b[1] ? 1 : -1)
        .map(([k]) => k)
        .join('| ')
      );

    return [
      `${Object.keys(fieldsMap).length > 0 ? 'resetButtons' : ''} | ${tools}`,
      ...fieldsMapBlocks
    ];
  };
}
