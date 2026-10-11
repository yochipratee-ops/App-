import { SpeechAnalysis } from '../types';

export interface AiResponseResult {
  reply: string;
  analysis: SpeechAnalysis;
}

// Client-side AI service to fetch direct on-point response from backend proxy
export async function getDirectAiResponse(
  message: string,
  gender: 'female' | 'male',
  aiName: string,
  userRole: string = 'student'
): Promise<AiResponseResult> {
  const cleanMsg = message.trim();
  if (!cleanMsg) {
    return {
      reply: '',
      analysis: {
        detectedMood: 'ปกติ',
        detectedIntent: 'เริ่มต้นสนทนา',
        energyLevel: 'moderate',
        encouragementFocus: 'การรับฟัง',
      },
    };
  }

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: cleanMsg,
        gender,
        aiName,
        userRole,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        return {
          reply: data.reply,
          analysis: data.analysis || generateClientSpeechAnalysis(cleanMsg),
        };
      }
    }
  } catch (err) {
    console.warn('API route call fallback, using client contextual speech engine:', err);
  }

  // Client-side intelligent contextual fallback directly addressing what was said
  return generateClientContextualReplyWithAnalysis(cleanMsg, gender, aiName);
}

export function generateClientSpeechAnalysis(text: string): SpeechAnalysis {
  const lower = text.toLowerCase();
  if (lower.includes('เหนื่อย') || lower.includes('หมดแรง') || lower.includes('ล้า') || lower.includes('ท้อ') || lower.includes('tired')) {
    return {
      detectedMood: 'เหนื่อยล้าสะสม / พลังงานใจต่ำ',
      detectedIntent: 'ต้องการได้รับการรับฟัง เติมพลังใจ และมองเห็นทิศทางไปข้างหน้า',
      energyLevel: 'low',
      encouragementFocus: 'การพักฟื้น เติมพลังบวก และวางแผนอนาคตไปด้วยกัน',
    };
  }
  if (lower.includes('อนาคต') || lower.includes('เป้าหมาย') || lower.includes('ฝัน') || lower.includes('หวัง') || lower.includes('future')) {
    return {
      detectedMood: 'ใคร่ครวญ / ค้นหาทิศทางชีวิต',
      detectedIntent: 'ต้องการตั้งเป้าหมายและวางแผนอนาคต',
      energyLevel: 'moderate',
      encouragementFocus: 'การวางแผนทีละขั้นและการลงมือทำ',
    };
  }
  if (lower.includes('การบ้าน') || lower.includes('งานเยอะ') || lower.includes('โปรเจกต์') || lower.includes('งานกลุ่ม')) {
    return {
      detectedMood: 'วิตกกังวลต่อภาระงาน / ภาวะกดดัน',
      detectedIntent: 'ต้องการแนวทางการจัดลำดับความสำคัญและลดความตึงเครียด',
      energyLevel: 'low',
      encouragementFocus: 'การแบ่งงานเป็นขั้นตอนเล็กๆ (Micro-steps)',
    };
  }
  if (lower.includes('สอบ') || lower.includes('เกรด') || lower.includes('คะแนน') || lower.includes('อ่านหนังสือ')) {
    return {
      detectedMood: 'ตึงเครียดจากความคาดหวัง / กังวลผลสอบ',
      detectedIntent: 'ต้องการความมั่นใจและการปล่อยวางความกดดัน',
      energyLevel: 'moderate',
      encouragementFocus: 'ความพยายามในปัจจุบัน มากกว่าความกลัวอนาคต',
    };
  }
  if (lower.includes('เพื่อน') || lower.includes('ทะเลาะ') || lower.includes('บูลลี่') || lower.includes('แกล้ง') || lower.includes('เหงา')) {
    return {
      detectedMood: 'เจ็บปวดในความสัมพันธ์ / โดดเดี่ยว',
      detectedIntent: 'ต้องการพื้นที่ปลอดภัยและคนเข้าใจความรู้สึก',
      energyLevel: 'low',
      encouragementFocus: 'การปกป้องคุณค่าในตัวเองและการขอความช่วยเหลือ',
    };
  }
  if (lower.includes('ชื่อ') || lower.includes('name') || lower.includes('ใคร') || lower.includes('เธอคือ')) {
    return {
      detectedMood: 'อยากทำความรู้จัก / สร้างความคุ้นเคย',
      detectedIntent: 'สร้างความคุ้นเคยก่อนเปิดใจพูดคุย',
      energyLevel: 'high',
      encouragementFocus: 'การสร้างความสัมพันธ์ที่อบอุ่นและไว้ใจได้',
    };
  }
  return {
    detectedMood: 'ต้องการการรับฟังและสะท้อนความคิด',
    detectedIntent: 'สื่อสารเรื่องราวที่อยู่ในใจออกมา',
    energyLevel: 'moderate',
    encouragementFocus: 'การรับฟังอย่างลึกซึ้งและการชวนคิดต่อ',
  };
}

