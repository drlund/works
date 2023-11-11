import React from "react";
import { Link } from "react-router-dom";

import { EyeOutlined } from "@ant-design/icons";

const commonColumns = [
  { title: "Id", dataIndex: "id" },
  {
    title: "MCI",
    dataIndex: "mci",
  },
  {
    title: "Cliente",
    dataIndex: "nomeCliente",
  },
  {
    title: "Solicitante",
    dataIndex: "solicitante",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Ações",
    width: "10%",
    align: "center",
    render: (text, record) => {
      return (
        <span>
          <Link to={`/encantar/aprovar-solicitacao/${record.id}`}>
            <EyeOutlined className="link-color" />
          </Link>
        </span>
      );
    },
  },
];

export default commonColumns;
