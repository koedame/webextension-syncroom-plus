import { describe, it, test, expect } from '@jest/globals';
import sumallizeRoomData from '../../lib/sumallizeRoomData';
import { SYNCROOM } from '../../types/syncroom';

describe('部屋が存在しない時', () => {
  it('正しく集計されること', () => {
    const rooms: SYNCROOM.RoomType[] = [];
    const { AggregatedTags, LockedAggregatedTags, UnlockedAggregatedTags, TestRoom, PublicRoomsCount, PublicLockedRoomsCount, PublicUnlockedRoomsCount } = sumallizeRoomData(rooms);

    expect(AggregatedTags).toStrictEqual([]);
    expect(LockedAggregatedTags).toStrictEqual([]);
    expect(UnlockedAggregatedTags).toStrictEqual([]);
    expect(TestRoom).toStrictEqual(null);
    expect(PublicRoomsCount).toStrictEqual(0);
    expect(PublicLockedRoomsCount).toStrictEqual(0);
    expect(PublicUnlockedRoomsCount).toStrictEqual(0);
  });
});

describe('テストルームが存在する時', () => {
  it('テストルームに分類されて返ること', () => {
    const testRoom: SYNCROOM.TestRoomType = {
      realm: 1,
      index: 1,
      roomAttribute: { language: 'ja' },
      roomName: '接続テストルーム',
      roomDesc: '',
      needPasswd: false,
      creator: {
        userId: 'id',
        nickname: 'SYNCROOM bot',
        nsgmMemberId: 'id',
        iconInfo: {
          type: 'preset',
          preset: '0',
          url: '',
        },
        favorite: false,
      },
      members: [
        {
          userId: 'id',
          nickname: 'SYNCROOM bot',
          nsgmMemberId: 'id',
          iconInfo: {
            type: 'preset',
            preset: '0',
            url: '',
          },
          favorite: false,
        },
      ],
      numMembers: 1,
      tagMask: '0',
      tagOrig: '',
      createTime: '2022-06-12 12:57 GMT',
    };
    const rooms: SYNCROOM.RoomType[] = [testRoom];

    const { AggregatedTags, LockedAggregatedTags, UnlockedAggregatedTags, TestRoom, PublicRoomsCount, PublicLockedRoomsCount, PublicUnlockedRoomsCount } = sumallizeRoomData(rooms);

    expect(AggregatedTags).toStrictEqual([]);
    expect(LockedAggregatedTags).toStrictEqual([]);
    expect(UnlockedAggregatedTags).toStrictEqual([]);
    expect(TestRoom).toStrictEqual(testRoom);
    expect(PublicRoomsCount).toStrictEqual(0);
    expect(PublicLockedRoomsCount).toStrictEqual(0);
    expect(PublicUnlockedRoomsCount).toStrictEqual(0);
  });
});

describe('鍵なしルームが存在する時', () => {
  it('鍵なしルームとして集計されること', () => {
    const unLockedRoom: SYNCROOM.RoomType = {
      realm: 1,
      index: 1,
      roomAttribute: { language: 'ja' },
      roomName: '公開部屋',
      roomDesc: '',
      needPasswd: false,
      creator: {
        userId: 'id',
        nickname: 'SYNCROOM bot',
        nsgmMemberId: 'id',
        iconInfo: {
          type: 'preset',
          preset: '0',
          url: '',
        },
        favorite: false,
      },
      members: [
        {
          userId: 'id',
          nickname: 'SYNCROOM bot',
          nsgmMemberId: 'id',
          iconInfo: {
            type: 'preset',
            preset: '0',
            url: '',
          },
          favorite: false,
        },
      ],
      numMembers: 1,
      tagMask: '0',
      tagOrig: '独自タグ',
      createTime: '2022-06-12 12:57 GMT',
    };
    const rooms: SYNCROOM.RoomType[] = [unLockedRoom];

    const { AggregatedTags, LockedAggregatedTags, UnlockedAggregatedTags, TestRoom, PublicRoomsCount, PublicLockedRoomsCount, PublicUnlockedRoomsCount } = sumallizeRoomData(rooms);

    expect(AggregatedTags).toStrictEqual([{ name: '独自タグ', count: 1 }]);
    expect(LockedAggregatedTags).toStrictEqual([]);
    expect(UnlockedAggregatedTags).toStrictEqual([{ name: '独自タグ', count: 1 }]);
    expect(TestRoom).toStrictEqual(null);
    expect(PublicRoomsCount).toStrictEqual(1);
    expect(PublicLockedRoomsCount).toStrictEqual(0);
    expect(PublicUnlockedRoomsCount).toStrictEqual(1);
  });
});

describe('鍵ありルームが存在する時', () => {
  it('鍵ありルームとして集計されること', () => {
    const lockedRoom: SYNCROOM.RoomType = {
      realm: 1,
      index: 1,
      roomAttribute: { language: 'ja' },
      roomName: '公開部屋',
      roomDesc: '',
      needPasswd: true,
      creator: {
        userId: 'id',
        nickname: 'SYNCROOM bot',
        nsgmMemberId: 'id',
        iconInfo: {
          type: 'preset',
          preset: '0',
          url: '',
        },
        favorite: false,
      },
      members: [
        {
          userId: 'id',
          nickname: 'SYNCROOM bot',
          nsgmMemberId: 'id',
          iconInfo: {
            type: 'preset',
            preset: '0',
            url: '',
          },
          favorite: false,
        },
      ],
      numMembers: 1,
      tagMask: '0',
      tagOrig: '独自タグ',
      createTime: '2022-06-12 12:57 GMT',
    };
    const rooms: SYNCROOM.RoomType[] = [lockedRoom];

    const { AggregatedTags, LockedAggregatedTags, UnlockedAggregatedTags, TestRoom, PublicRoomsCount, PublicLockedRoomsCount, PublicUnlockedRoomsCount } = sumallizeRoomData(rooms);

    expect(AggregatedTags).toStrictEqual([{ name: '独自タグ', count: 1 }]);
    expect(LockedAggregatedTags).toStrictEqual([{ name: '独自タグ', count: 1 }]);
    expect(UnlockedAggregatedTags).toStrictEqual([]);
    expect(TestRoom).toStrictEqual(null);
    expect(PublicRoomsCount).toStrictEqual(1);
    expect(PublicLockedRoomsCount).toStrictEqual(1);
    expect(PublicUnlockedRoomsCount).toStrictEqual(0);
  });
});

