import tf from '@tensorflow/tfjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import HistoryModel from '../models/HistoryModel.js';
import { localFileHandler } from '../localFileHandler.js';
import sharp from 'sharp';

// Set to 'graph' for tfjs_graph_model or 'layers' for layers-model
const MODEL_FORMAT = 'graph';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Class labels
const CLASS_LABELS = {
  0: 'Batrai',
  1: 'Botol Plastik',
  2: 'Kaca',
  3: 'Kardus dan Kertas',
  4: 'Metal',
  5: 'Sisa buah dan sayur',
  6: 'Trash Bag',
  7: 'food_organics'
};

// Rich data mapping
const CLASS_DATA_MAP = {
  'Batrai': {
    category: 'B3',
    description: 'Baterai bekas yang mengandung bahan kimia berbahaya.',
    recyclingTips: ['Kumpulkan di tempat pengumpulan limbah B3', 'Jangan dibuang ke tempat sampah umum'],
    disposalGuide: 'Bawa ke dropbox e-waste atau pusat pengelolaan limbah B3.',
    decompositionTime: 'Tidak terurai secara alami',
  },
  'Botol Plastik': {
    category: 'anorganik',
    description: 'Botol plastik minuman (PET/HDPE).',
    recyclingTips: ['Cuci bersih', 'Remas botol untuk menghemat ruang'],
    disposalGuide: 'Masukkan ke tempat sampah anorganik (kuning).',
    decompositionTime: '450 tahun',
  },
  'Kaca': {
    category: 'anorganik',
    description: 'Pecahan atau botol kaca.',
    recyclingTips: ['Bungkus dengan aman jika pecah', 'Pisahkan berdasarkan warna jika memungkinkan'],
    disposalGuide: 'Masukkan ke wadah sampah anorganik khusus kaca.',
    decompositionTime: '1 juta tahun',
  },
  'Kardus dan Kertas': {
    category: 'anorganik',
    description: 'Limbah serat selulosa seperti kardus, kertas tulis, dan koran.',
    recyclingTips: ['Pastikan kering dan tidak berminyak', 'Lipat agar pipih'],
    disposalGuide: 'Masukkan ke tempat sampah khusus kertas (biru).',
    decompositionTime: '2-5 bulan',
  },
  'Metal': {
    category: 'anorganik',
    description: 'Kaleng logam, aluminium, atau besi.',
    recyclingTips: ['Cuci sisa makanan', 'Kumpulkan untuk dijual ke pengepul'],
    disposalGuide: 'Masukkan ke tempat sampah anorganik (kuning).',
    decompositionTime: '50-200 tahun',
  },
  'Sisa buah dan sayur': {
    category: 'organik',
    description: 'Potongan sisa buah-buahan dan sayuran dapur.',
    recyclingTips: ['Sangat baik untuk bahan kompos', 'Bisa diolah menjadi Eco-Enzyme'],
    disposalGuide: 'Masukkan ke komposter atau tempat sampah organik (hijau).',
    decompositionTime: '1-4 minggu',
  },
  'Trash Bag': {
    category: 'anorganik',
    description: 'Kantong plastik atau kresek pembungkus sampah.',
    recyclingTips: ['Gunakan kembali sebagai kantong sampah', 'Beralihlah ke tas belanja kain'],
    disposalGuide: 'Masukkan ke tempat sampah anorganik.',
    decompositionTime: '10-20 tahun',
  },
  'food_organics': {
    category: 'organik',
    description: 'Sisa makanan matang atau sisa konsumsi rumah tangga.',
    recyclingTips: ['Tiriskan airnya', 'Gunakan sebagai pakan ternak jika memungkinkan'],
    disposalGuide: 'Masukkan ke tempat sampah organik (hijau).',
    decompositionTime: '2-4 minggu',
  }
};

// --- Model Loading (Singleton) ---
let model = null;

