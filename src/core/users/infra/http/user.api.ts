import { userMsg } from 'src/core/users/domain/user.const';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import {
  IEmailInput,
  INameInput,
  IValidationInput,
  IErrorResponse,
  IGeneralResponse,
  ILoginInput,
  IResetPasswordInput,
  ISignupInput,
  IUser,
} from 'src/type-defs/userTypes';
import { Notify } from 'quasar';
import { api } from 'boot/axios';

export const refreshAccessTokenFn = () => {
  const response = api.get<IGeneralResponse<IUser> | IErrorResponse>(
    'auth/refresh'
  );

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

export const verifyEmailFn = async (
  signupVerifyToken: string
): Promise<IGeneralResponse> => {
  const response = await api.get(
    `users/verify-email?signupVerifyToken=${signupVerifyToken}`
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

export const sendResetPasswordEmail = async (
  email: IEmailInput
): Promise<IGeneralResponse> => {
  const response = await api.post('users/send-reset-password-email', email);
  return response.data;
};

export const verifyResetPasswordTokenFn = async (
  resetPasswordVerifyToken: string
): Promise<IGeneralResponse> => {
  const response = await api.get(
    `users/verify-reset-password-token?resetPasswordVerifyToken=${resetPasswordVerifyToken}`
  );
  return response.data ? response.data : response;
};

export const resetPassword = async (password: IResetPasswordInput) => {
  const response = await api.post('users/reset-password', password);
  return response.data;
};

export const changeEmailFn = async (email: IEmailInput) => {
  const response = await api.post('users/change-email', email);
  return response.data;
};

export const verifyChangeEmailTokenFn = async (
  changeEmailVerifyToken: string
) => {
  const response = await api.get(
    `users/verify-change-email?changeEmailVerifyToken=${changeEmailVerifyToken}`
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
