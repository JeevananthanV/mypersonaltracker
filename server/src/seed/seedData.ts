import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  TransactionModel,
  LoanPaymentModel,
  LoanAccountModel,
  SkillModel,
  TaskModel,
  HabitModel,
  FitnessLogModel,
  ProjectModel,
  WeeklyReviewModel,
  IdeaModel,
  ProfileModel
} from '../models/index.js';
import { getMongoConnectionConfig } from '../config/db.js';

dotenv.config();

export const seedDatabase = async () => {
  const { uri, dbName } = getMongoConnectionConfig();
  
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(uri, { dbName });
      console.log('Connected to MongoDB for initial check/seed...');
    } catch (err: any) {
      console.warn('Skipping DB auto-seed (MongoDB not reachable). Fallback mode active.');
      return;
    }
  }

  // WIPE ANY PREVIOUS TEST TRANSACTIONS / TEST PAYMENTS
  await TransactionModel.deleteMany({});
  await LoanPaymentModel.deleteMany({});
  await FitnessLogModel.deleteMany({});
  await WeeklyReviewModel.deleteMany({});
  console.log('🧹 Cleaned all test transactions, payments, and logs for real-time user input.');

  // Ensure Profile exists
  const profileCount = await ProfileModel.countDocuments();
  if (profileCount === 0) {
    await ProfileModel.create({
      userName: 'Jeeva',
      salary: 34000,
      initialLoanPrincipal: 240000,
      weightKg: 57,
      heightCm: 160,
      careerFocus: 'AI/ML Engineer'
    });
  }

  // Ensure the 3 Separate Real Loans exist
  const loanCount = await LoanAccountModel.countDocuments();
  if (loanCount === 0) {
    await LoanAccountModel.create([
      {
        name: 'Loan 1 (₹1,00,000)',
        originalPrincipal: 100000,
        currentPrincipal: 100000,
        interestPaidTotal: 0,
        principalPaidTotal: 0,
        estimatedEmi: 8000,
        lenderNotes: 'First ₹1 Lakh tranche. When closed, monthly payment decreases by ₹2,000.',
        status: 'active'
      },
      {
        name: 'Loan 2 (₹1,00,000)',
        originalPrincipal: 100000,
        currentPrincipal: 100000,
        interestPaidTotal: 0,
        principalPaidTotal: 0,
        estimatedEmi: 8000,
        lenderNotes: 'Second ₹1 Lakh tranche.',
        status: 'active'
      },
      {
        name: 'Loan 3 (₹40,000)',
        originalPrincipal: 40000,
        currentPrincipal: 40000,
        interestPaidTotal: 0,
        principalPaidTotal: 0,
        estimatedEmi: 3500,
        lenderNotes: '₹40k balance loan.',
        status: 'active'
      }
    ]);
    console.log('✅ Created 3 separate real loans: ₹1L + ₹1L + ₹40k');
  }

  console.log('✨ System is 100% clean and ready for real-time data input!');
};

if (process.argv[1]?.includes('seedData')) {
  seedDatabase().then(() => {
    console.log('Setup finished.');
    process.exit(0);
  });
}
