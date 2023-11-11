const columnsVisaoMtn = [
  {
    title: "Id",
    render: (record, text) => {
      return `${record.mtn.id}`;
    },
    sorter: false,
  },
  {
    title: "Nr. MTN",
    render: (record, text) => {
      return `${record.mtn.nrMtn}`;
    },
    sorter: false,
  },
  {
    title: "Envolvido",
    render: (record, text) => {
      return `${record.matricula} - ${record.nomeFunci}`;
    },
    sorter: false,
  },
  {
    title: "Prefixo",
    render: (record, text) => {
      return `${record.mtn.prefixo} - ${record.mtn.nomePrefixo}`;
    },
    sorter: false,
  },
  {
    title: "Instância",
    render: (record, text) => {

      if(record.instancia === 'ENVOLVIDO'){
        return "Envolvido" ;
      }

      if((record.instancia === 'SUPER' || record.instancia === null ) && record.respondido_em !== null){
        return "Finalizado"
      }
      return 'Super';
    },
    sorter: false,
  },
  {
    title: "Medida Aplicada",
    render: (record, text) => record.medida ? record.medida.txtMedida : "Não se Aplica",
    sorter: false,
  },
  {
    title: "Visão",
    dataIndex: "visao",
    sorter: false,
  },
  {
    dataIndex: "criacaoOcorrencia",
    title: 'Criação MTN',    
    sorter: false,
  },
  
];

export default columnsVisaoMtn;
