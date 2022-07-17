/**
 * @jest-environment jsdom
 */
import { jest, describe, it, expect } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-hooks';
import { useServiceNotification } from '../../hooks/useServiceNotification';
import { ServiceNotificationRepository } from '../../repositories/serviceNotificationRepository';

describe('初期状態', () => {
  it('初期状態が返ること', () => {
    const now = '2022-12-01T00:00:00+00:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    const { result } = renderHook(() => useServiceNotification());
    expect(spy).toHaveBeenCalledTimes(0);

    expect(result.current.color).toStrictEqual('yellow');
    expect(result.current.isShow).toStrictEqual(false);
    expect(result.current.serviceNotification).toStrictEqual(null);

    spy.mockReset();
    spy.mockRestore();
  });
});

describe('期間内のお知らせがあった場合', () => {
  it('表示できる状態の情報が返ること', async () => {
    const now = '2022-01-02T00:00:00+09:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    const spy2 = jest.spyOn(ServiceNotificationRepository, 'latest').mockImplementation(() =>
      Promise.resolve({
        title: 'タイトル',
        description: '詳細',
        start_at: '2022-01-01T00:00:00+09:00',
        end_at: '2022-01-03T00:00:00+09:00',
        notification_type: 'info',
        closable: false,
        has_icon: false,
      })
    );

    const { result } = renderHook(() => useServiceNotification());

    await act(async () => {
      await result.current.fetchServiceNotification();
    });

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    expect(result.current.color).toStrictEqual('blue');
    expect(result.current.isShow).toStrictEqual(true);
    expect(result.current.serviceNotification).toStrictEqual({
      title: 'タイトル',
      description: '詳細',
      start_at: '2022-01-01T00:00:00+09:00',
      end_at: '2022-01-03T00:00:00+09:00',
      notification_type: 'info',
      closable: false,
      has_icon: false,
    });

    spy.mockReset();
    spy.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });
});

describe('期間前のお知らせがあった場合', () => {
  it('表示できない状態の情報が返ること', async () => {
    const now = '2022-01-02T00:00:00+09:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    const spy2 = jest.spyOn(ServiceNotificationRepository, 'latest').mockImplementation(() =>
      Promise.resolve({
        title: 'タイトル',
        description: '詳細',
        start_at: '2022-01-03T00:00:00+09:00',
        end_at: '2022-01-04T00:00:00+09:00',
        notification_type: 'info',
        closable: false,
        has_icon: false,
      })
    );

    const { result } = renderHook(() => useServiceNotification());

    await act(async () => {
      await result.current.fetchServiceNotification();
    });

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    expect(result.current.color).toStrictEqual('blue');
    expect(result.current.isShow).toStrictEqual(false);
    expect(result.current.serviceNotification).toStrictEqual({
      title: 'タイトル',
      description: '詳細',
      start_at: '2022-01-03T00:00:00+09:00',
      end_at: '2022-01-04T00:00:00+09:00',
      notification_type: 'info',
      closable: false,
      has_icon: false,
    });

    spy.mockReset();
    spy.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });
});

describe('期間後のお知らせがあった場合', () => {
  it('表示できない状態の情報が返ること', async () => {
    const now = '2022-01-02T00:00:00+09:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    const spy2 = jest.spyOn(ServiceNotificationRepository, 'latest').mockImplementation(() =>
      Promise.resolve({
        title: 'タイトル',
        description: '詳細',
        start_at: '2022-01-01T00:00:00+09:00',
        end_at: '2022-01-01T00:00:00+09:00',
        notification_type: 'info',
        closable: false,
        has_icon: false,
      })
    );

    const { result } = renderHook(() => useServiceNotification());

    await act(async () => {
      await result.current.fetchServiceNotification();
    });

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    expect(result.current.color).toStrictEqual('blue');
    expect(result.current.isShow).toStrictEqual(false);
    expect(result.current.serviceNotification).toStrictEqual({
      title: 'タイトル',
      description: '詳細',
      start_at: '2022-01-01T00:00:00+09:00',
      end_at: '2022-01-01T00:00:00+09:00',
      notification_type: 'info',
      closable: false,
      has_icon: false,
    });

    spy.mockReset();
    spy.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });
});

