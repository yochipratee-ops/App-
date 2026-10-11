export interface QuranVerse {
  verseNumber: number;
  arabic: string;
  transliterationTh: string;
  translationTh: string;
}

export interface SurahItem {
  id: string;
  surahNumber: number;
  nameArabic: string;
  nameTh: string;
  nameEn: string;
  versesCount: number;
  revelationType: 'มักกะฮ์' | 'มะดีนะฮ์';
  audioUrl: string;
  reciterNameTh: string;
  reciterNameEn: string;
  thematicExplanationTh: string;
  thematicExplanationEn: string;
  healingBenefitTh: string;
  verses: QuranVerse[];
}

export const SURAH_DATABASE: SurahItem[] = [
  {
    id: 'surah-94',
    surahNumber: 94,
    nameArabic: 'الشرح',
    nameTh: 'ซูเราะฮ์ อัช-ชัรห์ (Alam Nashrah)',
    nameEn: 'Surah Ash-Sharh (The Relief)',
    versesCount: 8,
    revelationType: 'มักกะฮ์',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/94.mp3',
    reciterNameTh: 'เชค มิชารี รอชิด อัล-อะฟาสีย์',
    reciterNameEn: 'Sheikh Mishary Rashid Alafasy',
    healingBenefitTh: 'บรรเทาความเหนื่อยล้าทางใจ เปิดความรู้สึกปลอดโปร่ง และย้ำเตือนว่าความง่ายดายจะตามมาเสมอ',
    thematicExplanationTh:
      'ซูเราะฮ์นี้กล่าวถึงการเปิดกว้างของหัวใจและการปลดเปลื้องภาระอันหนักอึ้ง ประทานลงมาเพื่อปลอบประโลมและชโลมหัวใจในยามที่เหน็ดเหนื่อยหรือเผชิญอุปสรรค พระองค์ทรงยืนยันด้วยคำสัญญาที่เด็ดขาดถึง 2 ครั้งว่า "แท้จริงพร้อมกับความยากลำบากนั้น มีความง่ายดายตามมาเสมอ" เพื่อให้ผู้ศรัทธามีความหวังและไม่ท้อแท้ต่ออุปสรรคใดๆ',
    thematicExplanationEn:
      'This Surah speaks about expanding the chest, removing heavy burdens, and raising one’s status. Allah comforts the believer by emphasizing twice: "Indeed, with hardship comes ease." It is the ultimate antidote to burnout, despair, and mental exhaustion.',
    verses: [
      {
        verseNumber: 1,
        arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ',
        transliterationTh: 'อะลัม นัชเราะห์ ละกะ ศ็อดร็อก',
        translationTh: 'เรามิได้เปิดอกของเจ้าให้เบิกบานแก่เจ้าดอกหรือ?',
      },
      {
        verseNumber: 2,
        arabic: 'وَوَضَعْنَا عَنكَ وِزْرَكَ',
        transliterationTh: 'วะวะเฎาะอ์นา อันกะ วิซร็อก',
        translationTh: 'และเรามิได้ปลดภาระอันหนักอึ้งของเจ้าออกไปจากเจ้าดอกหรือ?',
      },
      {
        verseNumber: 3,
        arabic: 'الَّذِي أَنقَضَ ظَهْرَكَ',
        transliterationTh: 'อัลละซี อันเกาะเฎาะ เซาะฮ์ร็อก',
        translationTh: 'ซึ่งเป็นภาระที่ถ่วงหลังของเจ้าจนหนักหน่วง',
      },
      {
        verseNumber: 4,
        arabic: 'وَرَفَعْنَا لَكَ ذِكْرَكَ',
        transliterationTh: 'วะเราะฟะอ์นา ละกะ ซิกร์ร็อก',
        translationTh: 'และเราได้ยกย่องเกียรติคุณของเจ้าให้สูงส่งขึ้น',
      },
      {
        verseNumber: 5,
        arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
        transliterationTh: 'ฟะอินนะ มะอัล อุซริ ยุซรอ',
        translationTh: 'ดังนั้น แท้จริงพร้อมกับความยากลำบาก ย่อมมีความง่ายดายเคียงคู่กัน',
      },
      {
        verseNumber: 6,
        arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
        transliterationTh: 'อินนะ มะอัล อุซริ ยุซรอ',
        translationTh: 'แท้จริงพร้อมกับความยากลำบาก ย่อมมีความง่ายดายอย่างแน่นอน!',
      },
      {
        verseNumber: 7,
        arabic: 'فَإِذَا فَرَغْتَ فَانصَبْ',
        transliterationTh: 'ฟะอิซา ฟะร็อฆตะ ฟันศ็อบ',
        translationTh: 'ดังนั้น เมื่อเจ้าเสร็จสิ้นภารกิจหนึ่งแล้ว ก็จงมุ่งมั่นกระทำความดีและภารกิจต่อไป',
      },
      {
        verseNumber: 8,
        arabic: 'وَإِلَىٰ رَبِّكَ فَارْغَب',
        transliterationTh: 'วะอิลา ร็อบบิกะ ฟัรฆ็อบ',
        translationTh: 'และแด่องค์อภิบาลของเจ้าเพียงผู้เดียว จงตั้งความปรารถนาและมอบความหวังทั้งหมดไว้',
      },
    ],
  },
  {
    id: 'surah-93',
    surahNumber: 93,
    nameArabic: 'الضحى',
    nameTh: 'ซูเราะฮ์ อัฎ-ฎุฮา (The Morning Hours)',
    nameEn: 'Surah Ad-Duha (The Morning Hours)',
    versesCount: 11,
    revelationType: 'มักกะฮ์',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/93.mp3',
    reciterNameTh: 'เชค มิชารี รอชิด อัล-อะฟาสีย์',
    reciterNameEn: 'Sheikh Mishary Rashid Alafasy',
    healingBenefitTh: 'เยียวยาความรู้สึกโดดเดี่ยว รู้สึกเหมือนถูกทอดทิ้ง หรือกำลังเผชิญความมืดมนในชีวิต',
    thematicExplanationTh:
      'ซูเราะฮ์นี้ประทานลงมาหลังจากช่วงเวลาที่ไม่มีวะฮียฺมาถึง ทำให้ท่านนบีเกิดความกังวล พระผู้เป็นเจ้าจึงทรงสาบานด้วยแสงสว่างยามสายและยามค่ำคืนที่เงียบสงบ เพื่อยืนยันว่า "พระองค์มิได้ทรงทอดทิ้งเจ้า และมิได้ทรงรังเกียจเจ้าเลย" และทรงสัญญาว่าอนาคตข้างหน้าจะดีกว่าสิ่งที่ผ่านมาอย่างแน่นอน',
    thematicExplanationEn:
      'Revealed during a period of silence and uncertainty, Allah swears by the morning brightness and tranquil night that: "Your Lord has not forsaken you, nor is He displeased." It brings profound consolation to anyone feeling abandoned or lost.',
    verses: [
      {
        verseNumber: 1,
        arabic: 'وَالضُّحَىٰ',
        transliterationTh: 'วัดฎุฮา',
        translationTh: 'ขอสาบานด้วยเวลาสายยามที่แสงตะวันสาดส่อง',
      },
      {
        verseNumber: 2,
        arabic: 'وَاللَّيْلِ إِذَا سَجَىٰ',
        transliterationTh: 'วัลลัยลิ อิซา สะญา',
        translationTh: 'และขอสาบานด้วยเวลากลางคืนเมื่อมันเงียบสงบชโลมความมืด',
      },
      {
        verseNumber: 3,
        arabic: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ',
        transliterationTh: 'มา วัดดะอะกะ ร็อบบุกะ วะมา เกาะลา',
        translationTh: 'พระเจ้าของเจ้ามิได้ทรงทอดทิ้งเจ้า และมิได้ทรงเกลียดชังเจ้าเลย',
      },
      {
        verseNumber: 4,
        arabic: 'وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ',
        transliterationTh: 'วะลัล อาคิเราะตุ ค็อยรุลละกะ มินัล อูลา',
        translationTh: 'และแท้จริงบั้นปลายและวันข้างหน้าย่อมดีสำหรับเจ้ายิ่งกว่ากาลเริ่มต้นในอดีต',
      },
      {
        verseNumber: 5,
        arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
        transliterationTh: 'วะละเซาฟะ ยุอ์ฏีกะ ร็อบบุกะ ฟะตัรฎอ',
        translationTh: 'และพระเจ้าของเจ้าจะประทานความโปรดปรานแก่เจ้าอย่างแน่นอน จนกระทั่งเจ้าพึงพอใจ',
      },
      {
        verseNumber: 6,
        arabic: 'أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ',
        transliterationTh: 'อะลัม ยะญิดกะ ยะตีมัน ฟะอาวา',
        translationTh: 'พระองค์มิได้ทรงพบเจ้าเป็นเด็กกำพร้า แล้วพระองค์ทรงให้ที่พึ่งพิงดอกหรือ?',
      },
      {
        verseNumber: 7,
        arabic: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ',
        transliterationTh: 'วะวะญะดะกะ ฎอลลัน ฟะฮะดา',
        translationTh: 'และทรงพบเจ้ากำลังแสวงหาทิศทาง แล้วพระองค์ก็ทรงชี้นำทางแก่เจ้า',
      },
    ],
  },
  {
    id: 'surah-1',
    surahNumber: 1,
    nameArabic: 'الفاتحة',
    nameTh: 'ซูเราะฮ์ อัล-ฟาติฮะฮ์ (บทเปิดแห่งคัมภีร์)',
    nameEn: 'Surah Al-Fatihah (The Opener)',
    versesCount: 7,
    revelationType: 'มักกะฮ์',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3',
    reciterNameTh: 'เชค มิชารี รอชิด อัล-อะฟาสีย์',
    reciterNameEn: 'Sheikh Mishary Rashid Alafasy',
    healingBenefitTh: 'เป็นแม่บทแห่งการเยียวยา (อัช-ชิฟาอ์) เสริมสร้างความสงบมั่นคงและการขอทางนำที่เที่ยงตรง',
    thematicExplanationTh:
      'ซูเราะฮ์นี้คือแก่นแท้ของคัมภีร์อัลกุรอาน มีชื่อเรียกว่า "อัช-ชิฟาอ์" (การเยียวยา) และ "อุมมุลกิตาบ" (มารดาแห่งคัมภีร์) เนื้อหาเริ่มต้นด้วยการสรรเสริญความเมตตาอันไพศาลของพระผู้เป็นเจ้า และการขอทางนำสู่หนทางอันเที่ยงตรงและปลอดภัย',
    thematicExplanationEn:
      'Known as the Opener, the Cure (Ash-Shifa), and the Mother of the Book. It centers upon God’s boundless mercy and a sincere plea for the straight, peaceful path.',
    verses: [
      {
        verseNumber: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliterationTh: 'บิสมิลลาฮิร เราะห์มานิร เราะฮีม',
        translationTh: 'ด้วยพระนามแห่งอัลลอฮ์ ผู้ทรงกรุณาปรานี ผู้ทรงเมตตาเสมอ',
      },
      {
        verseNumber: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliterationTh: 'อัลฮัมดุ ลิลลาฮิ ร็อบบิล อาละมีน',
        translationTh: 'มวลการสรรเสริญเป็นสิทธิ์ของอัลลอฮ์ พระผู้อภิบาลแห่งสากลโลก',
      },
      {
        verseNumber: 3,
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliterationTh: 'อัรเราะห์มานิร เราะฮีม',
        translationTh: 'ผู้ทรงกรุณาปรานี ผู้ทรงเมตตายิ่ง',
      },
      {
        verseNumber: 4,
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliterationTh: 'มาลิกิ เยามิดดีน',
        translationTh: 'ผู้ทรงอภิสิทธิ์สูงสุดแห่งวันพิพากษาตอบแทน',
      },
      {
        verseNumber: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliterationTh: 'อียากะ นะอ์บุดุ วะอียากะ นัสตะอีน',
        translationTh: 'เฉพาะพระองค์เท่านั้นที่พวกเราเคารพภักดี และเฉพาะพระองค์เท่านั้นที่พวกเราขอความช่วยเหลือ',
      },
      {
        verseNumber: 6,
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliterationTh: 'อิฮ์ดินัศ ศิรอฏ็อล มุสตะกีม',
        translationTh: 'โปรดทรงนำพวกเราสู่หนทางอันเที่ยงตรงและมั่นคง',
      },
      {
        verseNumber: 7,
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliterationTh: 'ศิรอฏ็อล ละซีนะ อันอัมตะ อะลัยฮิม ฆ็อยริล มัฆฎูบิ อะลัยฮิม วะลัฎฎอลลีน',
        translationTh: 'หนทางของผู้ที่พระองค์ทรงประทานความโปรดปราน มิใช่หนทางของผู้ถูกกริ้ว และมิใช่ผู้หลงทาง',
      },
    ],
  },
  {
    id: 'surah-67',
    surahNumber: 67,
    nameArabic: 'الملك',
    nameTh: 'ซูเราะฮ์ อัล-มุลก์ (The Sovereignty)',
    nameEn: 'Surah Al-Mulk (The Sovereignty)',
    versesCount: 30,
    revelationType: 'มักกะฮ์',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/67.mp3',
    reciterNameTh: 'เชค มิชารี รอชิด อัล-อะฟาสีย์',
    reciterNameEn: 'Sheikh Mishary Rashid Alafasy',
    healingBenefitTh: 'นำความสงบสุขยามค่ำคืน ปกป้องคุ้มครองจากความหวาดกลัว และเสริมสร้างสมาธิการนอนหลับ',
    thematicExplanationTh:
      'ซูเราะฮ์นี้มีคุณธรรมสูงยิ่งในการอ่านก่อนนอนเพื่อปกป้องคุ้มครอง เนื้อหากล่าวถึงความยิ่งใหญ่ของพระผู้สร้าง ความงดงามของจักรวาลและดวงดารา และการสร้างชีวิตและความตายเพื่อทดสอบว่าใครปฏิบัติงานได้ดียิ่ง',
    thematicExplanationEn:
      'Recited traditionally before sleep for spiritual protection and peace of mind. It highlights the cosmic majesty of creation and gives relief from nighttime anxiety.',
    verses: [
      {
        verseNumber: 1,
        arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        transliterationTh: 'ตะบาร็อกัล ละซี บิยะดิฮิล มุลกุ วะฮุวะ อะลา กุลลิ ชัยอิน เกาะดีร',
        translationTh: 'มหาบริสุทธิ์ยิ่งแด่พระผู้ซึ่งอำนาจการปกครองอยู่ในพระหัตถ์ของพระองค์ และพระองค์ทรงอานุภาพเหนือทุกสรรพสิ่ง',
      },
      {
        verseNumber: 2,
        arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ',
        transliterationTh: 'อัลละซี เคาะละก็อล เมาตะ วัลฮะยาตะ ลิยับลุวะกุม อัยยุกุม อะห์สะนุ อะมะลา',
        translationTh: 'พระผู้ทรงสร้างความตายและการมีชีวิต เพื่อทดสอบพวกเจ้าว่าผู้ใดในหมู่พวกเจ้าที่มีผลงานดียิ่ง และพระองค์ทรงเดชานุภาพ ผู้ทรงให้อภัยเสมอ',
      },
    ],
  },
  {
    id: 'surah-112',
    surahNumber: 112,
    nameArabic: 'الإخلاص',
    nameTh: 'ซูเราะฮ์ อัล-อิคลาศ (ความบริสุทธิ์ใจ)',
    nameEn: 'Surah Al-Ikhlas (Sincerity)',
    versesCount: 4,
    revelationType: 'มักกะฮ์',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3',
    reciterNameTh: 'เชค มิชารี รอชิด อัล-อะฟาสีย์',
    reciterNameEn: 'Sheikh Mishary Rashid Alafasy',
    healingBenefitTh: 'สร้างความมั่นคงในศรัทธา ยึดเหนี่ยวจิตใจกับที่พึ่งเพียงหนึ่งเดียว ปลดเปลื้องความสับสน',
    thematicExplanationTh:
      'ซูเราะฮ์นี้เทียบเท่ากับหนึ่งในสามของอัลกุรอาน อธิบายถึงความเป็นหนึ่งเดียวของอัลลอฮ์ พระองค์ทรงเป็นที่พึ่งของทุกสรรพสิ่ง ไม่ทรงพึ่งพาผู้ใด ทำให้จิตใจสงบนิ่งและหลุดพ้นจากความสับสน',
    thematicExplanationEn:
      'Equal to one-third of the Quran in virtue. Affirms absolute divine oneness and dependency upon God as the ultimate sanctuary.',
    verses: [
      {
        verseNumber: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliterationTh: 'กุล ฮุวัลลอฮุ อะฮัด',
        translationTh: 'จงกล่าวเถิด: พระองค์คืออัลลอฮ์ ผู้ทรงเอกะ (หนึ่งเดียว)',
      },
      {
        verseNumber: 2,
        arabic: 'اللَّهُ الصَّمَدُ',
        transliterationTh: 'อัลลอฮุศ เศาะมัด',
        translationTh: 'อัลลอฮ์ทรงเป็นที่พึ่งพิงอันถาวรของทุกสรรพสิ่ง',
      },
      {
        verseNumber: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliterationTh: 'ลัม ยะลิด วะลัม ยูลัด',
        translationTh: 'พระองค์มิได้ประสูติ และมิได้ถูกให้กำเนิดขึ้นมา',
      },
      {
        verseNumber: 4,
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliterationTh: 'วะลัม ยะกุล ละฮู กุฟุวัน อะฮัด',
        translationTh: 'และไม่มีสิ่งหนึ่งสิ่งใดเสมอเหมือนพระองค์',
      },
    ],
  },
  {
    id: 'surah-113',
    surahNumber: 113,
    nameArabic: 'الفلق',
    nameTh: 'ซูเราะฮ์ อัล-ฟะลัก (ยามรุ่งอรุณ)',
    nameEn: 'Surah Al-Falaq (The Daybreak)',
    versesCount: 5,
    revelationType: 'มักกะฮ์',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/113.mp3',
    reciterNameTh: 'เชค มิชารี รอชิด อัล-อะฟาสีย์',
    reciterNameEn: 'Sheikh Mishary Rashid Alafasy',
    healingBenefitTh: 'ขจัดความหวาดระแวง ความอิจฉาริษยา และความวิตกกังวลจากภายนอก',
    thematicExplanationTh:
      'เป็นซูเราะฮ์แห่งการขอความคุ้มครอง (อัล-มุเอาวิซาต) ขอให้พระผู้ทรงสร้างรุ่งอรุณคุ้มครองจากความมืดมิด ความอิจฉา และภยันตรายทั้งปวง ช่วยให้จิตใจปลอดภัยและคลายความหวาดกลัว',
    thematicExplanationEn:
      'A powerful prayer seeking refuge in the Lord of daybreak from envy, unseen darkness, and evil harm.',
    verses: [
      {
        verseNumber: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        transliterationTh: 'กุล อะอูซุ บิร็อบบิล ฟะลัก',
        translationTh: 'จงกล่าวเถิด: ข้าพระองค์ขอความคุ้มครองต่อพระผู้อภิบาลแห่งรุ่งอรุณ',
      },
      {
        verseNumber: 2,
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        transliterationTh: 'มิน ชัรริ มา เคะลัก',
        translationTh: 'ให้พ้นจากความชั่วร้ายของสิ่งที่พระองค์ได้ทรงบันดาลสร้างไว้',
      },
      {
        verseNumber: 3,
        arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        transliterationTh: 'วะมิน ชัรริ ฆอสิกิน อิซา วะก็อบ',
        translationTh: 'และให้พ้นจากความชั่วร้ายแห่งความมืดมิดในยามที่มันแผ่คลุม',
      },
    ],
  },
  {
    id: 'surah-114',
    surahNumber: 114,
    nameArabic: 'الناس',
    nameTh: 'ซูเราะฮ์ อัน-นาส (มวลมนุษยชาติ)',
    nameEn: 'Surah An-Nas (Mankind)',
    versesCount: 6,
    revelationType: 'มักกะฮ์',
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/114.mp3',
    reciterNameTh: 'เชค มิชารี รอชิด อัล-อะฟาสีย์',
    reciterNameEn: 'Sheikh Mishary Rashid Alafasy',
    healingBenefitTh: 'สลายความคิดฟุ้งซ่าน การกระซิบกระซาบในใจ (Waswas) และความตื่นตระหนก',
    thematicExplanationTh:
      'ซูเราะฮ์สุดท้ายแห่งคัมภีร์ ขอความคุ้มครองต่อพระเจ้าแห่งมนุษยชาติจากความคิดด้านลบ การกระซิบกระซาบที่ก่อให้เกิดความวิตกกังวล และความไม่สบายใจในส่วนลึกของหัวใจ',
    thematicExplanationEn:
      'The concluding Surah of the Quran, shielding the soul against insidious whispers, self-doubt, panic, and internal overthinking.',
    verses: [
      {
        verseNumber: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transliterationTh: 'กุล อะอูซุ บิร็อบบิน นาส',
        translationTh: 'จงกล่าวเถิด: ข้าพระองค์ขอความคุ้มครองต่อพระผู้อภิบาลแห่งมนุษยชาติ',
      },
      {
        verseNumber: 2,
        arabic: 'مَلِكِ النَّاسِ',
        transliterationTh: 'มะลิกิน นาส',
        translationTh: 'พระมหากษัตริย์ผู้ทรงครอบครองแห่งมนุษยชาติ',
      },
      {
        verseNumber: 3,
        arabic: 'إِلَٰهِ النَّاسِ',
        transliterationTh: 'อิลาฮิน นาส',
        translationTh: 'พระผู้เป็นเจ้าแห่งมนุษยชาติ',
      },
      {
        verseNumber: 4,
        arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        transliterationTh: 'มิน ชัรริล วัสวาสิล ค็อนนาส',
        translationTh: 'ให้พ้นจากความชั่วร้ายของผู้กระซิบกระซาบที่คอยหลบซ่อนและล่อลวง',
      },
      {
        verseNumber: 5,
        arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        transliterationTh: 'อัลละซี ยุวัสวิสุ ฟี ศุดูริน นาส',
        translationTh: 'ผู้ซึ่งคอยกระซิบกระซาบสิ่งชั่วร้ายในทรวงอกของมนุษย์',
      },
      {
        verseNumber: 6,
        arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        transliterationTh: 'มินัล ญินนะติ วันนาส',
        translationTh: 'ทั้งที่มาจากหมู่ญินและหมู่มนุษย์',
      },
    ],
  },
];
