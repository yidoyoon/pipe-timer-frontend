import {
  GenericResponse,
  ILoginInput,
  ILoginResponse,
  ISignUpInput,
  IUserResponse,
} from 'src/api/userTypes';
import { api } from 'boot/axios';

export const refreshAccessTokenFn = async () => {
  const response = await api.get<ILoginResponse>('auth/refresh');
  return response.data;
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  // 토근 만료로 인한 에러 메시지 발생
  // TODO: 토큰 만료 확인 기능 추가
  async (error) => {
    const originalRequest = error.config;
    const errMessage = <string>error.response.data.message;
    // 반복적인 토큰 요청 제한
    if (errMessage.includes('not logged in') && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAccessTokenFn();
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);
export const signUpUserFn = async (user: ISignUpInput) => {
  const response = await api.post<GenericResponse>('auth/register', user);
  return response.data;
};

export const loginUserFn = async (user: ILoginInput) => {
  const response = await api.post<ILoginResponse>('auth/login', user);
  return response.data;
};

export const verifyEmailFn = async (verificationCode: string) => {
  const response = await api.get<GenericResponse>(
    `auth/verify-email/${verificationCode}`
  );
  return response.data;
};

export const logoutUserFn = async () => {
  const response = await api.get<GenericResponse>('auth/logout');
  return response.data;
};

export const getMeFn = async () => {
  const response = await api.get<IUserResponse>('users/me');
  return response.data;
};
