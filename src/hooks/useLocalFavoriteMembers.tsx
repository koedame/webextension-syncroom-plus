import { atom, selector, useRecoilState } from 'recoil';
import browser from 'webextension-polyfill';

export type MemberName = string;

export type FavoriteMember = {
  memberName: MemberName;
  createdAt: string;
};

const savedFavoriteMembersSelector = selector<FavoriteMember[]>({
  key: 'savedFavoriteMembers',
  get: async ({ get }) => {
    const res = await browser.storage.local.get('favoriteMembers').then(({ favoriteMembers }) => {
      if (typeof favoriteMembers !== 'undefined') {
        return favoriteMembers;
      } else {
        return [] as FavoriteMember[];
      }
    });
    return res;
  },
});

const favoriteMembersState = atom<FavoriteMember[]>({
  key: 'favoriteMembers',
  default: savedFavoriteMembersSelector,
});

export const favoriteMembersSelector = selector<FavoriteMember[]>({
  key: 'favoriteMembersSelector',
  get: ({ get }) => get(favoriteMembersState),
  set: ({ set }, newValue) => {
    browser.storage.local.set({ favoriteMembers: newValue });
    set(favoriteMembersState, newValue);
  },
});

export const useFavoriteMembers = () => {
  const [favoriteMembers, setFavoriteMembers] = useRecoilState(favoriteMembersSelector);

  const removeFavoriteMemberFromName = (memberName: MemberName) => {
    const newValue = favoriteMembers.filter((m: FavoriteMember) => {
      return m.memberName !== memberName;
    });

    setFavoriteMembers(newValue);
  };

  const addFavoriteMemberFromName = (memberName: MemberName) => {
    const newValue = [
      ...favoriteMembers,
      {
        memberName: memberName,
        createdAt: new Date().toISOString(),
      },
    ];
    setFavoriteMembers(newValue);
  };

  const isFavoriteMember = (memberName: MemberName): boolean => {
    for (let favoriteMember of favoriteMembers) {
      if (favoriteMember.memberName === memberName) {
        return true;
      }
    }
    return false;
  };

  return {
    favoriteMembers,
    setFavoriteMembers,
    addFavoriteMemberFromName,
    removeFavoriteMemberFromName,
    isFavoriteMember,
  };
};
