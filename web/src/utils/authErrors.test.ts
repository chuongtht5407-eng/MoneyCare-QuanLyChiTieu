import { mapAuthError } from './authErrors';

function runAuthErrorTests() {
  console.log('--- RUNNING MONEYCARE AUTH ERRORS AUTOMATED TESTS ---');

  const testCases: Array<{
    input: unknown;
    expected: string;
    description: string;
  }> = [
    {
      input: { code: 'auth/invalid-credential' },
      expected: 'Email hoặc mật khẩu không đúng.',
      description: 'auth/invalid-credential -> Email hoặc mật khẩu không đúng.',
    },
    {
      input: { code: 'auth/wrong-password' },
      expected: 'Email hoặc mật khẩu không đúng.',
      description: 'auth/wrong-password -> Email hoặc mật khẩu không đúng.',
    },
    {
      input: { code: 'auth/user-not-found' },
      expected: 'Email hoặc mật khẩu không đúng.',
      description: 'auth/user-not-found -> Email hoặc mật khẩu không đúng.',
    },
    {
      input: { code: 'auth/email-already-in-use' },
      expected: 'Email này đã được đăng ký.',
      description: 'auth/email-already-in-use -> Email này đã được đăng ký.',
    },
    {
      input: { code: 'auth/weak-password' },
      expected: 'Mật khẩu quá yếu, cần ít nhất 6 ký tự.',
      description: 'auth/weak-password -> Mật khẩu quá yếu, cần ít nhất 6 ký tự.',
    },
    {
      input: { code: 'auth/invalid-email' },
      expected: 'Địa chỉ email không hợp lệ.',
      description: 'auth/invalid-email -> Địa chỉ email không hợp lệ.',
    },
    {
      input: { code: 'auth/network-request-failed' },
      expected: 'Không có kết nối mạng. Vui lòng kiểm tra internet và thử lại.',
      description: 'auth/network-request-failed -> Không có kết nối mạng.',
    },
    {
      input: { code: 'auth/too-many-requests' },
      expected: 'Bạn thử quá nhiều lần. Vui lòng đợi một lúc rồi thử lại.',
      description: 'auth/too-many-requests -> Bạn thử quá nhiều lần.',
    },
    {
      input: { code: 'auth/user-disabled' },
      expected: 'Tài khoản này đã bị vô hiệu hóa.',
      description: 'auth/user-disabled -> Tài khoản này đã bị vô hiệu hóa.',
    },
    {
      input: { code: 'auth/requires-recent-login' },
      expected: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
      description: 'auth/requires-recent-login -> Phiên đăng nhập đã hết hạn.',
    },
    {
      input: { code: 'auth/unknown-error' },
      expected: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
      description: 'Mã lỗi không xác định -> Đã có lỗi xảy ra. Vui lòng thử lại.',
    },
  ];

  let passed = 0;
  for (const tc of testCases) {
    const actual = mapAuthError(tc.input);
    if (actual !== tc.expected) {
      throw new Error(
        `Test failed for ${tc.description}.\nExpected: "${tc.expected}"\nGot: "${actual}"`
      );
    }
    console.log(`✓ Test passed: ${tc.description}`);
    passed++;
  }

  console.log(`--- ALL ${passed} AUTH ERROR TESTS PASSED SUCCESSFULLY ---`);
}

runAuthErrorTests();
