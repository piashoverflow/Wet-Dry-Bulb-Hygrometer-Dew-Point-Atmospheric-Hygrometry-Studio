export type Language = 'bn' | 'en';
export type LabModule = 1 | 2 | 3;
export type InputMode = 'environment' | 'readings';
export type PhenomenonId = 'cities' | 'glasses' | 'winter' | 'pitcher';

export interface Translations {
  studioTitle: string;
  studioShortTitle: string;
  tabs: {
    m1: string;
    m2: string;
    m3: string;
  };
  langToggle: string;
  resetBtn: string;
  controls: {
    sectionTitle: string;
    inputModeLabel: string;
    modeEnvironment: string;
    modeReadings: string;
    dryBulbLabel: string;
    wetBulbLabel: string;
    humidityLabel: string;
    airflowLabel: string;
    airflowOn: string;
    airflowOff: string;
    airflowHintOff: string;
    loupeLabel: string;
    loupeOn: string;
    loupeOff: string;
    presetsTitle: string;
    presets: {
      pleasant: string;
      storm: string;
      dryWinter: string;
      saturated: string;
    };
    casesTitle: string;
    cases: {
      c1: string;
      c2: string;
      c3: string;
      c4: string;
    };
    openTablesBtn: string;
    scenarioTitle: string;
  };
  telemetry: {
    title: string;
    dryBulbReading: string;
    wetBulbReading: string;
    depressionLabel: string;
    glaisherFactor: string;
    dewPointLabel: string;
    svpAirLabel: string;
    svpDewLabel: string;
    calcHumidityLabel: string;
    ambientHumidityNote: string;
    vaporDeficitLabel: string;
    formulaCardTitle: string;
    step1Title: string;
    step2Title: string;
    step2GlaisherInterpTitle: string;
    step2ExactTable: string;
    step3Title: string;
    step4Title: string;
    step5Title: string;
    forecastTitle: string;
    stagnantWarning: string;
    weather: {
      storm: {
        badge: string;
        summary: string;
      };
      humid: {
        badge: string;
        summary: string;
      };
      pleasant: {
        badge: string;
        summary: string;
      };
      dry: {
        badge: string;
        summary: string;
      };
    };
  };
  canvas: {
    dryBulb: string;
    wetBulb: string;
    muslinWick: string;
    waterReservoir: string;
    evaporationFlux: string;
    equilibriumZeroNet: string;
    loupeDry: string;
    loupeWet: string;
    airflowBreeze: string;
    stagnantPocket: string;
    skyTitle: string;
    svpGraphTitle: string;
    svpAxisX: string;
    svpAxisY: string;
    deficitLabel: string;
    hoverPrompt: string;
  };
  phenomena: {
    cities: {
      tab: string;
      title: string;
      dhakaName: string;
      coxsName: string;
      tempSlider: string;
      dhakaRhSlider: string;
      coxsRhSlider: string;
      evapRate: string;
      apparentTemp: string;
      comfortGood: string;
      comfortMuggy: string;
      explanationTitle: string;
      explanationBody: string;
    };
    glasses: {
      tab: string;
      title: string;
      lensTempSlider: string;
      outdoorTempSlider: string;
      outdoorRhSlider: string;
      dewPointReadout: string;
      lensStatusFogged: string;
      lensStatusClear: string;
      explanationTitle: string;
      explanationBody: string;
    };
    winter: {
      tab: string;
      title: string;
      winterTempSlider: string;
      winterRhSlider: string;
      dryingTime: string;
      skinMoistureLoss: string;
      explanationTitle: string;
      explanationBody: string;
    };
    pitcher: {
      tab: string;
      title: string;
      ambientTempSlider: string;
      ambientRhSlider: string;
      materialLabel: string;
      materialClay: string;
      materialMetal: string;
      waterTempLabel: string;
      coolingDropLabel: string;
      explanationTitle: string;
      explanationBody: string;
    };
  };
  modal: {
    title: string;
    subtitle: string;
    svpTab: string;
    glaisherTab: string;
    tempCol: string;
    svpCol: string;
    glaisherCol: string;
    activeRowLegend: string;
    closeBtn: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  bn: {
    studioTitle: 'সিক্ত ও শুষ্ক বাল্ব আর্দ্রতামাপক যন্ত্র এবং আর্দ্রতামিতি ল্যাব',
    studioShortTitle: 'আর্দ্রতামিতি ল্যাব',
    tabs: {
      m1: 'মডিউল ১: হাইগ্রোমিটারের কার্যপদ্ধতি',
      m2: 'মডিউল ২: গ্লেইসারের সূত্র ও পূর্বাভাস',
      m3: 'মডিউল ৩: দৈনন্দিন ঘটনাবলি',
    },
    langToggle: 'English',
    resetBtn: 'রিসেট',
    controls: {
      sectionTitle: 'পরিবেশগত ও গাণিতিক নিয়ন্ত্রণ',
      inputModeLabel: 'পরিমাপ ও হিসাবের ধরন নির্বাচন',
      modeEnvironment: 'পরিবেশ (θ₁ ও R%)',
      modeReadings: 'পাঠ থেকে হিসাব (θ₁ ও θ₂)',
      dryBulbLabel: 'শুষ্ক বাল্ব তাপমাত্রা (θ₁)',
      wetBulbLabel: 'সিক্ত বাল্ব তাপমাত্রা (θ₂)',
      humidityLabel: 'বায়ুর প্রকৃত আপেক্ষিক আর্দ্রতা (R%)',
      airflowLabel: 'মৃদু বায়ুপ্রবাহ (পাখা)',
      airflowOn: 'সচল (সঠিক পাঠ)',
      airflowOff: 'স্থির বায়ু (সীমিত বাষ্পীভবন)',
      airflowHintOff: 'স্থির বাতাসে সিক্ত বাল্বের চারপাশে আর্দ্র স্তর জমে যাওয়ায় বাষ্পীভবন কিছুটা ধীর হয়।',
      loupeLabel: 'ম্যাগনিফাইং লুপ (০.১°C সূক্ষ্ম পাঠ)',
      loupeOn: 'চালু',
      loupeOff: 'বন্ধ',
      presetsTitle: 'দ্রুত অবস্থা নির্বাচন (Presets)',
      presets: {
        pleasant: 'স্বাভাবিক দুপুর (২৮°C, ৫৫%)',
        storm: 'ঝড়ের পূর্বাভাস (৩০°C, ৯২%)',
        dryWinter: 'শুষ্ক শীত (১৫°C, ২২%)',
        saturated: '১০০% সম্পৃক্ত (২৪°C, ১০০%)',
      },
      casesTitle: 'ইন্টারপোলেশন ও শিশিরাঙ্ক অনুশীলন কেস',
      cases: {
        c1: 'কেস ১: পূর্ণ θ₁, ভগ্নাংশ শিশিরাঙ্ক (২৮.০°C, ২২.৫°C)',
        c2: 'কেস ২: G ও SVP উভয় ইন্টারপোলেশন (২৭.৪°C, ২১.৬°C)',
        c3: 'কেস ৩: শীতকালীন শুষ্ক পাঠ (১৫.৫°C, ৯.২°C)',
        c4: 'কেস ৪: নিম্ন তাপমাত্রায় G-ইন্টারপোলেশন (৭.০°C, ৪.৮°C)',
      },
      openTablesBtn: 'SVP ও গ্লেইসার সারণি দেখুন',
      scenarioTitle: 'বাস্তব জীবনের ঘটনা নির্বাচন করুন',
    },
    telemetry: {
      title: 'লাইভ পরিমাপ ও বিশ্লেষণ',
      dryBulbReading: 'শুষ্ক বাল্ব পাঠ (θ₁)',
      wetBulbReading: 'সিক্ত বাল্ব পাঠ (θ₂)',
      depressionLabel: 'তাপমাত্রার পার্থক্য (θ₁ − θ₂)',
      glaisherFactor: 'গ্লেইসারের উৎপাদক (G)',
      dewPointLabel: 'হিসাবকৃত শিশিরাঙ্ক (θ)',
      svpAirLabel: 'বায়ুর তাপমাত্রায় SVP (F)',
      svpDewLabel: 'শিশিরাঙ্কে SVP (f)',
      calcHumidityLabel: 'আপেক্ষিক আর্দ্রতা (R = f/F × ১০০%)',
      ambientHumidityNote: 'পরিবেশের প্রকৃত R%',
      vaporDeficitLabel: 'বাষ্পচাপ ঘাটতি (F − f)',
      formulaCardTitle: 'ধাপে ধাপে ইন্টারপোলেশন ও গ্লেইসারের সূত্র',
      step1Title: 'ধাপ ১: সিক্ত বাল্ব তাপমাত্রা হ্রাস (Δθ)',
      step2Title: 'ধাপ ৩: গ্লেইসারের সূত্র দিয়ে শিশিরাঙ্ক (θ)',
      step2GlaisherInterpTitle: 'ধাপ ২: θ₁ থেকে গ্লেইসার উৎপাদক (G) ইন্টারপোলেশন',
      step2ExactTable: 'সারণি থেকে সরাসরি মান:',
      step3Title: 'ধাপ ৪: রৈখিক ইন্টারপোলেশনে f ও F নির্ণয়',
      step4Title: 'ধাপ ৫: আপেক্ষিক আর্দ্রতা (R%)',
      step5Title: 'হিসাবকৃত ফলাফল',
      forecastTitle: 'গ্লেইসারের আবহাওয়া পূর্বাভাস',
      stagnantWarning: 'স্থির বায়ু সক্রিয়: বাল্বের চারপাশে বাষ্প জমে থাকায় পাঠ সামান্য পরিবর্তিত হয়েছে।',
      weather: {
        storm: {
          badge: 'ঝড়-বৃষ্টির প্রবল সম্ভাবনা',
          summary: 'θ₁ ও θ₂ এর পার্থক্য খুব কম এবং আর্দ্রতা ৮৫% এর বেশি। বায়ু প্রায় সম্পৃক্ত হওয়ায় দ্রুত ঘনীভবন ও বৃষ্টির সম্ভাবনা রয়েছে।',
        },
        humid: {
          badge: 'মেঘলা ও স্যাঁতসেঁতে আবহাওয়া',
          summary: 'বাতাসে জলীয় বাষ্পের পরিমাণ বেশি হওয়ায় বাষ্পীভবন ধীর হচ্ছে। ঘাম শুকাতে সময় লাগবে এবং আকাশ মেঘাচ্ছন্ন থাকতে পারে।',
        },
        pleasant: {
          badge: 'স্বাভাবিক ও আরামদায়ক আবহাওয়া',
          summary: 'শুষ্ক ও সিক্ত বাল্বের পার্থক্য মাঝারি। বাষ্পীভবনের হার সুষম থাকায় আবহাওয়া পরিষ্কার ও স্বস্তিদায়ক।',
        },
        dry: {
          badge: 'অত্যন্ত শুষ্ক আবহাওয়া',
          summary: 'θ₁ − θ₂ পার্থক্য অনেক বেশি এবং আপেক্ষিক আর্দ্রতা ৩৫% এর নিচে। প্রবল বাষ্পীভবনের কারণে দ্রুত পানি শুকিয়ে যায়।',
        },
      },
    },
    canvas: {
      dryBulb: 'শুষ্ক বাল্ব (θ₁)',
      wetBulb: 'সিক্ত বাল্ব (θ₂)',
      muslinWick: 'ভেজা মসলিন কাপড়',
      waterReservoir: 'পাতিত পানির আধার',
      evaporationFlux: 'বাষ্পীভবন হার',
      equilibriumZeroNet: 'গতিশীল সাম্যাবস্থা (নিট বাষ্পীভবন = ০)',
      loupeDry: '৪× জুম: শুষ্ক বাল্ব',
      loupeWet: '৪× জুম: সিক্ত বাল্ব',
      airflowBreeze: 'মৃদু বায়ুপ্রবাহ',
      stagnantPocket: 'স্থির আর্দ্র বলয়',
      skyTitle: 'বায়ুমণ্ডলীয় আকাশ ও আবহাওয়ার দৃশ্যপট',
      svpGraphTitle: 'সম্পৃক্ত জলীয় বাষ্পচাপ (SVP) ও রৈখিক ইন্টারপোলেশন লেখচিত্র',
      svpAxisX: 'তাপমাত্রা θ (°C)',
      svpAxisY: 'SVP (mmHg)',
      deficitLabel: 'ঘাটতি (F − f)',
      hoverPrompt: 'যেকোনো তাপমাত্রায় SVP দেখতে গ্রাফের ওপর কার্সার নিন',
    },
    phenomena: {
      cities: {
        tab: '১. ঢাকা বনাম কক্সবাজারে অস্বস্তি',
        title: 'একই তাপমাত্রায় ঢাকা বনাম কক্সবাজারে ভিন্ন অনুভূতি',
        dhakaName: 'ঢাকা (তুলনামূলক শুষ্ক)',
        coxsName: 'কক্সবাজার (উপকূলীয় আর্দ্র)',
        tempSlider: 'উভয় শহরের তাপমাত্রা (θ₁)',
        dhakaRhSlider: 'ঢাকার আপেক্ষিক আর্দ্রতা (R%)',
        coxsRhSlider: 'কক্সবাজারের আপেক্ষিক আর্দ্রতা (R%)',
        evapRate: 'ঘাম বাষ্পীভবন হার',
        apparentTemp: 'অনুভূত তাপমাত্রা (Heat Index)',
        comfortGood: 'স্বস্তিদায়ক (দ্রুত বাষ্পীভবন শীতলতা)',
        comfortMuggy: 'ভ্যাপসা ও অস্বস্তিকর (ঘাম শুকায় না)',
        explanationTitle: 'পদার্থবিজ্ঞানের ব্যাখ্যা: বাষ্পীভবন ও সুপ্ততাপ',
        explanationBody: 'আমাদের শরীর থেকে নির্গত ঘাম বাষ্পীভূত হওয়ার সময় ত্বক থেকে বাষ্পীভবনের সুপ্ততাপ শোষণ করে শরীর ঠান্ডা রাখে। কক্সবাজারে সমুদ্রের কারণে আপেক্ষিক আর্দ্রতা (R%) অনেক বেশি থাকায় বাতাস জলীয় বাষ্পে প্রায় সম্পৃক্ত থাকে; ফলে ঘাম বাষ্পীভূত হতে পারে না এবং শরীরে তাপ আটকে ভ্যাপসা অস্বস্তি সৃষ্টি হয়।',
      },
      glasses: {
        tab: '২. এসি ঘর থেকে বের হলে চশমা ঘোলা হওয়া',
        title: 'শীতাতপ নিয়ন্ত্রিত ঘর থেকে বাইরে বের হলে চশমায় কুয়াশা জমা',
        lensTempSlider: 'চশমার কাচের তাপমাত্রা (θ_lens)',
        outdoorTempSlider: 'বাইরের বায়ুর তাপমাত্রা (θ₁)',
        outdoorRhSlider: 'বাইরের আপেক্ষিক আর্দ্রতা (R%)',
        dewPointReadout: 'বাইরের বাতাসের শিশিরাঙ্ক (θ_dew)',
        lensStatusFogged: 'ঘনীভবন হচ্ছে: কাচ ঘোলা!',
        lensStatusClear: 'ঘনীভবন নেই: কাচ স্বচ্ছ',
        explanationTitle: 'পদার্থবিজ্ঞানের ব্যাখ্যা: শিশিরাঙ্কের নিচে শীতলীকরণ',
        explanationBody: 'এসি ঘরের ভেতরে থাকায় চশমার কাচ ঠান্ডা থাকে (θ_lens)। বাইরে বের হলে চশমার সংস্পর্শে আসা উষ্ণ ও আর্দ্র বাতাস শীতল হয়ে বাইরের বাতাসের শিশিরাঙ্কের (θ_dew) নিচে নেমে যায়। যখন θ_lens < θ_dew হয়, তখন বাতাসের অতিরিক্ত জলীয় বাষ্প কাচের ওপর ক্ষুদ্র জলকণা হিসেবে ঘনীভূত হয়ে চশমা ঘোলা করে দেয়।',
      },
      winter: {
        tab: '৩. শীতকালে ঠোঁট ফাটা ও কাপড় দ্রুত শুকানো',
        title: 'শীতের শুষ্ক বাতাসে ত্বকের আর্দ্রতা হ্রাস ও দ্রুত বাষ্পীভবন',
        winterTempSlider: 'শীতকালীন বায়ুর তাপমাত্রা (θ₁)',
        winterRhSlider: 'বায়ুর আপেক্ষিক আর্দ্রতা (R%)',
        dryingTime: 'কাপড় শুকানোর আপেক্ষিক গতি',
        skinMoistureLoss: 'ত্বক/ঠোঁট থেকে আর্দ্রতা ক্ষয়',
        explanationTitle: 'পদার্থবিজ্ঞানের ব্যাখ্যা: নিম্ন আপেক্ষিক আর্দ্রতা',
        explanationBody: 'শীতকালে তাপমাত্রা কম থাকলেও বাতাসে জলীয় বাষ্পের পরিমাণ খুবই কম থাকে (নিম্ন R%)। বাতাস অসম্পৃক্ত থাকায় ভেজা কাপড় কিংবা ত্বক ও ঠোঁটের আর্দ্রতা থেকে পানি দ্রুত বাষ্পীভূত হয়ে বাতাসে মিশে যায়। এ কারণেই শীতে ভেজা কাপড় দ্রুত শুকায় এবং ঠোঁট ও ত্বক ফেটে যায়।',
      },
      pitcher: {
        tab: '৪. মাটির কলসিতে পানি ঠান্ডা থাকার কারণ',
        title: 'সচ্ছিদ্র মাটির কলসিতে স্বতঃস্ফূর্ত বাষ্পীভবন শীতলীকরণ',
        ambientTempSlider: 'বাইরের পরিবেশের তাপমাত্রা (θ₁)',
        ambientRhSlider: 'বাইরের আপেক্ষিক আর্দ্রতা (R%)',
        materialLabel: 'পাত্রের ধরন নির্বাচন',
        materialClay: 'সচ্ছিদ্র মাটির কলসি',
        materialMetal: 'ধাতব / কাচের বন্ধ পাত্র',
        waterTempLabel: 'পাত্রের ভেতরের পানির তাপমাত্রা',
        coolingDropLabel: 'শীতলীকরণ হ্রাস (Δθ)',
        explanationTitle: 'পদার্থবিজ্ঞানের ব্যাখ্যা: ছিদ্রপথে বাষ্পীভবন ও সুপ্ততাপ',
        explanationBody: 'মাটির কলসির গায়ে অসংখ্য আণুবীক্ষণিক ছিদ্র থাকে। এসব ছিদ্র দিয়ে সামান্য পানি চুইয়ে কলসির বাইরের পৃষ্ঠে আসে এবং বাইরের শুষ্ক বাতাসে বাষ্পীভূত হয়। বাষ্পীভবনের জন্য প্রয়োজনীয় সুপ্ততাপ কলসি ও ভেতরের পানি থেকে শোষিত হওয়ায় কলসির পানি সিক্ত বাল্ব তাপমাত্রার (θ₂) কাছাকাছি ঠান্ডা হয়ে যায়। ধাতব পাত্রে ছিদ্র না থাকায় পানি ঠান্ডা হয় না।',
      },
    },
    modal: {
      title: 'প্রমাণ সম্পৃক্ত জলীয় বাষ্পচাপ (SVP) ও গ্লেইসারের উৎপাদক সারণি',
      subtitle: 'হাইগ্রোমেট্রিক হিসাবের জন্য ০°C থেকে ৫০°C তাপমাত্রার প্রমাণ মানসমূহ',
      svpTab: 'সম্পৃক্ত বাষ্পচাপ (SVP, mmHg)',
      glaisherTab: 'গ্লেইসারের উৎপাদক (G)',
      tempCol: 'তাপমাত্রা (°C)',
      svpCol: 'SVP (mmHg)',
      glaisherCol: 'উৎপাদক (G)',
      activeRowLegend: 'হলুদ/সবুজ হাইলাইট: বর্তমান θ₁ ও θ এর নিকটতম মান',
      closeBtn: 'বন্ধ করুন',
    },
  },
  en: {
    studioTitle: 'Wet & Dry Bulb Hygrometer & Hygrometry Studio',
    studioShortTitle: 'Hygrometry Studio',
    tabs: {
      m1: 'Module 1: Hygrometer Apparatus',
      m2: "Module 2: Glaisher's Factor & Forecaster",
      m3: 'Module 3: Real-World Phenomena',
    },
    langToggle: 'বাংলা',
    resetBtn: 'Reset',
    controls: {
      sectionTitle: 'Atmospheric & Formula Controls',
      inputModeLabel: 'Input & Calculation Mode',
      modeEnvironment: 'Environment (θ₁, R%)',
      modeReadings: 'Readings & Interp (θ₁, θ₂)',
      dryBulbLabel: 'Dry Bulb Temp (θ₁)',
      wetBulbLabel: 'Wet Bulb Temp (θ₂)',
      humidityLabel: 'True Relative Humidity (R%)',
      airflowLabel: 'Gentle Air Circulation (Fan)',
      airflowOn: 'Active (Calibrated)',
      airflowOff: 'Stagnant Air (Damped)',
      airflowHintOff: 'Without gentle airflow, a humid pocket lingers around the muslin wick and slows evaporation.',
      loupeLabel: 'Magnifying Loupes (0.1°C Precision)',
      loupeOn: 'On',
      loupeOff: 'Off',
      presetsTitle: 'Quick Atmospheric Presets',
      presets: {
        pleasant: 'Pleasant Noon (28°C, 55%)',
        storm: 'Storm Warning (30°C, 92%)',
        dryWinter: 'Dry Winter (15°C, 22%)',
        saturated: '100% Saturated (24°C, 100%)',
      },
      casesTitle: 'Dew Point & Interpolation Practice Cases',
      cases: {
        c1: 'Case 1: Integer θ₁, Fractional θ (28.0°C, 22.5°C)',
        c2: 'Case 2: Dual G & SVP Interpolation (27.4°C, 21.6°C)',
        c3: 'Case 3: Dry Winter Observation (15.5°C, 9.2°C)',
        c4: 'Case 4: Cold Air G-Interpolation (7.0°C, 4.8°C)',
      },
      openTablesBtn: 'View SVP & Glaisher Tables',
      scenarioTitle: 'Select Real-World Phenomenon',
    },
    telemetry: {
      title: 'Live Telemetry & Psychrometry',
      dryBulbReading: 'Dry Bulb Reading (θ₁)',
      wetBulbReading: 'Wet Bulb Reading (θ₂)',
      depressionLabel: 'Wet-Bulb Depression (θ₁ − θ₂)',
      glaisherFactor: "Glaisher's Factor (G)",
      dewPointLabel: 'Calculated Dew Point (θ)',
      svpAirLabel: 'SVP at Air Temp (F)',
      svpDewLabel: 'SVP at Dew Point (f)',
      calcHumidityLabel: 'Relative Humidity (R = f/F × 100%)',
      ambientHumidityNote: 'True Ambient R%',
      vaporDeficitLabel: 'Vapor Pressure Deficit (F − f)',
      formulaCardTitle: "Step-by-Step Interpolation & Glaisher's Formula",
      step1Title: 'Step 1: Wet-Bulb Cooling Depression (Δθ)',
      step2Title: "Step 3: Dew Point via Glaisher's Formula (θ)",
      step2GlaisherInterpTitle: "Step 2: Glaisher's Factor (G) Interpolation",
      step2ExactTable: 'Direct table lookup:',
      step3Title: 'Step 4: Linear Interpolation for f & F',
      step4Title: 'Step 5: Relative Humidity (R%)',
      step5Title: 'Final Result',
      forecastTitle: "Glaisher's Weather Forecast",
      stagnantWarning: 'Stagnant air active: boundary vapor pocket slightly raises θ₂ reading.',
      weather: {
        storm: {
          badge: 'High Storm & Rain Risk',
          summary: 'θ₁ − θ₂ is very small and RH exceeds 85%. Air is nearly saturated, indicating imminent condensation, heavy clouds, or rain.',
        },
        humid: {
          badge: 'Humid & Overcast Sky',
          summary: 'High ambient vapor pressure slows evaporation. Expect muggy air, slower sweat drying, and building cloud cover.',
        },
        pleasant: {
          badge: 'Pleasant & Comfortable Weather',
          summary: 'Moderate wet-bulb depression indicates balanced moisture levels, clear skies, and comfortable evaporative cooling.',
        },
        dry: {
          badge: 'Very Dry Air (Rapid Evaporation)',
          summary: 'Large θ₁ − θ₂ depression with RH below 35%. High vapor pressure deficit causes rapid evaporation from surfaces.',
        },
      },
    },
    canvas: {
      dryBulb: 'Dry Bulb (θ₁)',
      wetBulb: 'Wet Bulb (θ₂)',
      muslinWick: 'Wet Muslin Wick',
      waterReservoir: 'Distilled Water Reservoir',
      evaporationFlux: 'Evaporation Rate',
      equilibriumZeroNet: 'Dynamic Equilibrium (Net Evap = 0)',
      loupeDry: '4× Zoom: Dry Bulb',
      loupeWet: '4× Zoom: Wet Bulb',
      airflowBreeze: 'Laminar Airflow',
      stagnantPocket: 'Humid Boundary Pocket',
      skyTitle: 'Atmospheric Sky & Weather Window',
      svpGraphTitle: 'Saturation Vapor Pressure (SVP) & Linear Interpolation Curve',
      svpAxisX: 'Temperature θ (°C)',
      svpAxisY: 'SVP (mmHg)',
      deficitLabel: 'Deficit (F − f)',
      hoverPrompt: 'Hover along the SVP curve to inspect exact interpolated pressure',
    },
    phenomena: {
      cities: {
        tab: "1. Dhaka vs Cox's Bazar Comfort",
        title: "Why Identical Temperatures Feel Different in Dhaka vs Cox's Bazar",
        dhakaName: 'Dhaka (Moderate Humidity)',
        coxsName: "Cox's Bazar (Coastal Humid)",
        tempSlider: 'Shared Air Temperature (θ₁)',
        dhakaRhSlider: 'Dhaka Relative Humidity (R%)',
        coxsRhSlider: "Cox's Bazar Relative Humidity (R%)",
        evapRate: 'Sweat Evaporation Rate',
        apparentTemp: 'Apparent Feel (Heat Index)',
        comfortGood: 'Comfortable (Effective Sweat Cooling)',
        comfortMuggy: 'Oppressive & Muggy (Sweat Trapped)',
        explanationTitle: 'Physics Principle: Evaporative Latent Heat',
        explanationBody: "Sweat cools the human body by absorbing latent heat of vaporization from the skin. In coastal Cox's Bazar, high relative humidity (R%) leaves the air nearly saturated, drastically suppressing sweat evaporation and trapping body heat—making the exact same 34°C feel far hotter and stickier than in drier Dhaka.",
      },
      glasses: {
        tab: '2. Glasses Fogging Outside AC Room',
        title: 'Condensation on Cool Eyeglasses When Stepping into Humid Air',
        lensTempSlider: 'Eyeglass Lens Temp (θ_lens)',
        outdoorTempSlider: 'Outdoor Air Temp (θ₁)',
        outdoorRhSlider: 'Outdoor Relative Humidity (R%)',
        dewPointReadout: 'Outdoor Dew Point (θ_dew)',
        lensStatusFogged: 'Condensing: Lenses Fogged!',
        lensStatusClear: 'Above Dew Point: Lenses Clear',
        explanationTitle: 'Physics Principle: Cooling Below Dew Point',
        explanationBody: 'Inside an air-conditioned room, eyeglass lenses cool to θ_lens. Stepping outside brings warm humid air into contact with the cold glass, chilling that boundary air below its Dew Point (θ_dew). Whenever θ_lens < θ_dew, excess water vapor immediately condenses into microscopic fog droplets on the lenses.',
      },
      winter: {
        tab: '3. Winter Chapped Lips & Fast Drying',
        title: 'Why Lips Chap and Wet Clothes Dry Quickly in Cold Winter Air',
        winterTempSlider: 'Winter Air Temperature (θ₁)',
        winterRhSlider: 'Winter Relative Humidity (R%)',
        dryingTime: 'Clothes Drying Speed',
        skinMoistureLoss: 'Skin & Lip Moisture Loss',
        explanationTitle: 'Physics Principle: Low Relative Humidity & Vapor Deficit',
        explanationBody: 'Even though winter air feels cold, its relative humidity (R%) is often very low, meaning the air holds far less water vapor than its saturation capacity. This creates a steep moisture gradient that rapidly pulls water molecules out of damp laundry and exposed lips/skin.',
      },
      pitcher: {
        tab: '4. Earthen Pitcher (Matka) Water Cooling',
        title: 'Spontaneous Evaporative Cooling in a Porous Clay Pitcher',
        ambientTempSlider: 'Ambient Air Temperature (θ₁)',
        ambientRhSlider: 'Ambient Relative Humidity (R%)',
        materialLabel: 'Vessel Material',
        materialClay: 'Porous Clay Pitcher (Matka)',
        materialMetal: 'Sealed Metal / Glass Vessel',
        waterTempLabel: 'Internal Water Temperature',
        coolingDropLabel: 'Net Cooling Achieved (Δθ)',
        explanationTitle: 'Physics Principle: Pores & Latent Heat Extraction',
        explanationBody: 'Microscopic pores in an unglazed clay pitcher allow tiny amounts of water to seep to the outer wall and evaporate into dry surrounding air. Each evaporating gram extracts latent heat from the clay wall and remaining water, cooling the water down toward the wet-bulb temperature θ₂. A sealed metal vessel blocks seepage and stays warm.',
      },
    },
    modal: {
      title: "Standard Saturation Vapor Pressure (SVP) & Glaisher's Factor Tables",
      subtitle: 'Reference values from 0°C to 50°C used for linear interpolation',
      svpTab: 'Saturation Vapor Pressure (mmHg)',
      glaisherTab: "Glaisher's Factor (G)",
      tempCol: 'Temp (°C)',
      svpCol: 'SVP (mmHg)',
      glaisherCol: 'Factor (G)',
      activeRowLegend: 'Highlighted rows indicate active θ₁ and Dew Point θ brackets',
      closeBtn: 'Close',
    },
  },
};