describe('タイムゾーンが指定されていないお知らせがあった場合', () => {
  it('正しい情報が返ること', async () => {
    const now = '2022-01-02T00:00:00+09:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    const spy2 = jest.spyOn(ServiceNotificationRepository, 'latest').mockImplementation(() =>
      Promise.resolve({
        title: 'タイトル',
        description: '詳細',
        start_at: '2022-01-01T00:00:00Z',
        end_at: '2022-01-03T00:00:00Z',
        notification_type: 'info',
        closable: false,
        has_icon: false,
      })
    );

    const { result } = renderHook(() => useServiceNotification());

    await act(async () => {
      await result.current.fetchServiceNotification();
    });

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    expect(result.current.color).toStrictEqual('blue');
    expect(result.current.isShow).toStrictEqual(true);
    expect(result.current.serviceNotification).toStrictEqual({
      title: 'タイトル',
      description: '詳細',
      start_at: '2022-01-01T00:00:00Z',
      end_at: '2022-01-03T00:00:00Z',
      notification_type: 'info',
      closable: false,
      has_icon: false,
    });

    spy.mockReset();
    spy.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });
});

describe('お知らせ情報の取得に失敗した場合', () => {
  it('初期状態のままでいること', async () => {
    const now = '2022-01-02T00:00:00+09:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    const spy2 = jest.spyOn(ServiceNotificationRepository, 'latest').mockImplementation(() => Promise.reject('エラーです'));
    const spy3 = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useServiceNotification());

    await act(async () => {
      await result.current.fetchServiceNotification();
    });

    expect(spy).toHaveBeenCalledTimes(0);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy3.mock.calls[0][0]).toBe('お知らせ取得失敗');
    expect(spy3.mock.calls[0][1]).toBe('エラーです');

    expect(result.current.color).toStrictEqual('yellow');
    expect(result.current.isShow).toStrictEqual(false);
    expect(result.current.serviceNotification).toStrictEqual(null);

    spy.mockReset();
    spy.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
    spy3.mockReset();
    spy3.mockRestore();
  });
});

describe('infoが設定されている時', () => {
  it('colorにblueが設定されること', async () => {
    const now = '2022-01-02T00:00:00+09:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    const spy2 = jest.spyOn(ServiceNotificationRepository, 'latest').mockImplementation(() =>
      Promise.resolve({
        title: 'タイトル',
        description: '詳細',
        start_at: '2022-01-01T00:00:00+09:00',
        end_at: '2022-01-03T00:00:00+09:00',
        notification_type: 'info',
        closable: false,
        has_icon: false,
      })
    );

    const { result } = renderHook(() => useServiceNotification());

    await act(async () => {
      await result.current.fetchServiceNotification();
    });

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    expect(result.current.color).toStrictEqual('blue');
    expect(result.current.isShow).toStrictEqual(true);
    expect(result.current.serviceNotification).toStrictEqual({
      title: 'タイトル',
      description: '詳細',
      start_at: '2022-01-01T00:00:00+09:00',
      end_at: '2022-01-03T00:00:00+09:00',
      notification_type: 'info',
      closable: false,
      has_icon: false,
    });

    spy.mockReset();
    spy.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });
});

describe('successが設定されている時', () => {
  it('colorにgreenが設定されること', async () => {
    const now = '2022-01-02T00:00:00+09:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    const spy2 = jest.spyOn(ServiceNotificationRepository, 'latest').mockImplementation(() =>
      Promise.resolve({
        title: 'タイトル',
        description: '詳細',
        start_at: '2022-01-01T00:00:00+09:00',
        end_at: '2022-01-03T00:00:00+09:00',
        notification_type: 'success',
        closable: false,
        has_icon: false,
      })
    );

    const { result } = renderHook(() => useServiceNotification());

    await act(async () => {
      await result.current.fetchServiceNotification();
    });

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    expect(result.current.color).toStrictEqual('green');
    expect(result.current.isShow).toStrictEqual(true);
    expect(result.current.serviceNotification).toStrictEqual({
      title: 'タイトル',
      description: '詳細',
      start_at: '2022-01-01T00:00:00+09:00',
      end_at: '2022-01-03T00:00:00+09:00',
      notification_type: 'success',
      closable: false,
      has_icon: false,
    });

    spy.mockReset();
    spy.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });
});

