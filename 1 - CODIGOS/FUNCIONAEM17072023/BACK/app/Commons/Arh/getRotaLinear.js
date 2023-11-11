"use strict"

const { round } = require("../NumberUtils");


async function getRotaLinear(posicao, unit = "K") {
  const {latOrigem, longOrigem, latDestino, longDestino} = posicao;

	if ((latOrigem == latDestino) && (longOrigem == longDestino)) {
		return 0.0;
	}
	else {
		var radlatOrigem = Math.PI * latOrigem/180;
		var radlatDestino = Math.PI * latDestino/180;
		var theta = longOrigem-longDestino;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlatOrigem) * Math.sin(radlatDestino) + Math.cos(radlatOrigem) * Math.cos(radlatDestino) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return round(dist);
	}

}

module.exports = getRotaLinear;
