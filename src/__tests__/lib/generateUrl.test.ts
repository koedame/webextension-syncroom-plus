import { describe, it, expect } from '@jest/globals';
import { generateUrl } from '../../lib/openInSyncroomApp';

describe('半角英数のみのとき', () => {
  it('正しくエンコードされること', () => {
    const actual = generateUrl('RoomName', 'Password', false);
    expect(actual).toStrictEqual('syncroom:am9pbmdyb3VwP21vZGU9MiZwaWQ9NCZuaWNrbmFtZT0mZ3JvdXBuYW1lPVJvb21OYW1lJnBhc3N3b3JkPVBhc3N3b3Jk');
  });
});

describe('仮入室用URLのとき', () => {
  it('正しくエンコードされること', () => {
    const actual = generateUrl('RoomName', 'Password', true);
    expect(actual).toStrictEqual('syncroom:am9pbmdyb3VwP21vZGU9MyZwaWQ9NCZuaWNrbmFtZT0mZ3JvdXBuYW1lPVJvb21OYW1lJnBhc3N3b3JkPVBhc3N3b3Jk');
  });
});

describe('日本語が含まれるとき', () => {
  it('正しくエンコードされること', () => {
    const actual = generateUrl('部屋名', 'パスワード', false);
    expect(actual).toStrictEqual(
      'syncroom:am9pbmdyb3VwP21vZGU9MiZwaWQ9NCZuaWNrbmFtZT0mZ3JvdXBuYW1lPSVFOSU4MyVBOCVFNSVCMSU4QiVFNSU5MCU4RCZwYXNzd29yZD0lRTMlODMlOTElRTMlODIlQjklRTMlODMlQUYlRTMlODMlQkMlRTMlODMlODk='
    );
  });
});

describe('記号が含まれるとき', () => {
  it('正しくエンコードされること', () => {
    const actual = generateUrl('`1234567890-=~_+[];\',./\\{}|:"<>?', '`1234567890-=~_+[];\',./\\{}|:"<>?', false);
    expect(actual).toStrictEqual(
      'syncroom:am9pbmdyb3VwP21vZGU9MiZwaWQ9NCZuaWNrbmFtZT0mZ3JvdXBuYW1lPSU2MDEyMzQ1Njc4OTAtJTNEfl8lMkIlNUIlNUQlM0InJTJDLiUyRiU1QyU3QiU3RCU3QyUzQSUyMiUzQyUzRSUzRiZwYXNzd29yZD0lNjAxMjM0NTY3ODkwLSUzRH5fJTJCJTVCJTVEJTNCJyUyQy4lMkYlNUMlN0IlN0QlN0MlM0ElMjIlM0MlM0UlM0Y='
    );
  });
});
