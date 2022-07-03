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

interface Props {}

// 初回実行アクションはココにまとめる
// root componentにRecoilの処理を入れることができないのでこのやり方をとっている
const InitialFC: React.FC<Props> = ({}: Props) => {
  const { refreshToken, reloadMyProfile } = useSession();

  const reloadSession = () => {
    // トークンの期限が発行から24時間に設定されているので読み込みの度にトークンを更新しておく
    refreshToken()
      .then((_res) => {
        // トークン更新前にユーザー情報を取得していた場合は整合性が取れないので再取得しておく
        reloadMyProfile();
      })
      .catch((e) => {
        console.error('トークン更新エラー', e);
      });
  };

  useEffect(() => {
    reloadSession();

    const timer = setInterval(reloadSession, 1000 * 60);

    return () => clearInterval(timer);
  }, []);

  return <div></div>;
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
        <SearchMember />
      </React.Suspense>
    </RecoilRoot>
  );
};

export default App;
