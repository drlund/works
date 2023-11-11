import React, { useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './EditorTexto.scss';

function EditorTexto(props) {
  const {
    value = '<p></p>', onChange, toolbarHidden = false, readOnly = false
  } = props;
  const [editorState, setEditorState] = useState(() => {
    const contentBlock = htmlToDraft(value);
    const texto = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    return EditorState.createWithContent(texto);
  });

  const onEditorStateChange = async (editorChanges) => {
    setEditorState(await editorChanges);
    const data = draftToHtml(convertToRaw(editorChanges.getCurrentContent()));

    onChange?.({
      value: data,
    });
  };

  return (
    <div className="editor-wrapper edition" style={{ flex: 'auto' }}>
      <Editor
        editorState={editorState}
        wrapperClassName="editor-wrapper"
        onEditorStateChange={onEditorStateChange}
        toolbarHidden={toolbarHidden}
        readOnly={readOnly}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'fontFamily'],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
            bold: { className: 'bordered-option-classname' },
            italic: { className: 'bordered-option-classname' },
            underline: { className: 'bordered-option-classname' },
            strikethrough: { className: 'bordered-option-classname' },
            code: { className: 'bordered-option-classname' },
          },
          blockType: {
            className: 'bordered-option-classname',
          },
          fontSize: {
            className: 'bordered-option-classname',
          },
          fontFamily: {
            className: 'bordered-option-classname',
          },
        }}
      />
    </div>
  );
}

export default React.memo(EditorTexto);
