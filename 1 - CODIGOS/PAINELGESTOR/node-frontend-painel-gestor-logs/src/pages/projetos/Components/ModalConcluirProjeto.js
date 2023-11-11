import React, { Component } from "react";
import { Typography, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
// import { constantes } from "../Helpers/Constantes";
import styles from "../projetos.module.css";

class ModalConcluirProjeto extends Component {
    render() {
        return (
            <Modal
            title={
                <Typography.Text>
                <ExclamationCircleOutlined style={{ fontSize: 20, color: "orange" }} />{" "}
                Concluir Projeto?
                </Typography.Text>
            }
            visible={this.props.exibirModalStatusProjeto}
            okButtonProps={{ className: styles.bbBGAzul }}
            okText="SIM"
            onOk={() => {
                this.props.onOkFunction(true);
            }}
            cancelText="NÃO"
            onCancel={() => {
                this.props.changeStateFunction(false);
            }}
            cancelButtonProps={{
                onClick: () => this.props.onCancelFunction(false),
                type: "danger",
            }}
            >
            Todas as atividades deste projeto foram concluídas. Deseja concluir este
            Projeto?
            </Modal>
        )
    }
}
export default ModalConcluirProjeto;
