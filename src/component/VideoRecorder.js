import React, { useRef, useEffect, useState } from "react";
import {
  useReactMediaRecorder,
  ReactMediaRecorder,
} from "react-media-recorder";
import axios from "axios";
import { ApiUrl } from "../utils/HostUrls";


const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  if (!stream) {
    return null;
  }
  return <video ref={videoRef} width={500} height={500} autoPlay />;
};

export default function VideoRecorder() {
  const [videoBlob, setVideoBlob] = useState(null);
  const [openWebcam, setOpenWebcam] = useState(false);
  const [uploading, setUploading] = useState({isUploading: false, uploadStatusMsg: "" });
  const handleWebcamOpening = () => {
    setOpenWebcam(true);
  };
  const handleWebcamClosing = () => {
    setOpenWebcam(false);
  };

  const uploadVidToServer = async () => {
    var reader = new FileReader();
    reader.readAsDataURL(videoBlob);
    reader.onloadend = async function () {
      var base64data = reader.result;
      // console.log(base64data);
      await postVideoToServer(base64data);
    };
  };

  const postVideoToServer = async (base64data) => {
    let data = {
      videoBase64Str: base64data,
    };
    // change UI to show video is being uploaded to the server
    setUploading({isUploading: true, uploadStatusMsg: "Hang on, it is uploading..."});
    let req = await axios.post(
      `${ApiUrl}/video/post/videoBase64`,
      data
    );
    console.log(req.data);
    if(req.data.test === "success 123") {
      setUploading({isUploading: false, uploadStatusMsg: "Congrats! Video upload successfully "});
    } else {
      setUploading({isUploading: false, uploadStatusMsg: "Sorry, something went wrong. Please, try again!"});
      console.log("Sorry, something went wrong. Please, try again!")
    }

  };

  return (
    <div>
      <ReactMediaRecorder
        onStop={async (blobUrl) => {
          console.log(blobUrl);
          let blob = await fetch(blobUrl).then((r) => r.blob());
          console.log(blob);
          setVideoBlob(blob);
        }}
        video={true}
        render={({
          status,
          startRecording,
          stopRecording,
          mediaBlobUrl,
          previewStream,
        }) => (
          <div id="VideoRecorderContainer">
            <h5>Status: {status.toUpperCase()}</h5>
            <div>
              {mediaBlobUrl ? (
                <div>
                  <h5>Preview</h5>
                  <video src={mediaBlobUrl} controls autoplay loop />
                </div>
              ) : openWebcam ? (
                <VideoPreview stream={previewStream} />
              ) : (
                <p>Please click on "Open Webcam" to start recording </p>
              )}
            </div>
            <div>
              {openWebcam ? (
                <button onClick={handleWebcamOpening} disabled>
                  Open Webcam
                </button>
              ) : (
                <button onClick={handleWebcamOpening}>Open Webcam</button>
              )}

              {openWebcam ? (
                <div>
                  <button onClick={startRecording}>Start Recording</button>
                  <button onClick={stopRecording}>Stop Recording</button>
                  {status === 'recording' ? (
                    <button onClick={handleWebcamClosing} disabled >Close Webcam</button>
                  ) : (
                    <button onClick={handleWebcamClosing}>Close Webcam</button>
                  ) }
                  
                </div>
              ) : (
                <div>
                  <button onClick={startRecording} disabled>
                    Start Recording
                  </button>
                  <button onClick={stopRecording} disabled>
                    Stop Recording
                  </button>
                  <button onClick={handleWebcamClosing} disabled>
                    Close Webcam
                  </button>
                </div>
              )}
            </div>
            <div>
              {mediaBlobUrl ? (
                <button onClick={uploadVidToServer}>Upload</button>
              ) : (
                <button onClick={uploadVidToServer} disabled>
                  Upload
                </button>
              )}
            </div>
          {/* Video Upload status  */}
            <div>
                {uploading.isUploading ? (
                  <p>{uploading.uploadStatusMsg}</p>
                ) : (
                  <p>{uploading.uploadStatusMsg}</p>
                )}
            </div>
          </div>


        )}
        />
    </div>
  );
}
