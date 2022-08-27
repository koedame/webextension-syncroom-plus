import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../../lib/i18n';

import React, { Fragment, memo, useEffect, useState } from 'react';

import { atom, useRecoilState } from 'recoil';
import { useSession } from '../../hooks/useSession';
import { iconInfoToUrl } from '../../lib/iconInfoToUrl';
import { FavoriteGenreRepository } from '../../repositories/favoriteGenreRepository';
import { FavoriteProductRepository } from '../../repositories/favoriteProductRepository';
import { SessionRepository } from '../../repositories/sessionRepository';
import type { SYNCROOM } from '../../types/syncroom';
import { PresetIconRepository } from '../../repositories/presetIconRepository';
import { customImageRepository } from '../../repositories/customImageRepository';
import ReactLoading from 'react-loading';

const myProfileModalState = atom<boolean>({
  key: 'MyProfileModalState',
  default: false,
});

export const useMyProfile = () => {
  const [isOpen, setIsOpen] = useRecoilState(myProfileModalState);

  const openMyProfileForm = () => {
    setIsOpen(true);
  };

  const closeMyProfileForm = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openMyProfileForm,
    closeMyProfileForm,
  };
};

interface Props {}

const Component: React.FC<Props> = ({}: Props) => {
  const { t } = useTranslation();

  const { myProfile, reloadMyProfile } = useSession();
  const { isOpen, closeMyProfileForm } = useMyProfile();

  const [formState, setFormState] = useState<SYNCROOM.MyProfileEditRequestType>();
  const [isTwitterConnect, setIsTwitterConnect] = useState<boolean>(false);
  const [iconTypeState, setIconTypeState] = useState<'twitter' | 'preset' | 'koedame'>('preset');
  const [uploadImageState, setUploadImageState] = useState<File | null>(null);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);

  const buildFormStateFromMyProfile = (myProfile: SYNCROOM.MyProfileType): SYNCROOM.MyProfileEditRequestType => {
    return {
      profileLinked: {
        type: myProfile.profileLinked.type,
        linkNickname: myProfile.profileLinked.linkNickname ? myProfile.profileLinked.linkNickname : false,
        linkImage: myProfile.profileLinked.linkImage ? myProfile.profileLinked.linkImage : false,
      },
      autoTweet: {
        roomCreated: myProfile.autoTweet.roomCreated,
      },
      socialLinks: myProfile.socialLinks,
      publishStatus: myProfile.publishStatus,
      nickname: myProfile.nickname,
      profileText: myProfile.profileText,
      favoriteProducts: myProfile.favoriteProducts,
      favoriteGenres: myProfile.favoriteGenres,
      iconInfo: myProfile.iconInfo,
    };
  };

  const resetFrom = () => {
    if (myProfile) {
      const newState = buildFormStateFromMyProfile(myProfile);
      if (JSON.stringify(formState) !== JSON.stringify(newState)) {
        setFormState(newState);
      }

      if (myProfile.profileLinked.type === 'twitter' && myProfile.profileLinked.linkImage) {
        setIconTypeState('twitter');
      } else if (
        ((myProfile.profileLinked.type === 'twitter' && !myProfile.profileLinked.linkImage) || myProfile.profileLinked.type === 'none') &&
        myProfile.iconInfo.type === 'preset'
      ) {
        setIconTypeState('preset');
      } else if (
        ((myProfile.profileLinked.type === 'twitter' && !myProfile.profileLinked.linkImage) || myProfile.profileLinked.type === 'none') &&
        myProfile.iconInfo.type === 'url'
      ) {
        setIconTypeState('koedame');
      } else {
        // 拾えなかった例外はすべてpresetにしておく
        setIconTypeState('preset');
      }
    }
  };

  useEffect(() => {
    resetFrom();
    setIsTwitterConnect(myProfile ? myProfile.profileLinked.type === 'twitter' : false);
    return () => {};
  }, [myProfile]);

  const updateProfile = () => {
    if (formState) {
      SessionRepository.updateMyProfile(formState)
        .then((_res) => {
          reloadMyProfile();
        })
        .catch((error) => {
          console.error('プロフィール更新失敗', error);
        });
    }
  };

  useEffect(() => {
    // リクエストが飛びすぎないようにtimerを設定しておく
    let timer = setTimeout(() => {
      // 不要なリクエストが飛んだりループしないように差分があるときだけ更新
      if (myProfile && JSON.stringify(formState) !== JSON.stringify(buildFormStateFromMyProfile(myProfile))) {
        updateProfile();
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [formState]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {
          closeMyProfileForm();
        }}
      >
        <div className="flex items-center justify-center py-10 px-20  text-center h-screen">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-scroll-y shadow-xl transform transition-all sm:align-middle w-5/6 h-5/6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => closeMyProfileForm()}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="pb-20">
                <div className="rounded bg-white">
                  {formState && (
                    <form className="p-6 space-y-8 divide-y divide-gray-200">
                      <div className="space-y-8 divide-y divide-gray-200">
                        <div>
                          <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{t('edit_my_profile')}</h3>
                          </div>

                          <div className="mt-6 sm:mt-5 space-y-6">
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                              <label className="block text-sm font-medium text-gray-700">{t('icon')}</label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                  {iconTypeState === 'twitter' && (
                                    <img className="h-12 w-12 border border-gray-200 rounded-md overflow-hidden bg-gray-100" src={iconInfoToUrl(formState.iconInfo)} />
                                  )}
                                  {iconTypeState !== 'twitter' && (
                                    <div>
                                      {PresetIconRepository.index().map((presetIcon) => (
                                        <img
                                          key={`icon-preset-${presetIcon.preset}`}
                                          className={`cursor-pointer m-2 h-12 w-12 border border-gray-200 rounded-md overflow-hidden bg-gray-100 inline-block ${
                                            iconTypeState === 'preset' && formState.iconInfo.preset === presetIcon.preset ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                                          }`}
                                          src={iconInfoToUrl(presetIcon)}
                                          onClick={() => {
                                            let tempIconInfo = { ...formState.iconInfo };

                                            tempIconInfo.type = 'preset';
                                            tempIconInfo.preset = presetIcon.preset;

                                            setFormState({
                                              ...formState,
                                              iconInfo: tempIconInfo,
                                            });
                                          }}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <hr />
                                <div>
                                  <div>
                                    {iconTypeState === 'koedame' && (
                                      <img className="m-2 h-12 w-12 border border-gray-200 rounded-md overflow-hidden bg-gray-100" src={iconInfoToUrl(formState.iconInfo)} />
                                    )}
                                  </div>
                                  {iconTypeState !== 'twitter' && (
                                    <div>
                                      {isImageUploading ? (
                                        <ReactLoading className="h-20 w-20" type="spin" color="rgb(79 70 229)" />
                                      ) : (
                                        <>
                                          <input
                                            type="file"
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            accept=".png,.jpeg,.jpg,.gif"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                              if (e.target.files && e.target.files[0]) {
                                                setUploadImageState(e.target.files[0]);
                                              } else {
                                                setUploadImageState(null);
                                              }
                                            }}
                                          />
                                          <button
                                            type="button"
                                            className="flex shadow-sm items-center bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2 px-4 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={() => {
                                              setIsImageUploading(true);
                                              if (myProfile && uploadImageState) {
                                                var data = new FormData();
                                                data.append('file', uploadImageState);
                                                customImageRepository.upload(myProfile?.userId, data).then((res) => {
                                                  setIsImageUploading(false);

                                                  setFormState({
                                                    ...formState,
                                                    profileLinked: {
                                                      ...formState.profileLinked,
                                                      linkImage: false,
                                                    },
                                                    iconInfo: {
                                                      ...formState.iconInfo,
                                                      type: 'url',
                                                      url: res.url,
                                                    },
                                                  });
                                                });
                                              }
                                            }}
                                          >
                                            {t('upload')}
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {isTwitterConnect && (
                                  <div className="relative flex items-start mt-5">
                                    <div className="flex items-center h-5">
                                      <input
                                        id="useTwitterIcon"
                                        name="useTwitterIcon"
                                        type="checkbox"
                                        className="cursor-pointer focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        checked={formState.profileLinked.linkImage}
                                        onChange={(e) => {
                                          SessionRepository.updateTwitterConfig({
                                            profileLinked: {
                                              type: 'twitter',
                                              linkNickname: myProfile ? myProfile.profileLinked.linkNickname || false : false,
                                              linkImage: e.target.checked,
                                            },
                                            autoTweet: {
                                              roomCreated: myProfile ? myProfile.autoTweet.roomCreated || false : false,
                                            },
                                          }).then(() => {
                                            reloadMyProfile();
                                          });
                                        }}
                                      />
                                    </div>
                                    <div className="ml-3 text-sm">
                                      <label htmlFor="useTwitterIcon" className="cursor-pointer font-medium text-gray-700">
                                        {t('use_twitter_icon')}
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                {t('nickname')}
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <input
                                  type="text"
                                  name="nickname"
                                  id="nickname"
                                  autoComplete="nickname"
                                  className={`max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md ${
                                    formState.profileLinked.linkNickname ? 'bg-gray-100' : ''
                                  }`}
                                  value={formState.nickname}
                                  disabled={formState.profileLinked.linkNickname}
                                  onChange={(e) => {
                                    if (formState.nickname !== e.target.value) {
                                      setFormState({
                                        ...formState,
                                        nickname: e.target.value,
                                      });
                                    }
                                  }}
                                />

                                {isTwitterConnect && (
                                  <div className="relative flex items-start mt-5">
                                    <div className="flex items-center h-5">
                                      <input
                                        id="useTwitterName"
                                        value="useTwitterName"
                                        name="useTwitterName"
                                        type="checkbox"
                                        className="cursor-pointer focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        checked={formState.profileLinked.linkNickname}
                                        onChange={(e) => {
                                          SessionRepository.updateTwitterConfig({
                                            profileLinked: {
                                              type: 'twitter',
                                              linkNickname: e.target.checked,
                                              linkImage: myProfile ? myProfile.profileLinked.linkImage || false : false,
                                            },
                                            autoTweet: {
                                              roomCreated: myProfile ? myProfile.autoTweet.roomCreated || false : false,
                                            },
                                          }).then(() => {
                                            reloadMyProfile();
                                          });
                                        }}
                                      />
                                    </div>
                                    <div className="ml-3 text-sm">
                                      <label htmlFor="useTwitterName" className="cursor-pointer font-medium text-gray-700">
                                        {t('use_twitter_name')}
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                {t('my_profile_description')}
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <textarea
                                  id="about"
                                  name="about"
                                  rows={3}
                                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                  value={formState.profileText}
                                  onChange={(e) => {
                                    if (formState.profileText !== e.target.value) {
                                      setFormState({
                                        ...formState,
                                        profileText: e.target.value,
                                      });
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="divide-y divide-gray-200 space-y-6 sm:space-y-5">
                          <div className="space-y-6 sm:space-y-5 divide-y divide-gray-200">
                            <div className="pt-5">
                              <div role="group" aria-labelledby="label-email">
                                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                                  <div>
                                    <div className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700" id="label-email">
                                      {t('favorite_genres')}
                                    </div>
                                  </div>
                                  <div className="mt-4 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg space-y-4">
                                      {FavoriteGenreRepository.index().map((genre) => {
                                        return (
                                          <div className="relative flex items-start" key={genre}>
                                            <div className="flex items-center h-5">
                                              <input
                                                id={genre}
                                                defaultValue={genre}
                                                name="favoriteGenres"
                                                type="checkbox"
                                                className="cursor-pointer focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                checked={formState.favoriteGenres.includes(genre)}
                                                onChange={(e) => {
                                                  let tempFavoriteGenres = [...formState.favoriteGenres];

                                                  if (e.target.checked) {
                                                    tempFavoriteGenres = [...tempFavoriteGenres, e.target.value] as SYNCROOM.FavoriteGenreType[];
                                                  } else {
                                                    tempFavoriteGenres = tempFavoriteGenres.filter((g) => g !== e.target.value) as SYNCROOM.FavoriteGenreType[];
                                                  }

                                                  setFormState({
                                                    ...formState,
                                                    favoriteGenres: tempFavoriteGenres,
                                                  });
                                                }}
                                              />
                                            </div>
                                            <div className="ml-3 text-sm">
                                              <label htmlFor={genre} className="cursor-pointer font-medium text-gray-700">
                                                {t(`genres.${genre}`)}
                                              </label>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="pt-6 sm:pt-5">
                              <div role="group" aria-labelledby="label-email">
                                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                                  <div>
                                    <div className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700" id="label-email">
                                      {t('interested_products')}
                                    </div>
                                  </div>
                                  <div className="mt-4 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg space-y-4">
                                      {FavoriteProductRepository.index().map((product) => {
                                        return (
                                          <div className="relative flex items-start" key={product}>
                                            <div className="flex items-center h-5">
                                              <input
                                                id={product}
                                                defaultValue={product}
                                                name="favoriteProducts"
                                                type="checkbox"
                                                className="cursor-pointer focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                checked={formState.favoriteProducts.includes(product)}
                                                onChange={(e) => {
                                                  let tempFavoriteProducts = [...formState.favoriteProducts];

                                                  if (e.target.checked) {
                                                    tempFavoriteProducts = [...tempFavoriteProducts, e.target.value] as SYNCROOM.FavoriteProductType[];
                                                  } else {
                                                    tempFavoriteProducts = tempFavoriteProducts.filter((g) => g !== e.target.value) as SYNCROOM.FavoriteProductType[];
                                                  }

                                                  setFormState({
                                                    ...formState,
                                                    favoriteProducts: tempFavoriteProducts,
                                                  });
                                                }}
                                              />
                                            </div>
                                            <div className="ml-3 text-sm">
                                              <label htmlFor={product} className="cursor-pointer font-medium text-gray-700">
                                                {t(`products.${product}`)}
                                              </label>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div role="group" aria-labelledby="label-notifications">
                                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                                  <div>
                                    <div className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700" id="label-notifications">
                                      {t('profile_public_settings')}
                                    </div>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <div className="max-w-lg">
                                      <div className="mt-4 space-y-4">
                                        <div className="flex items-center">
                                          <input
                                            id="push-everything"
                                            name="push-notifications"
                                            type="radio"
                                            className="cursor-pointer focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                            checked={formState.publishStatus === 'open'}
                                            onChange={(_e) => {
                                              setFormState({
                                                ...formState,
                                                publishStatus: 'open',
                                              });
                                            }}
                                          />
                                          <label htmlFor="push-everything" className="cursor-pointer ml-3 block text-sm font-medium text-gray-700">
                                            {t('public')}
                                          </label>
                                        </div>
                                        <div className="flex items-center">
                                          <input
                                            id="push-email"
                                            name="push-notifications"
                                            type="radio"
                                            className="cursor-pointer focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                            checked={formState.publishStatus === 'hidden'}
                                            onChange={(_e) => {
                                              setFormState({
                                                ...formState,
                                                publishStatus: 'hidden',
                                              });
                                            }}
                                          />
                                          <label htmlFor="push-email" className="cursor-pointer ml-3 block text-sm font-medium text-gray-700">
                                            {t('private')}
                                          </label>
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-500">{t('profile_private_notes')}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {isTwitterConnect && (
                              <div>
                                <div role="group" aria-labelledby="label-notifications">
                                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                                    <div>
                                      <div className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700" id="label-notifications">
                                        {t('tweet_settings')}
                                      </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <div className="max-w-lg">
                                        <div className="mt-4 space-y-4">
                                          <div className="flex items-center">
                                            <input
                                              id="autoTweet"
                                              value="hoge"
                                              name="favoriteProducts"
                                              type="checkbox"
                                              className="cursor-pointer focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                              checked={formState.autoTweet.roomCreated}
                                              onChange={(e) => {
                                                SessionRepository.updateTwitterConfig({
                                                  profileLinked: {
                                                    type: 'twitter',
                                                    linkNickname: myProfile ? myProfile.profileLinked.linkNickname || false : false,
                                                    linkImage: myProfile ? myProfile.profileLinked.linkImage || false : false,
                                                  },
                                                  autoTweet: {
                                                    roomCreated: e.target.checked,
                                                  },
                                                }).then(() => {
                                                  reloadMyProfile();
                                                });
                                              }}
                                            />
                                            <label htmlFor="autoTweet" className="cursor-pointer ml-3 block text-sm font-medium text-gray-700">
                                              {t('tweet_room_create')}
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
                          <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{t('social_links')}</h3>
                          </div>
                          <div className="space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Twitter
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="max-w-lg flex rounded-md shadow-sm">
                                  <input
                                    type="text"
                                    name="twitter"
                                    id="twitter"
                                    autoComplete="username"
                                    placeholder={t('twitter_placeholder')}
                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                                    value={formState.socialLinks.twitter}
                                    onChange={(e) => {
                                      let newValue = e.target.value;

                                      let tempSocialLinks = { ...formState.socialLinks };
                                      if (newValue.length > 0) {
                                        // 0文字以上の場合は上書きする
                                        tempSocialLinks = { ...formState.socialLinks, twitter: newValue };
                                      } else {
                                        // 0文字の場合はキーごと消す
                                        delete tempSocialLinks.twitter;
                                      }

                                      setFormState({
                                        ...formState,
                                        socialLinks: tempSocialLinks,
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Instagram
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="max-w-lg flex rounded-md shadow-sm">
                                  <input
                                    type="text"
                                    name="instagram"
                                    id="instagram"
                                    autoComplete="username"
                                    placeholder={t('instagram_placeholder')}
                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                                    value={formState.socialLinks.instagram}
                                    onChange={(e) => {
                                      let newValue = e.target.value;

                                      let tempSocialLinks = { ...formState.socialLinks };
                                      if (newValue.length > 0) {
                                        // 0文字以上の場合は上書きする
                                        tempSocialLinks = { ...formState.socialLinks, instagram: newValue };
                                      } else {
                                        // 0文字の場合はキーごと消す
                                        delete tempSocialLinks.instagram;
                                      }

                                      setFormState({
                                        ...formState,
                                        socialLinks: tempSocialLinks,
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Facebook
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="max-w-lg flex rounded-md shadow-sm">
                                  <input
                                    type="text"
                                    name="facebook"
                                    id="facebook"
                                    placeholder={t('facebook_placeholder')}
                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                                    value={formState.socialLinks.facebook}
                                    onChange={(e) => {
                                      let newValue = e.target.value;

                                      let tempSocialLinks = formState.socialLinks;
                                      if (newValue.length > 0) {
                                        // 0文字以上の場合は上書きする
                                        tempSocialLinks = { ...formState.socialLinks, facebook: newValue };
                                      } else {
                                        // 0文字の場合はキーごと消す
                                        delete tempSocialLinks.facebook;
                                      }

                                      setFormState({
                                        ...formState,
                                        socialLinks: tempSocialLinks,
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <hr />

                            {isTwitterConnect ? (
                              <button
                                type="button"
                                className="flex shadow-sm items-center bg-rose-600 hover:bg-rose-700 text-white rounded py-2 px-4 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                onClick={() => {
                                  SessionRepository.unlinkTwitter().then(() => {
                                    reloadMyProfile();
                                  });
                                }}
                              >
                                {t('unlink_to_twitter')}
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="flex shadow-sm items-center bg-sky-600 hover:bg-sky-700 text-white rounded py-2 px-4 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                onClick={() => {
                                  SessionRepository.getConnectTwitterLink().then((res) => {
                                    location.href = res.url;
                                  });
                                }}
                              >
                                {t('link_to_twitter')}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default memo(Component);
