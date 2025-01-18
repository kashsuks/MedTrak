import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('userId', '12345');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResponse(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>MediTrack AI</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {response && (
        <div>
          <h2>Medication Details</h2>
          <p>Name: {response.medication.name}</p>
          <p>Dosage: {response.medication.dosage}</p>
          <p>Instructions: {response.medication.instructions}</p>
        </div>
      )}
    </div>
  );
};

export default App;
