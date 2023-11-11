import React, { useEffect, useState } from "react";
import {
	Row,
	Col,
	Form,
	Input,
	Button,
	message,
	Card,
	Tooltip,
	Typography,
	Radio,
	Space,
	Tabs,
} from "antd";
import SearchTable from "components/searchtable/SearchTable";
import AlfaSort from "utils/AlfaSort";
import styles from "./publicoAlvo.module.scss";
import { Link } from "react-router-dom";
import { getPublicoAlvo } from "services/ducks/Tarifas.ducks";
import { FileDoneOutlined, InfoCircleOutlined } from "@ant-design/icons";

import BBSpinning from "components/BBSpinning/BBSpinning";
import MaskedInput from "react-text-mask";

const { TabPane } = Tabs;
const { Paragraph, Title } = Typography;

const columnsEmAndamento = [
	{
		dataIndex: "id",
		title: "Id",
		sorter: (a, b) => AlfaSort(a.id, b.id),
	},
	{
		dataIndex: "mci",
		title: "MCI",
		sorter: (a, b) => AlfaSort(a.mci, b.mci),
	},
	{
		dataIndex: "nomeCliente",
		title: "Nome do Cliente",
		sorter: (a, b) => AlfaSort(a.nomeCliente, b.nomeCliente),
	},
	{
		dataIndex: "status",
		title: "Status",
		sorter: (a, b) => AlfaSort(a.nomeCliente, b.nomeCliente),
	},
];

const columnsPendentes = [
	{
		dataIndex: "id",
		title: "Id",
		sorter: (a, b) => AlfaSort(a.id, b.id),
	},
	{
		dataIndex: "mci",
		title: "MCI",
		sorter: (a, b) => AlfaSort(a.mci, b.mci),
	},
	{
		dataIndex: "nomeCliente",
		title: "Nome do Cliente",
		sorter: (a, b) => AlfaSort(a.nomeCliente, b.nomeCliente),
	},
	{
		title: "Ações",
		render: (record, text) => {
			return (
				<div className={styles.acoes}>
					<Tooltip title="Reservar para pagamento">
						<Link to={`/tarifas/reservar-ocorrencia/${record.id}`}>
							<FileDoneOutlined className="link-color" />
						</Link>
					</Tooltip>
				</div>
			);
		},
	},
];

function hasOnlyNumbers(testString) {
	var numbers = /^[0-9]+$/;
	return numbers.test(testString);
}

const Filtros = (props) => {
	const layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
	};

	const { filtrosControl } = props;
	const { filtros } = filtrosControl;

	const mascaras = {
		CPF: {
			placeholder: "000.000.000-00",
			mascara: [
				/\d/,
				/\d/,
				/\d/,
				".",
				/\d/,
				/\d/,
				/\d/,
				".",
				/\d/,
				/\d/,
				/\d/,
				"-",
				/\d/,
				/\d/,
			],
		},
		CNPJ: {
			placeholder: "000.000.000/0000-00",
			mascara: [
				/\d/,
				/\d/,
				/\d/,
				".",
				/\d/,
				/\d/,
				/\d/,
				".",
				/\d/,
				/\d/,
				/\d/,
				"/",
				/\d/,
				/\d/,
				/\d/,
				/\d/,
				"-",
				/\d/,
				/\d/,
			],
		},
	};

	const [tipoPessoa, setTipoPessoa] = useState("CPF");
	const onChangeCampo = (campo, valor) => {
		filtrosControl.setFiltros({ ...filtrosControl.filtros, [campo]: valor });
	};

	useEffect(() => {
		onChangeCampo("cpf_cnpj", "");
		// eslint-disable-next-line
	}, [tipoPessoa]);

	return (
		<Form {...layout} labelAlign="left">
			<Form.Item label="MCI">
				<Input
					value={filtros.mci}
					onChange={(e) => {
						if (hasOnlyNumbers(e.target.value) || e.target.value === "") {
							onChangeCampo("mci", e.target.value);
						}
					}}
				/>
			</Form.Item>
			<Form.Item label="Tipo Pessoa">
				<Radio.Group
					onChange={(e) => setTipoPessoa(e.target.value)}
					value={tipoPessoa}
				>
					{Object.keys(mascaras).map((key) => {
						return <Radio value={key}>{key}</Radio>;
					})}
				</Radio.Group>
			</Form.Item>

			<Form.Item label="CPF/CNPJ">
				<MaskedInput
					className="ant-input"
					value={filtros.cpf_cnpj}
					mask={mascaras[tipoPessoa].mascara}
					placeholder={mascaras[tipoPessoa].placeholder}
					onChange={(e) => {
						const value = e.target.value
							.replaceAll("_", "")
							.replaceAll(".", "")
							.replaceAll("/", "")
							.replaceAll("-", "");
						if (hasOnlyNumbers(value) || value === "") {
							onChangeCampo("cpf_cnpj", value);
						}
					}}
				/>
			</Form.Item>

			<Form.Item
				label={
					<Space>
						Nome Completo
						<Tooltip title={"Não é permitida pesquisa parcial do nome"}>
							<InfoCircleOutlined />
						</Tooltip>
					</Space>
				}
			>
				<Input
					value={filtros.nome}
					onChange={(e) => onChangeCampo("nomeCliente", e.target.value)}
				/>
			</Form.Item>
		</Form>
	);
};

