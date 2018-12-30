export default function captureUserMedia(callback) {
  var params = { audio: true }

  navigator.getUserMedia(params, callback, error => {
    console.log(error)
    throw error
  })
}
