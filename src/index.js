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
  var actx = audioContext
  var soundbuffer = buffy
  var frameCount = soundbuffer[0].length - 1
  var buffer = actx.createBuffer(2, frameCount, actx.sampleRate)
  var src = actx.createBufferSource(), // enable using loaded data as source
    channel,
    tmp,
    i,
    t = 0,
    len,
    len2

  // reverse channels
  while (t < buffer.numberOfChannels) {
    // iterate each channel
    channel = buffer.getChannelData(t) // get reference to a channel
    for (var i = 0; i < frameCount; i++) {
      // Math.random() is in [0; 1.0]
      // audio needs to be in [-1.0; 1.0]
      channel[i] = soundbuffer[t][i]
    }
    len = channel.length - 1 // end of buffer
    len2 = len >>> 1 // center of buffer (integer)
    for (i = 0; i < len2; i++) {
      // loop to center
      tmp = channel[len - i] // from end -> tmp
      channel[len - i] = channel[i] // end = from beginning
      channel[i] = tmp // tmp -> beginning
    }
    t += 1
  }

  // play
  src.buffer = buffer
  src.connect(actx.destination)
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
