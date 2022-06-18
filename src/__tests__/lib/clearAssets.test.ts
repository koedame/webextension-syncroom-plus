/**
 * @jest-environment jsdom
 */

import { describe, it, expect } from '@jest/globals';
import clearAssets from '../../lib/clearAssets';

describe('clearAssets()を実行したとき', () => {
  const html = '<link /><meta /><script></script>';
  document.head.innerHTML = html;
  document.body.innerHTML = html;

  it('不要なタグが削除されること', () => {
    clearAssets();
    expect(document.head.innerHTML).toBe('');
    expect(document.body.innerHTML).toBe('');
  });
});
