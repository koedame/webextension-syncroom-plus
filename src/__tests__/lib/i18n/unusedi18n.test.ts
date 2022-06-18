import i18nJson from '../../../lib/i18n.json';
import fs from 'fs';

// 指定のディレクトリ配下のファイルパスを再帰的に取得する
const listFiles = (targetDirectoryPath) => {
  return fs.readdirSync(targetDirectoryPath, { withFileTypes: true }).flatMap((dirent) => {
    const name = `${targetDirectoryPath}/${dirent.name}`;
    return dirent.isFile() ? [name] : listFiles(name);
  });
};

describe('言語設定情報を読み込んだ時', () => {
  it('使用されていないi18nがないこと', async () => {
    let unusedList = Object.keys(i18nJson.en);

    listFiles('./src')
      .filter((filePath) => filePath.endsWith('.tsx') || filePath.endsWith('.ts'))
      .forEach((filePath) => {
        const contents = fs.readFileSync(filePath, 'utf-8');

        for (const key of unusedList) {
          if (contents.includes(`t('${key}'`) || contents.includes(`t("${key}"`)) {
            unusedList = unusedList.filter((k) => k !== key);
          } else {
          }
        }
      });

    expect(unusedList).toStrictEqual([]);
  });
});
