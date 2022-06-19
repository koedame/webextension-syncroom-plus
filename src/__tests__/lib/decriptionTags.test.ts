import { describe, it, test, expect } from '@jest/globals';
import decryptionTags from '../../lib/decriptionTags';

describe('タグがないとき', () => {
  it('空の配列が返ること', () => {
    const actual = decryptionTags('0', '');
    expect(actual).toStrictEqual([]);
  });
});

describe('独自タグだけのとき', () => {
  it('独自タグだけの配列になること', () => {
    const actual = decryptionTags('0', '独自タグです');
    expect(actual).toStrictEqual(['独自タグです']);
  });
});

describe('既定タグが1つ設定されているとき', () => {
  it('復号されたタグの配列が返ること', () => {
    const actual = decryptionTags('16', '');
    expect(actual).toStrictEqual(['録音中']);
  });
});

describe('既定タグが2つあるとき', () => {
  it('復号されたタグの配列が返ること', () => {
    const actual = decryptionTags('6', '');
    expect(actual).toStrictEqual(['おしゃべり', '初心者OK']);
  });
});

describe('既定タグを全部指定したとき', () => {
  it('復号された既定タグの配列が返ること', () => {
    const actual = decryptionTags('524287', '');
    expect(actual).toStrictEqual([
      '練習中',
      'おしゃべり',
      '初心者OK',
      '配信中',
      '録音中',
      'Classic',
      'Country / Folk',
      'Club Music / EDM',
      'Hip Hop / Rap',
      'R&B / Soul',
      'Jazz',
      'Fusion',
      'Rock',
      'HR / HM',
      '洋楽',
      'J-Pop',
      'アイドル',
      'アニメ・ゲーム・ボカロ',
      'World',
    ]);
  });
});

describe('既定タグ2つと独自タグが混ざっているとき', () => {
  it('混在した配列が返ること', () => {
    const actual = decryptionTags('6', 'こんにちは');
    expect(actual).toStrictEqual(['こんにちは', 'おしゃべり', '初心者OK']);
  });
});

describe('既定タグが空文字だったとき', () => {
  test('エラーにならずに空の配列が返ること', () => {
    const actual = decryptionTags('', '');
    expect(actual).toStrictEqual([]);
  });
});

describe('既定タグが不正な値だったとき', () => {
  test('エラーにならずに空の配列が返ること', () => {
    const actual = decryptionTags('invalid', '');
    expect(actual).toStrictEqual([]);
  });
});
