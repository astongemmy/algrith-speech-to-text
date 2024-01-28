import encoderPathWasm from 'opus-recorder/dist/encoderWorker.min.wasm';
import encoderPath from 'opus-recorder/dist/encoderWorker.min.js';
import Recorder from 'opus-recorder';
import { useState } from 'react';

const useOpusRecorder = () => {
  const [transcript, setTranscript] = useState();

  const initializeOpusRecorder = () => {
    let opusRecorder = new Recorder({
      originalSampleRateOverride: 48000,
      encoderPathWasm: encoderPathWasm,
      encoderPath: encoderPath,
      encoderSampleRate: 48000,
      encoderApplication: 2049,
      encoderFrameSize: 20,
      streamPages: true,
      birate: 128,
    });
  };

    // startRecordingButton.addEventListener('click', () => {
    //     opusRecorder.start().then(() => {
    //     startTimer();
    //     // Change visual indicator color when recording starts
    //     recordingIndicator.style.backgroundColor = 'red';
    //     startRecordingButton.disabled = true;
    //     stopRecordingButton.disabled = false;
    //     });
    // });
  
    // stopRecordingButton.addEventListener('click', () => {
    //     opusRecorder.stop().then(() => {
    //         // Reset visual indicator after recording stops
    //         recordingIndicator.style.backgroundColor = 'transparent';
    //         startRecordingButton.disabled = false;
    //         stopRecordingButton.disabled = true;
    //         stopTimer();
    //     });
    // });
  
    // opusRecorder.ondataavailable = (blob) => {
    //     const bloby = new Blob([blob], {
    //         type: 'audio/wav'
    //     });
  
    //     const audioUrl = URL.createObjectURL(bloby);
    //     audioPlayback.controls = true;
    //     audioPlayback.src = audioUrl;
    // };

};

export default useOpusRecorder;