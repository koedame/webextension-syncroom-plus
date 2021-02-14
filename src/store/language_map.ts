interface LanguageMap {
  [id: string]: {
    displayName: string;
  };
}

const languageMap: LanguageMap = {
  en: {
    displayName: 'English',
  },
  ja: {
    displayName: '日本語',
  },
  ko: {
    displayName: '한국',
  },
};

export default languageMap;
