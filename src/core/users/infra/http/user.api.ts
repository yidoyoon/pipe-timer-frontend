import { userMsg } from 'src/core/users/domain/user.const';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import {
  IEmailInput,
  INameInput,
  IValidationInput,
  IErrorResponse,
  IRes,
  ILoginInput,
  IChangePasswordInput,
  ISignupInput,
  IUser,
} from 'src/type-defs/userTypes';
import { Notify } from 'quasar';
import { api } from 'boot/axios';

export const refreshAccessTokenFn = () => {
  const response = api.get<IRes<IUser> | IErrorResponse>('auth/refresh');

  return response;
};

// TODO: retry, retryDelay, maxRetries 설정
api.interceptors.response.use(
  (response) => response,
  // TODO: 토큰 만료 확인 기능 추가
  // 토큰 만료로 인한 에러 메시지 발생
  // TODO: 서버 자체가 열려있지 않을 때 로그인 비활성화
  // TODO: 에러메시지를 각 서비스로 분산
  // TODO: 미들웨어에서 router.push 수행하도록 수정
  async (err) => {
    const userStore = useUserStore();
    const errMsg = err.response.data?.message as string;
    // const originalRequest = error.config;

    if (errMsg === 'Unauthorized' || errMsg === 'User not found') {
      return await refreshAccessTokenFn().catch(() => {
        Notify.create({
          html: true,
          color: 'negative',
          message: userMsg.INVALID_TOKEN,
          icon: 'error',
        });

        userStore.$reset();
      });
    }

    return Promise.reject(err);
  }
);

export const checkEmailFn = async (email: IEmailInput) => {
  const response = await api.post('auth/check-email', email);
  return response.data;
};

export const signUpUserFn = async (user: ISignupInput) => {
  const response = await api.post('auth/register', user);
  return response.data;
};

export const loginUserFn = async (user: ILoginInput) => {
  const response = await api.post('auth/login', user);
  return response.data;
};

export const verifyEmailFn = async (signupToken: string): Promise<IRes> => {
  const response = await api.get(
    `users/verify-email?signupToken=${signupToken}`
  );
  return response.data ? response.data : response;
};

export const logoutUserFn = async () => {
  const response = await api.delete('auth/logout');
  return response.data;
};

export const getMeFn = async () => {
  const response = await api.get('auth/me');
  return response.data;
};

export const sendResetPasswordEmailFn = async (
  email: IEmailInput
): Promise<IRes> => {
  const response = await api.post('users/send-reset-password-email', email);
  return response.data;
};

export const verifyResetPasswordTokenFn = async (
  resetPasswordToken: string
): Promise<IRes> => {
  const response = await api.get(
    `users/verify-reset-password-token?resetPasswordToken=${resetPasswordToken}`
  );
  return response.data ? response.data : response;
};

export const changePassword = async (password: IChangePasswordInput) => {
  const response = await api.post('users/change-password', password);
  return response.data;
};

export const sendChangeMailFn = async (email: IEmailInput) => {
  const response = await api.post('users/send-change-mail', email);
  return response.data;
};

export const verifyChangeEmailTokenFn = async (changeEmailToken: string) => {
  const response = await api.get(
    `users/verify-change-email?changeEmailToken=${changeEmailToken}`
  );
  return response.data ? response.data : response;
};

export const changeNameFn = async (userName: INameInput) => {
  const response = await api.post('users/change-name', userName);
  return response.data;
};

export const deleteAccountFn = async (validation: IValidationInput) => {
  const response = await api.post('users/delete-account', validation);
  return response.data;
};

export const resendSignupEmailFn = async (email: string): Promise<IRes> => {
  const response = await api.post('auth/resend-signup-email', { email });
  return response.data;
};
