import { describe, it, expect } from '@jest/globals';
import optimizeSearchKeyword from '../../lib/optimizeSearchKeyword';

describe('空文字のとき', () => {
  it('空文字が返ること', () => {
    const actual = optimizeSearchKeyword('');
    expect(actual).toStrictEqual('');
  });
});

describe('記号が含まれるとき', () => {
  it('すべて削除されること', () => {
    const actual = optimizeSearchKeyword('a`!@#$%^&*()_+-=[b]\\;\',./{}|:"<>?c');
    expect(actual).toStrictEqual('abc');
  });
});

describe('全角英数字が含まれるとき', () => {
  it('半角英数字に変換されること', () => {
    const actual = optimizeSearchKeyword('ＡＢＣＤＥＦＧａｂｃｄｅｆｇ１２３３５');
    expect(actual).toStrictEqual('abcdefgabcdefg12335');
  });
});

describe('ひらがなが含まれるとき', () => {
  it('カタカナに変換されること', () => {
    const actual = optimizeSearchKeyword('あいうえおアイウエオ');
    expect(actual).toStrictEqual('アイウエオアイウエオ');
  });
});

describe('半角カタカナが含まれるとき', () => {
  it('全角カタカナに変換されること', () => {
    const actual = optimizeSearchKeyword('ｱｲｳｴｵ｡､ｰ｢｣･');
    expect(actual).toStrictEqual('アイウエオ。、ー「」・');
  });
});
