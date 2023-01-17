export const CHECK_EMPTY = 1;

export const userVar = {
  USER_NAME_MIN_LEN: 3,
  USER_NAME_MAX_LEN: 39,
  PASSWORD_MIN_LEN: 8,
  PASSWORD_MAX_LEN: 64,
  USER_EMAIL_MAX_LEN: 320,
};

export const userMsg = {
  // Login
  EMPTY_USER_EMAIL: '이메일 주소를 입력해주세요.',
  EMPTY_USER_PASSWORD: '비밀번호를 입력해주세요.',
  SUCCESS_USER_LOGIN: '로그인에 성공했습니다.',

  // Login - Error
  NO_MATCHING_ACCOUNT: '일치하는 메일 정보가 없습니다.',
  UNAUTHORIZED_PASSWORD: '비밀번호가 일치하지 않습니다.',

  // Logout
  ERROR_USER_LOGOUT: '로그아웃 중 문제가 발생했습니다.',

  // Authorization
  INVALID_TOKEN: '인증 정보가 만료됐습니다. 다시 로그인해주세요.',

  // Signup
  INVALID_USER_EMAIL: '유효하지 않은 이메일 형식입니다.',
  BELOW_MIN_USER_NAME: `유저네임을 ${userVar.USER_NAME_MIN_LEN}자 이상으로 설정해주세요`,
  BELOW_MIN_USER_PASSWORD: `비밀번호를 ${userVar.PASSWORD_MIN_LEN}자 이상으로 설정해주세요.`,
  ABOVE_MAX_USER_PASSWORD: `비밀번호를 ${userVar.PASSWORD_MAX_LEN}자 미만으로 설정해주세요.`,
  EMPTY_CONFIRM_PASSWORD: '비밀번호를 한번 더 입력해주세요.',
  MISMATCH_PASSWORD: '비밀번호가 일치하지 않습니다.',
  SEND_USER_SIGNUP_VERIFICATION_EMAIL:
    '로 인증 메일이 전송됐습니다. 메일을 확인해주세요.',

  // Email verification
  VERIFY_USER_EMAIL: '인증 코드를 입력해주세요.',
  VERIFY_COMPLETE: '인증 되었습니다. 서비스를 이용하시려면 로그인해주세요.',
  INVALID_EMAIL_VERIFICATION_CODE: '유효하지 않은 인증정보 입니다.',
  ALREADY_VERIFIED_EMAIL: '이미 인증된 계정입니다.',
};
