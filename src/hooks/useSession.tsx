import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import ky from 'ky';
import type { SYNCROOM } from '../types/syncroom';
import { SessionRepository } from '../repositories/sessionRepository';

export type MyProfile = SYNCROOM.MyProfileType | null;

const savedMyProfileSelector = selector<MyProfile>({
  key: 'savedMyProfile',
  get: async ({}) => {
    if (localStorage.getItem('token')) {
      const res = SessionRepository.myProfile()
        .then((res) => res)
        .catch((e: any) => {
          console.error('自分の情報取得エラー', e);
          // 取得に失敗したら非ログイン状態を表すnullを返す
          return null;
        });
      return res;
    } else {
      // トークンがない場合は非ログイン状態を表すnullを返す
      return null;
    }
  },
});

const myProfileState = atom<MyProfile>({
  key: 'myProfile',
  default: savedMyProfileSelector,
});

export const myProfileSelector = selector<MyProfile>({
  key: 'myProfileSelector',
  get: ({ get }) => get(myProfileState),
  set: ({ set }, newValue) => {
    set(myProfileState, newValue);
  },
});

const isLoggedInSelector = selector<boolean>({
  key: 'isLoggedIn',
  get: ({ get }) => {
    const myProfile = get(myProfileSelector);
    return !!myProfile;
  },
});

export const useSession = () => {
  const [myProfile, setMyProfile] = useRecoilState(myProfileSelector);
  const isLoggedIn = useRecoilValue(isLoggedInSelector);

  const reloadMyProfile = async (): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, _reject) => {
      if (localStorage.getItem('token')) {
        SessionRepository.myProfile()
          .then((res) => {
            setMyProfile(res);
            resolve(true);
          })
          .catch((e: any) => {
            console.error('自分の情報取得エラー', e);
            // 取得に失敗したら非ログイン状態を表すnullを返す
            setMyProfile(null);
            resolve(true);
          });
      } else {
        // トークンがない場合は非ログイン状態を表すnullを返す
        setMyProfile(null);
        resolve(true);
      }
    });
  };

  const logout = () => {
    if (localStorage.getItem('token')) {
      SessionRepository.logout()
        .then((_res) => {
          // ログアウト成功
        })
        .catch((e: any) => {
          console.error('ログアウトエラー', e);
        });
    }

    // 強制
    localStorage.removeItem('token');

    reloadMyProfile();
  };

  const refreshToken = async (): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
      if (localStorage.getItem('token') && localStorage.getItem('refreshToken')) {
        const client = ky.create({
          headers: {
            'x-api-key': 'O98sxYkdgh9ZtVmv5mT5S2zbuipzhSa81MKExbCN',
          },
        });

        try {
          const json: { token: string; refreshToken: string } = await client
            .post('https://webapi.syncroom.appservice.yamaha.com/comm/token/refresh', {
              json: {
                token: localStorage.getItem('token'),
                refreshToken: localStorage.getItem('refreshToken'),
              },
            })
            .json();

          // 文字列の "undefined" が返って来たことがあるので、念の為チェックをしておく。
          if (json.token && json.token !== 'undefined') {
            localStorage.setItem('token', json.token);
          }
          if (json.refreshToken && json.refreshToken !== 'undefined') {
            localStorage.setItem('refreshToken', json.refreshToken);
          }

          return resolve(true);
        } catch (error) {
          return reject(error);
        }
      } else {
        reject(false);
      }
    });
  };

  return {
    myProfile,
    setMyProfile,
    reloadMyProfile,
    logout,
    isLoggedIn,
    refreshToken,
  };
};
