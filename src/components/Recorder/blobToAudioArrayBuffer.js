// by https://stackoverflow.com/a/40364457
export default (blob, audioContext) =>
  new Promise((resolve, reject) => {
    let fileReader = new FileReader()
    fileReader.onloadend = () => {
      return resolve(fileReader.result)
    }
    fileReader.onerror = reject

    fileReader.readAsArrayBuffer(blob)
  }).then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
