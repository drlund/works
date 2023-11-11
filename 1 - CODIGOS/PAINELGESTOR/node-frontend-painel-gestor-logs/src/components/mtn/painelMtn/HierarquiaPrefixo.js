import React, { useState, useEffect } from "react";
import { Form, Input, Select } from "antd";
import { fetchAllDiretorias } from "services/ducks/Mestre.ducks";

const diretorias = [
  {
    uor_pai: 86684,
    prefixo_pai: "8008",
    nome_pai: "DIREC- CLI. MPE E PF",
    tipologia_pai: "DIRETORIA",
    uor_filha: 20247,
    prefixo_filha: "9879",
    nome_filha: "CLIENTES-MPE",
    tipologia_filha: "UNIDADE",
  },
  {
    uor_pai: 18905,
    prefixo_pai: "8550",
    nome_pai: "DIRCO-CONTROLADORIA",
    tipologia_pai: "DIRETORIA",
    uor_filha: 284297,
    prefixo_filha: "8550",
    nome_filha: "DIRCO/DIAGE",
    tipologia_filha: "DIRETORIA",
  },
  {
    uor_pai: 18908,
    prefixo_pai: "8553",
    nome_pai: "DIJUR-JURIDICA",
    tipologia_pai: "DIRETORIA",
    uor_filha: 19001,
    prefixo_filha: "8645",
    nome_filha: "AJURE SERGIPE",
    tipologia_filha: "AJURE",
  },
  {
    uor_pai: 18911,
    prefixo_pai: "8556",
    nome_pai: "DICRE-CREDITO",
    tipologia_pai: "DIRETORIA",
    uor_filha: 18909,
    prefixo_filha: "8554",
    nome_filha: "DICRE/GEALC",
    tipologia_filha: "GERENCIA EXECUTIVA",
  },
  {
    uor_pai: 18912,
    prefixo_pai: "8557",
    nome_pai: "DIFIN-FINANCAS",
    tipologia_pai: "DIRETORIA",
    uor_filha: 18910,
    prefixo_filha: "8555",
    nome_filha: "DIFIN/GERENCIAS RJ",
    tipologia_filha: "GERENCIA EXECUTIVA",
  },
  {
    uor_pai: 18913,
    prefixo_pai: "8558",
    nome_pai: "DISEC-SUP INFR PATR",
    tipologia_pai: "DIRETORIA",
    uor_filha: 18323,
    prefixo_filha: "7417",
    nome_filha: "CESUP ADM CONTRATOS",
    tipologia_filha: "CENOP",
  },
  {
    uor_pai: 18914,
    prefixo_pai: "8559",
    nome_pai: "DIPES-CULT E PESSOAS",
    tipologia_pai: "DIRETORIA",
    uor_filha: 19330,
    prefixo_filha: "8927",
    nome_filha: "GEPES NORTE",
    tipologia_filha: "GEPES",
  },
  {
    uor_pai: 18946,
    prefixo_pai: "8590",
    nome_pai: "DICOR-CORP BANK",
    tipologia_pai: "DIRETORIA",
    uor_filha: 19941,
    prefixo_filha: "9512",
    nome_filha: "SUPER CORP BANK IV",
    tipologia_filha: "SUPER ATACADO",
  },
  {
    uor_pai: 18948,
    prefixo_pai: "8592",
    nome_pai: "DIVAR-COMERCIAL VAR",
    tipologia_pai: "DIRETORIA",
    uor_filha: 18872,
    prefixo_filha: "8517",
    nome_filha: "SUPER VAR E GOV TO",
    tipologia_filha: "SUPER NEGOCIOS",
  },
  {
    uor_pai: 283210,
    prefixo_pai: "8593",
    nome_pai: "DIGOV/GEREX GEFUP",
    tipologia_pai: "DIRETORIA",
    uor_filha: 19358,
    prefixo_filha: "8955",
    nome_filha: "DIGOV/GEFUP/DIGEP",
    tipologia_filha: "GERENCIA",
  },
  {
    uor_pai: 18951,
    prefixo_pai: "8595",
    nome_pai: "DIRAO-REESTR.ATIVOS",
    tipologia_pai: "DIRETORIA",
    uor_filha: 17442,
    prefixo_filha: "4935",
    nome_filha: "GECOR SERVICOS",
    tipologia_filha: "GECOR",
  },
  {
    uor_pai: 18952,
    prefixo_pai: "8596",
    nome_pai: "DIRAG-AGRONEGOCIOS",
    tipologia_pai: "DIRETORIA",
    uor_filha: 18396,
    prefixo_filha: "8037",
    nome_filha: "GERAG SAO PAULO",
    tipologia_filha: "GERAG",
  },
  {
    uor_pai: 345910,
    prefixo_pai: "8896",
    nome_pai: "DISIN-SEGUR.INST.",
    tipologia_pai: "DIRETORIA",
    uor_filha: 27315,
    prefixo_filha: "8334",
    nome_filha: "GESIN PARANA",
    tipologia_filha: "REROP",
  },
  {
    uor_pai: 464252,
    prefixo_pai: "9010",
    nome_pai: "DIRAC-ATEND. CANAIS",
    tipologia_pai: "DIRETORIA",
    uor_filha: 85893,
    prefixo_filha: "1960",
    nome_filha: "SAC",
    tipologia_filha: "SAC",
  },
  {
    uor_pai: 327809,
    prefixo_pai: "9510",
    nome_pai: "DIREG/GEREX GOVER I",
    tipologia_pai: "DIRETORIA",
    uor_filha: 283575,
    prefixo_filha: "9510",
    nome_filha: "DIREG/GER. PART.EXT.",
    tipologia_filha: "DIRETORIA",
  },
  {
    uor_pai: 19953,
    prefixo_pai: "9568",
    nome_pai: "COGER-CONTADORIA",
    tipologia_pai: "DIRETORIA",
    uor_filha: 283873,
    prefixo_filha: "9568",
    nome_filha: "COGER/GESUB",
    tipologia_filha: "DIRETORIA",
  },
  {
    uor_pai: 19955,
    prefixo_pai: "9572",
    nome_pai: "DICOI-CONTR.INTERNOS",
    tipologia_pai: "DIRETORIA",
    uor_filha: 19957,
    prefixo_filha: "9574",
    nome_filha: "GECOI SAO PAULO I",
    tipologia_filha: "GECOI",
  },
  {
    uor_pai: 19981,
    prefixo_pai: "9599",
    nome_pai: "DIRIS-GESTAO RISCOS",
    tipologia_pai: "DIRETORIA",
    uor_filha: 283016,
    prefixo_filha: "9599",
    nome_filha: "DIRIS/GERIM",
    tipologia_filha: "DIRETORIA",
  },
  {
    uor_pai: 20237,
    prefixo_pai: "9867",
    nome_pai: "DIMEC-MERC.CAP.INFRA",
    tipologia_pai: "DIRETORIA",
    uor_filha: 19342,
    prefixo_filha: "8939",
    nome_filha: "DIMEC/GER INV OPER",
    tipologia_filha: "GERENCIA EXECUTIVA",
  },
  {
    uor_pai: 29373,
    prefixo_pai: "9880",
    nome_pai: "DIMEP-MEIOS PAGAMEN.",
    tipologia_pai: "DIRETORIA",
    uor_filha: 19370,
    prefixo_filha: "8967",
    nome_filha: "CECAR",
    tipologia_filha: "CECAR",
  },
  {
    uor_pai: 371221,
    prefixo_pai: "9897",
    nome_pai: "DINED-NEG. DIGITAIS",
    tipologia_pai: "DIRETORIA",
    uor_filha: 440945,
    prefixo_filha: "9870",
    nome_filha: "LABB",
    tipologia_filha: "LABB",
  },
  {
    uor_pai: 20259,
    prefixo_pai: "9903",
    nome_pai: "DITEC-TECNOLOGIA",
    tipologia_pai: "DIRETORIA",
    uor_filha: 20260,
    prefixo_filha: "9904",
    nome_filha: "DITEC/GEREL",
    tipologia_filha: "GERENCIA EXECUTIVA",
  },
  {
    uor_pai: 24876,
    prefixo_pai: "9951",
    nome_pai: "DISEM-SOLUC EMPRES",
    tipologia_pai: "DIRETORIA",
    uor_filha: 19223,
    prefixo_filha: "8868",
    nome_filha: "COMERCIAL/BB-LEASING",
    tipologia_filha: "GERENCIA EXECUTIVA",
  },
  {
    uor_pai: 29374,
    prefixo_pai: "9973",
    nome_pai: "DIPRO-PRODUTOS PF",
    tipologia_pai: "DIRETORIA",
    uor_filha: 288163,
    prefixo_filha: "4011",
    nome_filha: "GIMOB - IMOBILIARIO",
    tipologia_filha: "GIMOB",
  },
  {
    uor_pai: 20322,
    prefixo_pai: "9984",
    nome_pai: "DIMAC-MARKETING COM.",
    tipologia_pai: "DIRETORIA",
    uor_filha: 18603,
    prefixo_filha: "8244",
    nome_filha: "CCBB RIO DE JANEIRO",
    tipologia_filha: "CCBB",
  },
  {
    uor_pai: 20323,
    prefixo_pai: "9990",
    nome_pai: "DIREO-ESTRAT.ORG.",
    tipologia_pai: "DIRETORIA",
    uor_filha: 439881,
    prefixo_filha: "9928",
    nome_filha: "UGP-GOV. TI PROC.",
    tipologia_filha: "UNIDADE",
  },
];