async function loadModel() {
  if (model) return model;
  const modelPath = path.join(__dirname, '../data/tfjs_model/model.json');
  console.log('[AI] Loading TensorFlow.js model from:', modelPath);
  // Use localFileHandler for both graph and layers models from filesystem
  model = await tf.loadGraphModel(localFileHandler(modelPath));
  console.log('[AI] Model loaded and ready.');
  return model;
}

// Pre-load the model when server starts
loadModel().catch(err => console.error('[AI] Failed to pre-load model:', err));


// --- Image Preprocessing ---
async function preprocessImage(imagePath) {
  // Read file to buffer first to avoid file locking on Windows
  const imageBuffer = fs.readFileSync(imagePath);

  // Use sharp to resize and get raw pixel data (RGB, 224x224)
  const { data, info } = await sharp(imageBuffer)
    .resize(224, 224)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Convert to Float32Array and normalize to [0, 1]
  const float32Data = new Float32Array(data.length);
  for (let i = 0; i < data.length; i++) {
    float32Data[i] = data[i] / 255.0;
  }

  // Create tensor with shape [1, 224, 224, 3]
  return tf.tensor4d(float32Data, [1, info.height, info.width, info.channels]);
}


// --- Controller ---
export const classifyWaste = async (req, res, next) => {
  const imagePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided for classification' });
    }

    // Create small thumbnail from the uploaded image for storage efficiency
    let thumbnailBase64 = null;
    try {
      const thumbnailBuffer = await sharp(imagePath)
        .resize(200, 200, { fit: 'inside' })
        .jpeg({ quality: 70 })
        .toBuffer();
      thumbnailBase64 = 'data:image/jpeg;base64,' + thumbnailBuffer.toString('base64');
    } catch (err) {
      console.error('[Thumbnail] Failed to create thumbnail:', err);
      // Fallback: we could still proceed without thumbnail or try a simpler way
    }

    // Load model and preprocess image
    const aiModel = await loadModel();
    const inputTensor = await preprocessImage(imagePath);

    // Run inference - graph models use execute() with named inputs
    // Input name comes from model.json signature: 'input_layer_2'
    const outputMap = aiModel.execute({ 'input_layer_2': inputTensor });
    // Output can be a tensor or named map, handle both cases
    const outputTensor = Array.isArray(outputMap) ? outputMap[0] : outputMap;
    const probabilities = await outputTensor.data();

    // Cleanup tensors
    inputTensor.dispose();
    outputTensor.dispose();

    // Find class with highest probability
    let maxProb = -1;
    let classIndex = -1;
    for (let i = 0; i < probabilities.length; i++) {
      if (probabilities[i] > maxProb) {
        maxProb = probabilities[i];
        classIndex = i;
      }
    }

    const predictedLabelName = CLASS_LABELS[classIndex] || 'Unknown';
    const richData = CLASS_DATA_MAP[predictedLabelName] || {};
    const confidence = parseFloat((maxProb * 100).toFixed(2));

    console.log(`[AI] Predicted: ${predictedLabelName} (${confidence}%)`);

    const finalResult = {
      name: predictedLabelName,
      category: richData.category || 'unknown',
      confidence,
      description: richData.description || 'Tidak ada deskripsi',
      recyclingTips: richData.recyclingTips || [],
      disposalGuide: richData.disposalGuide || '-',
      decompositionTime: richData.decompositionTime || '-',
      economicValue: null
    };

    // Save to history
    const historyItem = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      imageBase64: thumbnailBase64,
      result: finalResult
    };

    HistoryModel.add(historyItem);

    // Cleanup uploaded image
    fs.unlink(imagePath, (err) => {
      if (err) console.error('[Cleanup] Error deleting uploaded file:', err);
    });

    return res.status(200).json(historyItem);

  } catch (error) {
    // Cleanup on error
    if (imagePath) {
      fs.unlink(imagePath, () => {});
    }
    next(error);
  }
};
