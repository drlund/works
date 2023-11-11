import { tiposEtapa } from '../DadosProcuracao/tiposEtapa';
import { validarDadosProcuracao } from '../DadosProcuracao/validarDadosProcuracao';

export const validarDadosProcuracaoSubsidiaria = validarDadosProcuracao(tiposEtapa.publica);
