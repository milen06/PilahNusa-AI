import HistoryModel from '../models/HistoryModel.js';

export const getHistory = (req, res) => {
  try {
    const history = HistoryModel.getAll();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
};

export const addHistoryItem = (req, res) => {
  try {
    const { id, date, result, imageUrl } = req.body;
    if (!id || !result) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newItem = HistoryModel.add({ id, date, result, imageUrl });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add history item' });
  }
};

export const deleteHistoryItem = (req, res) => {
  try {
    const { id } = req.params;
    const success = HistoryModel.delete(id);
    if (success) {
      res.status(200).json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete history item' });
  }
};
