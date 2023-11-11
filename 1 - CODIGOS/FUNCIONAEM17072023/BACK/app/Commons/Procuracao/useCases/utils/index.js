/**
 * @param {string} uuid
*/
function isUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/gi;
  return uuidRegex.test(uuid);
}

exports.isUUID = isUUID;
