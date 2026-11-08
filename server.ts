import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Candidate models in priority order: if a model has high demand (503/429), fallback smoothly
const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

async function generateWithFallbackAndRetry(params: {
  contents: string;
  systemInstruction?: string;
}): Promise<string> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.systemInstruction
            ? { systemInstruction: params.systemInstruction }
            : undefined
        });

        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err);
        const isTransient =
          msg.includes('503') ||
          msg.includes('high demand') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('429') ||
          msg.includes('RESOURCE_EXHAUSTED');

        console.warn(`Attempt ${attempt + 1} with model ${model} failed (${isTransient ? 'transient' : 'permanent'}):`, msg);

        if (isTransient) {
          // Wait briefly with backoff before retry or fallback
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
        } else {
          // If non-transient error, break attempt loop and try next model
          break;
        }
      }
    }
  }

  throw lastError || new Error('មិនអាចបង្កើតមាតិកាបានទេនៅពេលនេះ។ សូមព្យាយាមម្តងទៀត។');
}

// API endpoint to generate MoEYS 5-Step Lesson Plan
app.post('/api/generate-lesson-plan', async (req: Request, res: Response) => {
  try {
    const { grade, subject, chapter, title, outcome, pages, hours, schoolName, teacherName } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'មិនទាន់មាន GEMINI_API_KEY នៅក្នុងប្រព័ន្ធទេ។ សូមពិនិត្យការកំណត់ Secrets។'
      });
    }

    const prompt = `
អ្នកគឺជាអ្នកឯកទេសគរុកោសល្យ និងជាគ្រូបង្រៀនគំរូនៃក្រសួងអប់រំ យុវជន និងកីឡាកម្ពុជា (MoEYS Cambodia)។
សូមរៀបចំ "កិច្ចតែងការបង្រៀនស្តង់ដារ ៥ ជំហាន" តាមទម្រង់ផ្លូវការរបស់ក្រសួងអប់រំកម្ពុជា ជាភាសាខ្មែរយ៉ាងលម្អិត និងត្រឹមត្រូវបំផុត៖

ព័ត៌មានមេរៀន៖
- សាលារៀន៖ ${schoolName || 'សាលាបឋមសិក្សា'}
- គ្រូបង្រៀន៖ ${teacherName || 'លោកគ្រូ/អ្នកគ្រូ'}
- ថ្នាក់៖ ${grade || 'ថ្នាក់បឋមសិក្សា'}
- មុខវិជ្ជា៖ ${subject || ''}
- ជំពូក/មេរៀន៖ ${chapter || ''}
- ចំណងជើងមេរៀន៖ ${title || ''}
- វត្ថុបំណង/លទ្ធផលរំពឹងទុក៖ ${outcome || ''}
- ទំព័រសៀវភៅ៖ ${pages || ''}
- រយៈពេលបង្រៀន៖ ${hours || '១ម៉ោង (៤០ នាទី)'}

ទម្រង់កិច្ចតែងការ ៥ ជំហានដែលត្រូវរៀបចំ៖
I. វត្ថុបំណង (វិជ្ជាសម្បទា បំណិនសម្បទា ចរិយាសម្បទា)
II. សម្ភារឧបទេស (សម្ភារគ្រូ សម្ភារសិស្ស)
III. ដំណើរការបង្រៀននិងរៀន (តារាង ៣ កាឡោនតាមលំដាប់លំដោយម៉ឺងម៉ាត់៖ សកម្មភាពគ្រូ | ខ្លឹមសារមេរៀន | សកម្មភាពសិស្ស)៖
តម្រូវការចាំបាច់៖ ត្រូវរៀបចំកាឡោនទី១ ជា «សកម្មភាពគ្រូ», កាឡោនទី២ ជា «ខ្លឹមសារមេរៀន», និងកាឡោនទី៣ ជា «សកម្មភាពសិស្ស» គ្រប់ជំហានទាំង ៥៖
| សកម្មភាពគ្រូ | ខ្លឹមសារមេរៀន | សកម្មភាពសិស្ស |
| :--- | :--- | :--- |
- ជំហានទី១៖ រដ្ឋបាលថ្នាក់ (២ នាទី)
- ជំហានទី២៖ រំលឹកមេរៀនចាស់ ឬត្រួតពិនិត្យកិច្ចការផ្ទះ (៥ នាទី)
- ជំហានទី៣៖ មេរៀនថ្មី (២៥ នាទី) (ការណែនាំ, ការបង្ហាញ, ការអនុវត្តរួម, ការអនុវត្តជាក្រុម/បុគ្គល)
- ជំហានទី៤៖ ពង្រឹងពុទ្ធិ/ចំណេះដឹង (៥ នាទី)
- ជំហានទី៥៖ បណ្តាំផ្ញើ និងកិច្ចការផ្ទះ (៣ នាទី)
IV. ការវាយតម្លៃ និងកែលម្អការបង្រៀន

សូមសរសេរជាភាសាខ្មែរផ្លូវការ ស្រស់ស្អាត មានលក្ខណៈគរុកោសល្យជាក់ស្តែង និងអាចបោះពុម្ពប្រើប្រាស់ក្នុងថ្នាក់រៀនភ្លាមៗបាន។`;

    const text = await generateWithFallbackAndRetry({
      contents: prompt,
      systemInstruction:
        'អ្នកជាគ្រូបង្រៀនបឋមសិក្សាជំនាញ និងអ្នកតាក់តែងកិច្ចតែងការបង្រៀនផ្លូវការនៃក្រសួងអប់រំ យុវជន និងកីឡាកម្ពុជា។ ឆ្លើយជាទម្រង់ Markdown ស្អាតបាត និងជាភាសាខ្មែរត្រឹមត្រូវ។'
    });

    res.json({ content: text });
  } catch (err: any) {
    console.error('Error in /api/generate-lesson-plan:', err);
    const msg = String(err?.message || err);
    let friendlyError = 'មានបញ្ហាក្នុងការបង្កើតកិច្ចតែងការបង្រៀន។';
    if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
      friendlyError = 'ម៉ាស៊ីនបម្រើ AI កំពុងមានសំណើច្រើនក្នុងពេលតែមួយ (High Demand)។ សូមចុចប៊ូតុង "ព្យាយាមម្តងទៀត"។';
    }
    res.status(500).json({
      error: friendlyError,
      technicalDetails: msg
    });
  }
});

