import React from "react";
import {
	Card,
	Button,
	Row,
	message,
	Modal,
	Popconfirm,
	Checkbox,
	Divider,
} from "antd";
import {
	EyeOutlined,
	CheckOutlined,
	CloseOutlined,
	UndoOutlined,
	RedoOutlined,
} from "@ant-design/icons";
import AlfaSort from "utils/AlfaSort";
import FloatSort from "utils/FloatSort";
import DateBrSort from "utils/DateBrSort";
import SearchTable from "components/searchtable/SearchTable";
import FrameVerSolicitacao from "./FrameVerSolicitacao";
import FrameVotosDesativados from "./FrameVotosDesativados";
import VerVotosPopOver from "./VerVotosPopOver";
import history from "@/history.js";
import {
	getSolicEmVotacao,
	gravaVotos,
	Acoes,
} from "services/ducks/Patrocinios.ducks";
import "./TableHead.scss";

class Votacao extends React.Component {
	state = {
		pageLoading: false,
		selectedRowKeys: [],
		checkAll: false,
		indeterminate: false,
		solicEmVotacao: [],
	};

	columns = [
		{
			dataIndex: "dtInclusao",
			title: "Dt. Inclusão",
			width: "10%",
			align: "center",
			sorter: (a, b) => DateBrSort(a.dtInclusao, b.dtInclusao),
		},
		{
			dataIndex: "prefixoSolicitante",
			title: "Super",
			width: "15%",
			sorter: (a, b) => AlfaSort(a.prefixoSolicitante, b.prefixoSolicitante),
			render: (text, record) =>
				`${record.prefixoSolicitante} - ${record.nomeSolicitante}`,
		},
		{
			dataIndex: "dataInicioEvento",
			title: "Dt. Evento",
			width: "10%",
			align: "center",
			sorter: (a, b) => DateBrSort(a.dataInicioEvento, b.dataInicioEvento),
		},
		{
			dataIndex: "nomeEvento",
			title: "Evento",
			width: "45%",
			sorter: (a, b) => AlfaSort(a.nomeEvento, b.nomeEvento),
		},
		{
			dataIndex: "valorEvento",
			title: "Valor",
			width: "10%",
			align: "right",
			sorter: (a, b) => FloatSort(a.valorEvento, b.valorEvento),
		},
		{
			dataIndex: "qtdVotos",
			title: "Votos",
			width: "5%",
			align: "center",
			sorter: (a, b) => AlfaSort(a.qtdVotos, b.qtdVotos),
			render: (text, record) => <VerVotosPopOver votos={record.voto} />,
		},
		{
			title: "Visualizar",
			width: "5%",
			align: "center",
			render: (text, record) => {
				return (
					<EyeOutlined
						className="link-color link-cursor"
						onClick={() =>
							this.setState({ idSolicitacao: record.id, visibleModal: true })
						}
					/>
				);
			},
		},
	];

	componentDidMount() {
		this.fetchSolicEmVotacao();
	}

	fetchSolicEmVotacao = () => {
		this.setState({ pageLoading: true }, () =>
			getSolicEmVotacao({
				responseHandler: {
					successCallback: (solicEmVotacao) =>
						this.setState({
							solicEmVotacao,
							pageLoading: false,
							selectedRowKeys: [],
							checkAll: false,
							indeterminate: false,
						}),
					errorCallback: () => message.error("Falha ao obter as solicitações."),
				},
			})
		);
	};

	onCheckAllChange = (e) => {
		this.setState({
			selectedRowKeys: e.target.checked
				? this.state.solicEmVotacao.map((solic) => solic.id)
				: [],
			indeterminate: false,
			checkAll: e.target.checked,
		});
	};

	hideModalVerSolicitacao = () => {
		this.setState({ visibleModal: false, idSolicitacao: null });
	};

	renderModalVerSolicitacao() {
		return (
			<Modal
				title={<span style={{ fontWeight: "bold" }}>Solicitação</span>}
				visible={this.state.visibleModal}
				onOk={this.hideModalVerSolicitacao}
				onCancel={this.hideModalVerSolicitacao}
				footer={null}
				width={1300}
				destroyOnClose
				style={{ top: 5 }}
			>
				<FrameVerSolicitacao
					idSolicitacao={this.state.idSolicitacao}
					onClickButtonVoltar={this.hideModalVerSolicitacao}
				/>
			</Modal>
		);
	}

