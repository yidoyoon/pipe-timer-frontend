import { Router } from 'src/router';
import {
  IErrorResponse,
  IGeneralResponse,
  ILoginInput,
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

// TODO: api 이름 구분
// TODO: retry, retryDelay, maxRetries 설정
api.interceptors.response.use(
  (response) => {
    return response;
  },
  // TODO: 토큰 만료 확인 기능 추가
  // 토근 만료로 인한 에러 메시지 발생
  async (error) => {
    // const originalRequest = error.config;
    const errMessage = error.response.data.message as string;
    console.log(error);

    if (errMessage === 'Email authenticated') {
      await Router.push({ name: 'login' });
      Notify.create({
        color: 'positive',
        message: '이미 인증된 계정입니다.',
      });
    } else if (errMessage === 'Unauthorized') {
      return await refreshAccessTokenFn().catch(() => {
        Notify.create({
          color: 'negative',
          message: '인증 정보가 없습니다. 다시 로그인해주세요.',
        });
      });
    }
    return Promise.reject(error);
  }
);

export const signUpUserFn = async (user: ISignupInput) => {
  const response = await api.post('auth/register', user);
  return response.data;
};

export const loginUserFn = async (user: ILoginInput) => {
  const response = await api.post('auth/login', user);
  return response.data;
};

// TODO: 이메일 인증 시, 로그인까지 진행하도록 구현
export const verifyEmailFn = async (signupVerifyToken: string) => {
  const response = await api.post(
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
