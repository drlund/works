import { CostsConfig } from '@/pages/peopleCost/config/Costs.config';
import { AcessosPlataformaConfig } from './apps/acessos-plataforma.config';
import { AmbienciaConfig } from './apps/ambiencia.config';
import { APIKeysConfig } from './apps/api-keys.config';
import { AutoridadesSecexConfig } from './apps/autoridades-secex.config';
import { BacenProcConfig } from './apps/bacenproc.config';
import { CarrosselConfig } from './apps/carrossel.config';
import { CtrlDisciplinarConfig } from './apps/ctrldisciplinar.config';
import { DemandasConfig, getDefaultRoute } from './apps/demandas.config';
import { DesignacaoConfig } from './apps/designacao.config';
import { ElogiosConfig } from './apps/elogios.config';
import { EncantarConfig } from './apps/encantar.config';
import { FlexCriteriosConfig } from './apps/flexCriterios.config';
import { HrXtraConfig } from './apps/hrxtra.config';
import { MovimentacoesConfig } from './apps/movimentacoes.config';
import { MtnConfig } from './apps/mtn.config';
import { OrdemServConfig } from './apps/ordemserv.config';
import { PainelGestorConfig } from './apps/painelGestor.config';
import { PatrociniosConfig } from './apps/patrocinios.config';
import { PodcastsConfig } from './apps/podcasts.config';
import { ProcuracoesConfig } from './apps/procuracoes.config';
import { ProjetosConfig } from './apps/projetos.config';
import { RelatoriosConfig } from './apps/relatorios.config';
import { TarifasConfig } from './apps/tarifas.config';
import { ValidacaoRHConfig } from './apps/validacaorh.config';

import { GerenciadorFerramentasConfig } from './apps/gerenciadorFerramentas.config';

import AppConfig from './app.config';

export const DefaultPage = getDefaultRoute();

export default {
  acessosPlataforma: AcessosPlataformaConfig,
  ambiencia: AmbienciaConfig,
  autoridadesSecex: AutoridadesSecexConfig,
  apikeys: APIKeysConfig,
  app: AppConfig,
  bacen: BacenProcConfig,
  carrossel: CarrosselConfig,
  costs: CostsConfig,
  ctrldisciplinar: CtrlDisciplinarConfig,
  demandas: DemandasConfig,
  designacao: DesignacaoConfig,
  elogios: ElogiosConfig,
  encantar: EncantarConfig,
  hrxtra: HrXtraConfig,
  movimentacoes: MovimentacoesConfig,
  mtn: MtnConfig,
  ordemserv: OrdemServConfig,
  painel: PainelGestorConfig,
  patrocinios: PatrociniosConfig,
  procuracoes: ProcuracoesConfig,
  projetos: ProjetosConfig,
  relatorios: RelatoriosConfig,
  tarifas: TarifasConfig,
  validacaorh: ValidacaoRHConfig,
  flexCriterios: FlexCriteriosConfig,
  podcasts: PodcastsConfig,
  gerenciadorFerramentas: GerenciadorFerramentasConfig,
};
