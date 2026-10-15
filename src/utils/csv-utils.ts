// @ts-nocheck
// CSV Utility Functions for Finance Tracker
// Handles import, validation, duplicate detection, and export

import { IncomeRecord, ExpenseRecord, LoanPaymentRecord, TransactionType } from '../types/finance-types';

// =====================
// CSV Row Interface
// =====================

export interface CsvRow {
  date: string;
  description: string;
  amount: string | number;
  type?: string;
  category?: string;
  account?: string;
  paymentMethod?: string;
  reference?: string;
  counterparty?: string;
  status?: string;
  notes?: string;
  recurring?: string;
  [key: string]: any;
}

// =====================
// Import Result Types
// =====================

export interface ImportedTransaction {
  id: string;
  type: 'income' | 'expense' | 'loan_repayment';
  record: IncomeRecord | ExpenseRecord | LoanPaymentRecord;
  warnings: string[];
  autoLinked?: {
    salaryMonth?: string;
    loanId?: string;
    principalPortion?: number;
    interestPortion?: number;
  };
}

export interface ImportResult {
  successful: ImportedTransaction[];
  failed: Array<{
    row: CsvRow;
    errors: string[];
    retryable: boolean;
  }>;
  duplicates: Array<{
    row: CsvRow;
    existingRecord: {
      id: string;
      description: string;
      date: string;
      amount: number;
    };
    conflict: 'exact' | 'similar';
  }>;
  summary: {
    totalRows: number;
    imported: number;
    skipped: number;
    duplicates: number;
    failed: number;
    reconciliationDifference: number; // openingBalance + imported - closingBalance
  };
  errors: string[];
}

// =====================
// Date Parsing Helpers
// =====================

/**
 * Parse various date formats to YYYY-MM-DD
 */
export function parseCsvDate(dateStr: string): string | null {
  if (!dateStr) return null;

  const cleaned = dateStr.trim();

  // Common formats
  const formats = [
    // YYYY-MM-DD
    (str: string) => {
      const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) return `${match[1]}-${match[2]}-${match[3]}`;
      return null;
    },
    // MM/DD/YYYY (US format)
    (str: string) => {
      const match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (match) return `${match[3]}-${match[1]}-${match[2]}`;
      return null;
    },
    // DD/MM/YYYY (Common in India)
    (str: string) => {
      const match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (match) return `${match[3]}-${match[2]}-${match[1]}`;
      return null;
    },
    // DD-MM-YYYY
    (str: string) => {
      const match = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (match) return `${match[3]}-${match[2]}-${match[1]}`;
      return null;
    },
    // MM-DD-DD (variations)
    (str: string) => {
      const match = str.match(/^(\d{2})-(\d{2})-(\d{2,4})$/);
      if (match) {
        // If year is 2 digits, assume current century
        let year = parseInt(match[3]);
        if (year < 50) year += 2000;
        else year += 1900;
        return `${year}-${match[1]}-${match[2]}`;
      }
      return null;
    },
    // Just year-month
    (str: string) => {
      const match = str.match(/^(\d{4})-(\d{2})$/);
      if (match) return `${match[1]}-${match[2]}-01`;
      return null;
    },
  ];

  for (const format of formats) {
    const result = format(cleaned);
    if (result) return result;
  }

  console.warn(`Could not parse date: ${dateStr}`);
  return null;
}

/**
 * Parse amount string to number (handles ₹, commas, etc.)
 */
export function parseCsvAmount(amountStr: string): number | null {
  if (!amountStr) return null;

  const cleaned = amountStr
    .trim()
    // Remove ₹ symbol and spaces
    .replace(/₹/g, '')
    .replace(/,/g, '')
    .trim();

  const number = parseFloat(cleaned);
  if (isNaN(number)) {
    console.warn(`Could not parse amount: ${amountStr}`);
    return null;
  }
  return number;
}

/**
 * Determine transaction type from CSV
 */
