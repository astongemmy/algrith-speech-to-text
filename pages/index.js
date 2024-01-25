'use client';

// import encoderPathWasm from 'opus-recorder/dist/encoderWorker.min.wasm';
// import encoderPath from 'opus-recorder/dist/encoderWorker.min.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm';
import tw, { styled } from 'twin.macro';
import WaveSurfer from 'wavesurfer.js';
// import Recorder from 'opus-recorder';
import Head from 'next/head';

import Layout from '../components/Layout';
import { useEffect, useRef, useState } from 'react';

const WaveSurferWrapper = styled.div`
  #record-indicator {
    transition: background-color 0.3s;
    background-color: red;
    display: inline-block;
    border-radius: 50%;
    margin-right: 5px;
    height: 10px;
    width: 10px;
  }
  
  #record-downloader {
    display: none;
  }
`;

const Index = () => {
  const [recordingState, setRecordingState] = useState('stopped');
  const [transcript, setTranscript] = useState();
  const [wavesurfer, setWavesurfer] = useState();
  const [timer, setTimer] = useState('00:00');
  const [recorder, setRecorder] = useState();
  const waveformRef = useRef();
  
  const [audioPlayerAttributes, setAudioPlayerAttributes] = useState({
    controls: true,
    src: '',
  });

  const transcribeSpeech = (audioBlob) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];

      fetch('https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyBmt5on_i0iKnY5GOAunbG1JbdLQvy5CYQ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'en-US'
          },
          audio: {
            content: base64Data
          }
        })
      })
      .then(response => response.json())
      .then(data => {
        const transcript = data.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');

        setTranscript(transcript);
      })
      .catch(error => {
        console.error('Error performing speech-to-text:', error);
      });
    };

    reader.readAsDataURL(audioBlob);
  };

  const updateRecordTimer = (timer) => {
    if (!timer) return setTimer('00:00');
    
    const timerArray = [
      Math.floor((timer % 3600000) / 60000),
      Math.floor((timer % 60000) / 1000)
    ];
    
    setTimer(timerArray.map((v) => (v < 10 ? '0' + v : v)).join(':'));
  };

  useEffect(() => {
    const initialiseWaveSurfer = () => {
      if (wavesurfer) wavesurfer.destroy();

      setWavesurfer(
        WaveSurfer.create({
          progressColor: 'rgb(100, 0, 100)',
          container: waveformRef?.current,
          waveColor: 'rgb(200, 0, 200)',
          renderFunction: (channels, ctx) => {
            const { width, height } = ctx.canvas;
            const scale = channels[0].length / width;
            const step = 10;
    
            ctx.translate(0, height / 2);
            ctx.strokeStyle = ctx.fillStyle;
            ctx.beginPath();
    
            for (let i = 0; i < width; i += step * 2) {
              const index = Math.floor(i * scale);
              const value = Math.abs(channels[0][index]);
              let x = i;
              let y = value * height;
    
              ctx.moveTo(x, 0);
              ctx.lineTo(x, y);
              ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true);
              ctx.lineTo(x + step, 0);
    
              x = x + step;
              y = -y;
              ctx.moveTo(x, 0);
              ctx.lineTo(x, y);
              ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false);
              ctx.lineTo(x + step, 0);
            }
    
            ctx.stroke();
            ctx.closePath();
          },
        })
      );
    };

    initialiseWaveSurfer();
  }, []);

  useEffect(() => {
    if (wavesurfer) {
      setRecorder(
        wavesurfer.registerPlugin(
          RecordPlugin.create({
            renderRecordedAudio: false,
            scrollingWaveform: false
          })
        )
      );
    }
  }, [wavesurfer]);

  useEffect(() => {
    if (recorder) {
      recorder.on('record-progress', (time) => updateRecordTimer(time));
        
      recorder.on('record-end', (blob) => {
        const recordedUrl = URL.createObjectURL(blob);
        setAudioPlayerAttributes({
          src: recordedUrl,
          controls: true
        });
        setTimer('00:00');
          
        // Object.assign(recordDownloader, {
          //   download: 'recording.' + blob.type.split(';')[0].split('/')[1] || 'webm',
          //   href: recordedUrl
        // });
          
        // Perform speech-to-text on the stored audio blob
        // transcribeSpeech(blob);
      });
    }

  }, [recorder]);

  const handleRecording = () => {
    if (!recorder) return;

    if (recorder.isRecording()) {
      recorder.pauseRecording();
      return setRecordingState('paused');
    }

    if (recorder.isPaused()) {
      recorder.resumeRecording();
      return setRecordingState('recording');
    }

    recorder.startRecording().then(() => {
      setRecordingState('recording');
    });
  };

  const stopRecording = () => {
    if (!recorder) return;
    
    if (recorder.isRecording() || recorder.isPaused()) {
      recorder.stopRecording();
      setRecordingState('stopped');
    }
  };
  
  // const initializeOpusRecorder = () => {
  //   let opusRecorder = new Recorder({
  //     originalSampleRateOverride: 48000,
  //     encoderPathWasm: encoderPathWasm,
  //     encoderPath: encoderPath,
  //     encoderSampleRate: 48000,
  //     encoderApplication: 2049,
  //     encoderFrameSize: 20,
  //     streamPages: true,
  //     birate: 128,
  //   });
  // };

  // initializeOpusRecorder();
  
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

	return (
    <Layout>
      <Head>
        <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1" />
        <title> Home | Algrith Speech to Text Transcriber </title>
        {/* <script src="https://apis.google.com/js/platform.js"></script> */}
      </Head>

      <main>
        <WaveSurferWrapper>
          <div className="flex justify-between gap-4 bg-green-200 p-4 my-6 rounded shadow">
            <button onClick={handleRecording} type="button" className="bg-green-600 shadow py-2 px-4 rounded border-none outline-none">
              {recordingState === 'recording' && 'Pause'}
              {recordingState === 'paused' && 'Resume'}
              {recordingState === 'stopped' && 'Start'}
            </button>
            
            <button onClick={stopRecording} type="button" className="bg-red-400 shadow py-2 px-4 rounded border-none outline-none" disabled={!['recording', 'paused'].includes(recordingState)}>
              Stop
            </button>
            
            <div className="flex items-center bg-gray-200 ml-4 rounded px-2">
              {timer}
            </div>
          </div>
          
          {/* <div className={}></div> */}
          
          <div className="my-8" ref={waveformRef}></div>
          
          <audio {...audioPlayerAttributes}></audio>
          
          {/* <a href="" id="record-downloader">Download</a> */}
          
          {transcript && (
            <div className="my-4">{ transcript }</div>
          )}
        </WaveSurferWrapper>
      </main>
    </Layout>
  );
};

export default Index;