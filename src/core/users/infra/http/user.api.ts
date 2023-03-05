import { userMsg } from 'src/core/users/domain/userConst';
import {
  ICheckEmailInput,
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

// TODO: retry, retryDelay, maxRetries 설정
api.interceptors.response.use(
  response => response,
  // TODO: 토큰 만료 확인 기능 추가
  // 토큰 만료로 인한 에러 메시지 발생
  // TODO: 서버 자체가 열려있지 않을 때 로그인 비활성화
  // TODO: 에러메시지를 각 서비스로 분산
  async (err) => {
    // const originalRequest = error.config;
    const errMsg = err.response.data.message as string;

    if (errMsg === 'Unauthorized') {
      return await refreshAccessTokenFn().catch(() => {
        Notify.create({
          color: 'negative',
          html: true,
          message: userMsg.INVALID_TOKEN,
          icon: 'error',
        });
      });
    }  else if (errMsg.includes('regular expression')) {
      Notify.create({
        color: 'negative',
        message: '비밀번호로 사용 불가능한 문자가 포함되어 있습니다.',
        icon: 'error',
      });
    }

    return Promise.reject(err);
  }
);

export const checkEmailFn = async (email: ICheckEmailInput) => {
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

// TODO: 이메일 인증 시, 로그인까지 진행하도록 구현
export const verifyEmailFn = async (signupVerifyToken: string) => {
  const response = await api.get(
    `user/verify-email?signupVerifyToken=${signupVerifyToken}`
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
