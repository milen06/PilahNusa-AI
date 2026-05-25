import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/history.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
};

class HistoryModel {
  constructor() {
    ensureDataDir();
  }

  getAll() {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading history data:', error);
      return [];
    }
  }

  saveAll(data) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving history data:', error);
      return false;
    }
  }

  add(item) {
    const history = this.getAll();
    history.unshift(item);
    this.saveAll(history);
    return item;
  }

  delete(id) {
    const history = this.getAll();
    const newHistory = history.filter((item) => item.id !== id);
    if (newHistory.length < history.length) {
      this.saveAll(newHistory);
      return true;
    }
    return false;
  }

  clear() {
    this.saveAll([]);
    return true;
  }
}

export default new HistoryModel();
