import { describe, it } from '@jest/globals';
import { savePassword } from '../../../lib/passwordManager';

describe('初めてパスワードを保存するとき', () => {
  it('正しくパスワードが保存されること', () => {
    mockBrowser.storage.local.get.expect('roomPasswords').andResolve(
      new Promise((resolve) => {
        resolve({ roomPasswords: undefined });
      })
    );

    mockBrowser.storage.local.set
      .expect({
        roomPasswords: { 部屋名1: 'パスワード1' },
      })
      .andResolve();

    savePassword('部屋名1', 'パスワード1');
  });
});

describe('他の部屋のパスワードが保存されているとき', () => {
  it('他の部屋のパスワードと一緒に保存されること', () => {
    mockBrowser.storage.local.get.expect('roomPasswords').andResolve(
      new Promise((resolve) => {
        resolve({ roomPasswords: { 部屋名2: 'パスワード2' } });
      })
    );

    mockBrowser.storage.local.set
      .expect({
        roomPasswords: { 部屋名2: 'パスワード2', 部屋名1: 'パスワード1' },
      })
      .andResolve();

    savePassword('部屋名1', 'パスワード1');
  });
});

describe('すでに別のパスワードが保存されているとき', () => {
  it('上書き保存されること', () => {
    mockBrowser.storage.local.get.expect('roomPasswords').andResolve(
      new Promise((resolve) => {
        resolve({ roomPasswords: { 部屋名2: 'パスワード2', 部屋名1: '古いパスワード' } });
      })
    );

    mockBrowser.storage.local.set
      .expect({
        roomPasswords: { 部屋名2: 'パスワード2', 部屋名1: '新しいパスワード' },
      })
      .andResolve();

    savePassword('部屋名1', '新しいパスワード');
  });
});

describe('既存の形式がおかしいとき(配列)', () => {
  it('リセットされて新しくパスワードが保存されること', () => {
    mockBrowser.storage.local.get.expect('roomPasswords').andResolve(
      new Promise((resolve) => {
        resolve({ roomPasswords: [] });
      })
    );

    mockBrowser.storage.local.set
      .expect({
        roomPasswords: { 部屋名1: 'パスワード1' },
      })
      .andResolve();

    savePassword('部屋名1', 'パスワード1');
  });
});

describe('既存の形式がおかしいとき(文字列)', () => {
  it('リセットされて新しくパスワードが保存されること', () => {
    mockBrowser.storage.local.get.expect('roomPasswords').andResolve(
      new Promise((resolve) => {
        resolve({ roomPasswords: '' });
      })
    );

    mockBrowser.storage.local.set
      .expect({
        roomPasswords: { 部屋名1: 'パスワード1' },
      })
      .andResolve();

    savePassword('部屋名1', 'パスワード1');
  });
});
