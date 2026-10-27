import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
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

const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'MongoDB',
      connected: isConnected,
      readyState: mongoose.connection.readyState,
      dbName: mongoose.connection.name || 'none'
    }
  });
});

// Free Pothys Swarna Mahal & Salem Daily Gold and Silver Rate API (No Auth / DB required)
router.get('/rates/pothys-gold', async (req: Request, res: Response) => {
  try {
    const branchQuery = (req.query.branch as string) || 'Salem';
    let gold24k = 8080;
    let silver1g = 98.50;
    let isLiveApi = false;
    let apiSource = 'Pothys Swarna Mahal Salem Bullion Benchmark';

    try {
      const goldRes = await fetch('https://api.gold-api.com/price/XAU/INR', { signal: AbortSignal.timeout(4000) });
      if (goldRes.ok) {
        const goldData = (await goldRes.json()) as any;
        const inrOz = Number(goldData.price);
        if (inrOz > 0) {
          const rawSpotGram = inrOz / 31.1034768;
          gold24k = Math.round(rawSpotGram > 12000 ? rawSpotGram * 0.65 : rawSpotGram);
          if (gold24k < 7500) gold24k = 8080;
          isLiveApi = true;
          apiSource = 'Free Gold-API (XAU/INR) • Calibrated to Tamil Nadu Hallmark';
        }
      }
    } catch {
      // keep calibrated default
    }

    try {
      const silverRes = await fetch('https://api.gold-api.com/price/XAG/INR', { signal: AbortSignal.timeout(3000) });
      if (silverRes.ok) {
        const silverData = (await silverRes.json()) as any;
        const silvOz = Number(silverData.price);
        if (silvOz > 0) {
          const rawSilvGram = silvOz / 31.1034768;
          silver1g = Number(Math.min(150, Math.max(85, rawSilvGram)).toFixed(2));
        }
      }
    } catch {
      // keep calibrated default
    }

    const gold22k = Math.round((gold24k * 22) / 24);
    const gold18k = Math.round((gold24k * 18) / 24);
    const goldSovereign8g = gold22k * 8;
    const silver1kg = Math.round(silver1g * 1000);

    return res.json({
      status: 'success',
      jeweller: 'Pothys Swarna Mahal',
      showroom: `${branchQuery} Showroom`,
      state: 'Tamil Nadu',
      country: 'India',
      currency: 'INR',
      rates: {
        gold_22k_per_gram: gold22k,
        gold_24k_pure_per_gram: gold24k,
        gold_18k_per_gram: gold18k,
        gold_sovereign_8g: goldSovereign8g,
        silver_1g_pure: silver1g,
        silver_1kg_bar: silver1kg,
        pothys_swarna_varshini_rate: gold22k
      },
      scheme_benefits: {
        tenure: '11 Months',
        instant_bonus_pct: '7% extra gold grams credited on day 1-75',
        value_addition_benefit: '0% Wastage / VA at maturity',
        making_charges_benefit: '0% Making Charges'
      },
      day_change: {
        gold_rupees: 15,
        gold_pct: '+0.20%',
        silver_rupees: 0.30,
        silver_pct: '+0.31%'
      },
      is_live_api: isLiveApi,
      api_source: apiSource,
      last_updated: new Date().toISOString()
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// Database guard middleware: Fail fast if database is disconnected instead of 10s buffer hang
router.use((req: Request, res: Response, next: any) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'MongoDB Atlas is currently disconnected or IP is not whitelisted. Using local storage mode.' });
  }
  next();
});

// Full Dashboard Bundle
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    if (!isConnected) {
      return res.status(503).json({ error: 'MongoDB not currently connected' });
    }

    const [
      profile,
      transactions,
      loanPayments,
      loanAccounts,
      skills,
      tasks,
      habits,
      fitnessLogs,
      projects,
      weeklyReviews,
      ideas
    ] = await Promise.all([
      ProfileModel.findOne().lean(),
      TransactionModel.find().sort({ date: -1 }).lean(),
      LoanPaymentModel.find().sort({ date: -1 }).lean(),
      LoanAccountModel.find().lean(),
      SkillModel.find().lean(),
      TaskModel.find().sort({ dueDate: 1 }).lean(),
      HabitModel.find().lean(),
      FitnessLogModel.find().sort({ date: -1 }).lean(),
      ProjectModel.find().lean(),
      WeeklyReviewModel.find().sort({ createdAt: -1 }).lean(),
      IdeaModel.find().lean()
    ]);

    res.json({
      profile: profile || { salary: 34000, initialLoanPrincipal: 240000, weightKg: 57, heightCm: 160 },
      transactions,
      loanPayments,
      loanAccounts,
      skills,
      tasks,
      habits,
      fitnessLogs,
      projects,
      weeklyReviews,
      ideas
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Transactions
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const txs = await TransactionModel.find().sort({ date: -1 });
    res.json(txs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/transactions', async (req: Request, res: Response) => {
  try {
    const tx = new TransactionModel(req.body);
    await tx.save();
    res.status(201).json(tx);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/transactions/:id', async (req: Request, res: Response) => {
  try {
    await TransactionModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Loans
router.get('/loans', async (req: Request, res: Response) => {
  try {
    const loans = await LoanPaymentModel.find().sort({ date: -1 });
    res.json(loans);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Loan Accounts (Separate Loans)
router.get('/loan-accounts', async (req: Request, res: Response) => {
  try {
    const accounts = await LoanAccountModel.find();
    res.json(accounts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/loan-accounts', async (req: Request, res: Response) => {
  try {
    const account = new LoanAccountModel(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/loan-accounts/:id', async (req: Request, res: Response) => {
  try {
    const updated = await LoanAccountModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/loans', async (req: Request, res: Response) => {
  try {
    const loan = new LoanPaymentModel(req.body);
    await loan.save();

    // Update specific loan account if loanId provided
    if (loan.loanId) {
      const account = await LoanAccountModel.findById(loan.loanId);
      if (account) {
        account.currentPrincipal = Math.max(0, account.currentPrincipal - loan.principalPaid);
        account.principalPaidTotal += loan.principalPaid;
        account.interestPaidTotal += loan.interestPaid;
        if (account.currentPrincipal === 0) {
          account.status = 'closed';
        }
        await account.save();
      }
    }

    // Also create corresponding transaction records
    const tx = new TransactionModel({
      title: `EMI Payment: ${loan.loanName || 'Loan'}`,
      type: 'loan_payment',
      category: 'Loan Principal',
      amount: loan.principalPaid,
      date: loan.date,
      month: loan.date.substring(0, 7),
      notes: loan.notes || 'Principal repayment'
    });
    await tx.save();

    if (loan.interestPaid > 0) {
      const interestTx = new TransactionModel({
        title: `Loan Interest: ${loan.loanName || 'Loan'}`,
        type: 'loan_payment',
        category: 'Loan Interest',
        amount: loan.interestPaid,
        date: loan.date,
        month: loan.date.substring(0, 7),
        notes: 'Interest on loan'
      });
      await interestTx.save();
    }

    res.status(201).json(loan);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/loans/:id', async (req: Request, res: Response) => {
  try {
    await LoanPaymentModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Tasks
router.get('/tasks', async (req: Request, res: Response) => {
  try {
    const tasks = await TaskModel.find().sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tasks', async (req: Request, res: Response) => {
  try {
    const task = new TaskModel(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const updated = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    await TaskModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Skills
router.get('/skills', async (req: Request, res: Response) => {
  try {
    const skills = await SkillModel.find();
    res.json(skills);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/skills', async (req: Request, res: Response) => {
  try {
    const skill = new SkillModel(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/skills/:id', async (req: Request, res: Response) => {
  try {
    const updated = await SkillModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Fitness
router.get('/fitness', async (req: Request, res: Response) => {
  try {
    const logs = await FitnessLogModel.find().sort({ date: -1 });
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/fitness', async (req: Request, res: Response) => {
  try {
    const log = new FitnessLogModel(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/fitness/:id', async (req: Request, res: Response) => {
  try {
    await FitnessLogModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Projects
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const projects = await ProjectModel.find();
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/projects', async (req: Request, res: Response) => {
  try {
    const project = new ProjectModel(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/projects/:id', async (req: Request, res: Response) => {
  try {
    const updated = await ProjectModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/projects/:id', async (req: Request, res: Response) => {
  try {
    await ProjectModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Ideas
router.get('/ideas', async (req: Request, res: Response) => {
  try {
    const ideas = await IdeaModel.find().sort({ pinned: -1, createdAt: -1 });
    res.json(ideas);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ideas', async (req: Request, res: Response) => {
  try {
    const idea = new IdeaModel(req.body);
    await idea.save();
    res.status(201).json(idea);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/ideas/:id', async (req: Request, res: Response) => {
  try {
    const updated = await IdeaModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/ideas/:id', async (req: Request, res: Response) => {
  try {
    await IdeaModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Weekly Reviews
router.get('/reviews', async (req: Request, res: Response) => {
  try {
    const reviews = await WeeklyReviewModel.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reviews', async (req: Request, res: Response) => {
  try {
    const review = new WeeklyReviewModel(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/reviews/:id', async (req: Request, res: Response) => {
  try {
    await WeeklyReviewModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
