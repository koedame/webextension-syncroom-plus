export namespace SYNCROOM {
  export type IconInfoType =
    | {
        type: 'url';
        preset: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13';
        url: string;
      }
    | {
        type: 'preset';
        preset: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13';
        url: '';
      };

  export type PublishStatusType = 'open' | 'hidden';

  // その他のキーも適当にでっち上げて入れることも可能
  export type SocialLinksType = {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };

  export type ProfileLinkedType = {
    type: 'twitter' | 'none';
    accountName: string;
    linkNickname?: boolean;
    linkImage?: boolean;
  };

  export type CurrentStateType =
    | {
        type: 'none';
        // 最終活動日時
        // プロフィール非公開ユーザーは 0 になる
        // 活動履歴がないと 0 になる
        time: number;
        roomName: '';
        needPasswd?: boolean;
      }
    | {
        // 公開部屋を作っている時
        type: 'createRoom';
        time: number;
        roomName: string;
        needPasswd?: boolean;
      }
    | {
        // 非公開部屋を作っている時
        type: 'createRoom';
        time: number;
        roomName: '';
        needPasswd?: boolean;
      }
    | {
        // 入室中は部屋名も鍵部屋かどうかもわからないので非公開入室も同じになる
        type: 'enterRoom';
        time: number;
        roomName: '';
        needPasswd?: boolean;
      };

  export type MyProfileType = {
    userId: string;
    nickname: string;
    profileText: string;
    iconInfo: IconInfoType;
    socialLinks: SocialLinksType;
    favoriteUsers: string[];
    blockedUsers: string[];
    favoriteProducts: FavoriteProductType[];
    favoriteGenres: FavoriteGenreType[];
    publishStatus: PublishStatusType;
    profileLinked: ProfileLinkedType;
    autoTweet: {
      roomCreated: boolean;
    };
    currentState: CurrentStateType;
    lastModified: number;
    version: number;
  };

  export type UserIdType = string;

  export type UserType = {
    userId: UserIdType;
    nickname: string;
    publishStatus: PublishStatusType;
    profileText: string;
    iconInfo: IconInfoType;
    socialLinks: SocialLinksType;
    favoriteProducts: FavoriteProductType[];
    favoriteGenres: FavoriteGenreType[];
    profileLinked: ProfileLinkedType;
    isBlockedByMe: boolean;
    isFavoredByMe: boolean;
    currentState: CurrentStateType;
    lastModified: number;
  };

  export type RoomAttributeType = { language: string };

  export type RoomType = {
    realm: number;
    index: number;
    roomAttribute: RoomAttributeType;
    roomName: string;
    roomDesc: string;
    needPasswd: boolean;
    creator: {
      userId: string;
      nickname: string;
      nsgmMemberId: string;
      iconInfo: IconInfoType;
      favorite: boolean;
    };
    members: {
      userId: string;
      nickname: string;
      nsgmMemberId: string;
      iconInfo: IconInfoType;
      favorite: boolean;
    }[];
    numMembers: number;
    tagMask: string;
    tagOrig: string;
    createTime: string;
  };

  export type TestRoomType = {
    realm: number;
    index: number;
    roomAttribute: RoomAttributeType;
    roomName: '接続テストルーム';
    roomDesc: string;
    needPasswd: false;
    creator: {
      userId: string;
      nickname: string;
      nsgmMemberId: string;
      iconInfo: IconInfoType;
      favorite: boolean;
    };
    members: {
      userId: string;
      nickname: string;
      nsgmMemberId: string;
      iconInfo: IconInfoType;
      favorite: boolean;
    }[];
    numMembers: number;
    tagMask: '0';
    tagOrig: '';
    createTime: string;
  };

  export type RoomsResponseType = {
    rooms: RoomType[];
    totalPublishedRooms: number;
    totalUnpublishedRooms: number;
  };

  export type UserBasicInfoType = {
    userId: UserIdType;
    nickname: string;
    publishStatus: PublishStatusType;
    profileText: string;
    iconInfo: IconInfoType;
    isBlockedByMe: boolean;
    isFavoredByMe: boolean;
  };

  export type UserBasicInfoResponseType = {
    [key: UserIdType]: UserBasicInfoType;
  }[];

  export type UserSearchRequestType = {
    keywords: string;
    publishStatus: 'open' | 'hidden';
    pageSize: number;
    page: number;
  };

  export type UserSearchType = {
    userId: UserIdType;
    nickname: string;
    profileText: string;
    publishStatus: PublishStatusType;
    iconInfo: IconInfoType;
    socialLinks: SocialLinksType;
    favoriteProducts: FavoriteProductType[];
    favoriteGenres: FavoriteGenreType[];
  };

  export type UserSearchMetaType = {
    pageSize: number;
    page: number;
    totalUsers: number;
    totalPages: number;
  };

  export type UserSearchResponseType = {
    users: UserSearchType[];
    meta: UserSearchMetaType;
  };

  export type FavoriteProductType =
    | 'ピアノ・電子ピアノ'
    | 'エレクトーン・キーボード'
    | 'シンセサイザー'
    | '音楽制作'
    | 'DJ'
    | '管楽器'
    | '弦楽器'
    | 'ギター'
    | 'ベース'
    | 'ドラム'
    | 'パーカッション'
    | 'PA機器'
    | 'ホームシアター・オーディオ'
    | 'その他';

  export type FavoriteGenreType =
    | 'Classic'
    | 'Country / Folk'
    | 'Club Music / EDM'
    | 'Hip Hop / Rap'
    | 'R&B / Soul'
    | 'Jazz'
    | 'Fusion'
    | 'Rock'
    | 'HR / HM'
    | '洋楽'
    | 'J-Pop'
    | 'アイドル'
    | 'アニメ・ゲーム・ボカロ'
    | 'World';

  export type MyProfileEditRequestType = {
    profileLinked: {
      type: 'twitter' | 'none';
      linkNickname: boolean;
      linkImage: boolean;
    };
    autoTweet: {
      roomCreated: boolean;
    };
    socialLinks: SocialLinksType;
    publishStatus: PublishStatusType;
    nickname: string;
    profileText: string;
    favoriteProducts: FavoriteProductType[];
    favoriteGenres: FavoriteGenreType[];
    iconInfo: IconInfoType;
  };

  // 未使用
  // export type ErrorRessponseType = {
  //   status: "error",
  //   error: {
  //     message: string
  //   }
  // }
}
