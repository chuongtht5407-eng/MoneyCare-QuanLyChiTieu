import { calculateFinancialSummary, formatCurrency } from './finance';
import { DEMO_TRANSACTIONS, DEMO_MONTHLY_BUDGET_LIMIT } from '../data/demoTransactions';

function runTests() {
  console.log('--- RUNNING MONEYCARE FINANCE UTILS AUTOMATED TESTS ---');

  const summary = calculateFinancialSummary(DEMO_TRANSACTIONS, DEMO_MONTHLY_BUDGET_LIMIT);

  // Assert Total Income = 10,000,000
  if (summary.totalIncome !== 10000000) {
    throw new Error(`Test failed: Expected totalIncome 10000000, got ${summary.totalIncome}`);
  }
  console.log('✓ Test passed: totalIncome is 10,000,000 đ');

  // Assert Total Expense = 2,900,000
  if (summary.totalExpense !== 2900000) {
    throw new Error(`Test failed: Expected totalExpense 2900000, got ${summary.totalExpense}`);
  }
  console.log('✓ Test passed: totalExpense is 2,900,000 đ');

  // Assert Current Balance = 7,100,000
  if (summary.currentBalance !== 7100000) {
    throw new Error(`Test failed: Expected currentBalance 7100000, got ${summary.currentBalance}`);
  }
  console.log('✓ Test passed: currentBalance is 7,100,000 đ');

  // Assert Budget Usage Percentage = 96.7%
  if (summary.budgetUsagePercentage !== 96.7) {
    throw new Error(`Test failed: Expected budgetUsagePercentage 96.7, got ${summary.budgetUsagePercentage}`);
  }
  console.log('✓ Test passed: budgetUsagePercentage is 96.7%');

  // Assert Format Currency
  const formatted7m = formatCurrency(7100000);
  if (formatted7m !== '7.100.000 đ') {
    throw new Error(`Test failed: Expected "7.100.000 đ", got "${formatted7m}"`);
  }
  console.log('✓ Test passed: formatCurrency(7100000) -> "7.100.000 đ"');

  console.log('--- ALL TESTS PASSED SUCCESSFULLY ---');
}

runTests();
