const Database = use("Database");
module.exports = {
  /**
   *   Conta a quantidade de mtn, de análises e de análises fora do prazo
   *   fonte de dados é a view do mtn criada pelo André
   */
  qtdeTotais: async (prazo, periodo) => {

    const totais = await Database.connection('pgMtn').raw(`
      select count(distinct t1.id) as qtd_mtn,
             count(t1.id) as qtd_analises,
             sum(case when t1.prazo_du > ? then 1 else 0 end) as qtd_fora_prazo
      from novo_mtn.vw_painel_analise_super t1
      where t1.dt_referencia between ? and ?
    `, [prazo, periodo[0], periodo[1]]);
    const qtdTotais = totais.rows[0];

    return qtdTotais;
  },
}