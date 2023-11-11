import React, { useState } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function EditorTexto({
  value = '<p></p>'
}) {
  const [editorState, setEditorState] = useState(() => {
    const contentBlock = htmlToDraft(value);
    const texto = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    return EditorState.createWithContent(texto);
  });

  const onEditorStateChange = async (editorChanges) => {
    setEditorState(await editorChanges);
  };

  return (
    <div className="editor-wrapper" style={{ flex: 'auto' }}>
      <Editor
        editorState={editorState}
        wrapperClassName="editor-wrapper"
        onEditorStateChange={onEditorStateChange}
        toolbarHidden
        readOnly
      />
    </div>
  );
}

export default EditorTexto;