const renderSelect = (fieldName, placeHolder, prefixos) => {
  return (
    <Select
      showSearch
      name={fieldName}
      style={{ width: "100%" }}
      placeholder={placeHolder}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {prefixos.map((prefixo) => {
        return (
          <Option
            value={prefixo.prefixo_pai}
          >{`${prefixo.prefixo_pai} - ${prefixo.nome_pai}`}</Option>
        );
      })}
    </Select>
  );
};

const HierarquiaPrefixo = (props) => {
  //States
  
  const [arvoreHierarquia, setArvoreHieraquia] = useState([]);
  const [diretorias, setDiretorias] = useState([]);

  //Funções fetch

  const getAllDiretorias = async () => {
    const fetched = await fetchAllDiretorias();
    setDiretorias(fetched);
  }
  //Effects
  useEffect(() => {
    getAllDiretorias();
  }, []);

  return (
    <>
      <Form.Item label="Diretoria">
        {renderSelect("diretoria", "Diretoria", diretorias)}
      </Form.Item>
      <Form.Item label="Super Negocial">
        {renderSelect("superNegocial", "Super Negocial", diretorias)}
      </Form.Item>
      <Form.Item label="Unidade Tática / Operacional">
        <Input />
      </Form.Item>
    </>
  );
};

export default HierarquiaPrefixo;
