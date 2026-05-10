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

// Rich data mapping — single source of truth for all 11 waste classes
const CLASS_DATA_MAP = {
  'Batrai': {
    category: 'B3',
    description: 'Baterai bekas yang mengandung bahan kimia berbahaya seperti merkuri, kadmium, dan timbal yang merusak lingkungan.',
    recyclingTips: [
      'Jangan dibuang sembarangan karena mengandung racun berbahaya',
      'Kumpulkan di kotak penyimpanan tertutup sebelum dibawa ke pusat daur ulang',
      'Cari drop-point baterai bekas di supermarket atau toko elektronik',
      'Pertimbangkan beralih ke baterai isi ulang (rechargeable)',
    ],
    recyclingPotential: ['Pemulihan logam berat (timbal, litium)', 'Bahan baku industri metalurgi'],
    disposalGuide: 'Pisahkan dari sampah rumah tangga biasa. Bawa ke pusat pengumpulan limbah B3 terdekat atau drop-point resmi.',
    environmentalImpact: 'Jika dibuang sembarangan, kandungan merkuri dan kadmium dapat mencemari tanah dan air tanah selama ratusan tahun, membahayakan makhluk hidup dan rantai makanan.',
    decompositionTime: 'Tidak terurai secara alami (berbahaya)',
    economicValue: 'Rendah',
  },
  'Botol Plastik': {
    category: 'anorganik',
    description: 'Botol plastik jenis PET (Polyethylene Terephthalate) yang umum digunakan untuk minuman kemasan dan dapat didaur ulang.',
    recyclingTips: [
      'Cuci bersih sebelum dibuang untuk menghindari bau dan kontaminasi',
      'Pisahkan tutup botol (biasanya PP) dari badan botol (PET)',
      'Kempeskan botol untuk menghemat ruang penyimpanan',
      'Kumpulkan dan jual ke pengepul plastik atau bank sampah',
    ],
    recyclingPotential: ['Serat tekstil (pakaian daur ulang)', 'Botol baru (bottle-to-bottle)', 'Lembaran plastik', 'Komponen otomotif'],
    disposalGuide: 'Masukkan ke tempat sampah anorganik (kuning). Pilah dan kumpulkan untuk dijual ke bank sampah atau pengepul.',
    environmentalImpact: 'Jika tidak didaur ulang, plastik PET terurai menjadi mikroplastik yang mencemari laut dan masuk ke rantai makanan, mengancam ekosistem laut dan kesehatan manusia.',
    decompositionTime: '400-450 tahun',
    economicValue: 'Sedang',
  },
  'Kaca': {
    category: 'anorganik',
    description: 'Pecahan kaca atau botol kaca yang bisa didaur ulang tanpa batas tanpa kehilangan kualitas materialnya.',
    recyclingTips: [
      'Bungkus pecahan kaca dengan beberapa lapis kertas tebal atau koran',
      'Pisahkan berdasarkan warna (bening, hijau, coklat) jika memungkinkan',
      'Jangan campur dengan cermin atau kaca oven karena berbeda komposisi',
      'Antar ke bank sampah atau pusat daur ulang kaca',
    ],
    recyclingPotential: ['Botol dan gelas baru', 'Bahan bangunan (agregat kaca)', 'Insulasi fiberglass', 'Bahan seni dan dekorasi'],
    disposalGuide: 'Bungkus dengan aman lalu masukkan ke tempat sampah khusus kaca atau anorganik. Jangan campur dengan sampah tajam lainnya.',
    environmentalImpact: 'Kaca yang dibuang ke TPA membutuhkan jutaan tahun untuk terurai. Pecahan kaca juga membahayakan pekerja sampah dan hewan liar yang mengais sampah.',
    decompositionTime: '1 juta tahun',
    economicValue: 'Rendah',
  },
  'Kardus dan Kertas': {
    category: 'anorganik',
    description: 'Limbah kertas tebal berupa kardus kemasan yang mudah didaur ulang dan memiliki nilai ekonomi cukup baik.',
    recyclingTips: [
      'Lipat pipih kardus untuk menghemat ruang penyimpanan dan transportasi',
      'Jaga agar tetap kering — kardus basah turun nilainya secara drastis',
      'Lepas selotip dan staples sebelum diserahkan ke pengepul',
      'Kumpulkan dalam jumlah besar sebelum dijual untuk nilai lebih',
    ],
    recyclingPotential: ['Kardus baru (corrugated board)', 'Kertas koran dan majalah', 'Bubur kertas untuk produk lain', 'Bahan kemasan daur ulang'],
    disposalGuide: 'Lipat pipih dan masukkan ke tempat sampah anorganik (kuning/biru) atau jual ke pengepul kertas/bank sampah.',
    environmentalImpact: 'Kardus yang dibuang ke TPA menghasilkan gas metana saat terurai dalam kondisi tanpa oksigen, berkontribusi pada efek rumah kaca.',
    decompositionTime: '2 bulan',
    economicValue: 'Sedang',
  },
  'Kertas': {
    category: 'anorganik',
    description: 'Kertas bekas cetak, koran, atau buku yang dapat didaur ulang untuk mengurangi penebangan pohon.',
    recyclingTips: [
      'Pastikan kertas tidak basah, kotor, atau terkena minyak sebelum dibuang',
      'Gunakan sisi kosong kertas sebelum dibuang untuk mengurangi pemborosan',
      'Pisahkan dari plastik laminasi — kertas berlapis plastik sulit didaur ulang',
      'Simpan kering dalam tas atau kardus sebelum diserahkan ke bank sampah',
    ],
    recyclingPotential: ['Kertas baru (newsprint, tissue)', 'Kardus dan kemasan', 'Kertas seni dan handmade paper', 'Bahan insulasi'],
    disposalGuide: 'Masukkan ke tempat sampah anorganik khusus kertas (biru). Pastikan kering dan tidak terkontaminasi minyak atau makanan.',
    environmentalImpact: 'Kertas di TPA menghasilkan metana dan lindi yang mencemari air tanah. Setiap ton kertas yang tidak didaur ulang setara pemborosan sekitar 17 pohon.',
    decompositionTime: '2-6 minggu',
    economicValue: 'Sedang',
  },
  'Makanan Sisa': {
    category: 'organik',
    description: 'Sisa makanan konsumsi yang mudah membusuk dan merupakan bahan baku utama kompos berkualitas tinggi.',
    recyclingTips: [
      'Tiriskan kandungan airnya sebelum dibuang untuk mengurangi bau',
      'Jadikan pupuk kompos dengan mencampurnya dengan tanah dan daun kering',
      'Manfaatkan untuk pakan ternak seperti ayam, bebek, atau babi (jika sesuai)',
      'Pertimbangkan maggot BSF (Black Soldier Fly) untuk mengurai sisa makanan menjadi pupuk',
    ],
    recyclingPotential: ['Kompos organik berkualitas tinggi', 'Pakan ternak', 'Biogas melalui fermentasi anaerobik', 'Media maggot BSF'],
    disposalGuide: 'Masukkan ke tempat sampah organik (hijau). Untuk pengelolaan mandiri, jadikan kompos di rumah menggunakan komposter atau lubang biopori.',
    environmentalImpact: 'Sisa makanan di TPA menghasilkan gas metana 25x lebih berbahaya dari CO₂, berkontribusi signifikan pada perubahan iklim. Juga menghasilkan lindi yang mencemari air tanah.',
    decompositionTime: '2 minggu - 1 bulan',
    economicValue: 'Rendah',
  },
  'Metal': {
    category: 'anorganik',
    description: 'Kaleng bekas minuman, makanan, atau logam lainnya yang memiliki nilai ekonomi tinggi dan dapat didaur ulang berkali-kali.',
    recyclingTips: [
      'Cuci bersih dan keringkan sebelum dikumpulkan',
      'Remukkan kaleng untuk menghemat ruang penyimpanan',
      'Pisahkan antara aluminium (ringan) dan baja (magnetis) untuk nilai lebih baik',
      'Jual ke pengepul logam — harga aluminium cukup tinggi di pasaran',
    ],
    recyclingPotential: ['Kaleng minuman baru', 'Suku cadang kendaraan', 'Peralatan rumah tangga', 'Material konstruksi'],
    disposalGuide: 'Masukkan ke tempat sampah anorganik (kuning) atau langsung jual ke pengepul besi/logam. Jangan campur dengan sampah organik.',
    environmentalImpact: 'Metal di TPA berkarat dan melepaskan senyawa besi yang mencemari air tanah. Produksi logam baru menggunakan energi jauh lebih besar dibanding daur ulang (aluminium: hemat 95% energi).',
    decompositionTime: '50-200 tahun',
    economicValue: 'Tinggi',
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
    description: 'Kantong plastik kresek berwarna hitam (HDPE/LDPE) yang sulit didaur ulang secara konvensional karena pewarnaan karbonnya.',
    recyclingTips: [
      'Gunakan ulang sebagai kantong sampah sekunder sebelum dibuang akhir',
      'Kurangi penggunaan kantong plastik sekali pakai — bawa tas belanja sendiri',
      'Beberapa pengepul khusus plastik campuran menerima plastik hitam',
      'Plastik kresek bisa diolah menjadi bahan bakar (pyrolysis) di fasilitas khusus',
    ],
    recyclingPotential: ['Bahan bakar alternatif (pirolisis)', 'Paving block plastik', 'Pot tanaman daur ulang'],
    disposalGuide: 'Masukkan ke tempat sampah anorganik. Jangan membakar — menghasilkan racun dioksin dan furan yang berbahaya.',
    environmentalImpact: 'Plastik hitam sangat susah didaur ulang secara konvensional. Jika dibakar menghasilkan dioksin karsinogenik. Di alam terbuka, terurai menjadi mikroplastik dalam puluhan tahun.',
    decompositionTime: '10-20 tahun',
    economicValue: 'Rendah',
  },
  'food_organics': {
    category: 'organik',
    description: 'Potongan sisa sayur dari dapur seperti kulit, batang, dan daun yang tidak digunakan, kaya nutrisi untuk kompos.',
    recyclingTips: [
      'Sangat baik untuk bahan utama kompos — kaya nitrogen',
      'Campurkan dengan bahan coklat (kardus, daun kering) untuk kompos seimbang',
      'Gunakan untuk eco-enzyme dengan mencampurnya dengan gula dan air',
      'Jadikan kaldu sayuran sebelum sisa akhirnya dikompos',
    ],
    recyclingPotential: ['Kompos organik berkualitas tinggi', 'Eco-enzyme serbaguna', 'Pakan ternak', 'Biogas'],
    disposalGuide: 'Masukkan ke tempat sampah organik (hijau). Sangat direkomendasikan untuk dijadikan kompos rumahan atau eco-enzyme.',
    environmentalImpact: 'Bila dibuang ke TPA, menghasilkan gas metana dan mencemari lindi. Padahal sisa sayuran adalah bahan baku kompos paling bernilai yang bisa menyuburkan tanah.',
    decompositionTime: '1-4 minggu',
    economicValue: 'Sedang',
  },
  'Sisa buah': {
    category: 'organik',
    description: 'Kulit buah, biji, atau sisa buah yang tidak termakan, kaya senyawa bioaktif yang bermanfaat untuk kompos dan eco-enzyme.',
    recyclingTips: [
      'Jadikan bahan dasar eco-enzyme dengan rasio 3:1:10 (kulit buah:gula:air)',
      'Keringkan untuk dijadikan teh herbal (kulit jeruk, mangga) atau pakan hewan',
      'Campurkan ke komposter untuk memperkaya nutrisi kompos',
      'Kulit citrus (jeruk, lemon) bisa digunakan sebagai pengusir serangga alami',
    ],
    recyclingPotential: ['Eco-enzyme multiguna', 'Kompos organik', 'Teh herbal dan aromaterapi', 'Pewarna alami'],
    disposalGuide: 'Masukkan ke tempat sampah organik (hijau). Manfaatkan untuk eco-enzyme atau kompos sebelum dibuang.',
    environmentalImpact: 'Sisa buah di TPA menghasilkan metana dan lindi. Sayang dibuang begitu saja karena mengandung enzim dan senyawa bioaktif yang sangat berguna.',
    decompositionTime: '2-5 minggu',
    economicValue: 'Sedang',
  },
  'Vegetation': {
    category: 'organik',
    description: 'Sisa tanaman, dedaunan kering, ranting, atau rumput yang merupakan bahan coklat ideal untuk kompos seimbang.',
    recyclingTips: [
      'Tumpuk di sudut halaman untuk pelapukan alami (leafmold)',
      'Cacah/potong kecil-kecil untuk mempercepat proses pengomposan',
      'Campurkan dengan sisa dapur (bahan hijau) untuk kompos C:N seimbang',
      'Daun kering bisa digunakan sebagai mulsa untuk melindungi tanah dari terik matahari',
    ],
    recyclingPotential: ['Kompos organik (bahan coklat)', 'Mulsa tanaman', 'Bahan bakar biomassa', 'Leafmold untuk media tanam'],
    disposalGuide: 'Jadikan tumpukan kompos di halaman atau masukkan ke sampah organik. Hindari membakar — mencemari udara dan membunuh mikroorganisme tanah.',
    environmentalImpact: 'Membakar daun/ranting menghasilkan partikulat dan CO₂ yang mencemari udara. Di TPA, menghasilkan metana. Padahal bisa menjadi kompos yang mengembalikan nutrisi ke tanah.',
    decompositionTime: '1-3 bulan',
    economicValue: 'Rendah',
  },
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
      recyclingPotential: richData.recyclingPotential || [],
      disposalGuide: richData.disposalGuide || '-',
      environmentalImpact: richData.environmentalImpact || null,
      decompositionTime: richData.decompositionTime || '-',
      economicValue: richData.economicValue || null,
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
