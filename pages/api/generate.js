// Import necessary modules
import { Configuration, OpenAIApi } from "openai";

// Configure OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Export the serverless function
export default async function (req, res) {
  try {
    // Check if OpenAI API key is configured
    if (!configuration.apiKey) {
      throw new Error("OpenAI API key not configured. Please follow instructions in README.md");
    }

    // Extract location data from the request
    const { origin, destination } = req.body;

    // Validate input
    if (!origin || !destination) {
      throw new Error("Please provide both origin and destination for directions.");
    }

    // Generate directions prompt
    const prompt = generatePrompt(origin, destination);
  
    // Make a request to OpenAI API
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.7,
      max_tokens: 500, // Set an appropriate value based on your needs
    });
    const totalTokensUsed = completion.data.usage.total_tokens;
    // Extract and send the generated directions
    const generatedText = completion.data.choices[0].text;
    res.status(200).json({ result: generatedText });
    console.log(`Total tokens used: ${totalTokensUsed}`);
  } catch (error) {
    // Handle errors
    console.error(`Error in OpenAI API request: ${error.message}`);
    const status = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data : 'An error occurred during your request.';
    res.status(status).json({ error: { message: errorMessage } });
  }
}

// Function to generate a prompt for directions
function generatePrompt(origin, destination) {
  return `Provide directions from ${origin} to ${destination} with all the longitudes and latitudes when turning in format(53.4657,-2.2328) at the end.`;
}