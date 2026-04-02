import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { Expense } from '../models/expense.model.js';
import Income from '../models/income.model.js';
import { User } from '../models/User.model.js';
import {
  buildCategoryHabitInsights,
  buildSpendingAwarenessSuggestions,
  computeGhostMetrics,
  ExpenseRow,
} from '../services/ghost.service.js';
import {
  buildPeriodWindows,
  parseExpenseDate,
  type DatedExpense,
} from '../services/ghostPeriod.service.js';

export async function getGhostOverview(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const uid = req.user!.id;
    const [expenses, incomes, user] = await Promise.all([
      Expense.find({ user: uid }).lean(),
      Income.find({ user: uid }).lean(),
      User.findById(uid).select('homeCurrency').lean(),
    ]);

    const expenseRows: ExpenseRow[] = expenses.map((e) => ({
      amount: e.amount,
      category: e.category,
    }));

    const datedExpenses: DatedExpense[] = expenses.map((e) => ({
      amount: e.amount,
      category: e.category,
      date: parseExpenseDate(e.date),
    }));

    const incomeRows = incomes.map((i) => ({ amount: i.amount }));

    const metrics = computeGhostMetrics(expenseRows, incomeRows);
    const currency = user?.homeCurrency || 'CAD';
    const spendingWindows = buildPeriodWindows(datedExpenses, new Date());
    const suggestions = buildSpendingAwarenessSuggestions(spendingWindows, currency);
    const categoryInsights = buildCategoryHabitInsights(metrics, currency, spendingWindows);

    res.json({
      currency,
      realBalance: metrics.realBalance,
      ghostBalance: metrics.ghostBalance,
      totalIncome: metrics.totalIncome,
      totalExpense: metrics.totalExpense,
      ghostExpenseTotal: metrics.ghostExpenseTotal,
      totalGap: metrics.totalGap,
      gapByCategory: metrics.gapByCategory,
      suggestions,
      categoryInsights,
      spendingWindows,
    });
  } catch (err) {
    next(err);
  }
}
