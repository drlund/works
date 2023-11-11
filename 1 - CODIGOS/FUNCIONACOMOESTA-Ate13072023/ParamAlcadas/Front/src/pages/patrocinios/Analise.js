import React, { useState, useEffect } from "react";
import { message, Form, Divider, Spin, Row, Col, Modal, Button } from "antd";
import {
	CheckOutlined,
	UndoOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
import PageLoading from "components/pageloading/PageLoading";
import AccessDenied from "pages/errors/AccessDenied";
import Error from "pages/errors/Error";
import history from "@/history.js";
import { useSelector, useDispatch } from "react-redux";
import {
	getPerguntas,
	alteraSolic,
	Acoes,
	types,
	getTpSolic,
	hashPerguntas,
	getIdPergunta,
	tipoCampoResposta,
} from "services/ducks/Patrocinios.ducks";
import FormPerguntas from "./FormPerguntas";
import FrameVerSolicitacao from "./FrameVerSolicitacao";

const { confirm } = Modal;

const Analise = (props) => {
	const [form] = Form.useForm();
	const [formDevolucao] = Form.useForm();

	const [pageLoading, setPageLoading] = useState(false);
	const [formSubmit, setFormSubmit] = useState(false);
	const [isAnaliseAcolhimento, setAnaliseAcolhimento] = useState(false);
	const [showButtonConcluirAnalise, setShowButtonConcluirAnalise] =
		useState(false);
	const [perguntas, setPerguntas] = useState([]);
	const [solicitacao, setSolicitacao] = useState({});
	const [faseTipoSolic, setFaseTipoSolic] = useState({});
	const [notAllowed, setNotAllowed] = useState(false);
	const [msgError, setMsgError] = useState("");
	const [showModalDevolucao, setShowModalDevolucao] = useState(false);

	const dispatch = useDispatch();
	const arquivos = useSelector(({ patrocinios }) => patrocinios.arquivos);
	const respostaCampoOpcoes = useSelector(
		({ patrocinios }) => patrocinios.camposResposta
	);

	const setFormFields = (perguntas, solicitacao) => {
		if (solicitacao) {
			const { arquivos } = solicitacao;

			if (arquivos) {
				dispatch({ type: types.PATROCINIOS_GET_ARQUIVOS, payload: arquivos });
			}
		}

		if (perguntas) {
			const respostas = perguntas.reduce((result, value) => {
				if (value.resposta) {
					const { descricaoResposta } = value.resposta;
					let resp = descricaoResposta;

					try {
						resp = JSON.parse(descricaoResposta);
					} catch {}

					if (Array.isArray(resp) && value.opcoes) {
						for (const opt of value.opcoes) {
							if (opt.subopcoes) {
								result[value.id] = resp.filter((val) => !val[opt.id]);
								return result;
							}
						}
					}

					result[value.id] = resp ? resp : descricaoResposta;
				}

				return result;
			}, {});

			form.setFieldsValue(respostas);
		}
	};

	const setCampoResposta = (pergs) => {
		for (const perg of pergs) {
			if (perg.opcoes) {
				for (const item of perg.opcoes) {
					if (item.subopcoes) {
						const campos = JSON.parse(item.subopcoes);

						if (campos) {
							if (perg.resposta && perg.resposta.descricaoResposta) {
								let resposta = [];

								try {
									resposta = JSON.parse(perg.resposta.descricaoResposta);
								} catch {}

								const resp = resposta.find((val) => !!val[item.id]);

								if (resp) {
									dispatch({
										type: types.PATROCINIOS_CHANGE_CAMPOS_RESPOSTA,
										payload: resp,
										idTipoOpcao: perg.id,
									});
								}
							}
						}
					}
				}
			}
		}
	};

	const getPerguntasForm = () => {
		setPageLoading(true);

		getPerguntas({
			idSolicitacao: props.match.params.id,
			responseHandler: {
				successCallback: ({ perguntas, solicitacao, faseTipoSolic }) => {
					if (!solicitacao.emAnalise) {
						const msg = "Solicitação não está disponível para análise.";
						setMsgError(msg);
						message.error(msg);
					} else {
						setSolicitacao(solicitacao);
						setFaseTipoSolic(faseTipoSolic);
						setPerguntas(perguntas);

						dispatch({
							type: types.PATROCINIOS_CHANGE_CAMPOS_RESPOSTA,
							payload: solicitacao.nrMKT,
							idTipoOpcao: tipoCampoResposta.nrMKT,
						});

						setCampoResposta(perguntas);

						getTpSolic({
							responseHandler: {
								successCallback: (tiposSolicitacao) => {
									try {
										const tipoSolicitacao = tiposSolicitacao.find(
											(tpSolic) => tpSolic.id === solicitacao.idTipoSolicitacao
										);
										const { valorAutorizSECOM } = tipoSolicitacao;
										const valorEvento = (
											solicitacao.valorEvento
										);

										if (valorEvento < valorAutorizSECOM) {
											const pergAutorizSECOM = getIdPergunta(
												perguntas,
												hashPerguntas.AutorizSECOM
											);

											if (pergAutorizSECOM) {
												setPerguntas(
													perguntas.filter(
														(perg) => perg.id !== pergAutorizSECOM.id
													)
												);
											}
										}

										setFormFields(perguntas, solicitacao);

										const { isAnaliseAcolhimento, tudoRespondido } =
											solicitacao;
										setAnaliseAcolhimento(isAnaliseAcolhimento);

										if (
											(isAnaliseAcolhimento && tudoRespondido) ||
											(tudoRespondido && !isAnaliseAcolhimento)
										) {
											setShowButtonConcluirAnalise(solicitacao.tudoRespondido);
										}
									} catch {
										message.error("Erro ao configurar as perguntas.");
									}
								},
								errorCallback: () =>
									message.error("Erro ao obter os tipos de solicitação."),
							},
						});
					}

					setPageLoading(false);
				},
				errorCallback: (error) => {
					setPageLoading(false);
					if (error) {
						if (error.status === 403) {
							setNotAllowed(true);
						} else {
							setMsgError(error.data);
							message.error(error.data);
						}
					}
				},
			},
		});
	};

	useEffect(() => {
		getPerguntasForm();
		// eslint-disable-next-line
	}, []);

	const onFinish = (values) => {
		setFormSubmit(true);

		const respostas = values;

		for (const key in arquivos) {
			const files = { alterado: false, fileList: [] };

			if (arquivos[key].length === 0) {
				// Arquivo excluído
				files.alterado = true;
			} else {
				arquivos[key].forEach((file) => {
					if (file.status) {
						// Arquivo incluído
						files.alterado = true;
						files.fileList.push(file.originFileObj);
					} else {
						files.fileList.push(file);
					}
				});
			}

			if (files.alterado) {
				respostas[`file${key}`] = files.fileList;
			}
		}

		for (const key in respostaCampoOpcoes) {
			if (Number(key) === tipoCampoResposta.nrMKT) {
				respostas[`resp${key}`] = respostaCampoOpcoes[key];
			} else {
				if (Array.isArray(respostas[key])) {
					respostas[key] = respostas[key].concat(respostaCampoOpcoes[key]);
				} else if (!["Sim", "Não"].includes(respostas[key])) {
					respostas[key] = Array.isArray(respostaCampoOpcoes[key])
						? respostaCampoOpcoes[key]
						: [respostaCampoOpcoes[key]];
				}
			}
		}

		const answers = {
			solicitacoes: {
				idSolicitacao: solicitacao.id,
				idAcao: faseTipoSolic.idAcaoSalvar,
			},
			respostas,
		};

		enviarSolicitacao(answers);
	};

	const clickVoltar = () => history.push("/patrocinios/cadastrar-consultar-sac");

	const enviarSolicitacao = (solicitacao) => {
		setFormSubmit(true);

		alteraSolic({
			solicitacao,
			responseHandler: {
				successCallback: ({ tudoRespondido }) => {
					const { solicitacoes } = solicitacao;

					if (solicitacoes.mudarFase) {
						message.success("Operação efetuada com sucesso!");
						clickVoltar();
					} else {
						switch (solicitacoes.idAcao) {
							case Acoes.DevolverSolic:
								message.success("Devolução efetuada com sucesso!");
								clickVoltar();
								break;
							default:
								message.success("Análise salva com sucesso!");
								setShowButtonConcluirAnalise(
									(isAnaliseAcolhimento && tudoRespondido) ||
										(tudoRespondido && !isAnaliseAcolhimento)
								);
								setFormSubmit(false);
								break;
						}
					}
				},
				errorCallback: (error) => {
					message.error(error);
					setFormSubmit(false);
				},
			},
		});
	};

	const renderTituloForm = () => {
		if (solicitacao) {
			const { fase } = solicitacao;

			if (fase && fase.descricao) {
				return (
					<Divider orientation="left" style={{ marginBottom: 10 }}>
						<span style={{ color: "#555", fontWeight: "bold" }}>
							{fase.descricao}
						</span>
					</Divider>
				);
			}
		}
	};

	const showConfirm = (title, okType, onOk) => {
		confirm({
			title,
			icon: <ExclamationCircleOutlined />,
			content: "Atenção! Esta ação não poderá ser desfeita.",
			okText: "Sim",
			okType,
			cancelText: "Não",
			onOk,
		});
	};

	const devolverSolicitacao = ({ obs }) => {
		enviarSolicitacao({
			solicitacoes: {
				idSolicitacao: solicitacao.id,
				idAcao: Acoes.DevolverSolic,
				obsDevolucao: obs,
			},
		});
	};

	const renderModalDevolucao = () => (
		<Modal
			visible={showModalDevolucao}
			width={450}
			closable={false}
			footer={null}
		>
			<Row style={{ padding: "16px 24px 24px" }}>
				<ExclamationCircleOutlined
					style={{
						fontSize: 22,
						color: "orange",
						marginRight: 16,
						float: "left",
					}}
				/>
				<span
					style={{
						fontSize: 16,
						fontWeight: 500,
						color: "rgba(0,0,0,.85)",
						lineHeight: 1.2,
					}}
				>
					Deseja realmente devolver esta solicitação?
				</span>

				<span
					style={{
						marginTop: 8,
						marginLeft: 38,
						color: "#FF6347",
					}}
				>
					Atenção! Esta ação não poderá ser desfeita.
				</span>
				<Form
					labelCol={{ span: 24 }}
					form={formDevolucao}
					style={{ width: "100%", marginTop: 8 }}
					onFinish={devolverSolicitacao}
				>
					<FormPerguntas
						perguntas={[
							{
								id: "obs",
								descricaoPergunta: "Observações",
								obrigatorio: { data: [1] },
								tipo: { cdTipoPergunta: "textarea" },
							},
						]}
					/>
					<Col span={24} style={{ textAlign: "end" }}>
						<Button
							disabled={formSubmit}
							onClick={() => setShowModalDevolucao(false)}
						>
							Não
						</Button>
						<Button
							htmlType="submit"
							loading={formSubmit}
							style={{ marginLeft: 15, color: "red", border: "1px dashed red" }}
						>
							Sim
						</Button>
					</Col>
				</Form>
			</Row>
		</Modal>
	);

	const showConcluirFaseConfirm = () => {
		showConfirm("Deseja realmente concluir esta fase?", "primary", () =>
			enviarSolicitacao({
				solicitacoes: {
					idSolicitacao: solicitacao.id,
					idAcao: faseTipoSolic.idAcaoConcluir,
					mudarFase: 1,
				},
			})
		);
	};

	const renderPerguntas = () => {
		if (perguntas) {
			const buttons = [
				{ type: "buttonOk", label: "Salvar", disabled: formSubmit },
				{ type: "buttonCancel", label: "Voltar", onClick: clickVoltar },
			];

			if (isAnaliseAcolhimento) {
				buttons.push({
					type: "devolver",
					label: "Devolver Solicitação",
					style: { color: "red", border: "1px dashed red" },
					icon: <UndoOutlined />,
					disabled: formSubmit,
					onClick: () => setShowModalDevolucao(true),
				});
			}

			if (showButtonConcluirAnalise) {
				const buttonLabel = isAnaliseAcolhimento
					? "Acolher Solicitação"
					: "Concluir Fase";

				buttons.push({
					type: "acolher",
					label: buttonLabel,
					style: { color: "green", border: "1px solid green" },
					icon: <CheckOutlined />,
					disabled: formSubmit,
					onClick: showConcluirFaseConfirm,
				});
			}

			return (
				<>
					{renderTituloForm()}
					<FormPerguntas
						perguntas={perguntas}
						idSolicitacao={solicitacao.id}
						buttons={buttons}
					/>
				</>
			);
		}
	};

	if (pageLoading) {
		return <PageLoading />;
	}

	if (notAllowed) {
		return (
			<>
				<Button icon={<UndoOutlined />} onClick={clickVoltar}>
					Voltar
				</Button>
				<AccessDenied nomeFerramenta={"Patrocínios"} showMessage={false} />
			</>
		);
	}

	if (msgError) {
		return (
			<>
				<Button icon={<UndoOutlined />} onClick={clickVoltar}>
					Voltar
				</Button>
				<Error nomeFerramenta={"Patrocínios"} mensagemErro={msgError} />
			</>
		);
	}

	return (
		<Spin spinning={formSubmit} indicator={<PageLoading />}>
			<Button
				icon={<UndoOutlined />}
				style={{ position: "absolute", top: -13, right: 0, zIndex: 9 }}
				onClick={clickVoltar}
			>
				Voltar
			</Button>

			<Row>
				<Col
					span={9}
					style={{
						backgroundColor: "#fbfbfb",
						marginBottom: 15,
						padding: "0 15px",
						border: "1px solid #ddd",
						borderRadius: 3,
					}}
				>
					{perguntas && (
						<Divider orientation="left">
							<span style={{ color: "#555", fontWeight: "bold" }}>SAC</span>
						</Divider>
					)}

					{solicitacao && solicitacao.id && (
						<FrameVerSolicitacao
							idSolicitacao={solicitacao.id}
							hideButton={true}
						/>
					)}
				</Col>

				<Col span={14} offset={1}>
					<Form labelCol={{ span: 24 }} form={form} onFinish={onFinish}>
						{renderPerguntas()}
					</Form>
				</Col>
			</Row>
			{renderModalDevolucao()}
		</Spin>
	);
};

export default Analise;
