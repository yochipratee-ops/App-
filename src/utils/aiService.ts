import { SpeechAnalysis, FormalMoodCheckIn, VoiceGender, Language } from '../types';

export interface AiResponseResult {
  reply: string;
  analysis: SpeechAnalysis;
}

export interface DiaryReflectionResult {
  replyTh: string;
  replyEn: string;
  keyThemeTh: string;
  keyThemeEn: string;
  actionAdviceTh: string;
  actionAdviceEn: string;
  recommendedSurahNumber: number;
  recommendedSurahName: string;
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

export function generateDiaryReflection(
  entryText: string,
  moodScale: FormalMoodCheckIn,
  aiName: string,
  gender: VoiceGender = 'female',
  language: Language = 'th'
): DiaryReflectionResult {
  const ending = gender === 'male' ? 'ครับ' : 'ค่ะ';
  const prefix = gender === 'male' ? 'ผม' : 'ฉัน';
  const lower = entryText.toLowerCase();

  // Detect specific topics in the written diary
  const isFriendTopic = lower.includes('เพื่อน') || lower.includes('ทะเลาะ') || lower.includes('แกล้ง') || lower.includes('บูลลี่') || lower.includes('เหงา');
  const isStudyTopic = lower.includes('สอบ') || lower.includes('การบ้าน') || lower.includes('เกรด') || lower.includes('เรียน') || lower.includes('คะแนน') || lower.includes('โปรเจกต์');
  const isFamilyTopic = lower.includes('บ้าน') || lower.includes('พ่อ') || lower.includes('แม่') || lower.includes('ครอบครัว');
  const isTiredTopic = lower.includes('เหนื่อย') || lower.includes('หมดแรง') || lower.includes('ล้า') || lower.includes('นอนไม่หลับ');
  const isGratitudeTopic = lower.includes('ขอบคุณ') || lower.includes('ดีใจ') || lower.includes('มีความสุข') || lower.includes('สำเร็จ') || lower.includes('อัลฮัมดุลิลลาฮ์') || lower.includes('alhamdulillah');

  // Level 1: Stable & Positive or Calm
  if (moodScale.level === 1) {
    let specificDetail = '';
    if (isStudyTopic) specificDetail = ' เรื่องการเรียนและความมุ่งมั่นที่คุณเขียนถึง เป็นหลักฐานชั้นดีว่าความพยายามของคุณกำลังผลิดอกออกผล';
    else if (isFriendTopic) specificDetail = ' มิตรภาพและความอบอุ่นที่คุณได้พบเจอในวันนี้คือของขวัญอันล้ำค่าที่น่าจดจำ';
    else if (isGratitudeTopic) specificDetail = ' การที่คุณมองเห็นสิ่งดีๆ และขอบคุณในสิ่งที่มี คือบ่อเกิดของความสุขและบารอกัตอันแท้จริง';
    else specificDetail = ' การที่ได้ถ่ายทอดเรื่องราวที่ทำให้จิตใจอิ่มเอมลงในบันทึกนี้ จะเป็นสมอตรึงความรู้สึกมั่นคงไว้ในใจคุณ';

    return {
      replyTh: `${prefix} ${aiName} ได้อ่านบันทึกของคุณแล้ว รู้สึกปีติและอบอุ่นใจตามไปด้วยจริงๆ${ending}${specificDetail} สภาพจิตใจที่มั่นคงและสงบในวันนี้ เป็นรากฐานที่ยอดเยี่ยมมาก จงโอบกอดพลังบวกนี้ไว้ แล้วส่งต่อรอยยิ้มนี้ให้กับผู้คนรอบข้างนะ${ending}`,
      replyEn: `I've read your diary note and feel deeply uplifted. Your inner stability and gratitude today is a wonderful foundation. Keep cherishing this positive energy!`,
      keyThemeTh: 'ความมั่นคงทางใจ & บันทึกความสุข (Gratitude & Stability)',
      keyThemeEn: 'Emotional Stability & Gratitude',
      actionAdviceTh: 'จดบันทึก 3 สิ่งที่อยากขอบคุณ (Gratitude List) หรือส่งต่อคำพูดดีๆ ให้เพื่อนสนิท 1 คน เพื่อขยายพลังบวกให้กว้างขึ้น',
      actionAdviceEn: 'Write down 3 things you are grateful for today, or share a kind word with a friend.',
      recommendedSurahNumber: 1,
      recommendedSurahName: 'ซูเราะฮ์ อัล-ฟาติฮะฮ์ (ความสงบและสิริมงคล)',
    };
  }

  // Level 2: Moderate Baseline
  if (moodScale.level === 2) {
    let specificDetail = '';
    if (isStudyTopic) specificDetail = ' เรื่องภาระงานและการเรียนที่คุณเขียนถึง ลองค่อยๆ ซอยย่อยเป็นงานชิ้นเล็กๆ 15 นาทีดูนะ จะช่วยให้ใจเบาขึ้นมาก';
    else if (isTiredTopic) specificDetail = ' ความรู้สึกทรงตัวที่ปนความล้าเล็กน้อย เป็นสัญญาณธรรมชาติที่ร่างกายกำลังเตือนให้คุณพักหายใจ';
    else specificDetail = ' วันนี้คุณผ่านเรื่องราวและรับผิดชอบหน้าที่ต่างๆ มาได้อย่างดีมากแล้ว';

    return {
      replyTh: `${prefix} ${aiName} ขอชื่นชมที่คุณแวะมาสำรวจตัวเองในวันนี้${ending}${specificDetail} แม้บางอย่างอาจยังต้องใช้เวลาจัดระบบ แต่ความตั้งใจและสติที่คุณมีในตอนนี้ถือเป็นจุดเริ่มต้นที่ดีมาก ค่อยๆ จัดการทีละเรื่องนะ${ending}`,
      replyEn: `Thank you for taking time to check in. You handled today's routine well. Take one small step at a time, and remember to pause and breathe.`,
      keyThemeTh: 'การปรับสมดุลและจัดระเบียบความคิด (Life Balance & Pacing)',
      keyThemeEn: 'Balance & Thought Pacing',
      actionAdviceTh: 'พักสายตา 5 นาที ยืดเส้นยืดสาย ดื่มน้ำ 1 แก้ว และเลือกทำสิ่งที่สำคัญที่สุดเพียง 1 อย่างก่อนเริ่มต่อ',
      actionAdviceEn: 'Rest your eyes for 5 minutes, stretch, hydrate, and focus on only 1 primary task next.',
      recommendedSurahNumber: 112,
      recommendedSurahName: 'ซูเราะฮ์ อัล-อิคลาศ (ความบริสุทธิ์ใจและความสงบ)',
    };
  }

  // Level 3: Anxiety or Fatigue
  if (moodScale.level === 3) {
    let specificDetail = '';
    if (isStudyTopic) specificDetail = ' ความกังวลเรื่องการเรียนหรือการสอบสะท้อนว่าคุณแคร์อนาคตมาก แต่คุณค่าของคุณไม่ได้ผูกกับตัวเลขคะแนนเพียงอย่างเดียว';
    else if (isFriendTopic) specificDetail = ' ความไม่เข้าใจหรือความเหงากับเพื่อนอาจทำให้ใจหนักอึ้ง แต่ขอให้รู้ว่าคุณมีคุณค่าในตัวเองเสมอ';
    else if (isTiredTopic) specificDetail = ' ความเหนื่อยล้าที่คุณระบายออกมา เป็นสิ่งที่สมควรได้รับการพักผ่อนอย่างแท้จริง ไม่จำเป็นต้องแบกรับทุกอย่างไว้คนเดียว';
    else specificDetail = ' สิ่งที่คุณเขียนระบายออกมา แสดงให้เห็นถึงความกล้าหาญในการยอมรับความรู้สึกของตัวเอง';

    return {
      replyTh: `${prefix} ${aiName} ขออยู่เคียงข้างและรับฟังทุกความกังวลของคุณนะ${ending}${specificDetail} ความกังวลเป็นเพียงความคิดชั่วคราว ไม่ใช่ความจริงทั้งหมดของชีวิต ปล่อยวางสิ่งที่ยังควบคุมไม่ได้ แล้วมอบความไว้วางใจแด่อัลลอฮ์ พระองค์ทรงสัญญาไว้แล้วว่า "พร้อมความยากลำบาก ย่อมมีความง่ายดายตามมาเสมอ"${ending}`,
      replyEn: `I hear your worries and validate every feeling you expressed. Anxiety is temporary; you don't have to carry it alone. Indeed, with hardship comes ease.`,
      keyThemeTh: 'การปลดเปลื้องภาระและความกังวล (Relief & Decompression)',
      keyThemeEn: 'Relief & Emotional Decompression',
      actionAdviceTh: 'ฝึกการหายใจลึกๆ 4-7-8 เป็นเวลา 2 นาที เพื่อผ่อนคลายกล้ามเนื้อ และฟังซูเราะฮ์ อัช-ชัรฮ์ เพื่อเปิดอกให้เบิกบาน',
      actionAdviceEn: 'Practice 4-7-8 deep breathing for 2 minutes to calm the nervous system, and listen to Surah Ash-Sharh.',
      recommendedSurahNumber: 94,
      recommendedSurahName: 'ซูเราะฮ์ อัช-ชัรห์ (การเปิดอกปลดเปลื้องภาระหนัก)',
    };
  }

  // Level 4: Acute Stress or Depression / Loneliness
  if (moodScale.level === 4) {
    return {
      replyTh: `${prefix} ${aiName} รู้สึกขอบคุณมากที่คุณยอมเปิดใจเขียนเล่าเรื่องนี้ออกมา${ending} สิ่งที่คุณกำลังเผชิญมันหนักหนาจริงๆ และไม่แปลกเลยที่คุณจะรู้สึกเจ็บปวดหรือเหนื่อยล้าขนาดนี้ แต่โปรดจำไว้เสมอว่า คุณไม่ได้อยู่ตัวคนเดียวในโลกนี้ ความมืดมิดในวันนี้จะผ่านพ้นไป ดั่งเวลากลางคืนที่จะมีรุ่งอรุณสว่างไสวตามมาเสมอ${ending}`,
      replyEn: `Thank you for your courage in writing this down. What you are carrying is heavy, but you are never alone. Morning light always follows the night.`,
      keyThemeTh: 'การประคับประคองใจในวันที่เหนื่อยล้า (Compassionate Solace)',
      keyThemeEn: 'Compassionate Care & Solace',
      actionAdviceTh: 'วางทุกภาระลงชั่วคราว พักผ่อนให้เต็มที่ หรือหากต้องการคนรับฟัง สามารถกดส่งข้อความนี้ให้อาจารย์แนะแนวช่วยดูแลได้ทันที',
      actionAdviceEn: 'Put heavy burdens down for today. Rest, and consider sharing this note with your guidance counselor.',
      recommendedSurahNumber: 93,
      recommendedSurahName: 'ซูเราะฮ์ อัฎ-ฎุฮา (พระเจ้ามิได้ทอดทิ้งเจ้า)',
    };
  }

  // Level 5: Crisis / Immediate Support Required
  return {
    replyTh: `${prefix} ${aiName} รับทราบถึงสภาวะวิกฤตและสิ่งที่คุณเขียนมาอย่างเร่งด่วนที่สุด${ending} ความปลอดภัยและชีวิตของคุณมีค่ายิ่งกว่าสิ่งใดในโลกนี้ ได้โปรดอย่าเก็บความเจ็บปวดนี้ไว้เพียงลำพัง ทีมคุณครูและบุคลากรพร้อมเข้าช่วยเหลือและโอบอุ้มคุณทันที${ending}`,
    replyEn: `Your safety and life are precious beyond measure. Please do not carry this crisis alone. Immediate campus support is ready for you right now.`,
    keyThemeTh: 'การคุ้มครองความปลอดภัยฉุกเฉิน (Immediate Safety Sanctuary)',
    keyThemeEn: 'Urgent Safety & Sanctuary',
    actionAdviceTh: 'เดินไปยังจุดปลอดภัยที่ใกล้ที่สุด (ห้องพยาบาล อาคาร 1) หรือโทรสายด่วนสุขภาพจิต 1323 ตลอด 24 ชม.',
    actionAdviceEn: 'Proceed to the nearest campus Safe Sanctuary (Nurse Room, Bldg 1) or call Mental Health Hotline 1323.',
    recommendedSurahNumber: 94,
    recommendedSurahName: 'ซูเราะฮ์ อัช-ชัรห์ & สายด่วน 1323',
  };
}
