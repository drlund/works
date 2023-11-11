<!-- ESTE ARQUIVO É DE CONTROLE PARA A INTERFACE DO PLAYER DO CARROSSEL DE NOTÍCIAS. -->
<!-- O ARQUIVO ORIGINAL ESTÁ NO SERVIDOR PHP NO SEGUINTE CAMINHO: "assets/files/pages/painelComunicacao/", QUE É UM LINK SIMBÓLICO PARA "/dados/superadm-storage/pages/painelComunicacao" -->
<!-- ESTA VERSÃO E A DO SERVIDOR DEVEM SER CORRESPONDENTES -->

<html>

<head>
	<title>Painel da Comunicação</title>
</head>

<body style="margin:0">
	<div id="painel" style="margin:0">
		<video id="auto" muted="true" controls style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;" />
	</div>

	<script defer>
		var basePath = "https://super.intranet.bb.com.br/superadm/assets/files/pages/";
		var video = document.querySelector('video');
		video.onplay = async () => {
			await video.requestFullscreen();
			video.onplay = null;
		}

		video.onended = async () => {
			await atualizaVideo()
				.finally(() => {
					video.play()
				});
		};

		function atualizaVideo(time = 10000) {
			const dezMin = 1000 * 60 * 10;
			const capTime = time > dezMin ? dezMin : time;

			return fetch("https://super.intranet.bb.com.br/server-api/carrossel/video")
				.then(r => r.json())
				.then(videoAtual => {
					video.src = basePath + videoAtual.urlVideo;
				})
				.catch(() => {
					const timeout = setTimeout(() => {
						clearTimeout(timeout);
						atualizaVideo(capTime * 2);
					}, capTime)
				})

		}

		atualizaVideo();
	</script>
</body>

</html>