describe('同じタグのルームが存在する時', () => {
  it('タグがそれぞれ集計されること', () => {
    const rooms: SYNCROOM.RoomType[] = [
      {
        realm: 1,
        index: 1,
        roomAttribute: { language: 'ja' },
        roomName: '公開部屋1',
        roomDesc: '',
        needPasswd: true,
        creator: {
          userId: 'id',
          nickname: 'SYNCROOM bot',
          nsgmMemberId: 'id',
          iconInfo: {
            type: 'preset',
            preset: '0',
            url: '',
          },
          favorite: false,
        },
        members: [
          {
            userId: 'id',
            nickname: 'SYNCROOM bot',
            nsgmMemberId: 'id',
            iconInfo: {
              type: 'preset',
              preset: '0',
              url: '',
            },
            favorite: false,
          },
        ],
        numMembers: 1,
        tagMask: '0',
        tagOrig: '独自タグ',
        createTime: '2022-06-12 12:57 GMT',
      },
      {
        realm: 1,
        index: 1,
        roomAttribute: { language: 'ja' },
        roomName: '公開部屋2',
        roomDesc: '',
        needPasswd: true,
        creator: {
          userId: 'id',
          nickname: 'SYNCROOM bot',
          nsgmMemberId: 'id',
          iconInfo: {
            type: 'preset',
            preset: '0',
            url: '',
          },
          favorite: false,
        },
        members: [
          {
            userId: 'id',
            nickname: 'SYNCROOM bot',
            nsgmMemberId: 'id',
            iconInfo: {
              type: 'preset',
              preset: '0',
              url: '',
            },
            favorite: false,
          },
        ],
        numMembers: 1,
        tagMask: '0',
        tagOrig: '独自タグ',
        createTime: '2022-06-12 12:57 GMT',
      },
      {
        realm: 1,
        index: 1,
        roomAttribute: { language: 'ja' },
        roomName: '公開部屋3',
        roomDesc: '',
        needPasswd: false,
        creator: {
          userId: 'id',
          nickname: 'SYNCROOM bot',
          nsgmMemberId: 'id',
          iconInfo: {
            type: 'preset',
            preset: '0',
            url: '',
          },
          favorite: false,
        },
        members: [
          {
            userId: 'id',
            nickname: 'SYNCROOM bot',
            nsgmMemberId: 'id',
            iconInfo: {
              type: 'preset',
              preset: '0',
              url: '',
            },
            favorite: false,
          },
        ],
        numMembers: 1,
        tagMask: '0',
        tagOrig: '独自タグ',
        createTime: '2022-06-12 12:57 GMT',
      },
      {
        realm: 1,
        index: 1,
        roomAttribute: { language: 'ja' },
        roomName: '公開部屋4',
        roomDesc: '',
        needPasswd: false,
        creator: {
          userId: 'id',
          nickname: 'SYNCROOM bot',
          nsgmMemberId: 'id',
          iconInfo: {
            type: 'preset',
            preset: '0',
            url: '',
          },
          favorite: false,
        },
        members: [
          {
            userId: 'id',
            nickname: 'SYNCROOM bot',
            nsgmMemberId: 'id',
            iconInfo: {
              type: 'preset',
              preset: '0',
              url: '',
            },
            favorite: false,
          },
        ],
        numMembers: 1,
        tagMask: '0',
        tagOrig: '独自タグ',
        createTime: '2022-06-12 12:57 GMT',
      },
      {
        realm: 1,
        index: 1,
        roomAttribute: { language: 'ja' },
        roomName: '公開部屋5',
        roomDesc: '',
        needPasswd: false,
        creator: {
          userId: 'id',
          nickname: 'SYNCROOM bot',
          nsgmMemberId: 'id',
          iconInfo: {
            type: 'preset',
            preset: '0',
            url: '',
          },
          favorite: false,
        },
        members: [
          {
            userId: 'id',
            nickname: 'SYNCROOM bot',
            nsgmMemberId: 'id',
            iconInfo: {
              type: 'preset',
              preset: '0',
              url: '',
            },
            favorite: false,
          },
        ],
        numMembers: 1,
        tagMask: '0',
        tagOrig: '独自タグ',
        createTime: '2022-06-12 12:57 GMT',
      },
    ];

    const { AggregatedTags, LockedAggregatedTags, UnlockedAggregatedTags, TestRoom, PublicRoomsCount, PublicLockedRoomsCount, PublicUnlockedRoomsCount } = sumallizeRoomData(rooms);

    expect(AggregatedTags).toStrictEqual([{ name: '独自タグ', count: 5 }]);
    expect(LockedAggregatedTags).toStrictEqual([{ name: '独自タグ', count: 2 }]);
    expect(UnlockedAggregatedTags).toStrictEqual([{ name: '独自タグ', count: 3 }]);
    expect(TestRoom).toStrictEqual(null);
    expect(PublicRoomsCount).toStrictEqual(5);
    expect(PublicLockedRoomsCount).toStrictEqual(2);
    expect(PublicUnlockedRoomsCount).toStrictEqual(3);
  });
});
