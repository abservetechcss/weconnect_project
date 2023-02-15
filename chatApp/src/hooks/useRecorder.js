import { useEffect, useState } from "react";

export const useRecorder = () => {
  const [audioURL, setAudioURL] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    addEventListener("devicechange", (event) => {
      console.log("recording device changed1", event);
    });
  });

  // navigator.mediaDevices.ondevicechange = (event) => {
  //   console.log("recording device changed2", event);
  // };

  useEffect(() => {
    // Lazily obtain recorder first time we're recording.
    if (recorder === null) {
      if (isRecording) {
        requestRecorder().then(setRecorder, console.error);
      }
      return;
    }

    // Manage recorder state.
    if (isRecording) {
      recorder.start();
    } else {
      if (recorder.state != "inactive") recorder.stop();
    }

    // Obtain the audio when ready.
    const handleData = (e) => {
      // console.log("Audio Url", URL.createObjectURL(e.data));
      setAudioURL(e.data);
    };

    recorder.addEventListener("dataavailable", handleData);
    return () => recorder.removeEventListener("dataavailable", handleData);
  }, [recorder, isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return [audioURL, isRecording, startRecording, stopRecording, setAudioURL];
};

async function requestRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return new MediaRecorder(stream);
}
export default useRecorder;
