import { describe, it } from '@jest/globals';
import { getPasswordByRoomName } from '../../../lib/passwordManager';

describe('一度もパスワードが保存されていないとき', () => {
  it('空文字が返ること', () => {
    mockBrowser.storage.local.get.expect('v2RoomPasswords').andResolve(
      new Promise((resolve) => {
        resolve({ v2RoomPasswords: undefined });
      })
    );

    getPasswordByRoomName('部屋1').then((res) => {
      expect(res).toBe('');
    });
  });
});

describe('指定した部屋のパスワードが保存されていないとき', () => {
  it('空文字が返ること', () => {
    mockBrowser.storage.local.get.expect('v2RoomPasswords').andResolve(
      new Promise((resolve) => {
        resolve({ v2RoomPasswords: { 部屋2: 'パスワード2' } });
      })
    );

    getPasswordByRoomName('部屋1').then((res) => {
      expect(res).toBe('');
    });
  });
});

describe('指定した部屋のパスワードが保存されているとき', () => {
  it('パスワードが返ること', () => {
    mockBrowser.storage.local.get.expect('v2RoomPasswords').andResolve(
      new Promise((resolve) => {
        resolve({ v2RoomPasswords: { 部屋1: 'パスワード1', 部屋2: 'パスワード2' } });
      })
    );

    getPasswordByRoomName('部屋1').then((res) => {
      expect(res).toBe('パスワード1');
    });
  });
});
