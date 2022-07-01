import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { Flipper } from 'react-flip-toolkit';
import { ExclamationIcon, StatusOnlineIcon, RefreshIcon, SearchIcon, XIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/solid';
import ReactLoading from 'react-loading';

import type { SYNCROOMPlus } from '../types/syncroomPlus';
import type { SYNCROOM } from '../types/syncroom';

import { useTranslation } from '../lib/i18n';
import optimizeSearchKeyword from '../lib/optimizeSearchKeyword';
import RoomCard from './RoomCard';
import RoomPasswordDialog from './RoomCard/RoomPasswordDialog';

import { useRoomPasswordPrompt } from '../hooks/useRoomPasswordPrompt';
import { useConfigAutoReload } from '../hooks/useConfigAutoReload';
import { RoomRepository } from '../repositories/roomRepository';
import decryptionTags from '../lib/decriptionTags';
import sumallizeRoomData from '../lib/sumallizeRoomData';
import { useRooms } from '../hooks/useRooms';

// focus:shadow-none が効かないのでこのやり方をとる
const SearchInputStyle = css`
  &:focus {
    box-shadow: none !important;
  }
`;

const slectedTagStyle = 'inline-block inline-flex items-center px-3 py-1 text-white bg-gray-600 shadow-sm rounded hover:bg-gray-800';
const unslectedTagStyle = 'inline-block inline-flex items-center px-3 py-1 text-gray-900 bg-gray-100 shadow-sm rounded hover:bg-gray-200';

interface Props {}

const Component: React.FC<Props> = ({}: Props) => {
  const { t } = useTranslation();

  const [keywordState, setKeywordState] = useState<string>('');
  const [selectRoomTypeState, setSelectRoomTypeState] = useState<'all' | 'unlocked' | 'locked'>('all');

  const [aggregatedTagsState, setAggregatedTagsState] = useState<SYNCROOMPlus.AggregatedTagType[]>([]);
  const [lockedAggregatedTagsState, setLockedAggregatedTagsState] = useState<SYNCROOMPlus.AggregatedTagType[]>([]);
  const [unlockedAggregatedTagsState, setUnlockedAggregatedTagsState] = useState<SYNCROOMPlus.AggregatedTagType[]>([]);
  const [selectTagState, setSelectTagState] = useState<string>('');

  const [filteredRoomsState, setFilteredRoomsState] = useState<SYNCROOM.RoomType[]>([]);

  const [publicRoomsCount, setPublicRoomsCount] = useState<number>(0);
  const [publicLockedRoomsCount, setPublicLockedRoomsCount] = useState<number>(0);
  const [publicUnlockedRoomsCount, setPublicUnlockedRoomsCount] = useState<number>(0);

  const [testRoomState, setTestRoomState] = useState<SYNCROOM.TestRoomType | null>(null);
  const [loadingAnnimationState, setLoadingAnnimationState] = useState<boolean>(false);

  const [initialState, setInitialState] = useState<boolean>(true);

  const { roomPasswordPromptOpen, closeRoomPasswordPrompt } = useRoomPasswordPrompt();

  const { configAutoReload } = useConfigAutoReload();

  const { rooms, setRooms } = useRooms();

  const fetchRooms = async () => {
    setLoadingAnnimationState(true);

    try {
      await RoomRepository.unauthedList()
        .then((res) => {
          setRooms(res.rooms);
        })
        .catch((e) => {
          console.error('ルーム情報取得失敗', e);
        });
    } catch (error) {
      // エラーで停止しないようにキャッチして握りつぶしておく
      console.error('ルーム一覧取得失敗', error);
    }

    setLoadingAnnimationState(false);
  };

  const changeSelectRoomType = (roomType: 'all' | 'unlocked' | 'locked') => {
    // すでに選択されていたら何もしない
    if (selectRoomTypeState === roomType) return false;

    // 選択中のタグが指定のRoomTypeに無い可能性があるのでタグ選択を外しておく
    setSelectTagState('');
    setSelectRoomTypeState(roomType);
  };

  // 部屋情報の定期読み込み
  useEffect(() => {
    fetchRooms().then((res) => {
      setInitialState(false);
    });

    let fetchTimer = setInterval(() => {
      if (configAutoReload) {
        fetchRooms();
      }
    }, 5000);

    return () => {
      clearInterval(fetchTimer);
    };
  }, [configAutoReload]);

  // 絞り込みの反映
  const roomFiltering = () => {
    const filteredRooms = rooms.filter((room) => {
      if (room.roomName === '接続テストルーム') {
        return false;
      }

      // キーワードでの絞り込み
      if (keywordState.length !== 0) {
        const k = optimizeSearchKeyword(keywordState);

        const forSearchWords =
          optimizeSearchKeyword(room.roomName) +
          '|' +
          room.members.map((m) => optimizeSearchKeyword(m.nickname)).join('|') +
          '|' +
          decryptionTags(room.tagMask, room.tagOrig)
            .map((t) => optimizeSearchKeyword(t))
            .join('|') +
          '|' +
          optimizeSearchKeyword(room.roomDesc);

        if (!forSearchWords.match(k)) return false;
      }

      // 鍵あり・鍵なしでの絞り込み
      if (selectRoomTypeState === 'all') {
      } else if (selectRoomTypeState === 'unlocked' && room.needPasswd) return false;
      else if (selectRoomTypeState === 'locked' && !room.needPasswd) return false;

      // タグでの絞り込み
      if (selectTagState !== '') {
        if (!decryptionTags(room.tagMask, room.tagOrig).includes(selectTagState)) {
          return false;
        }
      }

      // すべてパスしたものはtrue
      return true;
    });

    setFilteredRoomsState(filteredRooms);
  };

  // 部屋を読み込んだら更新する
  useEffect(() => {
    const { AggregatedTags, LockedAggregatedTags, UnlockedAggregatedTags, PublicRoomsCount, PublicLockedRoomsCount, PublicUnlockedRoomsCount, TestRoom } = sumallizeRoomData(rooms);

    setAggregatedTagsState(AggregatedTags);
    setLockedAggregatedTagsState(LockedAggregatedTags);
    setUnlockedAggregatedTagsState(UnlockedAggregatedTags);

    setPublicRoomsCount(PublicRoomsCount);
    setPublicLockedRoomsCount(PublicLockedRoomsCount);
    setPublicUnlockedRoomsCount(PublicUnlockedRoomsCount);

    setTestRoomState(TestRoom);
  }, [rooms]);

  // 絞り込みの反映
  useEffect(() => {
    roomFiltering();
  }, [rooms, keywordState, selectRoomTypeState, selectTagState]);

  return (
    <div>
      <div className="space-x-4 space-y-4 mb-4 flex justify-center items-end flex-wrap">
        {!configAutoReload && (
          <button
            type="button"
            onClick={fetchRooms}
            className="flex items-center bg-indigo-600 border border-indigo-600 hover:bg-indigo-800 text-white rounded px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshIcon className={loadingAnnimationState ? 'animate-reverse-spin h-4 w-4 mr-2' : 'h-4 w-4 mr-2'} />
            {t('reload')}
          </button>
        )}

        <label className="w-48 relative rounded overflow-hidden shadow-sm z-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <SearchIcon className="h-4 w-4" />
          </div>

          <input
            type="text"
            name="searchKeyword"
            id="searchKeyword"
            className={`block w-full pl-8 border border-gray-300 focus:border-blue-500 text-base rounded-md ${SearchInputStyle}`}
            placeholder={t('type_keywords')}
            onChange={(e) => setKeywordState(e.target.value)}
            value={keywordState}
          />
        </label>

        <div className="divide-x divide-gray-200 border border-gray-300 rounded shadow-sm overflow-hidden">
          <button
            onClick={() => {
              changeSelectRoomType('all');
            }}
            className={
              selectRoomTypeState === 'all'
                ? 'py-2 text-base px-4 h-full bg-blue-600 text-white inline-flex items-center cursor-default'
                : 'py-2 text-base px-4 h-full text-gray-900 hover:bg-gray-100 inline-flex items-center'
            }
          >
            {/* 高さを合わせるためのダミー */}
            <span className="h-4"></span>

            {t('all')}
            <span className={selectRoomTypeState === 'all' ? 'ml-1 text-sm text-blue-200' : 'ml-1 text-sm text-gray-900'}>{publicRoomsCount}</span>
          </button>
          <button
            onClick={() => {
              changeSelectRoomType('unlocked');
            }}
            className={
              selectRoomTypeState === 'unlocked'
                ? 'py-2 text-base px-4 h-full bg-indigo-600 text-white inline-flex items-center cursor-default'
                : 'py-2 text-base px-4 h-full text-gray-900 hover:bg-gray-100 inline-flex items-center'
            }
          >
            <LockOpenIcon className="h-4 w-4 mr-2" />
            {t('unlocked')}

            <span className={selectRoomTypeState === 'unlocked' ? 'ml-1 text-sm text-indigo-200' : 'ml-1 text-sm text-gray-900'}>{publicUnlockedRoomsCount}</span>
          </button>
          <button
            onClick={() => {
              changeSelectRoomType('locked');
            }}
            className={
              selectRoomTypeState === 'locked'
                ? 'py-2 text-base px-4 h-full bg-gray-600 text-white inline-flex items-center cursor-default'
                : 'py-2 text-base px-4 h-full text-gray-900 hover:bg-gray-100 inline-flex items-center'
            }
          >
            <LockClosedIcon className="h-4 w-4 mr-2" />
            {t('locked')}

            <span className={selectRoomTypeState === 'locked' ? 'ml-1 text-sm text-gray-300' : 'ml-1 text-sm text-gray-900'}>{publicLockedRoomsCount}</span>
          </button>
        </div>

        <button
          onClick={() => {
            // 細かい計算をしてもあまりかわらないので一番下までスクロールする
            window.scrollTo({ top: document.body.clientHeight, left: 0, behavior: 'smooth' });
          }}
          className="py-2 text-base px-4 bg-indigo-600 border border-indigo-600 hover:bg-indigo-800 text-white inline-flex items-center shadow-sm rounded"
        >
          <StatusOnlineIcon className="h-4 w-4 mr-2" />
          {t('test_room')}
        </button>
      </div>

      <div className="space-x-2 space-y-2 text-center mb-6">
        {selectRoomTypeState === 'all' &&
          aggregatedTagsState.map((tag) => {
            return (
              <button
                className={selectTagState === tag.name ? slectedTagStyle : unslectedTagStyle}
                key={`tags-${tag.name}-all`}
                onClick={() => {
                  if (selectTagState === tag.name) {
                    setSelectTagState('');
                  } else {
                    setSelectTagState(tag.name);
                  }
                }}
              >
                {selectTagState === tag.name && <XIcon className="h-3 w-3 mr-1" />}
                <span className="text-sm">{tag.name}</span>
                <span className="text-sm text-gray-400 ml-1">{tag.count}</span>
              </button>
            );
          })}

        {selectRoomTypeState === 'unlocked' &&
          unlockedAggregatedTagsState.map((tag) => {
            return (
              <button
                className={selectTagState === tag.name ? slectedTagStyle : unslectedTagStyle}
                key={`tags-unlocked-${tag.name}`}
                onClick={() => {
                  if (selectTagState === tag.name) {
                    setSelectTagState('');
                  } else {
                    setSelectTagState(tag.name);
                  }
                }}
              >
                {selectTagState === tag.name && <XIcon className="h-3 w-3 mr-1" />}
                <span className="text-sm">{tag.name}</span>
                <span className="text-sm text-gray-900 ml-1">{tag.count}</span>
              </button>
            );
          })}

        {selectRoomTypeState === 'locked' &&
          lockedAggregatedTagsState.map((tag) => {
            return (
              <button
                className={selectTagState === tag.name ? slectedTagStyle : unslectedTagStyle}
                key={`tags-locked-${tag.name}`}
                onClick={() => {
                  if (selectTagState === tag.name) {
                    setSelectTagState('');
                  } else {
                    setSelectTagState(tag.name);
                  }
                }}
              >
                {selectTagState === tag.name && <XIcon className="h-3 w-3 mr-1" />}
                <span className="text-sm">{tag.name}</span>
                <span className="text-sm text-gray-900 ml-1">{tag.count}</span>
              </button>
            );
          })}
      </div>

      {initialState ? (
        <div className="text-center my-32">
          <div className="flex flex-col justify-between">
            <ReactLoading className="mx-auto h-20 w-20" type="bubbles" color="rgb(79 70 229)" />
            <p>{t('loading')}</p>
          </div>
        </div>
      ) : (
        <div>
          {filteredRoomsState.length === 0 ? (
            <div className="flex justify-center">
              <div className="rounded-md bg-yellow-50 px-6 py-4">
                <p className="text-sm text-yellow-700">{t('room_not_found')}</p>
              </div>
            </div>
          ) : (
            <Flipper flipKey={filteredRoomsState.map((r) => r.roomName).join('')}>
              <div className="flex justify-center flex-wrap mx-4">
                {filteredRoomsState.map((room) => (
                  <RoomCard key={room.roomName} {...room} />
                ))}
              </div>
            </Flipper>
          )}

          {testRoomState ? (
            <div className="mb-4">
              <h2 className="text-center text-lg font-medium my-4">{t('test_room')}</h2>
              <div className="flex justify-center flex-wrap mx-4">
                <RoomCard {...testRoomState} isTestRoom={true} />
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <h2 className="text-center text-lg font-medium my-4">{t('test_room')}</h2>
              <div className="flex justify-center">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">{t('test_room_not_found')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <RoomPasswordDialog
        isOpen={roomPasswordPromptOpen}
        onClose={() => {
          closeRoomPasswordPrompt();
        }}
      />
    </div>
  );
};

export default React.memo(Component);
