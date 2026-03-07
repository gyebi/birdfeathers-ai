/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");

const openaiKey = defineSecret("OPENAI_API_KEY");

setGlobalOptions({ maxInstances: 10 });

function cors(res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
}

exports.aiInsights = onRequest(
  { secrets: [openaiKey] },
  async (req, res) => {

    cors(res);

    if (req.method === "OPTIONS") return res.status(204).send("");
    if (req.method !== "POST")
      return res.status(405).json({ error: "Use POST" });

    try {
      const { cycle } = req.body || {};
      if (!cycle)
        return res.status(400).json({ error: "Missing cycle" });

      const apiKey = openaiKey.value();
      if (!apiKey)
        return res.status(500).json({ error: "Missing OpenAI key" });

      const prompt = [
        "You are a poultry farm financial & operations analyst.",
        "Return STRICT JSON only with this shape:",
        '{ "summary": string, "warnings": string[], "recommendations": string[] }',
        "Keep it concise, practical, and based on the provided data.",
        "Cycle data:",
        JSON.stringify(cycle),
      ].join("\n");

      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      });

      if (!aiRes.ok) {
        const errText = await aiRes.text();
        logger.error("OpenAI error:", errText);
        return res.status(500).json({ error: "AI request failed" });
      }

      const data = await aiRes.json();
      //const text = data.choices?.[0]?.message?.content || "{}";
      let text = data.choices?.[0]?.message?.content || "{}";

      // Remove markdown code fences if present
      text = text.replace(/```json/g, "")
           .replace(/```/g, "")
           .trim();

      res.set("Content-Type", "application/json");
      return res.status(200).send(text);

    } catch (e) {
      logger.error("Server crash:", e);
      return res.status(500).json({ error: "Server crashed" });
    }
  }
);