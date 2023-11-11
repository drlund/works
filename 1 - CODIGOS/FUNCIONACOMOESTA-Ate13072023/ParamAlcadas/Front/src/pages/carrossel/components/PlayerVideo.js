import React, { useState, useEffect } from 'react';
import { fetchVideo } from '../apiCalls/apiCarrossel';

function PlayerVideo() {
  const [videoAtual, setVideoAtual] = useState([]);
  useEffect(() => {
    fetchVideo()
      .then(setVideoAtual);
  }, []);

  const basePath = 'https://super.intranet.bb.com.br/superadm/';
  const urlVideoCompleto = basePath + videoAtual.urlVideo;

  // script do php
  //
  // <script defer>
  //   var basePath = "https://super.intranet.bb.com.br/superadm/";
  //   var video = document.querySelector('video');
  //  video.onplay = async () => {
  //     await video.requestFullscreen();
  //   video.onplay = null;
  //  }

  //  video.onended = async () => {
  //     await atualizaVideo()
  //       .finally(() => {
  //         video.play()
  //       });
  //  };

  //   function atualizaVideo(time = 10000) {
  //   const dezMin = 1000 * 60 * 10;
  //   const capTime = time > dezMin ? dezMin : time;

  //   fetch("http://localhost:3333/carrossel/video")
  //     .then(r => r.json())
  //     .then(videoAtual => {
  //     video.src = basePath + videoAtual.urlVideo;
  //    })
  //    .catch(() => {
  //      const timeout = setTimeout(() => {
  //     clearTimeout(timeout);
  //   atualizaVideo(capTime * 2);
  //     }, capTime)
  //    })
  //  }

  //   atualizaVideo();
  // </script>

  return (
    <div id="painel" style={{ margin: 0 }}>
      <video
        id="auto"
        src={urlVideoCompleto}
        muted
        controls
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh'
        }}
      >
        {/* <source src={urlVideoCompleto} type="video/mp4" /> */}
      </video>
    </div>
  );
}

export default PlayerVideo;
