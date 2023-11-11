import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

// @ts-ignore
const filemanagerBaseURL = process.env.REACT_APP_TINYMCE_BASEURL
  || 'http://localhost/superadm/assets/js/tinymce';

/**
 * Wrapper para o editor Rich Text do TinyMCE.
 *
 * @see {@link https://www.tiny.cloud/docs/ TinyMCE} Docs, estamos na versão 5
 * @version TinyMCE Version 5
 *
 * @param {Object} [props] - props
 * @param {string} [props.customRootDir] - diretorio para salvar as images/arquivos de upload
 * @param {boolean} [props.disabled] - default false, desabilita a edição se habilitado
 * para incrementar ou sobrescrever alguma propriedade de inicializacao do componente.
 * @param {boolean} [props.dontWrapContent] - default false, se for passado nao adiciona
 * no servidor remoto. caso nao seja informado, nao habilita o plugin fileManager.
 * @param {string} [props.emoticonsDatabase] - default 'emojis', que usa emojis UNICODE
 * @param {string} [props.entityEncoding] - default 'named', que usa transforma characters
 * acima de 126 do unicode. Deixado como 'named' para compatibilidade reversa.
 * Recomendado usar `raw` para poder usar caracteres especiais UTF-8.
 * (exceção são os caracteres: < > & ' ")
 * @param {Record<string,(args: any) => void>} [props.extraInit] - propriedades adicionais que podem ser passadas
 * a tag <p> no conteudo
 * @param {boolean} [props.forcedRootBlock] - default true, faz o wrap de elementos
 * inline dentro de tags `p`
 * @param {number|string} [props.height] - default '500px'
 * @param {string} [props.id] - id a ser passado ao rich editor.
 * @param {string} [props.initialValue] - valor inicial
 * @param {boolean} [props.inline] - default false, renderiza em um iframe,
 * se true, renderiza direto no componente
 * @param {unknown} [props.menu] - override para os items do menu
 * @param {boolean} [props.menubar] - default true, mostra a barra de menu
 * @param {(props: {target: { getContent: () => string }}) => void} [props.onBlur] - função com trigger no onBlur
 * @param {(props: {target: { getContent: () => string }}) => void} [props.onChange] - função com trigger no onChange
 * @param {(...args: any) => void} [props.onInit] - função disparada no onInit do editor,
 * usada para salvar o editor em uma ref
 * @param {string|Function} [props.toolbar] - é o que o toolbar default vai mostrar como ferramentas.
 * Passando uma função, recebe a toolbar como parametro.
 * Se retornar dessa função um array de strings, cada linha vira uma linha no toolbar.
 * @param {number|string} [props.width] - default 'auto'
 *
 * @tutorial funções - para pegar os valores seja no `onBlur` ou no `onChange`, receba o `event`
 * e na função use `event.target.getContent()`.
```js
onBlur((event) => { event.target.getContent() }
onChange((event) => { event.target.getContent() }
```
 *
 * @tutorial onInit - recebe na função (evento, editor)
```js
onInit((event, editor) => { myRef.current = editor; });
```
 *
 * @tutorial customToolbarButtons - esses são botões que vão na toolbar
```js
// exemplo do tipo mais básico de botão
editor.ui.registry.addButton('nomeDeRegistroNaToolbar', {
  // se houver `icon` e omitir `text`, renderiza apenas o `icon`.
  // icone renderiza antes do `text`
  // https://www.tiny.cloud/docs/advanced/editor-icon-identifiers/
  icon: 'icone a ser renderizado',
  text: 'Nome que vai aparecer na Toolbar',
  tooltip: 'Tooltip no hover do botão',
  // onSetup roda ao ser renderizado
  onSetup: ((button) => {
    // button possui dois métodos:
    button.isDisabled(); // retorna boolean
    button.setDisabled(bool); // aceita boolean, habilita/desabilita botão
  }),
  // onAction: roda no click do botão
  onAction: (button) => {
    // retorna mesmos métodos do onSetup

    // uso comum é inserir alguma coisa no cursor:
    editor.insertContent('string a ser inserida');
    editor.insertContent('<span style="color:red">string pode ser um html válido</span>');
  }
});
```
 */
