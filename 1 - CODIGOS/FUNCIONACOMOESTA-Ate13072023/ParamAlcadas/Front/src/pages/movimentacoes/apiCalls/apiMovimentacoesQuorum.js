import { message } from 'antd';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getDadosQuorumMeuPrefixo = async () => fetch(FETCH_METHODS.GET, 'movimentacoes/excessoes-quorum-proprio');

export const postQuorumMeuPrefixo = async (quorum) => fetch(FETCH_METHODS.POST, 'movimentacoes/excessoes-quorum-proprio', {
  quorum,
}).then(() => message.success('Quorum criado com sucesso!'));

export const patchQuorumMeuPrefixo = async (quorum) => fetch(FETCH_METHODS.PATCH, 'movimentacoes/excessoes-quorum-proprio', {
  quorum,
}).then(() => message.success('Quorum alterado com sucesso!'));

export const deleteQuorumMeuPrefixo = async () => fetch(
  FETCH_METHODS.DELETE,
  'movimentacoes/excessoes-quorum-proprio',
).then(() => message.success('Quorum excluido com sucesso!'));

export const getDadosTodosQuoruns = async () => fetch(FETCH_METHODS.GET, 'movimentacoes/excessoes-quorum-todos');

export const postQuorumQualquerPrefixo = async ({ prefixo, quorum }) => fetch(FETCH_METHODS.POST, 'movimentacoes/excessoes-quorum-qualquer', {
  prefixo,
  quorum,
}).then(() => message.success('Quorum criado com sucesso!'));

export const patchQuorumQualquerPrefixo = async ({ prefixo, quorum }) => fetch(FETCH_METHODS.PATCH, 'movimentacoes/excessoes-quorum-qualquer', {
  prefixo,
  quorum,
}).then(() => message.success('Quorum alterado com sucesso!'));

export const deleteQuorumQualquerPrefixo = async (prefixo) => fetch(
  FETCH_METHODS.DELETE,
  'movimentacoes/excessoes-quorum-qualquer',
  { prefixo },
).then(() => message.success('Quorum excluído com sucesso!'));
