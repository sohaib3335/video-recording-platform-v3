import React, { useEffect, useState } from "react";
import { ReactVideo } from "reactjs-media";
import axios from "axios";
import { ApiUrl , UploadsUrl } from "../utils/HostUrls";


export default function AdminDashboard() {
  const [videosData, setVideosData] = useState({ videosData: [] });

  useEffect(() => {
    const getVideosData = async () => {
      let URL = `${ApiUrl}/video/get/allVideos`;
      let result = await axios.get(URL);
      console.log(result.data);
      
     
      setVideosData(result.data);
    };

    getVideosData();
  }, []);

  const getQatarTime = (theDate) => {
    let qatarTime = new Date(Date.parse(theDate));
    return qatarTime.toLocaleString();
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Admin Dashboard</h1>
      {videosData.videosData.map((video, i) => (
        <div key={i}>
          <p>Date and Time Uploaded: {getQatarTime(video.date_posted)}</p>
          <p>Name of Video: {video.recording_name}</p>
          
          <div style={{ width: "35%", margin: "5%" }}>
            <ReactVideo
              src={`${UploadsUrl}/${video.recording_name}`}
              poster="/poster.jpg"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
