import { describe, it, test, expect } from '@jest/globals';
import formatUserBasicInfo from '../../lib/formatUserBasicInfo';

describe('データを与えると', () => {
  it('名前順にソートされること', () => {
    const users = [
      {
        '122b26ea-6d1d-4268-832a-8c102db1a25e': {
          userId: 'c52b26ea-6d1d-4268-832a-8c102db1a25e',
          nickname: 'CDE',
          publishStatus: 'open',
          profileText: '',
          iconInfo: { type: 'preset', preset: '0', url: '' },
          isBlockedByMe: false,
          isFavoredByMe: true,
        },
      },
      {
        '349054b9-dd78-40a3-b4a9-4462549e84e5': {
          userId: '349054b9-2134-44b6-bdfe-4f3ece4d4a4a',
          nickname: 'ABC',
          publishStatus: 'open',
          profileText: '',
          iconInfo: { type: 'preset', preset: '0', url: '' },
          isBlockedByMe: false,
          isFavoredByMe: true,
        },
      },
      {
        '229054b9-dd78-40a3-b4a9-4462549e84e5': {
          userId: '229054b9-2134-44b6-bdfe-4f3ece4d4a4a',
          nickname: 'ABC',
          publishStatus: 'open',
          profileText: '',
          iconInfo: { type: 'preset', preset: '0', url: '' },
          isBlockedByMe: false,
          isFavoredByMe: true,
        },
      },
      {
        '449054b9-dd78-40a3-b4a9-4462549e84e5': {
          userId: '449054b9-2134-44b6-bdfe-4f3ece4d4a4a',
          nickname: 'BCD',
          publishStatus: 'open',
          profileText: '',
          iconInfo: { type: 'preset', preset: '0', url: '' },
          isBlockedByMe: false,
          isFavoredByMe: true,
        },
      },
    ];

    // @ts-ignore
    const received = formatUserBasicInfo(users);

    expect(received).toStrictEqual([
      {
        userId: '349054b9-2134-44b6-bdfe-4f3ece4d4a4a',
        nickname: 'ABC',
        publishStatus: 'open',
        profileText: '',
        iconInfo: { type: 'preset', preset: '0', url: '' },
        isBlockedByMe: false,
        isFavoredByMe: true,
      },
      {
        userId: '229054b9-2134-44b6-bdfe-4f3ece4d4a4a',
        nickname: 'ABC',
        publishStatus: 'open',
        profileText: '',
        iconInfo: { type: 'preset', preset: '0', url: '' },
        isBlockedByMe: false,
        isFavoredByMe: true,
      },
      {
        userId: '449054b9-2134-44b6-bdfe-4f3ece4d4a4a',
        nickname: 'BCD',
        publishStatus: 'open',
        profileText: '',
        iconInfo: { type: 'preset', preset: '0', url: '' },
        isBlockedByMe: false,
        isFavoredByMe: true,
      },
      {
        userId: 'c52b26ea-6d1d-4268-832a-8c102db1a25e',
        nickname: 'CDE',
        publishStatus: 'open',
        profileText: '',
        iconInfo: { type: 'preset', preset: '0', url: '' },
        isBlockedByMe: false,
        isFavoredByMe: true,
      },
    ]);
  });
});
