export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(500).json(data);
    }
    res.status(200).json(data);
  } catch (err) {
    console.error('Serverless error:', err);
    res.status(500).json({ error: 'Failed to contact Gemini API', details: err.message });
  }
} 