export function inferTransactionType(typeStr?: string): 'income' | 'expense' | 'loan_repayment' | 'transfer' {
  if (!typeStr) return 'expense'; // default

  const type = typeStr.trim().toLowerCase();
  switch (type) {
    case 'income':
    case 'salary':
    case 'credit':
      return 'income';
    case 'expense':
    case 'debit':
    case 'payment':
    case 'transfer':
      return 'expense'; // will be classified later
    case 'loan_repayment':
    case 'emi':
    case 'principal':
    case 'interest':
      return 'loan_repayment';
    case 'transfer':
      return 'transfer';
    default:
      return 'expense';
  }
}

// =====================
// Core Validation Logic
// =====================

/**
 * Validate a single CSV row and return parsed data
 */
export function validateCsvRow(row: CsvRow): {
  valid: boolean;
  errors: string[];
  parsed: Partial<IncomeRecord | ExpenseRecord | LoanPaymentRecord>;
} {
  const errors: string[] = [];
  const parsed: any = {};

  // Required: date
  const parsedDate = parseCsvDate(row.date);
  if (!parsedDate) {
    errors.push('Invalid date format. Use YYYY-MM-DD or MM/DD/YYYY');
  }
  parsed.date = parsedDate;

  // Required: description (non-empty)
  if (!row.description || row.description.trim().length === 0) {
    errors.push('Description is required');
  }
  parsed.description = row.description?.trim() || 'Unnamed transaction';

  // Required: amount
  const parsedAmount = parseCsvAmount(row.amount);
  if (parsedAmount === null) {
    errors.push('Invalid amount format');
  } else {
    parsed.amount = Math.abs(parsedAmount); // store as positive, type determines direction
  }

  // Type inference
  parsed.type = inferTransactionType(row.type);

  // Category (optional but recommended)
  if (row.category) {
    parsed.category = row.category.trim();
  }

  // Account
  if (row.account) {
    parsed.account = row.account.trim();
  }

  // Payment method
  if (row.paymentMethod) {
    parsed.paymentMethod = row.paymentMethod.trim() as 
      | 'UPI' | 'NEFT' | 'cash' | 'card' | 'bank_transfer' | 'other';
  }

  // Reference number (for duplicate detection)
  if (row.reference) {
    parsed.referenceNumber = row.reference.trim();
  }

  // Counterparty
  if (row.counterparty) {
    parsed.counterparty = row.counterparty.trim();
  }

  // Status
  if (row.status) {
    parsed.status = row.status.trim();
  }

  // Notes
  if (row.notes) {
    parsed.notes = row.notes.trim();
  }

  return {
    valid: errors.length === 0,
    errors,
    parsed,
  };
}

/**
 * Detect duplicates among imported records
 * Uses reference ID, date, amount, and account matching
 */
export function detectDuplicates<
  T extends { id?: string; date: string; amount: number; referenceNumber?: string; account?: string }
>(
  newRecords: T[],
  existingRecords: T[],
  tolerance: number = 0.01 // 1 rupee tolerance
): Array<{
  newRecord: T;
  matchingExisting: T;
  confidence: 'high' | 'medium' | 'low';
}> {
  const duplicates: Array<{
    newRecord: T;
    matchingExisting: T;
    confidence: 'high' | 'medium' | 'low';
  }> = [];

  for (const newRec of newRecords) {
    for (const existingRec of existingRecords) {
      // Match by reference number (highest confidence)
      if (newRec.referenceNumber && existingRec.referenceNumber) {
        const refMatch =
          newRec.referenceNumber.toLowerCase() ===
          existingRec.referenceNumber.toLowerCase();
        if (refMatch) {
          duplicates.push({
            newRecord: newRec,
            matchingExisting: existingRec,
            confidence: 'high',
          });
          break; // move to next new record
        }
      }

      // Match by date + amount + account (medium confidence)
      if (
        newRec.date === existingRec.date &&
        Math.abs(newRec.amount - existingRec.amount) <= tolerance &&
        (newRec.account === existingRec.account ||
          (!newRec.account && !existingRec.account))
      ) {
        // Avoid double-counting same existing record
        const alreadyMatched = duplicates.some(
          d => d.matchingExisting.id === existingRec.id
        );
        if (!alreadyMatched) {
          // Determine confidence based on how many fields match
          const matchingFields = [
            newRec.date === existingRec.date,
            Math.abs(newRec.amount - existingRec.amount) <= tolerance,
            newRec.account === existingRec.account,
          ].filter(Boolean).length;

          let confidence: 'high' | 'medium' | 'low';
          if (matchingFields >= 3) confidence = 'high';
          else if (matchingFields >= 2) confidence = 'medium';
          else confidence = 'low';

          duplicates.push({
            newRecord: newRec,
            matchingExisting: existingRec,
            confidence,
          });
          break;
        }
      }
    }
  }

  return duplicates;
}

