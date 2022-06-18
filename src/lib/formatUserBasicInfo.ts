import { SYNCROOM } from '../types/syncroom';

// 扱いやすい形式に変換してソート
const formatUserBasicInfo = (users: SYNCROOM.UserBasicInfoResponseType): SYNCROOM.UserBasicInfoType[] => {
  const res: SYNCROOM.UserBasicInfoType[] = [];
  for (const user of users) {
    res.push(Object.values(user)[0]);
  }
  return res.sort((a, b) => {
    if (a.nickname < b.nickname) {
      return -1;
    } else if (a.nickname > b.nickname) {
      return 1;
    } else {
      return 0;
    }
  });
};

export default formatUserBasicInfo;
