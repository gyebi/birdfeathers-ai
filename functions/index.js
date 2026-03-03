/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions"); // ADD THIS

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

//const { onRequest } = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");

function cors(res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
}

exports.aiInsights = onRequest(async (req, res) => {
  cors(res);

  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    const { cycle } = req.body || {};
    if (!cycle) return res.status(400).json({ error: "Missing cycle" });


    const apiKey = functions.config().openai.key;
    if (!apiKey) return res.status(500).json({ error: "Missing OpenAI key" });

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
      logger.error("OpenAI error", errText);
      return res.status(500).json({ error: "AI request failed" });
    }

    const data = await aiRes.json();
    const text = data.choices?.[0]?.message?.content || "{}";

    // Send back JSON text (already JSON) to the frontend
    res.set("Content-Type", "application/json");
    return res.status(200).send(text);
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ error: "Server crashed" });
  }
});