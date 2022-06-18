import { describe, it, expect } from '@jest/globals';
import { iconInfoToUrl } from '../../lib/iconInfoToUrl';

describe('プリセット0が指定されているとき', () => {
  it('プリセット0のURLが返ること', () => {
    const actual = iconInfoToUrl({ type: 'preset', preset: '0', url: 'https://example.com/dummy.png' });
    expect(actual).toStrictEqual('https://syncroom.yamaha.com/mypage/assets/img/user/img_0.png');
  });
});

describe('プリセット13が指定されているとき', () => {
  it('プリセット13のURLが返ること', () => {
    const actual = iconInfoToUrl({ type: 'preset', preset: '13', url: '' });
    expect(actual).toStrictEqual('https://syncroom.yamaha.com/mypage/assets/img/user/img_13.png');
  });
});

describe('URLが指定されているとき', () => {
  it('URLがそのまま返ること', () => {
    const actual = iconInfoToUrl({ type: 'url', preset: '0', url: 'https://example.com/dummy.png' });
    expect(actual).toStrictEqual('https://example.com/dummy.png');
  });
});

describe('未知のtypeが渡ってきたとき', () => {
  it('プリセット0のURLが返ること', () => {
    // @ts-ignore
    const actual = iconInfoToUrl({ type: 'unkown', preset: '0', url: 'https://example.com/dummy.png' });
    expect(actual).toStrictEqual('https://syncroom.yamaha.com/mypage/assets/img/user/img_0.png');
  });
});
