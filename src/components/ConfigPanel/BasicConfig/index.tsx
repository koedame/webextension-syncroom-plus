import React, { memo, useState } from 'react';
import { useTranslation } from '../../../lib/i18n';
import { useConfigAutoReload } from '../../../hooks/useConfigAutoReload';
import { useConfigRememberPassword } from '../../../hooks/useConfigRememberPasswordState';
import { resetRememberPasswords } from '../../../lib/passwordManager';
import ResetRememberPasswordDialog from './ResetRememberPassword/Dialog';
import ResetRememberPasswordSucceedToast from './ResetRememberPassword/SucceedToast';

interface Props {}

const Component: React.FC<Props> = ({}: Props) => {
  const { t } = useTranslation();

  const [resetRememberPasswordDialogOpenState, setResetRememberPasswordDialogOpenState] = useState<boolean>(false);
  const [resetRememberPasswordDialogSuccseedToastOpenState, setResetRememberPasswordDialogSuccseedToastOpenState] = useState<boolean>(false);

  const { configAutoReload, setConfigAutoReload } = useConfigAutoReload();
  const { configRememberPassword, setConfigRememberPassword } = useConfigRememberPassword();

  return (
    <div className="sm:px-6 sm:py-5">
      <div className="mt-4 text-sm text-gray-900 ">
        <fieldset className="space-y-5">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="autoreload"
                name="autoreload"
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                checked={configAutoReload}
                onChange={(e) => {
                  setConfigAutoReload(e.target.checked);
                }}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="autoreload">
                <p className="font-medium text-gray-700">{t('auto_reload')}</p>
                <p id="autoreload-description" className="text-gray-500">
                  {t('auto_reload_description')}
                </p>
              </label>
            </div>
          </div>

          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="rememberpassword"
                name="rememberpassword"
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                checked={configRememberPassword}
                onChange={(e) => {
                  setConfigRememberPassword(e.target.checked);
                }}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="rememberpassword">
                <p className="font-medium text-gray-700">{t('remember_password')}</p>
                <p id="rememberpassword-description" className="text-gray-500">
                  {t('remember_password_description')}
                </p>
              </label>

              <button
                className="my-2 border-b border-dashed border-red-600 text-red-600 hover:border-solid hover:border-red-800 hover:text-red-800"
                onClick={() => {
                  setResetRememberPasswordDialogOpenState(true);
                }}
              >
                {t('remove_remember_passwords')}
              </button>
            </div>
          </div>
        </fieldset>
        <ResetRememberPasswordDialog
          isOpen={resetRememberPasswordDialogOpenState}
          onClose={() => {
            setResetRememberPasswordDialogOpenState(false);
          }}
          onOk={() => {
            resetRememberPasswords();
            setResetRememberPasswordDialogOpenState(false);
            setResetRememberPasswordDialogSuccseedToastOpenState(true);
            setTimeout(() => {
              setResetRememberPasswordDialogSuccseedToastOpenState(false);
            }, 5000);
          }}
        />
        <ResetRememberPasswordSucceedToast
          isOpen={resetRememberPasswordDialogSuccseedToastOpenState}
          onClose={() => {
            setResetRememberPasswordDialogSuccseedToastOpenState(false);
          }}
        />
      </div>
    </div>
  );
};

export default memo(Component);
