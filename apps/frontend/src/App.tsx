import { useState, useEffect } from "react";
import api from "./api/axios";
import styles from "./App.module.css";

interface PostResponse {
  status: string;
  // Add other properties if your backend returns them
}

function App() {
  const [helloMessage, setHelloMessage] = useState("");
  const [kafkaMessage, setKafkaMessage] = useState("");
  const [postResponse, setPostResponse] = useState<PostResponse | null>(null); // Use the defined interface

  useEffect(() => {
    // Fetch hello message from backend
    api
      .get<string>("/") // Specify response type as string
      .then((response: Axios.AxiosXHR<string>) =>
        setHelloMessage(response.data)
      )
      .catch((error) => console.error("Error fetching hello message:", error)); // Explicitly type error
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response: Axios.AxiosXHR<PostResponse> = await api.post(
        "/message",
        {
          message: kafkaMessage,
        }
      ); // Specify response type
      setPostResponse(response.data);
    } catch (error: any) {
      // Use any for now, or define a more specific error type if needed
      console.error("Error posting message to Kafka:", error);
      setPostResponse({ status: "Error sending message" });
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
        <button type="submit" className={styles.button}>
          Send to Kafka
        </button>
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
