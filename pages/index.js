import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: originInput,
          destination: destinationInput,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      // Save result to a text file
      saveToFile(data.result, 'directions.txt');

      setResult(data.result);
      setOriginInput("");
      setDestinationInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  // Function to save content to a text file
  function saveToFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });

    const reader = new FileReader();
    reader.onload = function () {
      const link = document.createElement('a');
      link.href = reader.result;
      link.download = filename;
      link.click();
    };

    reader.readAsDataURL(blob);
  }

  return (
    <div>
      <Head>
        <title>OpenAI Directions</title>
      </Head>

      <main className={styles.main}>
        <h3>Get Directions</h3>
        <form onSubmit={onSubmit}>
          <label htmlFor="origin">Origin:</label>
          <input
            type="text"
            id="origin"
            name="origin"
            placeholder="Enter origin location"
            value={originInput}
            onChange={(e) => setOriginInput(e.target.value)}
          />
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            id="destination"
            name="destination"
            placeholder="Enter destination location"
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
          />
          <input type="submit" value="Get Directions" />
        </form>
        <div className={styles.result} style={{ whiteSpace: 'pre-line' }}>
          {result}
        </div>
      </main>
    </div>
  );
}
