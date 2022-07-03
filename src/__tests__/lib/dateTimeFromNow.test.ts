import { jest, describe, it, expect } from '@jest/globals';
import { dateTimeFromNow } from '../../lib/dateTimeFromNow';

describe('現在時刻と同じ時', () => {
  it('0秒前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-01T00:00:00+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'seconds', duration: 0 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('01秒前のとき', () => {
  it('01秒前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-01T00:00:01+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'seconds', duration: 1 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('59秒前のとき', () => {
  it('59秒前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-01T00:00:59+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'seconds', duration: 59 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('1分前のとき', () => {
  it('1分前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-01T00:01:00+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'minutes', duration: 1 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('1分前から2分の間のとき', () => {
  it('1分前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-01T00:01:12+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'minutes', duration: 1 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('59分前のとき', () => {
  it('59分前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-01T00:59:12+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'minutes', duration: 59 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('1時間前のとき', () => {
  it('1時間前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-01T01:00:00+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'hours', duration: 1 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('1時間と2時間の間のとき', () => {
  it('1時間前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-01T01:12:12+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'hours', duration: 1 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('23時間59分59秒前のとき', () => {
  it('23時間前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-01T23:59:59+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'hours', duration: 23 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('1日前のとき', () => {
  it('1日前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-02T00:00:00+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'days', duration: 1 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('1日と2日の間のとき', () => {
  it('1日前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-02T12:12:12+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'days', duration: 1 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('6日23時間59分59秒前のとき', () => {
  it('6日前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-07T23:59:59+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'days', duration: 6 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('7日前のとき', () => {
  it('1週間前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-08T00:00:00+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'weeks', duration: 1 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('4週間前のとき', () => {
  it('4週間前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-12-29T23:59:59+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'weeks', duration: 4 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('1ヶ月前のとき', () => {
  it('1ヶ月前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2023-01-01T00:00:00+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'months', duration: 1 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('1年前のとき', () => {
  it('1年前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2023-12-01T00:00:00+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'years', duration: 1 });

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('未来の日付のとき', () => {
  it('0秒前が返ること', () => {
    const from = '2022-12-01T00:00:00+00:00';
    const now = '2022-11-30T00:00:00+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const actual = dateTimeFromNow(new Date(from).getTime());
    expect(spy).toHaveBeenCalled();

    expect(actual).toStrictEqual({ type: 'seconds', duration: 0 });

    spy.mockReset();
    spy.mockRestore();
  });
});
