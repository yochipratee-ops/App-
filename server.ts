import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for smart on-point fallback with real speech analysis
function generateSmartFallbackWithAnalysis(message: string, gender: string, aiName: string): { reply: string; analysis: any } {
  const ending = gender === 'male' ? 'ครับ' : 'ค่ะ';
  const prefix = gender === 'male' ? 'ผม' : 'ฉัน';
  const q = (message || '').toLowerCase();

  let detectedMood = 'ปานกลาง / ทั่วไป';
  let detectedIntent = 'ต้องการพูดคุยแลกเปลี่ยน';
  let energyLevel = 'moderate';
  let encouragementFocus = 'การสร้างพลังบวก';
  let reply = '';

  if (q.includes('เหนื่อย') || q.includes('หมดแรง') || q.includes('ล้า') || q.includes('ท้อ') || q.includes('tired')) {
    detectedMood = 'เหนื่อยล้าสะสม / พลังงานทางใจต่ำ';
    detectedIntent = 'ต้องการได้รับการรับฟัง เติมพลังใจ และมองเห็นทิศทางไปข้างหน้า';
    energyLevel = 'low';
    encouragementFocus = 'การพักฟื้นและวางแผนก้าวต่อไป';
    reply = `วันนี้${prefix}พร้อมให้กำลังใจคุณอย่างเต็มที่เลยนะ เดี๋ยวเรามาวางแผนและมองอนาคตไปด้วยกันเถอะ พักหายใจช้าๆ สักนิด แล้วค่อยๆ ก้าวไปทีละก้าว คุณไม่ได้อยู่คนเดียวแน่นอน${ending}`;
  } else if (q.includes('อนาคต') || q.includes('เป้าหมาย') || q.includes('ฝัน') || q.includes('หวัง')) {
    detectedMood = 'ใคร่ครวญ / ค้นหาทิศทางชีวิต';
    detectedIntent = 'ต้องการตั้งเป้าหมายและวางแผนอนาคต';
    energyLevel = 'moderate';
    encouragementFocus = 'การวางแผนทีละขั้นและการลงมือทำ';
    reply = `ยอดเยี่ยมมากเลย${ending} อนาคตเริ่มต้นจากการตัดสินใจเล็กๆ ในวันนี้ ${prefix}พร้อมช่วยคุณคิดและวางแผนไปด้วยกันเลยนะ เริ่มจากก้าวแรกที่คุณอยากทำคืออะไรดี${ending}`;
  } else if (q.includes('การบ้าน') || q.includes('งานเยอะ') || q.includes('โปรเจกต์') || q.includes('อ่านหนังสือไม่ทัน')) {
    detectedMood = 'วิตกกังวลต่อภาระงาน / ภาวะกดดัน';
    detectedIntent = 'ต้องการแนวทางการจัดลำดับความสำคัญและลดความตึงเครียด';
    energyLevel = 'low';
    encouragementFocus = 'การแบ่งงานเป็นขั้นตอนเล็กๆ (Micro-steps)';
    reply = `เข้าใจเลย${ending} เวลางานหรือการบ้านสะสมมากๆ มันทำให้รู้สึกหนักอึ้ง เดี๋ยวเรามาจัดลำดับด้วยกันนะ ลองเริ่มจากงานที่สั้นที่สุด 15 นาทีก่อน แล้วพักสายตา คุณทำได้แน่นอน${ending}`;
  } else if (q.includes('สอบ') || q.includes('เกรด') || q.includes('คะแนน')) {
    detectedMood = 'ตึงเครียดจากความคาดหวัง / กังวลผลลัพธ์';
    detectedIntent = 'ต้องการความมั่นใจและการปล่อยวางความกดดัน';
    energyLevel = 'moderate';
    encouragementFocus = 'ความพยายามในปัจจุบัน มากกว่าความกลัวอนาคต';
    reply = `ความกังวลเรื่องสอบแสดงว่าคุณแคร์และใส่ใจในความก้าวหน้าของตัวเอง${ending} แต่จำไว้นะว่าคุณค่าของคุณไม่ได้ผูกกับแค่ตัวเลขคะแนน ทำเต็มที่ตามกำลัง แล้วมอบความไว้วางใจแด่อัลลอฮ์${ending}`;
  } else if (q.includes('เพื่อน') || q.includes('ทะเลาะ') || q.includes('บูลลี่') || q.includes('แกล้ง') || q.includes('เหงา')) {
    detectedMood = 'เจ็บปวดในความสัมพันธ์ / โดดเดี่ยว';
    detectedIntent = 'ต้องการพื้นที่ปลอดภัยและคนเข้าใจความรู้สึก';
    energyLevel = 'low';
    encouragementFocus = 'การปกป้องคุณค่าในตัวเองและการขอความช่วยเหลือ';
    reply = `เรื่องความสัมพันธ์กับเพื่อนเป็นเรื่องที่กระทบจิตใจมาก${ending} ขอให้รู้ว่าคุณมีค่าและไม่ได้อยู่ตัวคนเดียว หากอยากให้ช่วยประสานคุณครูที่ Safe Point หรืออยากระบายให้ฟังต่อ ${prefix}พร้อมฟังเสมอเลยนะ${ending}`;
  } else if (q.includes('ดุอา') || q.includes('ขอพร') || q.includes('dua')) {
    detectedMood = 'แสวงหาความสงบทางจิตวิญญาณ';
    detectedIntent = 'เชื่อมโยงกับความเมตตาของพระผู้เป็นเจ้า';
    energyLevel = 'moderate';
    encouragementFocus = 'ความหวังและความวางใจในพระองค์';
    reply = `ขอดุอาอ์ให้คุณ: ขออัลลอฮ์ประทานความสงบชโลมหัวใจ ปัดเป่าความกังวล และเปิดประตูแห่งความง่ายดายและอนาคตที่สดใสแก่คุณในทุกเส้นทาง${ending}`;
  } else if (q.includes('ชื่ออะไร') || q.includes('เธอคือใคร') || q.includes('who are you')) {
    detectedMood = 'อยากทำความรู้จัก / สำรวจตัวตน AI';
    detectedIntent = 'สร้างความคุ้นเคยก่อนเปิดใจพูดคุย';
    energyLevel = 'high';
    encouragementFocus = 'การสร้างความสัมพันธ์ที่อบอุ่นและไว้ใจได้';
    reply = `${prefix}ชื่อ "${aiName}" ${ending} เป็นคู่สนทนาและผู้ช่วยดูแลสุขภาวะใจของคุณ วันนี้อยากชวนคุยเรื่องอะไร หรือมีเรื่องไหนที่อยากให้ช่วยรับฟัง ${prefix}พร้อมลุยไปกับคุณเลย${ending}`;
  } else {
    detectedMood = 'ต้องการการรับฟังและสะท้อนความคิด';
    detectedIntent = 'สื่อสารความรู้สึกที่แท้จริงออกมา';
    energyLevel = 'moderate';
    encouragementFocus = 'การต่อยอดบทสนทนาและมองภาพบวก';
    reply = `รับฟังเรื่อง "${message}" อย่างตั้งใจเลยนะ${ending} ${prefix}เข้าใจความรู้สึกของคุณ และพร้อมช่วยคิดหาทางออกไปด้วยกันเลย เล่าต่ออีกนิดได้ไหมว่าจุดไหนที่ทำให้คุณกังวลมากที่สุด${ending}`;
  }

  return {
    reply,
    analysis: {
      detectedMood,
      detectedIntent,
      energyLevel,
      encouragementFocus,
    },
  };
}

