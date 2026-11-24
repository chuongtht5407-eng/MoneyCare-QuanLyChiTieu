import {
  calculateTotalBalance,
  calculateMonthlyIncome,
  calculateMonthlyExpense,
  calculateMonthlyCategoryExpense,
  calculateYearlyChartData,
  calculateBudgetUsage,
  calculateFinancialSummary,
  formatCurrency,
} from './finance';
import { Transaction } from '../types/transaction';

function runPerson3Tests() {
  console.log('====================================================');
  console.log('🚀 RUNNING PERSON 3 MATHEMATICAL & INTEGRATION TESTS');
  console.log('====================================================');

  // --- TEST SET A ---
  console.log('\n--- TEST SET A: Baseline Monthly Calculation ---');
  const testSetA: Transaction[] = [
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

  const totalIncA = calculateMonthlyIncome(testSetA, 2026, 11);
  const totalExpA = calculateMonthlyExpense(testSetA, 2026, 11);
  const balanceA = calculateTotalBalance(testSetA);
  const budgetUsageA = calculateBudgetUsage(totalExpA, 3000000);

  if (totalIncA !== 10000000) throw new Error(`Test A Failed: Expected Income 10,000,000, got ${totalIncA}`);
  if (totalExpA !== 2900000) throw new Error(`Test A Failed: Expected Expense 2,900,000, got ${totalExpA}`);
  if (balanceA !== 7100000) throw new Error(`Test A Failed: Expected Balance 7,100,000, got ${balanceA}`);
  if (budgetUsageA.remaining !== 100000) throw new Error(`Test A Failed: Expected Remaining 100,000, got ${budgetUsageA.remaining}`);
  if (budgetUsageA.status !== 'warning') throw new Error(`Test A Failed: Expected status "warning", got ${budgetUsageA.status}`);
  console.log('✓ TEST SET A PASSED: Total Income 10M, Expense 2.9M, Balance 7.1M, Usage 96.67%, Status Warning');

  // --- TEST SET B ---
  console.log('\n--- TEST SET B: Over Budget Alert ---');
  const testSetB: Transaction[] = [
    ...testSetA,
    {
      id: 'tx-5',
      type: 'expense',
      amount: 200000,
      categoryId: 'shopping',
      categoryName: 'Mua sắm',
      date: '2026-11-15',
      formattedTime: '15/11/2026',
    },
  ];

  const totalExpB = calculateMonthlyExpense(testSetB, 2026, 11);
  const balanceB = calculateTotalBalance(testSetB);
  const budgetUsageB = calculateBudgetUsage(totalExpB, 3000000);

  if (totalExpB !== 3100000) throw new Error(`Test B Failed: Expected Expense 3,100,000, got ${totalExpB}`);
  if (balanceB !== 6900000) throw new Error(`Test B Failed: Expected Balance 6,900,000, got ${balanceB}`);
  if (!budgetUsageB.isOver) throw new Error(`Test B Failed: Expected isOver to be true`);
  if (budgetUsageB.overAmount !== 100000) throw new Error(`Test B Failed: Expected Over Amount 100,000, got ${budgetUsageB.overAmount}`);
  if (budgetUsageB.status !== 'exceeded') throw new Error(`Test B Failed: Expected status "exceeded", got ${budgetUsageB.status}`);
  console.log('✓ TEST SET B PASSED: Expense 3.1M, Balance 6.9M, Over 100K, Status Exceeded');

  // --- TEST SET C ---
  console.log('\n--- TEST SET C: Category Budget Alert ---');
  const catExpenseNov = calculateMonthlyCategoryExpense(testSetA, 2026, 11);
  const foodSpent1 = catExpenseNov['food'] || 0;
  const foodUsage1 = calculateBudgetUsage(foodSpent1, 800000);

  if (foodSpent1 !== 700000) throw new Error(`Test C Failed: Expected Food Spent 700,000, got ${foodSpent1}`);
  if (foodUsage1.percentage !== 87.5) throw new Error(`Test C Failed: Expected Food Percentage 87.5%, got ${foodUsage1.percentage}%`);
  if (foodUsage1.status !== 'warning') throw new Error(`Test C Failed: Expected Food Status "warning"`);

  // Add extra 200k food expense
  const testSetC: Transaction[] = [
    ...testSetA,
    {
      id: 'tx-6',
      type: 'expense',
      amount: 200000,
      categoryId: 'food',
      categoryName: 'Ăn uống',
      date: '2026-11-20',
      formattedTime: '20/11/2026',
    },
  ];
  const catExpenseNov2 = calculateMonthlyCategoryExpense(testSetC, 2026, 11);
  const foodSpent2 = catExpenseNov2['food'] || 0;
  const foodUsage2 = calculateBudgetUsage(foodSpent2, 800000);

  if (foodSpent2 !== 900000) throw new Error(`Test C Failed: Expected Food Spent 900,000, got ${foodSpent2}`);
  if (foodUsage2.percentage !== 112.5) throw new Error(`Test C Failed: Expected Food Percentage 112.5%, got ${foodUsage2.percentage}%`);
  if (foodUsage2.status !== 'exceeded') throw new Error(`Test C Failed: Expected Food Status "exceeded"`);
  console.log('✓ TEST SET C PASSED: Food Budget 800K, Spent 900K (112.5%), Over 100K, Status Exceeded');

  // --- TEST SET D ---
  console.log('\n--- TEST SET D: Month & Year Transition Filtering ---');
  const testSetD: Transaction[] = [
    ...testSetA,
    {
      id: 'tx-dec',
      type: 'income',
      amount: 12000000,
      categoryId: 'salary',
      categoryName: 'Lương',
      date: '2026-12-01',
      formattedTime: '01/12/2026',
    },
    {
      id: 'tx-dec-exp',
      type: 'expense',
      amount: 4000000,
      categoryId: 'rent',
      categoryName: 'Tiền trọ',
      date: '2026-12-05',
      formattedTime: '05/12/2026',
    },
    {
      id: 'tx-jan2027',
      type: 'income',
      amount: 15000000,
      categoryId: 'salary',
      categoryName: 'Lương',
      date: '2027-01-01',
      formattedTime: '01/01/2027',
    },
  ];

  const novInc = calculateMonthlyIncome(testSetD, 2026, 11);
  const decInc = calculateMonthlyIncome(testSetD, 2026, 12);
  const jan2027Inc = calculateMonthlyIncome(testSetD, 2027, 1);
  const yearly2026Data = calculateYearlyChartData(testSetD, 2026);

  if (novInc !== 10000000) throw new Error(`Test D Failed: Nov 2026 Income expected 10M, got ${novInc}`);
  if (decInc !== 12000000) throw new Error(`Test D Failed: Dec 2026 Income expected 12M, got ${decInc}`);
  if (jan2027Inc !== 15000000) throw new Error(`Test D Failed: Jan 2027 Income expected 15M, got ${jan2027Inc}`);

  const totalYear2026Income = yearly2026Data.reduce((s, item) => s + item.income, 0);
  if (totalYear2026Income !== 22000000) throw new Error(`Test D Failed: 2026 Yearly Income expected 22M, got ${totalYear2026Income}`);
  console.log('✓ TEST SET D PASSED: Isolated month totals (Nov 10M, Dec 12M, Jan 2027 15M), 2026 Yearly Income 22M');

  // --- TEST SET E ---
  console.log('\n--- TEST SET E: Currency Formatting & Updates ---');
  if (formatCurrency(7100000) !== '7.100.000 đ') throw new Error(`Test E Failed: Format Currency positive`);
  if (formatCurrency(-2900000, true) !== '-2.900.000 đ') throw new Error(`Test E Failed: Format Currency negative`);
  if (formatCurrency(10000000, true) !== '+10.000.000 đ') throw new Error(`Test E Failed: Format Currency positive with sign`);
  console.log('✓ TEST SET E PASSED: Format Currency outputs exact Vietnamese Dong strings');

  console.log('\n====================================================');
  console.log('🎉 ALL PERSON 3 MATHEMATICAL & INTEGRATION TESTS PASSED!');
  console.log('====================================================');
}

runPerson3Tests();
