'use client';

import { useEffect, useRef } from 'react';
import tw, { styled } from 'twin.macro';
import Head from 'next/head';

import useTranscriber from '../hooks/useTranscriber';
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
  const { transcript, transcribe } = useTranscriber();
  const waveformRef = useRef();
  
  const {
    recordFileExtension,
    handleRecording,
    recordingState,
    stopRecording,
    recordTime,
    recordBlob,
    recordUrl,
  } = useWaveSurfer({
    waveformRef
  });
  
  const timer = new Timer(recordTime).formatted();
  
  useEffect(() => {
    if (recordBlob) transcribe(recordBlob);
  }, [recordBlob]);

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