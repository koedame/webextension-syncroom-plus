import { describe, it } from '@jest/globals';
import { resetRememberPasswords } from '../../../lib/passwordManager';

describe('実行したとき', () => {
  it('空のデータが保存されること', () => {
    mockBrowser.storage.local.set
      .expect({
        roomPasswords: {},
      })
      .andResolve();

    resetRememberPasswords();
  });
});
