/**
 * @jest-environment jsdom
 */

import { describe, it, expect } from '@jest/globals';
import addFavicon from '../../lib/addFavicon';

describe('addFavicon()を実行したとき', () => {
  const initial = '<meta charset="utf-8">\
  <title>プレイヤーズサイト｜SYNCROOM（シンクルーム）</title>';
  document.head.innerHTML = initial;

  it('ヘッダーにファビコンが設置されること', () => {
    addFavicon();
    expect(document.head.innerHTML.includes(initial)).toBe(true);
    expect(document.head.innerHTML.includes('<link rel="shortcut icon" href="https://syncroomplus.koeda.me/favicon.ico">')).toBe(true);
  });
});