describe('warningが設定されている時', () => {
  it('colorにyellowが設定されること', async () => {
    const now = '2022-01-02T00:00:00+09:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    const spy2 = jest.spyOn(ServiceNotificationRepository, 'latest').mockImplementation(() =>
      Promise.resolve({
        title: 'タイトル',
        description: '詳細',
        start_at: '2022-01-01T00:00:00+09:00',
        end_at: '2022-01-03T00:00:00+09:00',
        notification_type: 'warning',
        closable: false,
        has_icon: false,
      })
    );

    const { result } = renderHook(() => useServiceNotification());

    await act(async () => {
      await result.current.fetchServiceNotification();
    });

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    expect(result.current.color).toStrictEqual('yellow');
    expect(result.current.isShow).toStrictEqual(true);
    expect(result.current.serviceNotification).toStrictEqual({
      title: 'タイトル',
      description: '詳細',
      start_at: '2022-01-01T00:00:00+09:00',
      end_at: '2022-01-03T00:00:00+09:00',
      notification_type: 'warning',
      closable: false,
      has_icon: false,
    });

    spy.mockReset();
    spy.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });
});

describe('dangerが設定されている時', () => {
  it('colorにredが設定されること', async () => {
    const now = '2022-01-02T00:00:00+09:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    const spy2 = jest.spyOn(ServiceNotificationRepository, 'latest').mockImplementation(() =>
      Promise.resolve({
        title: 'タイトル',
        description: '詳細',
        start_at: '2022-01-01T00:00:00+09:00',
        end_at: '2022-01-03T00:00:00+09:00',
        notification_type: 'danger',
        closable: false,
        has_icon: false,
      })
    );

    const { result } = renderHook(() => useServiceNotification());

    await act(async () => {
      await result.current.fetchServiceNotification();
    });

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    expect(result.current.color).toStrictEqual('red');
    expect(result.current.isShow).toStrictEqual(true);
    expect(result.current.serviceNotification).toStrictEqual({
      title: 'タイトル',
      description: '詳細',
      start_at: '2022-01-01T00:00:00+09:00',
      end_at: '2022-01-03T00:00:00+09:00',
      notification_type: 'danger',
      closable: false,
      has_icon: false,
    });

    spy.mockReset();
    spy.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });
});

describe('typeに不明な値が設定されている時', () => {
  it('colorにblueが設定されること', async () => {
    const now = '2022-01-02T00:00:00+09:00';

    const mockDate = new Date(now).getTime();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    const spy2 = jest.spyOn(ServiceNotificationRepository, 'latest').mockImplementation(() =>
      // @ts-ignore
      Promise.resolve({
        title: 'タイトル',
        description: '詳細',
        start_at: '2022-01-01T00:00:00+09:00',
        end_at: '2022-01-03T00:00:00+09:00',
        notification_type: 'unknown',
        closable: false,
        has_icon: false,
      })
    );

    const { result } = renderHook(() => useServiceNotification());

    await act(async () => {
      await result.current.fetchServiceNotification();
    });

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    expect(result.current.color).toStrictEqual('blue');
    expect(result.current.isShow).toStrictEqual(true);
    expect(result.current.serviceNotification).toStrictEqual({
      title: 'タイトル',
      description: '詳細',
      start_at: '2022-01-01T00:00:00+09:00',
      end_at: '2022-01-03T00:00:00+09:00',
      notification_type: 'unknown',
      closable: false,
      has_icon: false,
    });

    spy.mockReset();
    spy.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });
});
