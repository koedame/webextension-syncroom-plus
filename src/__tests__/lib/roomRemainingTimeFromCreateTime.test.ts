import { jest, describe, it, expect } from '@jest/globals';
import { roomRemainingTimeFromCreateTime } from '../../lib/roomRemainingTimeFromCreateTime';

describe('開始時間のとき', () => {
  it('6時間が返ること', () => {
    const mockDate = new Date('2022-06-04T14:42:23+00:00').getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = roomRemainingTimeFromCreateTime('2022-06-04 14:42:23 GMT');
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual('06:00:00');

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('1時間23分12秒経過しているとき', () => {
  it('03:36:49が返ること', () => {
    const mockDate = new Date('2022-06-04T17:05:34+00:00').getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = roomRemainingTimeFromCreateTime('2022-06-04 14:42:23 GMT');
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual('03:36:49');

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('６時間経過経過しているとき', () => {
  it('00:00:00が返ること', () => {
    const mockDate = new Date('2022-06-04T20:42:23+00:00').getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = roomRemainingTimeFromCreateTime('2022-06-04 14:42:23 GMT');
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual('00:00:00');

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('６時間経過以上経過しているとき', () => {
  it('00:00:00が返ること', () => {
    const mockDate = new Date('2022-06-04T20:52:23+00:00').getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = roomRemainingTimeFromCreateTime('2022-06-04 14:42:23 GMT');
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual('00:00:00');

    spy.mockReset();
    spy.mockRestore();
  });
});
