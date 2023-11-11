const Database = use("Database");
module.exports = {
  /**
   *   Retorna a lista de análises fora do prazo
   *   fonte de dados é a view do mtn criada pelo André
   */
  listaForaPrazo: async (prazo, periodo) => {

    const analise = await Database.connection("pgMtn").raw(`
    select distinct on (t1.nr_mtn) t1.nr_mtn,
      t1.id,
      t1.prazo_du,
      t1.matricula,
      t1.nome_funci,
      t1.prefixo_ocorrencia,
      t1.nome_prefixo_ocorrencia,
      t1.desc_visao,
      t1.data_criacao,
      t1.evento,
      t1.prazo_du,
      t2.qtd_analises,
      t2.qtd_fora_prazo,
      t1.id_medida,
      t1.textoMedida,
      t1.bbatende
    from novo_mtn.vw_painel_analise_super t1
    left join (
      select distinct t1.nr_mtn,
        count(t1.nr_mtn) as qtd_analises,
        sum(case when t1.prazo_du > ? then 1 else 0 end) as qtd_fora_prazo
      from novo_mtn.vw_painel_analise_super t1
      where t1.dt_referencia between ? and ?
      group by t1.nr_mtn) t2
      on t1.nr_mtn = t2.nr_mtn
    where t1.dt_referencia between ? and ?
    order by t1.nr_mtn asc, t1.prazo_du desc
  `, [prazo, periodo[0], periodo[1], periodo[0], periodo[1]]);
    const analiseForaPrazo = analise.rows;

    return analiseForaPrazo;
  },
}
