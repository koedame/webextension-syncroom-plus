const decryptionTags = (room: any): Array<string> => {
  let m;
  let i;
  let result = [];

  const tags = [
    '練習中',
    'おしゃべり',
    '初心者OK',
    '配信中',
    '録音中',
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

  // 独自タグはそのまま使える
  if (room.tag_orig) {
    result.push(room.tag_orig);
  }

  if (room.tag_mask) {
    m = (room.tag_mask ^ 0xffffffff) >>> 0;
    for (i = 0; i < tags.length; i++) {
      let tm = Math.pow(2, i);
      if (((m ^ 0xffffffff) & tm) === tm) {
        result.push(tags[i]);
      }
    }
  }

  return result;
};

export default decryptionTags;