export function generateClientContextualReplyWithAnalysis(
  text: string,
  gender: 'female' | 'male',
  aiName: string
): AiResponseResult {
  const ending = gender === 'male' ? 'ครับ' : 'ค่ะ';
  const prefix = gender === 'male' ? 'ผม' : 'ฉัน';
  const lower = text.toLowerCase();
  const analysis = generateClientSpeechAnalysis(text);

  let reply = '';

  if (lower.includes('ชื่อ') || lower.includes('name') || lower.includes('ใคร') || lower.includes('เธอคือ')) {
    reply = `${prefix}ชื่อ "${aiName}" ${ending} เป็นคู่สนทนาและผู้ช่วยดูแลสุขภาวะใจของคุณ วันนี้อยากชวนคุยเรื่องอะไร หรือมีเรื่องไหนที่อยากให้ช่วยรับฟัง ${prefix}พร้อมลุยไปกับคุณเลย${ending}`;
  } else if (lower.includes('เหนื่อย') || lower.includes('หมดแรง') || lower.includes('ล้า') || lower.includes('ท้อ') || lower.includes('tired')) {
    reply = `วันนี้${prefix}พร้อมให้กำลังใจคุณอย่างเต็มที่เลยนะ เดี๋ยวเรามาวางแผนและมองอนาคตไปด้วยกันเถอะ พักหายใจช้าๆ สักนิด แล้วค่อยๆ ก้าวไปทีละก้าว คุณไม่ได้อยู่คนเดียวแน่นอน${ending}`;
  } else if (lower.includes('อนาคต') || lower.includes('เป้าหมาย') || lower.includes('ฝัน') || lower.includes('หวัง')) {
    reply = `ยอดเยี่ยมมากเลย${ending} อนาคตเริ่มต้นจากการตัดสินใจเล็กๆ ในวันนี้ ${prefix}พร้อมช่วยคุณคิดและวางแผนไปด้วยกันเลยนะ เริ่มจากก้าวแรกที่คุณอยากทำคืออะไรดี${ending}`;
  } else if (lower.includes('การบ้าน') || lower.includes('งานเยอะ') || lower.includes('โปรเจกต์') || lower.includes('งานกลุ่ม')) {
    reply = `เข้าใจเลย${ending} เวลางานหรือการบ้านสะสมมากๆ มันทำให้รู้สึกหนักอึ้ง เดี๋ยวเรามาจัดลำดับด้วยกันนะ ลองเริ่มจากงานที่สั้นที่สุด 15 นาทีก่อน แล้วพักสายตา คุณทำได้แน่นอน${ending}`;
  } else if (lower.includes('สอบ') || lower.includes('เกรด') || lower.includes('คะแนน') || lower.includes('อ่านหนังสือ')) {
    reply = `ความกังวลเรื่องสอบแสดงว่าคุณแคร์และใส่ใจในความก้าวหน้าของตัวเอง${ending} แต่จำไว้นะว่าคุณค่าของคุณไม่ได้ผูกกับแค่ตัวเลขคะแนน ทำเต็มที่ตามกำลัง แล้วมอบความไว้วางใจแด่อัลลอฮ์${ending}`;
  } else if (lower.includes('เพื่อน') || lower.includes('ทะเลาะ') || lower.includes('บูลลี่') || lower.includes('แกล้ง') || lower.includes('เหงา')) {
    reply = `เรื่องความสัมพันธ์กับเพื่อนเป็นเรื่องที่กระทบจิตใจมาก${ending} ขอให้รู้ว่าคุณมีค่าและไม่ได้อยู่ตัวคนเดียว หากอยากให้ช่วยประสานคุณครูที่ Safe Point หรืออยากระบายให้ฟังต่อ ${prefix}พร้อมฟังเสมอเลยนะ${ending}`;
  } else if (lower.includes('ดุอา') || lower.includes('ขอพร') || lower.includes('dua')) {
    reply = `ขอดุอาอ์ให้คุณ: ขออัลลอฮ์ประทานความสงบชโลมหัวใจ ปัดเป่าความกังวล และเปิดประตูแห่งความง่ายดายและอนาคตที่สดใสแก่คุณในทุกเส้นทาง${ending}`;
  } else if (lower.includes('เศร้า') || lower.includes('ร้องไห้') || lower.includes('เสียใจ')) {
    reply = `ไม่ผิดเลยที่จะรู้สึกเสียใจหรืออยากร้องไห้ออกมาในตอนนี้${ending} ปลดปล่อยความอึดอัดออกมาได้เลย ${prefix}พร้อมนั่งอยู่ข้างๆ และรับฟังคุณเสมอ${ending}`;
  } else if (lower.includes('ปวดหัว') || lower.includes('ไม่สบาย') || lower.includes('ป่วย')) {
    reply = `หากรู้สึกไม่สบายตัว แวะไปพักที่ห้องพยาบาล อาคาร 1 ชั้น 1 ได้เลยนะ${ending} ดื่มน้ำอุ่นมากๆ และพักผ่อนให้เพียงพอ ขอให้หายไวๆ นะ${ending}`;
  } else {
    reply = `รับฟังเรื่อง "${text}" อย่างตั้งใจเลยนะ${ending} ${prefix}เข้าใจความรู้สึกของคุณ และพร้อมช่วยคิดหาทางออกไปด้วยกันเลย เล่าต่ออีกนิดได้ไหมว่าจุดไหนที่ทำให้คุณกังวลมากที่สุด${ending}`;
  }

  return {
    reply,
    analysis,
  };
}
