import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Endpoint 1: Dynamic daily liturgical update (Mass readings, Saint of the Day, Gospel Commentary, Homily, Magisterium briefing)
  app.post('/api/daily-liturgy', async (req, res) => {
    const { dateIso } = req.body as { dateIso?: string };
    const targetDate = dateIso || new Date().toISOString().slice(0, 10);

    const ai = getGenAIClient();
    if (!ai) {
      res.status(503).json({
        error: 'Server Gemini API key not configured. Using built-in Roman Ordo database.',
      });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Provide the complete Catholic daily liturgical package for the date ${targetDate} according to the General Roman Calendar and Catholic Lectionary (RSV-CE / NABRE style). Include:
1. Liturgical day title, season, liturgical rank, vestment color, and lectionary cycle.
2. Saint of the Day from the Roman Martyrology (name, feast title, life dates, patronage, biography, and traditional Collect prayer).
3. Complete Daily Mass Readings: First Reading (citation, title, full scripture passage), Responsorial Psalm (citation, antiphon response, verses), Gospel Acclamation (citation and verse), and Gospel Reading (citation, title, full scripture passage).
4. In-depth Bible Commentary on the day's Gospel Reading (historical-liturgical context, verse-by-verse exegesis, and two quotes from the Church Fathers / Catena Aurea) plus a pastoral Daily Homily.
5. One fresh Magisterium AI doctrinal briefing connected to today's readings with exact Catechism of the Catholic Church (CCC) paragraph citations.`,
        config: {
          systemInstruction:
            'You are a faithful Catholic liturgical scholar, patristics theologian, and Roman Ordo editor. Always provide accurate Catholic Lectionary citations, reverent scripture texts, authentic Church Fathers commentary, and exact Catechism citations.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              liturgicalTitle: { type: Type.STRING },
              season: { type: Type.STRING },
              rank: { type: Type.STRING },
              color: { type: Type.STRING },
              cycle: { type: Type.STRING },
              saint: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  title: { type: Type.STRING },
                  dates: { type: Type.STRING },
                  patronage: { type: Type.STRING },
                  biography: { type: Type.STRING },
                  collectPrayer: { type: Type.STRING },
                  quote: { type: Type.STRING },
                },
              },
              readings: {
                type: Type.OBJECT,
                properties: {
                  firstReading: {
                    type: Type.OBJECT,
                    properties: {
                      citation: { type: Type.STRING },
                      subtitle: { type: Type.STRING },
                      text: { type: Type.STRING },
                    },
                  },
                  psalm: {
                    type: Type.OBJECT,
                    properties: {
                      citation: { type: Type.STRING },
                      response: { type: Type.STRING },
                      verses: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                  },
                  alleluia: {
                    type: Type.OBJECT,
                    properties: {
                      citation: { type: Type.STRING },
                      verse: { type: Type.STRING },
                    },
                  },
                  gospel: {
                    type: Type.OBJECT,
                    properties: {
                      citation: { type: Type.STRING },
                      subtitle: { type: Type.STRING },
                      text: { type: Type.STRING },
                    },
                  },
                },
              },
              gospelCommentary: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  historicalContext: { type: Type.STRING },
                  exegesis: { type: Type.STRING },
                  patristicVoices: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        father: { type: Type.STRING },
                        work: { type: Type.STRING },
                        excerpt: { type: Type.STRING },
                      },
                    },
                  },
                  homily: { type: Type.STRING },
                  lectioPrompts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
              },
              magisteriumBriefing: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  catechismRef: { type: Type.STRING },
                  encyclicalRef: { type: Type.STRING },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (error: any) {
      console.error('Error generating daily liturgy:', error);
      res.status(500).json({
        error: error?.message || 'Failed to generate daily liturgy from Gemini API.',
      });
    }
  });

  // Endpoint 2: Magisterium AI Doctrinal & Catechism Query
  app.post('/api/magisterium-query', async (req, res) => {
    const { query } = req.body as { query?: string };
    if (!query || !query.trim()) {
      res.status(400).json({ error: 'Query is required.' });
      return;
    }

    const ai = getGenAIClient();
    if (!ai) {
      res.status(503).json({
        error: 'Server Gemini API key not configured.',
      });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Question for Magisterium AI Research Desk: "${query}". Provide a concise, magisterially faithful synthesis referencing exact paragraphs of the Catechism of the Catholic Church (CCC), Ecumenical Councils, Papal Encyclicals, or Church Fathers.`,
        config: {
          systemInstruction:
            'You are a Catholic Magisterial research scholar synthesizing the Catechism of the Catholic Church, Papal Encyclicals, and Vatican documents with rigorous citations.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              answer: { type: Type.STRING },
              citations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: { type: Type.STRING },
                    reference: { type: Type.STRING },
                    excerpt: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in Magisterium query:', error);
      res.status(500).json({
        error: error?.message || 'Failed to complete Magisterium AI query.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ordo & Lectio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
