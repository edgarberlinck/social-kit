import { useState, useEffect } from 'react';
import axios, { type AxiosResponse, type AxiosError } from 'axios'; // Import AxiosResponse and AxiosError
import styles from './App.module.css';

interface PostResponse {
  status: string;
  // Add other properties if your backend returns them
}

function App() {
  const [helloMessage, setHelloMessage] = useState('');
  const [kafkaMessage, setKafkaMessage] = useState('');
  const [postResponse, setPostResponse] = useState<PostResponse | null>(null); // Use the defined interface

  useEffect(() => {
    // Fetch hello message from backend
    axios.get<string>('http://localhost:3000') // Specify response type as string
      .then((response: AxiosResponse<string>) => setHelloMessage(response.data))
      .catch((error: AxiosError) => console.error('Error fetching hello message:', error)); // Explicitly type error
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response: AxiosResponse<PostResponse> = await axios.post('http://localhost:3000/message', { message: kafkaMessage }); // Specify response type
      setPostResponse(response.data);
    } catch (error: any) { // Use any for now, or define a more specific error type if needed
      console.error('Error posting message to Kafka:', error);
      setPostResponse({ status: 'Error sending message' });
    }
  };

  return (
    <div className={styles.container}>
      <h1>Frontend Application</h1>

      <div className={styles.message}>
        <h2>Backend Hello Message:</h2>
        <p>{helloMessage}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Post Message to Kafka:</h2>
        <input
          type="text"
          value={kafkaMessage}
          onChange={(e) => setKafkaMessage(e.target.value)}
          placeholder="Enter message"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Send to Kafka</button>
      </form>

      {postResponse && (
        <div className={styles.message}>
          <h2>Kafka Post Response:</h2>
          <pre>{JSON.stringify(postResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