const PublicoAlvo = (props) => {
	const [ocorrencias, setOcorrencias] = useState(null);
	const [loading, setLoading] = useState(false);
	const [filtros, setFiltros] = useState({
		mci: "",
		nomeCliente: "",
		cpf_cnpj: "",
	});

	const onPesquisarOcorrencias = () => {
		setLoading(true);
		getPublicoAlvo(filtros)
			.then((recebido) => {
				if (Array.isArray(recebido) && recebido.length === 0) {
					message.info(
						"Nenhum cliente encontrado ou a solicitação já foi reservada para pagamento."
					);
				}
				setOcorrencias(recebido);
			})
			.catch((erro) => {
				if (typeof erro === "string") {
					message.error(erro);
				} else {
					message.erro(
						"Erro ao efetuar a pesquisa. Caso o mesmo persista, favor contactar o administrador do sistema."
					);
				}
			})
			.then(() => {
				setLoading(false);
			});
	};

	return (
		<BBSpinning spinning={loading}>
			<Row gutter={[0, 20]}>
				<Col span={24}>
					<Card>
						<Row gutter={[0, 20]}>
							<Col span={11}>
								<Title level={5}>Instruções</Title>
								<Paragraph>
									Conforme Comunicados a Administradores 2021/09227083 (Divar) e
									2021/09229822 (Dirav) - CTR ESTORNO DE VALORES, de 29/07/2021,
									o público-alvo (PF e PJ) que faz jus ao ressarcimento
									excepcional de tarifas debitadas indevidamente recebeu uma
									carta do BB e está listado nesta ferramenta. Para verificar se
									o cliente tem valores a receber, siga os passos a seguir:
								</Paragraph>
								<Paragraph>
									<ul>
										<li>
											Preencha ao menos um dos campos ao lado
											(MCI/CPF/CNPJ/Nome) e clique em “pesquisar”;
										</li>
										<li>
											Confira os dados e clique no ícone “Reservar para
											Pagamento”, abaixo da palavra “Ações”;
										</li>
										<li>
											Na tela seguinte, preencha os dados de contato do cliente.
										</li>
									</ul>
								</Paragraph>
								<Paragraph>
									OBS.: Caso um cliente apresente a carta enviada pelo BB e não
									seja encontrado nesta ferramenta, registre FaleCom no site da
									Super ADM (falecom.intranet.bb.com.br {">"} dependência Super
									ADM
									{">"} tópico de ajuda 'CTR Comunicado a Administradores
									Divar/Dirav').
								</Paragraph>
							</Col>
							<Col offset={2} span={11}>
								<div className={styles.filtrosWrapper}>
									<Filtros filtrosControl={{ filtros, setFiltros }} />
									<Button type="primary" onClick={onPesquisarOcorrencias}>
										Pesquisar
									</Button>
								</div>
							</Col>
						</Row>
					</Card>
				</Col>
				{ocorrencias !== null && (
					<Col span={24}>
						<Card title="Resultados">
							{ocorrencias.emAndamento && ocorrencias.emAndamento.length > 0 ? (
								<Tabs type="card">
									<TabPane tab="Pendentes Reserva" key="1">
										<SearchTable
											columns={columnsPendentes}
											dataSource={ocorrencias.pendentes}
										/>
									</TabPane>
									<TabPane tab="Reservados" key="2">
										<SearchTable
											columns={columnsEmAndamento}
											dataSource={ocorrencias.emAndamento}
										/>
									</TabPane>
								</Tabs>
							) : (
								<SearchTable
									columns={columnsPendentes}
									dataSource={ocorrencias.pendentes}
								/>
							)}
						</Card>
					</Col>
				)}
			</Row>
		</BBSpinning>
	);
};

export default PublicoAlvo;
