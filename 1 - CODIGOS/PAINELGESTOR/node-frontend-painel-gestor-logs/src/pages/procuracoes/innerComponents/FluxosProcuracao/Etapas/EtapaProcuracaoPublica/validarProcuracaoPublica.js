import { tiposEtapa } from '../DadosProcuracao/tiposEtapa';
import { validarDadosProcuracao } from '../DadosProcuracao/validarDadosProcuracao';

export const validarDadosProcuracaoPublica = validarDadosProcuracao(tiposEtapa.publica);
