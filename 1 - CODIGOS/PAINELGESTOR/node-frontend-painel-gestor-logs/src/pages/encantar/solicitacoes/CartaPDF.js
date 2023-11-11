import React from "react";
import { Document, Page, View, Font } from "@react-pdf/renderer";
import { decode } from "html-entities";
import fonts from "../../../fonts";
import { Html } from "react-pdf-html";
const cleanText = (originalTxt) => {
  var regexEmoji =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

  return decode(
    originalTxt
      .replaceAll("&nbsp;", " ") // Espaços em branco
      .replaceAll('"', "'")
      // eslint-disable-next-line
      .replaceAll(/<span[^>]+\>/g, "")
      // eslint-disable-next-line
      .replaceAll(/<p[^>]+\>/g, "<br />")
      // eslint-disable-next-line
      .replaceAll(/<div[^>]+\>/g, "<br />")
      .replaceAll(regexEmoji, " $& ") // Emoticons
  );
};

const URL_EMOJIS = `${process.env.PUBLIC_URL}/assets/emojis/`;

const CartaPDF = (props) => {
  const { selectedFont } = props;
  const font = selectedFont ? selectedFont : "reenieBeanie";

  Font.registerEmojiSource({
    format: "png",
    url: URL_EMOJIS,
  });

  const newHtml = cleanText(props.txt);

  for (const font in fonts) {
    Font.register({
      family: font,
      fonts: [
        {
          src: fonts[font],
        },
      ],
    });
  }

  return (
    <Document>
      <Page size="A4" orientation={"portrait"}>
        <View
          style={{
            fontFamily: font,
            margin: 30,
            textAlign: "justify",
            flexWrap: "wrap",
          }}
        >
          <Html>{newHtml}</Html>
        </View>
      </Page>
    </Document>
  );
};

export default CartaPDF;
