import {
  buildFinanceContext,
  formatContextPromptText,
} from './financeContextBuilder';
import { Transaction } from '../types/transaction';
import { MonthlyBudget } from '../types/budget';

function runFinanceContextBuilderTests() {
  console.log('====================================================');
  console.log('🤖 RUNNING MONEYCARE AI FINANCE CONTEXT BUILDER TESTS');
  console.log('====================================================');

  const testTransactions: Transaction[] = [
    {
      id: 'tx-1',
      type: 'income',
      amount: 10000000,
      categoryId: 'salary',
      categoryName: 'Lương',
      date: '2026-11-01',
      formattedTime: '01/11/2026',
    },
    {
      id: 'tx-2',
      type: 'expense',
      amount: 2000000,
      categoryId: 'rent',
      categoryName: 'Tiền trọ',
      date: '2026-11-05',
      formattedTime: '05/11/2026',
    },
    {
      id: 'tx-3',
      type: 'expense',
      amount: 700000,
      categoryId: 'food',
      categoryName: 'Ăn uống',
      date: '2026-11-10',
      formattedTime: '10/11/2026',
    },
    {
      id: 'tx-4',
      type: 'expense',
      amount: 200000,
      categoryId: 'transport',
      categoryName: 'Di chuyển',
      date: '2026-11-12',
      formattedTime: '12/11/2026',
    },
  ];

  const testBudget: MonthlyBudget = {
    id: '2026-11',
    monthYear: 'Tháng 11/2026',
    totalLimit: 3000000,
    categoryLimits: {
      rent: 2000000,
      food: 800000,
      transport: 700000,
    },
  };

  const context = buildFinanceContext(testTransactions, testBudget, 2026, 11);

  if (context.month !== 11 || context.year !== 2026) {
    throw new Error(`Test Failed: Month/Year incorrect: ${context.month}/${context.year}`);
  }
  console.log('✓ Test passed: Month/Year is 11/2026');

  if (context.totalIncome !== 10000000) {
    throw new Error(`Test Failed: Expected totalIncome 10,000,000, got ${context.totalIncome}`);
  }
  console.log('✓ Test passed: totalIncome is 10,000,000 đ');

  if (context.totalExpense !== 2900000) {
    throw new Error(`Test Failed: Expected totalExpense 2,900,000, got ${context.totalExpense}`);
  }
  console.log('✓ Test passed: totalExpense is 2,900,000 đ');

  if (context.balance !== 7100000) {
    throw new Error(`Test Failed: Expected balance 7,100,000, got ${context.balance}`);
  }
  console.log('✓ Test passed: balance is 7,100,000 đ');

  if (context.budgetUsagePercent !== 96.67) {
    throw new Error(`Test Failed: Expected budgetUsagePercent 96.67, got ${context.budgetUsagePercent}`);
  }
  console.log('✓ Test passed: budgetUsagePercent is 96.67%');

  if (context.topExpenseCategories[0].categoryName !== 'Tiền trọ') {
    throw new Error(`Test Failed: Expected top expense category "Tiền trọ", got ${context.topExpenseCategories[0].categoryName}`);
  }
  console.log('✓ Test passed: topExpenseCategories[0] is "Tiền trọ" (2,000,000 đ)');

  const promptText = formatContextPromptText(context);
  if (!promptText.includes('10.000.000 đ') || !promptText.includes('2.900.000 đ')) {
    throw new Error('Test Failed: Prompt text does not format currency strings correctly.');
  }
  console.log('✓ Test passed: Prompt text formatting is complete and valid.');

  console.log('====================================================');
  console.log('🎉 ALL MONEYCARE AI CONTEXT BUILDER TESTS PASSED!');
  console.log('====================================================');
}

runFinanceContextBuilderTests();