export default function RichEditor({
  customRootDir = '',
  disabled = false,
  dontWrapContent = false,
  emoticonsDatabase = 'emojis',
  entityEncoding = 'named',
  extraInit = {},
  forcedRootBlock = true,
  height = 500,
  id,
  initialValue = '',
  inline = false,
  menu = {
    insert: {
      title: 'Insert',
      items:
        'filemanager image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime',
    }
  },
  menubar = true,
  onBlur = undefined,
  onChange = undefined,
  onInit = undefined,
  toolbar,
  width = 'auto',
} = {}) {
  const hasFileManager = customRootDir !== '' ? 'filemanager' : '';
  const pluginsList = `advlist autolink lists image charmap preview anchor link searchreplace visualblocks hr searchreplace visualchars emoticons media insertdatetime imagetools table paste ${hasFileManager}`;

  const contentWrapper = dontWrapContent ? {
    force_br_newlines: true,
    force_p_newlines: false,
    forced_root_block: '',
  } : {};

  const toolbarRender = (() => {
    if (disabled) return '';

    const defaultToolbar = 'emoticons | undo redo | bold italic underline strikethrough | alignleft aligncenter alignright | blockquote bullist numlist outdent indent | forecolor backcolor | link preview';

    if (typeof toolbar === 'function') {
      return toolbar(defaultToolbar);
    }

    return toolbar || defaultToolbar;
  })();

  /**
   * @param {Function} cb
   * @param {any} value
   * @param {{filetype: string;}} meta
   * @this {any}
  */
  // eslint-disable-next-line camelcase
  function file_picker_callback(cb, value, meta) {
    const editor = this;
    const fieldId = (() => {
      const lista = document.getElementsByClassName('tox-form__group');

      if (lista.length) {
        const firstItem = lista.item(0);
        const fieldInput = firstItem.getElementsByTagName('input');

        if (fieldInput.length) {
          return fieldInput.item(0).getAttribute('id');
        }
      }

      return '';
    })();

    const type = /** @type {number} */ ({
      image: 1,
      file: 2,
      media: 5
    }[meta.filetype] ?? 0);

    editor.windowManager.openUrl({
      title: 'Gerenciador de Arquivos',
      url: `${filemanagerBaseURL}/plugins/filemanager/dialog.php?editor=${editor.id}&lang=pt_BR&subfolder=&type=${type}&field_id=${fieldId}&custom_root_dir=${customRootDir}`,
      filetype: 'all',
      inline: 1,
      resizable: true,
      maximizable: true,
    });
  }

  return (
    // @ts-ignore
    <Editor
      id={id}
      initialValue={initialValue}
      onBlur={onBlur}
      onChange={onChange}
      onInit={onInit}
      inline={inline}
      disabled={disabled}
      init={{
        forced_root_block: forcedRootBlock,
        plugins: pluginsList,
        language: 'pt_BR',
        entity_encoding: entityEncoding,
        emoticons_database: emoticonsDatabase,
        filemanagerBaseURL,
        customRootDir,
        default_link_target: '_blank',
        paste_data_images: true,
        image_advtab: true,
        menubar: disabled ? false : menubar,
        convert_urls: 0,
        remove_script_host: 0,
        fontsize_formats:
          '8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 18pt 20pt 22pt 24pt 32pt 36pt',
        height,
        width,
        toolbar: toolbarRender,
        ...extraInit,
        ...contentWrapper,
        relative_urls: false,
        menu: disabled ? null : menu,
        // eslint-disable-next-line camelcase
        file_picker_callback,
      }}
    />
  );
}
