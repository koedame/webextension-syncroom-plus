import { atom, useRecoilState } from 'recoil';

const roomPasswordPromptOpenState = atom<boolean>({
  key: 'roomPasswordPromptOpenState',
  default: false,
});

const currentRoomNameState = atom<string>({
  key: 'currentRoomNameState',
  default: '',
});

export const useRoomPasswordPrompt = () => {
  const [roomPasswordPromptOpen, setRoomPasswordPromptOpen] = useRecoilState(roomPasswordPromptOpenState);
  const [currentRoomName, setCurrentRoomName] = useRecoilState(currentRoomNameState);

  const openRoomPasswordPrompt = () => {
    setRoomPasswordPromptOpen(true);
  };

  const closeRoomPasswordPrompt = () => {
    setRoomPasswordPromptOpen(false);
  };

  return {
    roomPasswordPromptOpen,
    setRoomPasswordPromptOpen,
    openRoomPasswordPrompt,
    closeRoomPasswordPrompt,
    currentRoomName,
    setCurrentRoomName,
  };
};
