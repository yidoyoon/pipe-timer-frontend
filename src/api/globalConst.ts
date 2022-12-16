export const CHECK_EMPTY = 1;

export const userVar = {
  USER_NAME_MIN_LEN: 3,
  USER_NAME_MAX_LEN: 39,
  PASSWORD_MIN_LEN: 8,
  PASSWORD_MAX_LEN: 64,
}

export const userMsg = {
  EMPTY_USER_EMAIL: '이메일 주소를 입력해주세요.',
  EMPTY_USER_PASSWORD: '비밀번호를 입력해주세요.',
  SUCCESS_USER_LOGIN: '로그인에 성공했습니다.',

  INVALID_USER_EMAIL: '유효하지 않은 이메일 형식입니다.',
  BELOW_MIN_USER_NAME: `유저네임을 ${userVar.USER_NAME_MIN_LEN}자 이상으로 설정해주세요`,
  BELOW_MIN_USER_PASSWORD: `비밀번호를 ${userVar.PASSWORD_MIN_LEN}자 이상으로 설정해주세요.`,
  ABOVE_MAX_USER_PASSWORD: `비밀번호를 ${userVar.PASSWORD_MAX_LEN}자 미만으로 설정해주세요.`,
  EMPTY_CONFIRM_PASSWORD: '비밀번호를 한번 더 입력해주세요.',
  MISMATCH_PASSWORD: '비밀번호가 일치하지 않습니다.',
  SEND_USER_SIGNUP: '회원가입 요청이 전송됐습니다.',

  VERIFY_USER_EMAIL: '인증 코드를 입력해주세요.',
  VERIFY_COMPLETE: '인증 완료됐습니다.'
}
