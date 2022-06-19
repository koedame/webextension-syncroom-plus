import { SYNCROOM } from '../types/syncroom';

export const iconInfoToUrl = (iconInfo: SYNCROOM.IconInfoType) => {
  if (iconInfo.type === 'url') {
    return iconInfo.url;
  } else if (iconInfo.type === 'preset') {
    return `https://syncroom.yamaha.com/mypage/assets/img/user/img_${iconInfo.preset}.png`;
  } else {
    return `https://syncroom.yamaha.com/mypage/assets/img/user/img_0.png`;
  }
};
