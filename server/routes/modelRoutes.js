import express from 'express';
import { models, predictFraud } from '../models.js';
const router = express.Router();

// Endpoint to test a single model
router.post('/test-model/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    const formData = req.body;

    // Validate model ID
    if (!['mayank', 'yash_amount', 'yash_ratio'].includes(modelId)) {
      return res.status(400).json({ error: 'Invalid model ID' });
    }

    // Get prediction from the model
    const prediction = predictFraud(modelId, formData);

    // Return the prediction
    return res.json({ [modelId]: prediction });
  } catch (error) {
    console.error('Error testing model:', error);
    return res.status(500).json({ error: 'Error testing model' });
  }
});

// Endpoint to test all models
router.post('/test-all-models', async (req, res) => {
  try {
    const formData = req.body;

    // Get predictions from all models
    const predictions = {
      mayank: predictFraud('mayank', formData),
      yash_amount: predictFraud('yash_amount', formData),
      yash_ratio: predictFraud('yash_ratio', formData)
    };

    // Return the predictions
    return res.json(predictions);
  } catch (error) {
    console.error('Error testing models:', error);
    return res.status(500).json({ error: 'Error testing models' });
  }
});

export default router;