	renderModalMudouComite(mudouComite) {
		if (mudouComite) {
			Modal.warning({
				width: 1000,
				title:
					"Foi constatado uma mudança no Comitê de Administração de sua dependência durante o processo de votação.",
				content: (
					<div>
						<Divider />
						<p style={{ marginTop: 15 }}>O seu voto foi gravado com sucesso.</p>
						<p>
							No entanto, <b>os votos abaixo serão cancelados</b>.{" "}
							<span style={{ color: "tomato" }}>
								Pedimos que avise ao membros do comitê para efetuarem nova
								votação.
							</span>
						</p>
						<FrameVotosDesativados solicitacoes={mudouComite} />
					</div>
				),
			});
		}
	}

	votosDeferir = () => {
		const votos = {
			idSolicitacao: this.state.selectedRowKeys,
			deferido: 1,
			idAcao: Acoes.RegistrarVoto,
		};

		this.enviaVotos(votos);
	};

	votosIndeferir = () => {
		const votos = {
			idSolicitacao: this.state.selectedRowKeys,
			deferido: 0,
			idAcao: Acoes.RegistrarVoto,
		};

		this.enviaVotos(votos);
	};

	enviaVotos = (votos) =>
		this.setState({ pageLoading: true }, () => {
			gravaVotos({
				votos,
				responseHandler: {
					successCallback: ({ mudouComite }) => {
						this.setState({ pageLoading: false, selectedRowKeys: [] }, () => {
							message.success("Voto(s) gravado(s) com sucesso!");

							if (mudouComite && mudouComite.length) {
								this.renderModalMudouComite(mudouComite);
							}

							this.fetchSolicEmVotacao();
						});
					},
					errorCallback: (error) => {
						message.error(error);
						this.setState({ pageLoading: false });
					},
				},
			});
		});

	renderSearchTable() {
		const {
			selectedRowKeys,
			indeterminate,
			checkAll,
			pageLoading,
			solicEmVotacao,
		} = this.state;

		const rowSelection = {
			selectedRowKeys,
			columnTitle: () => (
				<div className="ant-table-selection" style={{ top: -3 }}>
					<span style={{ fontSize: 10 }}>Marcar Todos</span>
					<Checkbox
						indeterminate={indeterminate}
						onChange={this.onCheckAllChange}
						checked={checkAll}
						disabled={!solicEmVotacao.length}
					/>
				</div>
			),
			onChange: (selectedRowKeys) => {
				const { solicEmVotacao } = this.state;

				this.setState({
					selectedRowKeys,
					indeterminate:
						!!selectedRowKeys.length &&
						selectedRowKeys.length < solicEmVotacao.length,
					checkAll: selectedRowKeys.length === solicEmVotacao.length,
				});
			},
		};

		return (
			<SearchTable
				className="styledTableHead"
				columns={this.columns}
				dataSource={solicEmVotacao}
				rowSelection={rowSelection}
				size="small"
				loading={pageLoading}
				pagination={{ showSizeChanger: true }}
				ignoreAutoKey
			/>
		);
	}

	render() {
		const { selectedRowKeys, pageLoading, solicEmVotacao } = this.state;

		return (
			solicEmVotacao && (
				<React.Fragment>
					<Card>
						<Row style={{ marginBottom: "15px" }}>
							<Button
								icon={<RedoOutlined />}
								loading={pageLoading}
								onClick={this.fetchSolicEmVotacao}
							>
								Atualizar Lista
							</Button>
						</Row>

						{this.renderSearchTable()}

						<Card>
							<Row justify="center">
								<Popconfirm
									title="Deseja deferir todas as solicitações selecionadas?"
									placement="left"
									disabled={!selectedRowKeys.length || pageLoading}
									onConfirm={this.votosDeferir}
								>
									<Button
										type="primary"
										icon={<CheckOutlined />}
										disabled={!selectedRowKeys.length || pageLoading}
										style={{ paddingLeft: 25, paddingRight: 25 }}
									>
										Deferir
									</Button>
								</Popconfirm>

								<Popconfirm
									title="Deseja INDEFERIR todas as solicitações selecionadas?"
									placement="top"
									disabled={!selectedRowKeys.length || pageLoading}
									onConfirm={this.votosIndeferir}
								>
									<Button
										danger
										icon={<CloseOutlined />}
										disabled={!selectedRowKeys.length || pageLoading}
										style={{
											marginLeft: 30,
											paddingLeft: 20,
											paddingRight: 20,
										}}
									>
										Indeferir
									</Button>
								</Popconfirm>

								<Button
									icon={<UndoOutlined />}
									style={{ marginLeft: 30, paddingLeft: 30, paddingRight: 30 }}
									disabled={pageLoading}
									onClick={() => history.push("/patrocinios/cadastrar-consultar-sac")}
								>
									Voltar
								</Button>
							</Row>
						</Card>
					</Card>

					{this.renderModalVerSolicitacao()}
				</React.Fragment>
			)
		);
	}
}

export default Votacao;
