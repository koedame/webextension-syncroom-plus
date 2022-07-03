import { SYNCROOM } from '../types/syncroom';

// 扱いやすい形式に変換してソート
const formatUserBasicInfo = (users: SYNCROOM.UserBasicInfoResponseType): SYNCROOM.UserBasicInfoType[] => {
  const res: SYNCROOM.UserBasicInfoType[] = [];
  for (const user of users) {
    const data = Object.values(user)[0];
    if (data) {
      res.push(data);
    }
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