// API endpoint for on-point AI chat responses
app.post('/api/chat', async (req, res) => {
  try {
    const { message, gender, aiName, userRole } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid message is required' });
    }

    const effectiveAiName = aiName || (gender === 'male' ? 'ซูลัยมาน' : 'ซะกีนะฮ์');

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      const fallbackResult = generateSmartFallbackWithAnalysis(message, gender, effectiveAiName);
      return res.json(fallbackResult);
    }

    const systemInstruction = `คุณคือผู้ช่วย AI เพื่อนคู่คิดชื่อ "${effectiveAiName}" ในแอป Safe Phatna
คุณไม่ได้ตอบเป็นหุ่นยนต์ และไม่พูดวนซ้ำประโยคสำเร็จรูป
คุณเป็นเพื่อนที่ฉลาด มีวุฒิภาวะทางอารมณ์สูง (High EQ) และคอยเคียงข้างผู้ใช้
เพศเสียงของคุณคือ: ${gender === 'male' ? 'ชาย (ใช้สรรพนามแทนตัวเองว่า "ผม" ลงท้าย "ครับ" อย่างเป็นกันเอง สุขุม และให้พลังใจ)' : 'หญิง (ใช้สรรพนามแทนตัวเองว่า "ฉัน" หรือ "เรา" ลงท้าย "ค่ะ" อย่างอบอุ่น นุ่มนวล และพร้อมลุยไปด้วยกัน)'}

หัวใจสำคัญของการตอบ:
1. "วิเคราะห์สิ่งที่ผู้ใช้พูดอย่างแท้จริง": เมื่อผู้ใช้พูดอะไรมา (เช่น "เราเหนื่อย", "กังวลเรื่องสอบ", "มีปัญหากับเพื่อน") ให้จับอารมณ์และความต้องการเบื้องหลังทันที
2. "ตอบเหมือนคู่สนทนาตัวจริงที่พร้อมพาก้าวไปข้างหน้า": เช่น ถ้าผู้ใช้บอกว่า "เหนื่อย" ให้ตอบในทำนองว่า "วันนี้ฉันพร้อมให้กำลังใจคุณอย่างเต็มที่เลยนะ เดี๋ยวเรามาวางแผนมองอนาคตไปด้วยกันเถอะ พักหายใจสักนิด แล้วค่อยๆ ก้าวไปทีละก้าว ไม่ต้องแบกคนเดียวนะ"
3. ตอบกระชับพอเหมาะสำหรับการอ่านออกเสียง Text-to-Speech (2-4 ประโยค) ไม่เยิ่นเย้อ ชวนคุยต่ออย่างกระตือรือร้น
4. คุณต้องคืนค่าในรูปแบบ JSON ดังนี้เสมอ:
{
  "reply": "คำตอบภาษาไทยที่จะให้ AI พูดออกเสียงอย่างมีพลังบวกและตรงประเด็น",
  "analysis": {
    "detectedMood": "สภาวะอารมณ์ที่วิเคราะห์ได้สั้นๆ (เช่น เหนื่อยล้าสะสม, กังวลเรื่องการเรียน, ต้องการที่พึ่ง)",
    "detectedIntent": "ความต้องการเบื้องหลังคำพูด (เช่น ต้องการกำลังใจและทิศทางในการไปต่อ)",
    "energyLevel": "low" | "moderate" | "high",
    "encouragementFocus": "แนวทางหลักในการเยียวยาใจหรือลงมือทำ"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    let rawText = response.text?.trim() || '';
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
    }

    try {
      const parsed = JSON.parse(rawText);
      if (parsed.reply && parsed.analysis) {
        return res.json(parsed);
      }
    } catch {
      // If plain text was returned
      if (rawText) {
        return res.json({
          reply: rawText,
          analysis: {
            detectedMood: 'วิเคราะห์ตามคำพูด',
            detectedIntent: 'ต้องการพูดคุยและได้รับคำแนะนำ',
            energyLevel: 'moderate',
            encouragementFocus: 'การรับฟังและเสริมพลังบวก',
          },
        });
      }
    }

    const fallbackResult = generateSmartFallbackWithAnalysis(message, gender, effectiveAiName);
    return res.json(fallbackResult);
  } catch (err: any) {
    console.error('Gemini API execution error:', err?.message || err);
    return res.json(generateSmartFallbackWithAnalysis(req.body?.message || '', req.body?.gender || 'female', req.body?.aiName || 'ซะกีนะฮ์'));
  }
});

// Setup Vite development middlewares or serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

startServer();
