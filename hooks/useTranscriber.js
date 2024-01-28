import { useState } from 'react';

const useTranscriber = () => {
  const [couldNotTranscribe, setCouldNotTranscribe] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState();

  const transcribe = (audioBlob) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      setIsTranscribing(true);
      fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            config: {
              encoding: 'WEBM_OPUS',
              sampleRateHertz: 48000,
              languageCode: 'en-US',
            },
            audio: {
              content: base64Data,
            },
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const transcript = data.results
            .map((result) => result.alternatives[0].transcript)
            .join('\n');
          setCouldNotTranscribe(!transcript);
          setTranscript(transcript);
        })
        .catch((error) => {
          console.error('Error performing speech-to-text:', error);
        }).finally(() => setIsTranscribing(false));
    };

    reader.readAsDataURL(audioBlob);
  };

  return {
    couldNotTranscribe,
    isTranscribing,
    transcript,
    transcribe
  };
};

export default useTranscriber;