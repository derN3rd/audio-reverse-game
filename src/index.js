import Recorder from 'recorder-js'

const texts = [
  'Wie heißt du?',
  'Alles okay bei dir?',
  'Wie ist das Wetter?',
  'ich mag kuchen',
]

document.body.append(
  document.createTextNode(texts[Math.floor(texts.length * Math.random())])
)
document.body.append(document.createElement('br'))
document.body.append(document.createElement('br'))

const audioContext = new (window.AudioContext || window.webkitAudioContext)()

const recorder = new Recorder(audioContext, {
  //onAnalysed: data => console.log(data),
})

var buffy = null

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(stream => recorder.init(stream))
  .catch(err => console.log('Uh oh... unable to get stream...', err))

// https://stackoverflow.com/questions/29238549/playing-audio-backwards-with-htmlmediaelement
function process() {
  const frameCount = buffy[0].length - 1
  const buffer = audioContext.createBuffer(
    1,
    frameCount,
    audioContext.sampleRate
  )
  const src = audioContext.createBufferSource() // enable using loaded data as source
  var channel
  const reveredArray = buffy[0].reverse()

  channel = buffer.getChannelData(0) // get reference to a channel
  for (var i = 0; i < frameCount; i++) {
    channel[i] = reveredArray[i]
  }

  // play
  src.buffer = buffer
  src.connect(audioContext.destination)
  if (!src.start) src.start = src.noteOn
  src.start(0)
}

setTimeout(() => {}, 5000)

var btn = document.createElement('button')
btn.innerHTML = 'START'
var btn2 = document.createElement('button')
btn2.innerHTML = 'STOP'
btn2.disabled = true
btn.onclick = () => {
  console.log('start recording')
  recorder
    .start()
    .then(() => {
      btn.disabled = true
      btn2.disabled = false
    })
    .catch(e => {
      console.error(e)
      alert('Couldnt start recording. pls try again')
      btn.disabled = false
      btn2.disabled = true
    })
}
btn2.onclick = () => {
  console.log('finish recording')
  return recorder
    .stop()
    .then(({ buffer }) => {
      buffy = buffer
      console.log(buffer)
      process()
      btn.disabled = false
      btn2.disabled = true
    })
    .catch(e => {
      console.error(e)
      alert('Couldnt stop recording. pls try again')
      btn.disabled = true
      btn2.disabled = false
    })
}

document.body.appendChild(btn)
document.body.appendChild(btn2)
