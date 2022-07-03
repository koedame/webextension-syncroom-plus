import { Dialog, Transition } from '@headlessui/react';
import { ExclamationIcon, SearchIcon, XIcon } from '@heroicons/react/outline';
import { SYNCROOM } from '../../types/syncroom';
import { UserRepository } from '../../repositories/userRepository';
import { useTranslation } from '../../lib/i18n';

import { css } from '@emotion/css';
import React, { Fragment, memo, useEffect, useState } from 'react';
import MemberInfo from './MemberInfo';
import { InformationCircleIcon } from '@heroicons/react/solid';
import ReactLoading from 'react-loading';

// focus:shadow-none が効かないのでこのやり方をとる
const SearchInputStyle = css`
  &:focus {
    box-shadow: none !important;
  }
`;

interface PaginationProps extends SYNCROOM.UserSearchMetaType {
  onPrev: Function;
  onNext: Function;
}

const PaginationComponent: React.FC<PaginationProps> = ({ page, totalPages, onPrev, onNext }: PaginationProps) => {
  const { t } = useTranslation();

  return (
    <nav className="bg-white px-4 py-3 flex items-center justify-between sm:px-6" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          <span className="font-medium">{page}</span> / <span className="font-medium">{totalPages}</span> {t('pages')}
        </p>
      </div>
      <div className="flex-1 flex justify-between sm:justify-end">
        {page > 1 && (
          <button
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => {
              onPrev();
            }}
          >
            {t('prev')}
          </button>
        )}
        {page < totalPages && (
          <button
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => {
              onNext();
            }}
          >
            {t('next')}
          </button>
        )}
      </div>
    </nav>
  );
};

import { atom, useRecoilState } from 'recoil';

const userSearchModalState = atom<boolean>({
  key: 'UserSearchModalState',
  default: false,
});

export const useUserSearch = () => {
  const [isOpen, setIsOpen] = useRecoilState(userSearchModalState);

  const openUserSearchForm = () => {
    setIsOpen(true);
  };

  const closeUserSearchForm = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openUserSearchForm,
    closeUserSearchForm,
  };
};

interface Props {}

const Component: React.FC<Props> = ({}: Props) => {
  const { t } = useTranslation();

  const { isOpen, closeUserSearchForm } = useUserSearch();

  const [keywordState, setKeywords] = useState<string>('');
  const [pageState, setPageState] = useState<number>(1);
  const [searchRes, setSearchRes] = useState<SYNCROOM.UserSearchResponseType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [publishStatusState, setPublishStatusState] = useState<SYNCROOM.PublishStatusType>('open');

  useEffect(() => {
    if (keywordState === '') {
      setSearchRes(undefined);
    } else {
      setIsLoading(true);
      UserRepository.search({
        keywords: keywordState,
        publishStatus: publishStatusState,
        pageSize: 20,
        page: pageState,
      }).then((res) => {
        if (setSearchRes) setSearchRes(res);
        if (setIsLoading) setIsLoading(false);
      });
    }
  }, [keywordState, pageState, publishStatusState]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {
          closeUserSearchForm();
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
                  onClick={() => closeUserSearchForm()}
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="pb-20">
                <div className="rounded bg-white">
                  <h1 className="p-4 text-xl text-gray-900">{t('user_search')}</h1>
                  <div className="p-4 flex">
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
                        onChange={(e) => {
                          setKeywords(e.target.value);
                          setPageState(1);
                        }}
                        value={keywordState}
                      />
                    </label>

                    <div className="ml-6 space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                      <div className="flex items-center">
                        <input
                          id="publishStatusStateOpen"
                          name="payment-type"
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          checked={publishStatusState === 'open'}
                          onChange={() => {
                            setPublishStatusState('open');
                          }}
                        />
                        <label htmlFor="publishStatusStateOpen" className="ml-3 block text-sm font-medium text-gray-700">
                          {t('profile_is_public')}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="publishStatusStateHidden"
                          name="payment-type"
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          checked={publishStatusState === 'hidden'}
                          onChange={() => {
                            setPublishStatusState('hidden');
                          }}
                        />
                        <label htmlFor="publishStatusStateHidden" className="ml-3 block text-sm font-medium text-gray-700">
                          {t('profile_is_private')}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    {isLoading ? (
                      <div className="flex flex-col justify-between">
                        <ReactLoading className="mx-auto h-20 w-20" type="bubbles" color="rgb(79 70 229)" />
                        <p className="text-center">{t('loading')}</p>
                      </div>
                    ) : keywordState === '' ? (
                      <div className="rounded-md bg-blue-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-700">{t('type_keywords')}</p>
                          </div>
                        </div>
                      </div>
                    ) : searchRes?.users.length === 0 ? (
                      <div className="rounded-md bg-yellow-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm text-yellow-700">
                              <p>{t('user_not_found')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      searchRes && (
                        <>
                          <PaginationComponent
                            {...searchRes.meta}
                            onPrev={() => {
                              setPageState(pageState - 1);
                            }}
                            onNext={() => {
                              setPageState(pageState + 1);
                            }}
                          />
                          <div className="border border-gray-200 rounded-md">
                            <div className="divide-y divide-gray-200">
                              {searchRes.users.map((user, index) => (
                                <MemberInfo key={user.userId} {...user} index={index} />
                              ))}
                            </div>
                          </div>

                          <PaginationComponent
                            {...searchRes.meta}
                            onPrev={() => {
                              setPageState(pageState - 1);
                            }}
                            onNext={() => {
                              setPageState(pageState + 1);
                            }}
                          />
                        </>
                      )
                    )}
                  </div>
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
