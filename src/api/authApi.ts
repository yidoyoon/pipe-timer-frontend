import {
  IErrorResponse,
  IGeneralResponse,
  ILoginInput,
  IUser,
} from 'src/type-defs/userTypes';
import { api } from 'boot/axios';
import { Cookies, Notify } from 'quasar';
import { useRouter } from 'vue-router';

export const refreshAccessTokenFn = async () => {
  const response = await api.get<IGeneralResponse<IUser> | IErrorResponse>(
    'users/auth/refresh'
  );
  return response.data;
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
    const originalRequest = error.config;
    const errMessage = <string>error.response.data?.message;

    if (errMessage === '이미 인증되었습니다.') {
      Notify.create({
        color: 'positive',
        message: '이미 인증되었습니다.',
      });
      // TODO: 메시지 출력과 함께 로그인창으로 이동
    } else if (errMessage === 'No access token') {
      Notify.create({
        color: 'warning',
        message: '인증정보가 없습니다. 우선 로그인 해주세요.',
      });
    } else if (errMessage === 'jwt expired') {
      await refreshAccessTokenFn();
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const signUpUserFn = async (user: ISignupInput) => {
  const response = await api.post('users', user);
  return response.data;
};

export const loginUserFn = async (user: ILoginInput) => {
  const response = await api.post('users/login', user);
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
  const response = await api.get('users/logout');
  return response.data;
};

export const getMeFn = async () => {
  const response = await api.get('users/me');
  return response.data;
};
