import React from "react";
import RichEditor from "components/richeditor/RichEditor";

const RichEditorCarta = (props) => {
  return (
    <RichEditor
      height={550}
      toolbar={"emoticons | undo redo "}
      width={"100%"}
      onBlur={(evt) => props.updateFunc(evt.target.getContent())}
      menubar={false}
      emoticonsDatabase={"emojiimages"}
      forcedRootBlock={false}
      initialValue={props.txtCarta}
    />
  );
};

export default RichEditorCarta;