// Finance Calendar Component
// Displays bill due dates, loan payments, income, and expenses by month

import React from 'react';
import { IndianRupee } from 'lucide-react';

export interface BillRecord {
  id: string;
  name: string;
  category: string;
  amountDue: number;
  dueDate: string; // YYYY-MM-DD
  recurrence: 'monthly' | 'quarterly' | 'annual' | 'one_time';
  paymentStatus: 'upcoming' | 'partial' | 'paid' | 'overdue';
  paidDate?: string;
  reminderLeadTime: number;
  reference?: string;
  notes?: string;
}

export interface LoanPayment {
  id: string;
  date: string; // YYYY-MM-DD
  openingPrincipal: number;
  principalPaid: number;
  interestPaid: number;
  fees: number;
  closingPrincipal: number;
  paymentReference?: string;
  notes?: string;
  totalCashPaid?: number;
}

export interface CalendarDayProps {
  date: string; // YYYY-MM-DD
  events: Array<{
    title: string;
    description: string;
    type: 'bill' | 'loan_payment' | 'income' | 'expense';
    amount?: number;
  }>;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const FinanceCalendar: React.FC = ({
  billRecords,
  loanPayments,
  incomeRecords,
  expenseRecords,
}: {
  billRecords?: BillRecord[];
  loanPayments?: LoanPayment[];
  incomeRecords?: any[];
  expenseRecords?: any[];
}) => {
  // Compute calendar data
  const calendarEvents = React.useMemo(() => {
    const events: Array<{
      date: string;
      title: string;
      description: string;
      type: 'bill' | 'loan_payment' | 'income' | 'expense';
      amount?: number;
    }> = [];

    // Add bill due dates
    if (billRecords) {
      billRecords.forEach((bill) => {
        if (bill.dueDate) {
          events.push({
            date: bill.dueDate,
            title: bill.name,
            description: `${bill.amountDue} due`,
            type: 'bill',
            amount: bill.amountDue,
          });
        }
      });
    }

    // Add loan payment dates
    if (loanPayments) {
      loanPayments.forEach((payment) => {
        if (payment.date) {
          events.push({
            date: payment.date,
            title: `Loan Payment`,
            description: `${payment.principalPaid} principal, ${payment.interestPaid} interest`,
            type: 'loan_payment',
            amount: payment.totalCashPaid,
          });
        }
      });
    }

    // Add income dates
    if (incomeRecords) {
      incomeRecords.forEach((record) => {
        if (record.actualDate) {
          events.push({
            date: record.actualDate,
            title: `Salary: ${record.source}`,
            description: `${record.actualAmount} received`,
            type: 'income',
            amount: record.actualAmount,
          });
        }
      });
    }

    // Add expense dates
    if (expenseRecords) {
      expenseRecords.forEach((record) => {
        if (record.date) {
          events.push({
            date: record.date,
            title: record.description.substring(0, 25),
            description: `${record.amount} - ${record.category}`,
            type: 'expense',
            amount: record.amount,
          });
        }
      });
    }

    return events.sort((a, b) => a.date.localeCompare(b.date));
  }, [billRecords, loanPayments, incomeRecords, expenseRecords]);

  // Get unique dates and group by month
  const uniqueDates = React.useMemo(() => {
    return [...new Set(calendarEvents.map((e) => e.date))];
  }, [calendarEvents]);

  const eventsByMonth = React.useMemo(() => {
    return uniqueDates.reduce((acc, date) => {
      const month = date.substring(0, 7); // YYYY-MM
      if (!acc[month]) acc[month] = [];
      acc[month].push(date);
      return acc;
    }, {} as Record<string, string[]>);
  }, [uniqueDates]);

  // Current month state
  const [currentMonth, setCurrentMonth] = React.useState<string>(
    new Date().toISOString().substring(0, 7)
  );

  // Helper functions
  const daysInMonth = (month: string) => {
    const [year, monthNum] = month.split('-').map(Number);
    return new Date(year, monthNum, 0).getDate();
  };

  const firstDayOfMonth = (month: string) => {
    const [year, monthNum] = month.split('-').map(Number);
    return new Date(year, monthNum - 1, 1).getDay();
  };

  const prevMonth = () => {
    const [year, monthNum] = currentMonth.split('-').map(Number);
    const newMonth = monthNum === 1 ? 12 : monthNum - 1;
    const newYear = monthNum === 1 ? year - 1 : year;
    setCurrentMonth(`${newYear}-${newMonth <= 9 ? '0' + newMonth : newMonth}`);
  };

  const nextMonth = () => {
    const [year, monthNum] = currentMonth.split('-').map(Number);
    const newMonth = monthNum === 12 ? 1 : monthNum + 1;
    const newYear = monthNum === 12 ? year + 1 : year;
    setCurrentMonth(`${newYear}-${newMonth <= 9 ? '0' + newMonth : newMonth}`);
  };

  const isCurrentMonthDate = (
    date: string,
    month: string
  ): boolean => date.substring(0, 7) === month;

  const isToday = (date: string): boolean => {
    const today = new Date().toISOString().substring(0, 10);
    return date === today;
  };

  // Render calendar day
  const renderDay = (
    day: number,
    month: string,
    eventsForDay: any[]
  ): React.ReactNode => {
    const dayDate = `${month}-${day <= 9 ? '0' + day : day}`;
    const isCurrent = isCurrentMonthDate(dayDate, month);
    const today = isToday(dayDate);

    return (
      <div
        className={`border rounded-sm ${isCurrent && today ? 'bg-emerald-500/20 text-emerald-400' : isCurrent ? 'bg-slate-950/30 text-slate-300 hover:bg-slate-800/50' : 'bg-slate-950/50'}`}
      >
        <p className="text-[10px] font-medium">{day}</p>
        {eventsForDay.length > 0 && (
          <div className="mt-1 text-[8px]">
            {eventsForDay.map((e, i) => (
              <span
                key={i}
                className="block text-[1] text-emerald-400 hover:underline text-[XS]"
              >
                {e.title.substring(0, 12)}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 items-center gap-2 text-xs font-medium text-slate-400 border-b border-slate-700 pb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={prevMonth}
          className="rounded-lg border border-slate-600 bg-slate-950/20 px-2 py-1 text-slate-300 hover:bg-slate-800"
        >
          ← Prev
        </button>
        <button
          onClick={nextMonth}
          className="rounded-lg border border-slate-600 bg-slate-950/20 px-2 py-1 text-slate-300 hover:bg-slate-800"
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty days before month starts */}
        {[...Array(firstDayOfMonth(currentMonth)).keys()].map(
          (_, i) => (
            <div key={i} className="border rounded-sm bg-slate-950/50"></div>
          )
        )}

        {/* Day numbers with events */}
        {[...Array(daysInMonth(currentMonth)).keys()].map((day) => {
          const dayNumber = day + 1;
          const dayDate = `${currentMonth}-${dayNumber <= 9 ? '0' + dayNumber : dayNumber}`;
          const eventsForDay = calendarEvents.filter(
            (e: any) => e.date === dayDate
          );

          return renderDay(dayNumber, currentMonth, eventsForDay);
        })}

        {/* Empty days after month ends */}
        {[...Array(42 - daysInMonth(currentMonth) - firstDayOfMonth(currentMonth)).keys()].map(
          (_, i) => (
            <div
              key={i}
              className="border rounded-sm bg-slate-950/50"
            ></div>
          )
        )}
      </div>
    </div>
  );
};

export default FinanceCalendar;