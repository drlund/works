import React from "react";
import { Modal } from "antd";
import { finalizouVideo } from "services/ducks/Encantar.ducks";
import ReactPlayer from "react-player";

const ModalVideo = (props) => {
  return (
    <>
      {props.video && (
        <Modal
          title={props.video.titulo}
          centered
          footer={null}
          width={685}
          visible={props.video}
          onCancel={() => props.setVideo(null)}
        >
          <ReactPlayer
            onEnded={async () => {
              await finalizouVideo(props.video.id);
            }}
            pip={false}
            controls={true}
            url={props.video.url}
          />
        </Modal>
      )}
    </>
  );
};

export default ModalVideo;
