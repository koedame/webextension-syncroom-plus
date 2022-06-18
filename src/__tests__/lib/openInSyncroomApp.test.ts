/**
 * @jest-environment jsdom
 */

import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { openInSyncroomApp } from '../../lib/openInSyncroomApp';

const { location } = window;

beforeAll(() => {
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = { href: jest.fn() };
});

afterAll(() => {
  window.location = location;
});

describe('本入室を指定したとき', () => {
  it('本入室のURLが開かれること', () => {
    expect(jest.isMockFunction(window.location.href)).toBe(true);
    openInSyncroomApp('RoomName', 'Password', false);
    expect(window.location.href).toBe('syncroom:am9pbmdyb3VwP21vZGU9MiZwaWQ9NCZuaWNrbmFtZT0mZ3JvdXBuYW1lPVJvb21OYW1lJnBhc3N3b3JkPVBhc3N3b3Jk');
  });
});
