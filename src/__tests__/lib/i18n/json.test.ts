import i18nJson from '../../../lib/i18n.json';

describe('言語設定情報を読み込んだ時', () => {
  it('すべての言語のキーがもれなく設定されていること', () => {
    const langs = ['en', 'ja', 'ko'];

    for (const l of langs) {
      for (const key in i18nJson[l]) {
        for (const ll of langs) {
          if (ll !== l) {
            // どのキーでテスト失敗しているかわかりやすいようにこうしている
            let message = {
              fromLang: '',
              targetLang: '',
              missingkey: '',
            };
            try {
              message = {
                fromLang: l,
                targetLang: ll,
                missingkey: key,
              };
              expect(i18nJson[ll][key]).toBeDefined();
            } catch (e) {
              console.error(JSON.stringify(message, null, 2));
              throw e;
            }
          }
        }
      }
    }
  });
});
