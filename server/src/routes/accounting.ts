import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { AccountingEntry } from '../entities/AccountingEntry';

const router = Router();
const repo = AppDataSource.getRepository(AccountingEntry);

// Interface para tipagem do corpo da requisição
interface EntryRequestBody {
  entryDate: string;
  description: string;
  amount: number;
  entryType: 'CREDIT' | 'DEBIT';
}

// POST - Cria um novo lançamento
router.post('/entries', async (req: Request<{}, {}, EntryRequestBody>, res: Response) => {
  try {
    const { entryDate, description, amount, entryType } = req.body;

    // Validação do formato da data (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
      return res.status(400).json({ error: 'Invalid date format. Use yyyy-MM-dd.' });
    }

    const entry = repo.create({
      entryDate,
      description,
      amount,
      entryType,
    });

    const saved = await repo.save(entry);
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ error: 'Error saving entry.' });
  }
});

// GET - Lista todos os lançamentos
router.get('/entries', async (req: Request, res: Response) => {
  try {
    const entries = await repo.find({
      order: { entryDate: 'DESC' },
      select: ['id', 'entryDate', 'description', 'amount', 'entryType']
    });
    return res.json(entries);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching entries.' });
  }
});

// PUT - Atualiza um lançamento existente
router.put('/entries/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const { entryDate, description, amount, entryType } = req.body;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
      return res.status(400).json({ error: 'Invalid date format. Use yyyy-MM-dd.' });
    }

    const entry = await repo.findOneBy({ id });
    if (!entry) return res.status(404).json({ error: 'Entry not found.' });

    entry.entryDate = entryDate;
    entry.description = description;
    entry.amount = amount;
    entry.entryType = entryType;

    const updated = await repo.save(entry);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Error updating entry.' });
  }
});

// DELETE - Remove um lançamento
router.delete('/entries/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const entry = await repo.findOneBy({ id: req.params.id });
    if (!entry) return res.status(404).json({ error: 'Entry not found.' });

    await repo.remove(entry);
    return res.status(204).send(); // 204 No Content
  } catch (err) {
    return res.status(500).json({ error: 'Error deleting entry.' });
  }
});

// GET - Resumo mensal dos lançamentos
router.get('/entries/summary', async (req, res) => {
  try {
    const entries = await repo.find({
      order: { entryDate: 'DESC' },
      select: ['entryDate', 'entryType', 'amount']
    });

    if (!entries.length) return res.json([]);

    // Agrupa e calcula totais por mês/ano
    const summary = entries.reduce((acc, entry) => {
      const [year, month] = entry.entryDate.split("-");
      const monthYear = `${year}-${month}`;

      if (!acc[monthYear]) {
        acc[monthYear] = { totalCredit: 0, totalDebit: 0, balance: 0 };
      }

      const amount = Number(entry.amount);

      if (entry.entryType === 'CREDIT') {
        acc[monthYear].totalCredit += amount;
        acc[monthYear].balance += amount;
      } else {
        acc[monthYear].totalDebit += amount;
        acc[monthYear].balance -= amount;
      }

      return acc;
    }, {} as Record<string, { totalCredit: number; totalDebit: number; balance: number }>);

    const result = Object.entries(summary)
      .map(([month, totals]) => ({ month, ...totals }))
      .sort((a, b) => b.month.localeCompare(a.month));

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Error generating summary.' });
  }
});

export default router;
