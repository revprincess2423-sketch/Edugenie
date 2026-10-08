import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const err = (m, status = 400) =>
  Object.assign(new Error(m), { status });

const hasKey = () => {
  const k = process.env.GEMINI_API_KEY;
  return !!k && !k.startsWith('your_');
};

async function gemini(contents, { system, json } = {}) {
  if (!hasKey()) {
    throw err(
      'Gemini API key is missing. Please set GEMINI_API_KEY in Render Environment.',
      500
    );
  }

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents,
        ...(system && {
          systemInstruction: {
            parts: [{ text: system }]
          }
        }),
        generationConfig: json
          ? { responseMimeType: 'application/json' }
          : {}
      })
    }
  );

  const d = await r.json().catch(() => ({}));

  if (!r.ok) {
    throw err(
      d.error?.message || 'Gemini API error.',
      502
    );
  }

  const t = (d.candidates?.[0]?.content?.parts || [])
    .map(p => p.text || '')
    .join('');

  if (!t) {
    throw err(
      'Gemini returned an empty response. Try rephrasing.',
      502
    );
  }

  return json ? JSON.parse(t) : t;
}

const user = t => [
  {
    role: 'user',
    parts: [{ text: t }]
  }
];

const need = (...v) => {
  if (v.some(x => !String(x ?? '').trim())) {
    throw err('Please fill in all required fields.');
  }
};

const PLAIN =
  'Use plain text only: no markdown symbols like ** or #. Use short headings in CAPS and "-" bullets.';

const route = (p, fn) =>
  app.post('/api/' + p, async (q, s) => {
    try {
      s.json(await fn(q.body || {}));
    } catch (e) {
      console.error(`[${p}]`, e.message);

      s.status(e.status || 500).json({
        error:
          e instanceof SyntaxError
            ? "Could not read Gemini's response. Please try again."
            : e.message
      });
    }
  });

/* =========================
   API ROUTES
========================= */

app.get('/api/health', (q, s) =>
  s.json({
    ok: true,
    keyConfigured: hasKey()
  })
);

route('chat', async ({ messages }) => {
  if (!Array.isArray(messages) || !messages.length) {
    throw err('Please type a question.');
  }

  const contents = messages
    .slice(-20)
    .map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: String(m.text) }]
    }));

  return {
    text: await gemini(contents, {
      system: `You are EduGenie, a friendly tutor. Give simple, clear, accurate, student-friendly answers with examples. ${PLAIN}`
    })
  };
});

route('explain', async ({ topic, level }) => {
  need(topic, level);

  return {
    text: await gemini(
      user(
        `Explain "${topic}" for a ${level} level student. Include: OVERVIEW, KEY POINTS (bullets), EXAMPLES, QUICK RECAP. ${PLAIN}`
      )
    )
  };
});

route('summarize', async ({ text }) => {
  need(text);

  return await gemini(
    user(
      `Summarize these study notes. Return JSON: {"summary": string (3-4 sentences), "keyPoints": string[], "terms": [{"term": string, "meaning": string}]}.\n\nNOTES:\n${text}`
    ),
    { json: true }
  );
});

route('quiz', async ({ topic, count, level }) => {
  need(topic, level);

  const n = Math.min(
    Math.max(parseInt(count) || 5, 3),
    15
  );

  const questions = await gemini(
    user(
      `Create ${n} ${level} multiple-choice questions about "${topic}". Return a JSON array: [{"question": string, "options": [4 strings], "answer": index 0-3 of correct option, "explanation": string}].`
    ),
    { json: true }
  );

  if (!Array.isArray(questions) || !questions.length) {
    throw err('Could not build a quiz. Try again.', 502);
  }

  return { questions };
});

route('plan', async ({ subject, examDate, hours, level }) => {
  need(subject, examDate, hours, level);

  const today = new Date()
    .toISOString()
    .slice(0, 10);

  const days = await gemini(
    user(
      `Today is ${today}. Create a day-by-day study plan for "${subject}". Exam date: ${examDate}. Study hours per day: ${hours}. Current level: ${level}. Include revision and a final review day. Max 21 days (group days if longer). Return JSON array: [{"day": string like "Day 1", "date": "YYYY-MM-DD", "focus": string, "tasks": string[]}].`
    ),
    { json: true }
  );

  if (!Array.isArray(days)) {
    throw err('Could not build a plan. Try again.', 502);
  }

  return { days };
});

route('flashcards', async ({ input, count }) => {
  need(input);

  const n = Math.min(
    Math.max(parseInt(count) || 8, 3),
    20
  );

  const cards = await gemini(
    user(
      `Create ${n} study flashcards from this topic/notes: "${input}". Return JSON array: [{"front": question, "back": concise answer}].`
    ),
    { json: true }
  );

  if (!Array.isArray(cards) || !cards.length) {
    throw err(
      'Could not build flashcards. Try again.',
      502
    );
  }

  return { cards };
});

/* =========================
   FRONTEND
========================= */

const frontendPath = path.join(
  __dirname,
  '../dist'
);

app.use(express.static(frontendPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  res.sendFile(
    path.join(frontendPath, 'index.html')
  );
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `EduGenie API running on port ${PORT}`
  );

  if (!hasKey()) {
    console.warn(
      '⚠️ GEMINI_API_KEY not set. Add it in Render Environment Variables.'
    );
  }
});