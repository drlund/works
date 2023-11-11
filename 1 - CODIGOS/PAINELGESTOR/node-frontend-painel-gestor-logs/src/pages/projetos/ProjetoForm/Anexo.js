import React, { Component } from "react";
import { Form, Typography, Upload, Divider, Button, Space, Tooltip, message } from "antd";
import { InboxOutlined, DeleteOutlined, UndoOutlined, EyeOutlined } from "@ant-design/icons";
import SearchTable from "components/searchtable/SearchTable";
import AlfaSort from "utils/AlfaSort";
import styles from "../projetos.module.css";
import { constantes } from "../Helpers/Constantes";

class Anexo extends Component {
  removeFileFromList = (file, fileList) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    return newFileList;
  }

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  softDeleteAnexosServidor = (idAnexo) => {
    this.props.onUpdateState(
      "anexosServidor",
      this.props.anexosServidor.map( anexo => {
        if( anexo.id === idAnexo ) anexo.ativo = anexo.ativo === "true" ? "false" : "true";
        return anexo
      })
    )
  }

  permiteNovosAnexos = () => {
    if([constantes.statusConcluido, constantes.statusInterrompido].includes(this.props.idStatusProjeto)) {
      return false;
    }
    return true;
  }

  //Table Columns
  iconDeletar = <DeleteOutlined className={styles.vermelho}/>
  iconRestaurar = <UndoOutlined className={styles.bbAzul}/>
  columns = [
    {
      dataIndex: "nomeOriginal",
      title: "Nome do Arquivo",
      sorter: (a, b) => AlfaSort(a.nomeOriginal, b.nomeOriginal),
    },
    {
      dataIndex: "dtAtualizacao",
      title: "Data do Envio",
      sorter: (a, b) => AlfaSort(a.dtAtualizacao, b.dtAtualizacao),
    },
    {
      width: "20%",
      align: 'right',
      render: record => (
        <>
        {!JSON.parse(record.ativo) &&
          <Typography.Text type='danger' strong>Marcado para exclusão</Typography.Text>
        }
        </>
      )
    },
    {
      width: "10%",
      title: "Ações",
      align: "center",
      render: record => (
        <Space>
          <a
            href={`${process.env.REACT_APP_ENDPOINT_API_URL}/${record.path}/${record.nome}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Tooltip title="Visualizar">
              <Button
                size='small'
                type='text'
                icon={<EyeOutlined className={styles.bbAzul}/>}
              />
            </Tooltip>
          </a>
          {!this.props.soLeitura &&
            <Tooltip title={JSON.parse(record.ativo) ? "Remover" : "Cancelar Remoção"}>
              <Button
                size='small'
                type='text'
                icon={JSON.parse(record.ativo) ? this.iconDeletar : this.iconRestaurar}
                onClick={() => this.softDeleteAnexosServidor(record.id)}
              />
            </Tooltip>
          }
        </Space>
      )
    },
  ];

  render() {
    const anexos = this.props.anexos;
    const draggerProps = {
      listType: "picture",
      fileList: [...anexos],
      showUploadList: { removeIcon: this.iconDeletar },
      onRemove: (file) => {
        const newFileList = this.removeFileFromList(file, anexos)
        this.props.onUpdateState("anexos", newFileList);
      },
      // incluir o thumbnail
      data: async (file) => {
        file.thumbUrl = await this.getBase64(file);
      },
      // o before precisa ser async para o thumbanail funcionar
      beforeUpload: async (file) => {
        const isLt10MB = file.size / 1024 / 1024 < 10;
        if (!isLt10MB) {
          message.error("Anexo deve ser menor que 10MB!");
          return false;
        }
        const newFileList = [...anexos, file];
        this.props.onUpdateState("anexos", newFileList);
        return false;
      },
      anexos,
    };
    return (
      <Form.Item>
        { this.permiteNovosAnexos() &&
          <>
            <Typography.Paragraph>
              Já pensou em como seria a tela da sua ferramenta, itens do relatório,
              etc... e já montou uma imagem de como gostaria que ficasse?
            </Typography.Paragraph>
            <Typography.Paragraph>
              Aqui você pode fazer o upload do modelo, clicando no botão ou
              arrastando a imagem para a área abaixo:
            </Typography.Paragraph>
            <Upload.Dragger {...draggerProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Clique ou arraste os arquivos aqui</p>
              <p className="ant-upload-hint">Aceita mais de um anexo.</p>
            </Upload.Dragger>
          </>
        }
        <Divider>Arquivos anexados</Divider>
        <SearchTable
          columns={this.columns}
          dataSource={this.props.anexosServidor}
        />
      </Form.Item>
    );
  }
}

export default Anexo;
