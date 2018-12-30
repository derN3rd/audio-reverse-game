import React from 'react'
import RecordRTC, { MediaStreamRecorder } from 'recordrtc'
import captureUserMedia from './captureUserMedia'
import blobToAudioArrayBuffer from './blobToAudioArrayBuffer'
import config from '../../config'

const hasGetUserMedia = !!(
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
)

class RecordPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      recordAudio: null,
      src: null,
      isRecording: false,
    }

    this.requestUserMedia = this.requestUserMedia.bind(this)
    this.startRecord = this.startRecord.bind(this)
    this.stopRecord = this.stopRecord.bind(this)
  }

  componentDidMount() {
    if (!hasGetUserMedia) {
      alert(
        'Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.'
      )
      return
    }
    this.requestUserMedia()
  }

  requestUserMedia() {
    console.log('requestUserMedia')
    captureUserMedia(stream => {
      console.log('stream', stream)
    })
  }

  startRecord() {
    captureUserMedia(stream => {
      //this.setState({ recordAudio: RecordRTC(stream, { type: 'audio' }) })
      this.state.recordAudio = RecordRTC(stream, {
        recorderType: MediaStreamRecorder,
        type: 'audio',
        bitsPerSecond: 256 * 1024 * 8,
        desiredSampRate: 25 * 1000, // bits-per-sample * 1000
        disableLogs: config.isProduction,
      })
      this.state.recordAudio.startRecording()
      this.setState({ isRecording: true })
    })
  }

  stopRecord() {
    this.state.recordAudio.stopRecording(() => {
      let params = {
        type: 'video/webm',
        data: this.state.recordAudio.blob,
        id: Math.floor(Math.random() * 90000) + 10000,
      }
      console.log(this.state.recordAudio)

      blobToAudioArrayBuffer(this.state.recordAudio.getBlob()).then(
        audioArrayBuffer => {
          console.log(audioArrayBuffer, audioArrayBuffer.length)
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)()
          const frameCount = audioArrayBuffer.length - 1
          const buffer = audioContext.createBuffer(
            1,
            frameCount,
            audioContext.sampleRate
          )
          const src = audioContext.createBufferSource() // enable using loaded data as source
          var channel
          const reveredArray = audioArrayBuffer.reverse()

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
      )

      const audioUrl = URL.createObjectURL(this.state.recordAudio.blob)
      const audio = new Audio(audioUrl)
      audio.play()

      this.setState({ isRecording: false })

      //TODO: play audio or send it to server
    })
  }

  render() {
    return (
      <div>
        {this.state.isRecording ? <div>Recording...</div> : null}
        <div>
          <button onClick={this.startRecord} disabled={this.state.isRecording}>
            Start Record
          </button>
          <button onClick={this.stopRecord} disabled={!this.state.isRecording}>
            Stop Record
          </button>
        </div>
      </div>
    )
  }
}

export default RecordPage
