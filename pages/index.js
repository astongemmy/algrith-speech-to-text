'use client';

import { useState, useRef } from 'react';
import tw, { styled } from 'twin.macro';
import Head from 'next/head';

import useWaveSurfer from '../hooks/useWaveSurfer';
import Layout from '../components/Layout';
import { Timer } from '../utils/timer';

const WaveSurferWrapper = styled.div`
  ${tw`flex flex-col gap-4 p-8 w-2/5`};

  .recorder {
    ${tw`flex justify-between items-center gap-2 bg-green-200 p-4 rounded shadow`};

    button {
      &.record {
        ${tw`bg-green-600 font-bold text-white shadow py-2 px-6 rounded border-none outline-none`};
        ${({ recordingState }) => recordingState === 'paused' && tw`bg-yellow-500`};
      }
      
      &.stop {
        ${tw`bg-red-400 font-bold text-white shadow py-2 px-6 rounded border-none outline-none`};
      }
    }

    .indicator {
      ${tw`animate-pulse w-4 h-4 bg-red-400 shadow rounded-full`};
    }

    .timer {
      ${tw`flex items-center font-bold bg-gray-200 rounded px-2 py-2`};
    }
  }
`;

const Index = () => {
  const [transcript, setTranscript] = useState();
  const waveformRef = useRef();
  
  const {
    recordFileExtension,
    handleRecording,
    recordingState,
    stopRecording,
    getRecorder,
    recordTime,
    recordBlob,
    recordUrl,
  } = useWaveSurfer({
    waveformRef
  });

  const timer = new Timer(recordTime).formatted();
  
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
        <meta
          name='viewport'
          content='width=device-width, minimum-scale=1, initial-scale=1'
        />
        <title> Home | Algrith Speech to Text Transcriber </title>
      </Head>

      <main>
        <WaveSurferWrapper recordingState={recordingState}>
          <div className='recorder'>
            <button onClick={handleRecording} type='button' className='record'>
              {recordingState === 'recording' && 'Pause'}
              {recordingState === 'paused' && 'Resume'}
              {recordingState === 'stopped' && 'Start'}
            </button>

            <button
              disabled={!['recording', 'paused'].includes(recordingState)}
              onClick={stopRecording}
              className='stop'
              type='button'
            >
              Stop
            </button>

            <div className='indicator' />

            <div className='timer'>{timer}</div>
          </div>

          <div ref={waveformRef} />

          {recordUrl && (
            <>
              <audio controls src={recordUrl}></audio>

              <a href={recordUrl} download={`recording.${recordFileExtension}`}>
                Download
              </a>
            </>
          )}

          {transcript && <div>{transcript}</div>}
        </WaveSurferWrapper>
      </main>
    </Layout>
  );
};

export default Index;