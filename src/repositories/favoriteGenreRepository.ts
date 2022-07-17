import { SYNCROOM } from '../types/syncroom';

// 好きなジャンル管理
export const FavoriteGenreRepository = {
  // 好きなジャンル一覧
  index: (): SYNCROOM.FavoriteGenreType[] => {
    return [
      'Classic',
      'Country / Folk',
      'Club Music / EDM',
      'Hip Hop / Rap',
      'R&B / Soul',
      'Jazz',
      'Fusion',
      'Rock',
      'HR / HM',
      '洋楽',
      'J-Pop',
      'アイドル',
      'アニメ・ゲーム・ボカロ',
      'World',
    ];
  },
};