// API endpoint to generate Quizzes / Exercises
app.post('/api/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { grade, subject, chapter, title, outcome } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'មិនទាន់មាន GEMINI_API_KEY នៅក្នុងប្រព័ន្ធទេ។'
      });
    }

    const prompt = `
សូមបង្កើតកម្រងសំណួរវាយតម្លៃ និងលំហាត់អនុវត្តចំនួន ៥ សំណួរ សម្រាប់សិស្សបឋមសិក្សា ${grade} លើមុខវិជ្ជា ${subject}៖
- ជំពូក៖ ${chapter}
- មេរៀន៖ ${title}
- វត្ថុបំណង៖ ${outcome}

ទម្រង់រួមមាន៖
១. សំណួរជ្រើសរើសចម្លើយពិត (Multiple Choice) ៣ សំណួរ (ក, ខ, គ, ឃ) ជាមួយចម្លើយត្រឹមត្រូវ និងការពន្យល់ខ្លី
២. សំណួរបំពេញចន្លោះ ឬសំណួរត្រិះរិះខ្លី ២ សំណួរ
៣. គន្លឹះណែនាំសម្រាប់សិស្ស

សូមសរសេរជាភាសាខ្មែរ ងាយយល់ សមស្របនឹងកម្រិតសិស្សបឋមសិក្សា។`;

    const text = await generateWithFallbackAndRetry({
      contents: prompt
    });

    res.json({ content: text });
  } catch (err: any) {
    console.error('Error in /api/generate-quiz:', err);
    const msg = String(err?.message || err);
    let friendlyError = 'មានបញ្ហាក្នុងការបង្កើតសំណួរតេស្ត។';
    if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
      friendlyError = 'ម៉ាស៊ីនបម្រើ AI កំពុងមានសំណើច្រើនក្នុងពេលតែមួយ (High Demand)។ សូមចុចប៊ូតុង "ព្យាយាមម្តងទៀត"។';
    }
    res.status(500).json({
      error: friendlyError,
      technicalDetails: msg
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Curriculum App running at http://0.0.0.0:${port}`);
  });
}

startServer();
