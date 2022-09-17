/**
 * @jest-environment jsdom
 */

import { jest, describe, it, expect } from '@jest/globals';
import decodeJWTPayLoad from '../../lib/decodeJWTPayLoad';

describe('正常なペイロードが含まれるJWTのとき', () => {
  it('ペイロードが返ること', () => {
    // echo -n  '{"aud":"syncroom","exp":1641081600,"iat":1641081600,"iss":"https://webapi.syncroom.appservice.yamaha.com","key_type":2,"sub":"11111111-1111-1111-1111-111111111111","user_id":"11111111-1111-1111-1111-111111111111","x-logid":"1111111111111111111111111111111111111111111111111111111111111111"}' | base64
    const validToken = '__header__.eyJhdWQiOiJzeW5jcm9vbSIsImV4cCI6MTY0MTA4MTYwMCwiaWF0IjoxNjQxMDgxNjAwLCJpc3MiOiJodHRwczovL3dlYmFwaS5zeW5jcm9vbS5hcHBzZXJ2aWNlLnlhbWFoYS5jb20iLCJrZXlfdHlwZSI6Miwic3ViIjoiMTExMTExMTEtMTExMS0xMTExLTExMTEtMTExMTExMTExMTExIiwidXNlcl9pZCI6IjExMTExMTExLTExMTEtMTExMS0xMTExLTExMTExMTExMTExMSIsIngtbG9naWQiOiIxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExIn0=.__sign__';
    expect(decodeJWTPayLoad(validToken)).toStrictEqual({
      "aud": "syncroom",
      "exp": Number(new Date('2022-01-02 00:00:00Z')) / 1000,
      "iat": Number(new Date('2022-01-02 00:00:00Z')) / 1000,
      "iss": "https://webapi.syncroom.appservice.yamaha.com",
      "key_type": 2,
      "sub": "11111111-1111-1111-1111-111111111111",
      "user_id": "11111111-1111-1111-1111-111111111111",
      "x-logid": "1111111111111111111111111111111111111111111111111111111111111111",
    });
  });
})

describe('JWT形式の文字列ではないとき', () => {
  it('エラーになること', () => {
    const invalidToken = '__header__.invalid.__sign__';
    expect(() => decodeJWTPayLoad(invalidToken)).toThrowError(new Error('Invalid token'));
  });
});

describe('JWT形式の文字列ではないとき', () => {
  it('エラーになること', () => {
    const invalidToken = 'invalid token';
    expect(() => decodeJWTPayLoad(invalidToken)).toThrowError(new Error('Invalid token'));
  });
});
