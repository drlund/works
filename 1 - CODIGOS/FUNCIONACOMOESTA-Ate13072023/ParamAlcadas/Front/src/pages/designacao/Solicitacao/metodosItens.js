import { message } from 'antd';

export function beforeUpload(files, fileList) {
  const totalSize = fileList.reduce((acc, cur) => cur.size + acc, 0);

  if (totalSize < 5242880) {
    return fileList;
  }

  message.error('Tamanho total dos arquivos por caixa de envio não pode ser maior que 5MB!');
  return files;
}

export function removeFile(files, file) {
  const index = files.indexOf(file);
  const newFileList = files.slice();
  newFileList.splice(index, 1);
  return newFileList;
}

export function normFile(files, e) {
  if (Array.isArray(e)) {
    return e;
  }
  if (e.fileList.length >= files.length) {
    return e && e.fileList;
  }
  return e && e.fileList.filter((elemen) => files.some((intElem) => intElem.uid === elemen.uid));
}