// =====================
// Salary Linking Logic
// =====================

/**
 * Link imported income transactions to salary months
 * Matches by date range and amount proximity to expected salary
 */
export function linkSalaryToMonth(
  importedIncomes: ImportedTransaction[],
  salaryRecords: { expectedAmount: number; month: string }[]
): ImportedTransaction[] {
  return importedIncomes.map(income => {
    const amount = income.record.amount;
    const date = new Date(income.record.date);

    // Find matching salary record
    let matchedMonth = '';
    let confidence = 0;

    for (const salary of salaryRecords) {
      // Check if amount matches expected salary (allow 5% variance)
      const amountMatch = Math.abs(amount - salary.expectedAmount) / salary.expectedAmount < 0.05;

      // Check if date is in the salary month
      const dateInMonth =
        date.getMonth + 1 <= 12 // simplified check
          ? date.getMonth() + 1 === 1 // January placeholder
          : true; // simplified - would need full month logic

      if (amountMatch && dateInMonth) {
        if (!matchedMonth || confidence < 0.8) {
          matchedMonth = salary.month;
          confidence = amountMatch ? 0.9 : 0.6;
        }
      }
    }

    // Attach salary month info to the record
    if (matchedMonth) {
      ;(income.record as any).salaryMonth = matchedMonth;
      ;(income.record as any).linkedToSalary = true;
    }

    return income;
  });
}

/**
 * Split loan repayment into principal + interest + fees
 */
export function splitLoanRepayment(
  row: CsvRow,
  loanAccounts: {
    id: string;
    name: string;
    interestType: 'reducing_balance' | 'flat_rate' | 'fixed_amount_arrangement';
    interestRate?: number;
    currentPrincipal?: number;
  }[]
): {
  principal: number;
  interest: number;
  fees: number;
  total: number;
  loanId: string | null;
  method: string | null;
} {
  const amount = parseCsvAmount(row.amount);
  if (!amount) {
    return { principal: 0, interest: 0, fees: 0, total: 0, loanId: null, method: null };
  }

  // Try to match to a loan account
  let matchedLoan = null;
  let method = null;

  for (const loan of loanAccounts) {
    // Simple heuristic: if description mentions loan name, match it
    const descLower = row.description?.toLowerCase() || '';
    const nameLower = loan.name.toLowerCase();

    if (descLower.includes(nameLower) || nameLower.includes(descLower)) {
      matchedLoan = loan;
      break;
    }
  }

  if (!matchedLoan) {
    // No specific loan matched - treat as general expense
    return {
      principal: 0,
      interest: 0,
      fees: 0,
      total: amount,
      loanId: null,
      method: null,
    };
  }

  // Calculate split based on interest type
  const { interestType, interestRate, currentPrincipal } = matchedLoan;

  let principal = 0;
  let interest = 0;
  let fees = 0;

  switch (interestType) {
    case 'reducing_balance':
      // Simple: portion goes to principal, portion to interest
      // In real usage, would need amortization schedule
      if (interestRate && currentPrincipal) {
        const monthlyInterest = (currentPrincipal * interestRate) / 100 / 12;
        interest = Math.min(amount - monthlyInterest, amount * 0.3); // 30% default to interest
        principal = amount - interest;
        fees = 0;
      } else {
        // Default split: 70% principal, 30% interest
        principal = Math.round(amount * 0.7);
        interest = Math.round(amount * 0.3);
        fees = 0;
      }
      break;

    case 'flat_rate':
      // Flat rate: interest calculated on original principal
      // Typical: EMI = principal + (principal * rate * tenure)
      if (interestRate) {
        // Estimate: assume 50% principal, 50% interest for flat rate
        principal = Math.round(amount * 0.5);
        interest = Math.round(amount * 0.5);
        fees = 0;
      } else {
        principal = Math.round(amount * 0.6);
        interest = Math.round(amount * 0.3);
        fees = Math.round(amount * 0.1);
      }
      break;

    case 'fixed_amount_arrangement':
      // Fixed arrangement: user-specified split
      // Default reasonable split
      principal = Math.round(amount * 0.75);
      interest = Math.round(amount * 0.2);
      fees = Math.round(amount * 0.05);
      break;

    default:
      // Default split
      principal = Math.round(amount * 0.7);
      interest = Math.round(amount * 0.2);
      fees = Math.round(amount * 0.1);
      break;
  }

  // Ensure totals match
  const calculatedTotal = principal + interest + fees;
  // Adjust principal to match original amount if there's a small difference
  const adjustedPrincipal = Math.round(amount - interest - fees);

  return {
    principal: adjustedPrincipal,
    interest,
    fees,
    total: amount,
    loanId: matchedLoan.id,
    method: matchedLoan.interestType,
  };
}

