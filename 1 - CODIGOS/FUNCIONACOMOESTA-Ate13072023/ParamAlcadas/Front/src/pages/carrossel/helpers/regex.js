/** Retorna a última parte de um path referente a um arquivo de extensão .mp4 */
export const regexVideo = /(?:\/.*?)*\/(.*\.mp4)$/;

/**
 * Busca o nome do arquivo de vídeo mp4 dentro de um path, retornando apenas o nome.
 *
 * Sendo um path de arquivo ou url, retorna apenas o nome do arquivo.
 * Caso não se reconheça como um path de arquivo ou url, retorna a string completa.
 *
 * @example
 * ```js
 * regexNomeVideo('portalComunicacao/nomeVideo.mp4') // retorna 'nomeVideo.mp4'
 * regexNomeVideo('outroNomeVideo.mp4') // retorna 'outroNomeVideo.mp4'
 * ```
 * @param {string} urlVideo path do video
 * @returns {string} nome do video com `.mp4`
 */
export function regexNomeVideo(urlVideo) {
  // `exec` retorna um array onde [0] é o match inteiro e [1] é o first capturing group
  // faz o fallback para o nome inteiro passado
  return regexVideo.exec(urlVideo)?.[1] || urlVideo;
}
