import { tiposEtapa } from '../DadosProcuracao/tiposEtapa';
import { validarDadosProcuracao } from '../DadosProcuracao/validarDadosProcuracao';

export const validarDadosProcuracaoParticular = validarDadosProcuracao(tiposEtapa.particular);