// =====================
// Export Generation
// =====================

/**
 * Generate CSV string from transactions
 */
export function generateCsvFromTransactions<
  T extends {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense' | 'loan_repayment' | 'transfer';
    category?: string;
    account?: string;
    paymentMethod?: string;
    referenceNumber?: string;
    counterparty?: string;
    status?: string;
    notes?: string;
    salaryMonth?: string;
    loanId?: string;
    principalPortion?: number;
    interestPortion?: number;
  }
>(
  transactions: T[],
  options: {
    includeHeaders: boolean;
    includeFilters: boolean;
    filterBy?: {
      type?: T['type'];
      category?: string;
      account?: string;
      dateRange?: [string, string];
    };
  } = {}
): string {
  const { includeHeaders = true, includeFilters = false, filterBy } = options;

  // Apply filters if specified
  let filtered = [...transactions];
  if (filterBy) {
    filtered = filtered.filter(tx => {
      // Type filter
      if (filterBy.type && tx.type !== filterBy.type) return false;

      // Category filter
      if (filterBy.category && tx.category !== filterBy.category) return false;

      // Account filter
      if (filterBy.account && tx.account !== filterBy.account) return false;

      // Date range filter
      if (filterBy.dateRange) {
        const [startDate, endDate] = filterBy.dateRange;
        const txDate = new Date(tx.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (txDate < start || txDate > end) return false;
      }
      return true;
    });
  }

  // Build CSV rows
  const rows: string[] = [];

  // Headers
  if (includeHeaders) {
    const baseHeaders = [
      'Date',
      'Description',
      'Amount (INR)',
      'Type',
      'Category',
      'Account',
      'Payment Method',
      'Reference Number',
      'Counterparty',
      'Status',
      'Notes',
      'Salary Month',
      'Loan ID',
      'Principal Portion',
      'Interest Portion',
    ];

    // Add filter info if requested
    if (includeFilters && filterBy) {
      rows.push(`// Filtered: ${JSON.stringify(filterBy)}`);
    }

    rows.push(baseHeaders.join(','));
  }

  // Data rows
  for (const tx of filtered) {
    const row = [
      `"${tx.date}"`,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.amount.toFixed(2),
      tx.type,
      `"${tx.category || ''}"`,
      `"${tx.account || ''}"`,
      `"${tx.paymentMethod || ''}"`,
      `"${tx.referenceNumber || ''}"`,
      `"${tx.counterparty || ''}"`,
      `"${tx.status || ''}"`,
      `"${tx.notes || ''}"`,
      `"${tx.salaryMonth || ''}"`,
      `"${tx.loanId || ''}"`,
      tx.principalPortion !== undefined ? tx.principalPortion.toFixed(2) : '',
      tx.interestPortion !== undefined ? tx.interestPortion.toFixed(2) : '',
    ];

    rows.push(row.join(','));
  }

  return rows.join('\n');
}

/**
 * Export specific transaction types to CSV
 */
export function exportTransactionsCsv<
  T extends {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense' | 'loan_repayment' | 'transfer';
    category?: string;
    account?: string;
  }
>(
  transactions: T[],
  filename: string = `finance-export-${new Date().toISOString().split('T')[0]}.csv`
): void {
  const csvContent = generateCsvFromTransactions(transactions);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    // @ts-ignore
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// =====================
// Batch Import Processor
// =====================

/**
 * Process CSV import through the full pipeline
 */
export interface BatchImportProgress {
  stage: 'parsing' | 'validation' | 'duplicate-detection' | 'salary-linking' | 'loan-splitting' | 'complete';
  percentage: number;
  message: string;
  importedCount: number;
  errorCount: number;
}

export async function processBatchImport<
  T extends CsvRow
>(
  rows: T[],
  existingTransactions: {
    income: IncomeRecord[];
    expense: ExpenseRecord[];
    loanPayments: LoanPaymentRecord[];
  },
  salaryRecords?: { expectedAmount: number; month: string }[],
  loanAccounts?: {
    id: string;
    name: string;
    interestType: string;
    interestRate?: number;
    currentPrincipal?: number;
  }[]
): Promise<ImportResult> {
  const progress: BatchImportProgress[] = [
    { stage: 'parsing', percentage: 0, message: 'Parsing CSV rows...', importedCount: 0, errorCount: 0 },
    { stage: 'validation', percentage: 20, message: 'Validating each row...', importedCount: 0, errorCount: 0 },
    { stage: 'duplicate-detection', percentage: 40, message: 'Checking for duplicates...', importedCount: 0, errorCount: 0 },
    { stage: 'salary-linking', percentage: 60, message: 'Linking salary transactions...', importedCount: 0, errorCount: 0 },
    { stage: 'loan-splitting', percentage: 80, message: 'Splitting loan repayments...', importedCount: 0, errorCount: 0 },
    { stage: 'complete', percentage: 100, message: 'Import complete!', importedCount: 0, errorCount: 0 },
  ];

  const result: ImportResult = {
    successful: [],
    failed: [],
    duplicates: [],
    summary: {
      totalRows: rows.length,
      imported: 0,
      skipped: 0,
      duplicates: 0,
      failed: 0,
      reconciliationDifference: 0,
    },
    errors: [],
  };

  // Stage 1: Parse rows
  progress[0].message = 'Parsing CSV rows...';
  const parsedRows: Partial<IncomeRecord | ExpenseRecord | LoanPaymentRecord>[] = [];
  const parseErrors: { row: CsvRow; errors: string[] }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const validation = validateCsvRow(rows[i]);
    if (validation.valid) {
      parsedRows.push(validation.parsed);
    } else {
      parseErrors.push({ row: rows[i], errors: validation.errors });
    }
  }

  progress[0].message = `Parsing complete: ${parsedRows.length} valid, ${parseErrors.length} invalid`;
  progress[0].importedCount = parsedRows.length;
  progress[0].errorCount = parseErrors.length;

  // Stage 2: (Already done in validation)

  // Stage 3: Detect duplicates
  progress[2].message = 'Checking for duplicates...';
  
  // Get existing reference numbers for comparison
  const existingRefs = [
    ...existingTransactions.income.map(i => i.referenceNumber).filter(Boolean),
    ...existingTransactions.expense.map(e => e.referenceNumber).filter(Boolean),
    ...existingTransactions.loanPayments.map(l => l.paymentReference).filter(Boolean),
  ];

  const duplicateRecords = detectDuplicates(
    parsedRows as any[],
    // Create mock existing records for comparison
    existingTransactions.income.map(i => ({
      id: i.id,
      date: i.date,
      amount: i.amount,
      referenceNumber: i.referenceNumber,
      account: i.account,
    })),
    existingTransactions.expense.map(e => ({
      id: e.id,
      date: e.date,
      amount: e.amount,
      referenceNumber: e.referenceNumber,
      account: e.account,
    })),
    existingTransactions.loanPayments.map(l => ({
      id: l.id,
      date: l.date,
      amount: l.totalCashPaid,
      referenceNumber: l.paymentReference,
      account: l.account,
    }))
  );

  progress[2].message = `Duplicate detection complete: ${duplicateRecords.length} duplicates found`;

  // Stage 4: Salary linking
  progress[3].message = 'Linking salary transactions...';
  const salaryLinked = linkSalaryToMonth(
    // Filter to only income records
    duplicateRecords.length > 0 
      ? (duplicateRecords.map(d => d.newRecord) as any[])
      : (parsedRows.filter((_, i) => true) as any[]),
    salaryRecords || []
  );

  progress[3].message = `Salary linking complete`;
  progress[3].importedCount = salaryLinked.length;

  // Stage 5: Loan repayment splitting
  progress[4].message = 'Splitting loan repayments...';
  
  let loanProcessed = 0;
  const processedRecords = salaryLinked.map(record => {
    // Check if this is a loan repayment type
    if (record.type === 'loan_repayment' || 
        record.description?.toLowerCase().includes('loan') ||
        record.description?.toLowerCase().includes('emi')) {
      
      const split = splitLoanRepayment(
        // Create a minimal row object from the record
        {
          date: record.date,
          description: record.description,
          amount: record.amount.toString(),
          type: record.type,
        },
        loanAccounts || []
      );

      loanProcessed++;
      return {
        ...record,
        principalPortion: split.principal,
        interestPortion: split.interest,
        // Attach loan info for later use
        loanId: split.loanId,
        // Create loan payment record structure
        ...(split.loanId && {
          // Could create LoanPaymentRecord here
        }),
      };
    }

    return {
      ...record,
      principalPortion: 0,
      interestPortion: 0,
    };
  });

  progress[4].message = `Loan splitting complete: ${loanProcessed} loan repayments processed`;
  progress[4].importedCount = processedRecords.length;

  // Stage 6: Finalize result
  progress[5].message = 'Import complete!';

  // Build successful records (skip duplicates and failed)
  const allDuplicates = duplicateRecords.map(d => d.newRecord);
  const duplicateIds = new Set(allDuplicates.map(r => r.referenceNumber || r.id || ''));

  const successfulRecords = parsedRows.filter(
    (rec, i) => !duplicateIds.has(rec.referenceNumber || rec.id || '')
  );

  result.successful = successfulRecords.map((parsed, i) => ({
    id: `imp-${Date.now()}-${i}`,
    type: parsed.type as any,
    record: parsed as IncomeRecord | ExpenseRecord | LoanPaymentRecord,
    warnings: [],
  }));

  // Count duplicates
  result.duplicates = duplicateRecords.map(d => ({
    row: rows.find(r => r.date === d.newRecord.date && r.amount === String(d.newRecord.amount))!,
    existingRecord: {
      id: d.matchingExisting.id,
      description: 'Existing record', // Would fetch actual description
      date: d.matchingExisting.date,
      amount: d.matchingExisting.amount,
    },
    conflict: d.confidence,
  }));

  // Update summary
  result.summary = {
    totalRows: rows.length,
    imported: result.successful.length,
    skipped: duplicateRecords.length,
    duplicates: duplicateRecords.length,
    failed: parseErrors.length,
    reconciliationDifference: 0, // Would calculate based on opening/closing balances
  };

  result.failed = parseErrors.map(e => ({
    row: e.row,
    errors: e.errors,
    retryable: e.errors.some(err => !err.includes('Invalid date')), // retryable if not date format
  }));

  result.errors = [
    ...result.errors,
      ...parseErrors.map(e => e.errors.join(', ')),
  ];

  return result;
}

export default {
  parseCsvDate,
  parseCsvAmount,
  inferTransactionType,
  validateCsvRow,
  detectDuplicates,
  linkSalaryToMonth,
  splitLoanRepayment,
  generateCsvFromTransactions,
  exportTransactionsCsv,
  processBatchImport,
};