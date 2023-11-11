import React, { useState, useEffect } from "react";
import { message, Form, Divider, Row, Col, Button, Steps } from "antd";
import { UndoOutlined } from "@ant-design/icons";
import PageLoading from "components/pageloading/PageLoading";
import AccessDenied from "pages/errors/AccessDenied";
import Error from "pages/errors/Error";
import history from "@/history.js";
import { useDispatch } from "react-redux";
import {
	getPerguntas,
	types,
	getTpSolic,
	hashPerguntas,
	getIdPergunta,
	tipoCampoResposta,
	fetchFases,
} from "services/ducks/Patrocinios.ducks";
import FormPerguntas from "./FormPerguntas";
import FrameVerSolicitacao from "./FrameVerSolicitacao";

const { Step } = Steps;

const VerAnalise = (props) => {
	const [form] = Form.useForm();

	const [pageLoading, setPageLoading] = useState(false);
	const [perguntas, setPerguntas] = useState([]);
	const [solicitacao, setSolicitacao] = useState({});
	const [fases, setFases] = useState([]);
	const [faseAtual, setFaseAtual] = useState(0);
	const [currentStep, setCurrentStep] = useState();
	const [notAllowed, setNotAllowed] = useState(false);
	const [msgError, setMsgError] = useState("");

	const dispatch = useDispatch();

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

	const getPerguntasForm = (sequencialAtual = null) => {
		setPageLoading(true);

		getPerguntas({
			idSolicitacao: props.match.params.id,
			sequencial: sequencialAtual,
			readOnly: true,
			responseHandler: {
				successCallback: ({ perguntas, solicitacao }) => {
					setSolicitacao(solicitacao);
					setPerguntas(perguntas);
					setCurrentStep(
						sequencialAtual ? sequencialAtual - 2 : solicitacao.sequencial - 2
					);

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
									const valorEvento = (solicitacao.valorEvento);

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
								} catch {
									message.error("Erro ao configurar as perguntas.");
								}
							},
							errorCallback: () =>
								message.error("Erro ao obter os tipos de solicitação."),
						},
					});

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

	useEffect(() => {
		if (solicitacao.id) {
			fetchFases({ idSolicitacao: solicitacao.id })
				.then((fases) => {
					setFases(fases);

					const fase = fases.find((val) => val.idFase === solicitacao.idFase);

					setFaseAtual(fase);
				})
				.catch(() => {
					message.error("Erro na busca de fases.");
				});
		}
	}, [solicitacao.id, solicitacao.idFase]);

	const clickVoltar = () => history.push("/patrocinios/cadastrar-consultar-sac");

	const renderTituloForm = () => {
		if (fases.length && currentStep >= 0) {
			return (
				<Divider orientation="left" style={{ marginBottom: 10 }}>
					<span style={{ color: "#555", fontWeight: "bold" }}>
						{fases[currentStep].nomeFase}
					</span>
					<Button
						icon={<UndoOutlined />}
						style={{ position: "absolute", top: -13, right: 0 }}
						onClick={clickVoltar}
					>
						Voltar
					</Button>
				</Divider>
			);
		}
	};

	const renderPerguntas = () => {
		if (perguntas) {
			const buttons = [
				{ type: "buttonCancel", label: "Voltar", onClick: clickVoltar },
			];

			return (
				<>
					{renderTituloForm()}
					<FormPerguntas
						perguntas={perguntas}
						idSolicitacao={solicitacao.id}
						disabled={true}
						buttons={buttons}
					/>
				</>
			);
		}
	};

	const renderSteps = () => (
		<Steps
			type="navigation"
			size="small"
			current={currentStep}
			onChange={(current) => {
				getPerguntasForm(current + 2);
			}}
			className="site-navigation-steps"
		>
			{fases.map((fase, index) => {
				let status = "wait";

				if (fase.sequencial < faseAtual.sequencial) {
					status = "finish";
				} else if (fase.sequencial === faseAtual.sequencial) {
					status = "process";
				}

				return (
					<Step
						key={index}
						title={fase.nomeFase}
						status={status}
						disabled={fase.sequencial > faseAtual.sequencial}
					/>
				);
			})}
		</Steps>
	);

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
		<>
			<Row style={{ marginBottom: 20 }}>{renderSteps()}</Row>
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

					{solicitacao.id && (
						<FrameVerSolicitacao
							idSolicitacao={solicitacao.id}
							hideButton={true}
						/>
					)}
				</Col>

				<Col span={14} offset={1}>
					<Form labelCol={{ span: 24 }} form={form}>
						{renderPerguntas()}
					</Form>
				</Col>
			</Row>
		</>
	);
};

export default VerAnalise;
