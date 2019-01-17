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
    captureUserMedia(stream => {})
  }

  startRecord() {
    captureUserMedia(stream => {
      const recordAudio = RecordRTC(stream, {
        recorderType: MediaStreamRecorder,
        type: 'audio',
        bitsPerSecond: 100 * 1000,
        desiredSampRate: 25 * 1000, // bits-per-sample * 1000
        disableLogs: config.isProduction,
      })
      recordAudio.onStateChanged = state => {
        console.log('calling setstate with', {
          isRecording: state === 'recording',
        })
        this.setState({ isRecording: state === 'recording' })
      }
      this.setState({
        recordAudio,
      })
      this.state.recordAudio.startRecording()
    })
  }

  stopRecord() {
    this.state.recordAudio.stopRecording(() => {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)()
      blobToAudioArrayBuffer(
        this.state.recordAudio.getBlob(),
        audioContext
      ).then(audioArrayBuffer => {
        let src = audioContext.createBufferSource() // enable using loaded data as source
        var channel, tmp, len, len2

        // from https://stackoverflow.com/a/29240615
        channel = audioArrayBuffer.getChannelData(0) // get reference to a channel
        len = channel.length - 1 // end of buffer
        len2 = len >>> 1 // center of buffer (integer)
        for (var i = 0; i < len2; i++) {
          // loop to center
          tmp = channel[len - i] // from end -> tmp
          channel[len - i] = channel[i] // end = from beginning
          channel[i] = tmp // tmp -> beginning
        }

        // play
        this.state.recordAudio.destroy()
        src.buffer = audioArrayBuffer
        src.connect(audioContext.destination)
        console.log(src)
        if (!src.start) src.start = src.noteOn
        src.start(0)
        //TODO: play audio or send it to server
      })
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
