/**
 * Ánh xạ mã lỗi Firebase Authentication sang thông điệp tiếng Việt thân thiện với người dùng.
 */
export function mapAuthError(error: unknown): string {
  let code = '';

  if (typeof error === 'object' && error !== null && 'code' in error) {
    code = String((error as { code: unknown }).code || '');
  } else if (typeof error === 'string') {
    code = error;
  } else if (error instanceof Error) {
    code = error.message;
  }

  // Chuẩn hóa: loại bỏ tiền tố 'auth/' nếu có
  const normalizedCode = code.replace(/^auth\//, '').toLowerCase().trim();

  // Kiểm tra từng nhóm mã lỗi
  if (
    normalizedCode.includes('invalid-credential') ||
    normalizedCode.includes('invalid-login-credentials') ||
    normalizedCode.includes('wrong-password') ||
    normalizedCode.includes('user-not-found')
  ) {
    return 'Email hoặc mật khẩu không đúng.';
  }

  if (normalizedCode.includes('email-already-in-use') || normalizedCode.includes('email-already')) {
    return 'Email này đã được đăng ký.';
  }

  if (normalizedCode.includes('weak-password')) {
    return 'Mật khẩu quá yếu, cần ít nhất 6 ký tự.';
  }

  if (normalizedCode.includes('invalid-email')) {
    return 'Địa chỉ email không hợp lệ.';
  }

  if (
    normalizedCode.includes('network-request-failed') ||
    normalizedCode.includes('network') ||
    normalizedCode.includes('timeout')
  ) {
    return 'Không có kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
  }

  if (normalizedCode.includes('too-many-requests')) {
    return 'Bạn thử quá nhiều lần. Vui lòng đợi một lúc rồi thử lại.';
  }

  if (normalizedCode.includes('user-disabled')) {
    return 'Tài khoản này đã bị vô hiệu hóa.';
  }

  if (
    normalizedCode.includes('requires-recent-login') ||
    normalizedCode.includes('user-token-expired') ||
    normalizedCode.includes('token-expired')
  ) {
    return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
  }

  return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
}
