import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';

import browser from 'webextension-polyfill';

const version = browser.runtime.getManifest().version;

import Header from './Parts/Header';
import Footer from './Parts/Footer';

import RoomList from './RoomList';
import { useSession } from '../hooks/useSession';
import Report from './Report';
import Messages from './Messages';
import { LoginRequiredDialog } from '../components/LoginRequired/Dialog';
import ReturnToTopButton from './ReturnToTopButton';
import SearchMember from './SearchMember';
import MyProfile from './MyProfile';
import decodeJWTPayLoad from '../lib/decodeJWTPayLoad';

interface Props {}

// 初回実行アクションはココにまとめる
// root componentにRecoilの処理を入れることができないのでこのやり方をとっている
const InitialFC: React.FC<Props> = ({}: Props) => {
  const { myProfile, refreshToken, reloadMyProfile } = useSession();

  const reloadSession = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodeJWTPayLoad(token);
      // 期限が10分を切ってたら更新
      if (payload.exp < Math.floor(Date.now() / 1000 + 60 * 10)) {
        // トークンの期限が発行から30分に設定されているので読み込みの度にトークンを更新しておく
        refreshToken()
          .then(() => {})
          .catch((e) => {
            console.error('トークン更新エラー', e);
          });
      }
    }
  };

  useEffect(() => {
    // 初回読み込み時
    reloadSession().then(() => {
      reloadMyProfile();
    });

    // 1分おき
    const timer = setInterval(() => {
      reloadSession().then(() => {
        reloadMyProfile();
      });
    }, 1000 * 60);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {myProfile && (
        <>
          <MyProfile />
          <SearchMember />
        </>
      )}
    </div>
  );
};

const App: React.FC<Props> = ({}: Props) => {
  return (
    <RecoilRoot>
      <React.Suspense fallback={<div></div>}>
        <InitialFC />
        <Header />
        <Messages />
        <RoomList />
        <Footer version={version} />
        <Report />
        <LoginRequiredDialog />
        <ReturnToTopButton />
      </React.Suspense>
    </RecoilRoot>
  );
};

export default App;
