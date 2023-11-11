import { combineReducers } from 'redux';
import gedipReducer from 'services/ducks/CtrlDisciplinar/Gedip.ducks';
import cobanReducer from 'services/ducks/Coban.ducks';
import encantarReducer from 'services/ducks/Encantar.ducks';
import designacaoReducer from 'services/ducks/Designacao.ducks';
import demandasReducer from './demandas';
import elogiosReducer from '../ducks/Elogios.ducks';
import bacenProcReducer from '../ducks/BacenProc.ducks';
import mtnReducer from '../ducks/Mtn.ducks';
import ordemReducer from '../ducks/OrdemServ.ducks';
import commonsReducer from './commons';
import patrociniosReducer from '../ducks/Patrocinios.ducks';
import projetosReducer from '../ducks/Projetos.ducks';

export default combineReducers({
  demandas: demandasReducer,
  elogios: elogiosReducer,
  app: commonsReducer,
  gedip: gedipReducer,
  mtn: mtnReducer,
  ordemserv: ordemReducer,
  bacenProc: bacenProcReducer,
  coban: cobanReducer,
  encantar: encantarReducer,
  designacao: designacaoReducer,
  patrocinios: patrociniosReducer,
  projetos: projetosReducer,
});
