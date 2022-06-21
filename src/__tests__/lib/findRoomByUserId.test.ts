import { describe, it, expect } from '@jest/globals';
import findRoomByUserId from '../../lib/findRoomByUserId';
import { SYNCROOM } from '../../types/syncroom';

describe('ルームが存在しない時', () => {
  it('undefinedが返ること', () => {
    const rooms: SYNCROOM.RoomType[] = [];
    const userId = 'd67c80d4-9606-4532-ab47-176f1fe84779';
    const actual = findRoomByUserId(rooms, userId);
    expect(actual).toBeUndefined();
  });
});

describe('ユーザーが存在しない時', () => {
  it('undefinedが返ること', () => {
    const rooms: SYNCROOM.RoomType[] = [
      {
        realm: 4,
        index: 1,
        roomAttribute: {
          language: 'ja',
        },
        roomName: 'ルーム1',
        roomDesc: '',
        needPasswd: false,
        creator: {
          userId: 'a5b16ab0-e4b4-445a-861a-6b72e9b1eeb2',
          nickname: '作成者1',
          nsgmMemberId: '215363',
          iconInfo: {
            preset: '0',
            type: 'preset',
            url: '',
          },
          favorite: false,
        },
        members: [
          {
            userId: 'a5b16ab0-e4b4-445a-861a-6b72e9b1eeb2',
            nickname: '作成者1',
            nsgmMemberId: '215363',
            iconInfo: {
              preset: '0',
              type: 'preset',
              url: '',
            },
            favorite: false,
          },
          {
            userId: '2b3b3b1c-2c92-4675-bc0e-b6b5f95ee664',
            nickname: 'メンバー1',
            nsgmMemberId: '21234',
            iconInfo: {
              preset: '0',
              type: 'preset',
              url: '',
            },
            favorite: false,
          },
        ],
        numMembers: 2,
        tagMask: '2147516419',
        tagOrig: '',
        createTime: '2022-06-20 12:42:47 GMT',
      },
      {
        realm: 4,
        index: 1,
        roomAttribute: {
          language: 'ja',
        },
        roomName: 'ルーム2',
        roomDesc: '',
        needPasswd: false,
        creator: {
          userId: '430d9a9c-cfc9-4ca2-ada2-8b519ffb473c',
          nickname: '作成者2',
          nsgmMemberId: '215363',
          iconInfo: {
            preset: '0',
            type: 'preset',
            url: '',
          },
          favorite: false,
        },
        members: [
          {
            userId: '430d9a9c-cfc9-4ca2-ada2-8b519ffb473c',
            nickname: '作成者2',
            nsgmMemberId: '215363',
            iconInfo: {
              preset: '0',
              type: 'preset',
              url: '',
            },
            favorite: false,
          },
          {
            userId: '57247d1f-2ba7-4ae7-9eb9-19883b7756de',
            nickname: 'メンバー2',
            nsgmMemberId: '24334',
            iconInfo: {
              preset: '0',
              type: 'preset',
              url: '',
            },
            favorite: false,
          },
        ],
        numMembers: 2,
        tagMask: '2147516419',
        tagOrig: '',
        createTime: '2022-06-20 12:42:47 GMT',
      },
    ];
    const userId = 'noexist';
    const actual = findRoomByUserId(rooms, userId);
    expect(actual).toBeUndefined();
  });
});

describe('ユーザーが存在するとき', () => {
  it('対象のroomが返ること', () => {
    const expected: SYNCROOM.RoomType = {
      realm: 4,
      index: 1,
      roomAttribute: {
        language: 'ja',
      },
      roomName: 'ルーム1',
      roomDesc: '',
      needPasswd: false,
      creator: {
        userId: 'a5b16ab0-e4b4-445a-861a-6b72e9b1eeb2',
        nickname: '作成者1',
        nsgmMemberId: '215363',
        iconInfo: {
          preset: '0',
          type: 'preset',
          url: '',
        },
        favorite: false,
      },
      members: [
        {
          userId: 'a5b16ab0-e4b4-445a-861a-6b72e9b1eeb2',
          nickname: '作成者1',
          nsgmMemberId: '215363',
          iconInfo: {
            preset: '0',
            type: 'preset',
            url: '',
          },
          favorite: false,
        },
        {
          userId: '2b3b3b1c-2c92-4675-bc0e-b6b5f95ee664',
          nickname: 'メンバー1',
          nsgmMemberId: '21234',
          iconInfo: {
            preset: '0',
            type: 'preset',
            url: '',
          },
          favorite: false,
        },
      ],
      numMembers: 2,
      tagMask: '2147516419',
      tagOrig: '',
      createTime: '2022-06-20 12:42:47 GMT',
    };

    const rooms: SYNCROOM.RoomType[] = [
      expected,
      {
        realm: 4,
        index: 1,
        roomAttribute: {
          language: 'ja',
        },
        roomName: 'ルーム2',
        roomDesc: '',
        needPasswd: false,
        creator: {
          userId: '430d9a9c-cfc9-4ca2-ada2-8b519ffb473c',
          nickname: '作成者2',
          nsgmMemberId: '215363',
          iconInfo: {
            preset: '0',
            type: 'preset',
            url: '',
          },
          favorite: false,
        },
        members: [
          {
            userId: '430d9a9c-cfc9-4ca2-ada2-8b519ffb473c',
            nickname: '作成者2',
            nsgmMemberId: '215363',
            iconInfo: {
              preset: '0',
              type: 'preset',
              url: '',
            },
            favorite: false,
          },
          {
            userId: '57247d1f-2ba7-4ae7-9eb9-19883b7756de',
            nickname: 'メンバー2',
            nsgmMemberId: '24334',
            iconInfo: {
              preset: '0',
              type: 'preset',
              url: '',
            },
            favorite: false,
          },
        ],
        numMembers: 2,
        tagMask: '2147516419',
        tagOrig: '',
        createTime: '2022-06-20 12:42:47 GMT',
      },
    ];
    const userId = '2b3b3b1c-2c92-4675-bc0e-b6b5f95ee664';
    const actual = findRoomByUserId(rooms, userId);
    expect(actual).toStrictEqual(expected);
  });
});
