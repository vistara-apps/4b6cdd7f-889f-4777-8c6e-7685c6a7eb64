import OpenAI from 'openai';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || 'dummy-key-for-build',
    baseURL: "https://openrouter.ai/api/v1",
    dangerouslyAllowBrowser: true,
  });
}

export async function generateAdCopy(productName: string, productImage: string) {
  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter specializing in social media ads. Generate compelling ad copy that converts."
        },
        {
          role: "user",
          content: `Generate 3 different ad copy variations for a product called "${productName}". Each should include:
          1. A catchy headline (max 8 words)
          2. Body text (max 125 characters for social media)
          3. A strong call-to-action
          
          Focus on different angles: emotional appeal, problem-solving, and social proof.
          Return as JSON array with objects containing: headline, body, cta, angle`
        }
      ],
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.error('Error generating ad copy:', error);
    return null;
  }
}

export async function generateOptimizationSuggestions(performanceData: any) {
  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are a performance marketing expert analyzing ad performance data to provide optimization suggestions."
        },
        {
          role: "user",
          content: `Analyze this ad performance data and provide 3 specific optimization suggestions:
          ${JSON.stringify(performanceData)}
          
          Return as JSON array with objects containing: suggestion, reasoning, impact_level (high/medium/low)`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.error('Error generating optimization suggestions:', error);
    return null;
  }
}
