import express from 'express';
import { models, predictFraud } from '../models.js';
const router = express.Router();
router.post('/test-model/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    const formData = req.body;

    if (!['mayank', 'yash_amount', 'yash_ratio'].includes(modelId)) {
      return res.status(400).json({ error: 'Invalid model ID' });
    }

    const prediction = await predictFraud(modelId, formData);
    return res.json({ [modelId]: prediction });
  } catch (error) {
    console.error('Error testing model:', error);
    return res.status(500).json({ error: 'Error testing model' });
  }
});

router.post('/test-all-models', async (req, res) => {
  try {
    const formData = req.body;

    const predictions = {
      mayank: await predictFraud('mayank', formData),
      yash_amount: await predictFraud('yash_amount', formData),
      yash_ratio: await predictFraud('yash_ratio', formData)
    };

    return res.json(predictions);
  } catch (error) {
    console.error('Error testing models:', error);
    return res.status(500).json({ error: 'Error testing models' });
  }
});

export default router;
