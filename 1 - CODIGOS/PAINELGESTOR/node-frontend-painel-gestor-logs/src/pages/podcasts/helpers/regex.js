/** Retorna a extensão do arquivo de vídeo */
export const regexVideo = /(.{3})\s*$/;

/**
 * Busca o nome do arquivo de vídeo e retorna apenas a sua extensão.
 *
 * @example
 * ```js
 * regexNomeVideo('uploads/multimidia/podcast/ae7a0e29-3286-4f07-a19c-44406e12e7e1.mp4') // retorna 'mp4'
 * ```
 * @param {string} urlVideo path do vídeo
 * @returns {string} extensão do vídeo `.mp4`
 */
export function regexExtVideo(urlVideo) {
  return regexVideo.exec(urlVideo)?.[1] || 'mp4';
}
