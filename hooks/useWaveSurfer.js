import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm';
import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const useWaveSurfer = ({ waveformRef }) => {
  const [recordingState, setRecordingState] = useState('stopped');
  const [recordFileExtension, setFileExtension] = useState();
  const [recordTime, setRecordTime] = useState(0);
  const [recordBlob, setRecordBlob] = useState();
  const [recordUrl, setRecordUrl] = useState();
  const recorderRef = useRef();
    
  const getRecorder = () => {
    if (!recorderRef.current) {
      const wavesurfer = WaveSurfer.create({
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
        }
      });
      
      recorderRef.current = wavesurfer.registerPlugin(
        RecordPlugin.create({
          renderRecordedAudio: false,
          scrollingWaveform: false
        })
      );
      
      return recorderRef.current;
    }

    return recorderRef.current;
  };

  useEffect(() => {
    const recorder = getRecorder();

    recorder.on('record-progress', (time) => setRecordTime(time));

    recorder.on('record-end', (blob) => {
      const fileExtension = `${blob.type.split(';')[0].split('/')[1]}` || 'webm';
      setRecordUrl(URL.createObjectURL(blob));
      setFileExtension(fileExtension);
      setRecordBlob(blob);
    });
  }, [recorderRef.current]);
  
  useEffect(() => {
    if (recordingState === 'stopped') setRecordTime(0);
  }, [recordingState]);

  const handleRecording = () => {
    const recorder = getRecorder();

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
    const recorder = getRecorder();

    if (recorder.isRecording() || recorder.isPaused()) {
      recorder.stopRecording();
      setRecordingState('stopped');
    }
  };

  return {
    recordFileExtension,
    handleRecording,
    recordingState,
    stopRecording,
    getRecorder,
    recordTime,
    recordBlob,
    recordUrl,
  };
};

export default useWaveSurfer;