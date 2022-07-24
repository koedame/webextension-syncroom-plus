import { SYNCROOM } from '../types/syncroom';

// 興味のある製品管理
export const FavoriteProductRepository = {
  // 興味のある製品一覧
  index: (): SYNCROOM.FavoriteProductType[] => {
    return [
      'ピアノ・電子ピアノ',
      'エレクトーン・キーボード',
      'シンセサイザー',
      '音楽制作',
      'DJ',
      '管楽器',
      '弦楽器',
      'ギター',
      'ベース',
      'ドラム',
      'パーカッション',
      'PA機器',
      'ホームシアター・オーディオ',
      'その他',
    ];
  },
};
