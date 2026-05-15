# PilahNusa AI

PilahNusa AI is a mobile-first application for classifying waste from a photo, then showing disposal guidance, recycling tips, and scan history. It features a React frontend and a Node.js/Express backend running a TensorFlow.js machine learning model.

## Tech Stack

- **Frontend:** React 18, Vite, React Router DOM, Lucide React icons
- **Backend:** Node.js, Express, Multer (file uploads), Sharp (image preprocessing)
- **Machine Learning:** `@tensorflow/tfjs` (Running on the Node.js server)

## Project Structure & Flow

- **`/src`**: Contains the React frontend code (`HomePage`, `ScanPage`, `HistoryPage`). It captures an image and sends it via `src/services/aiService.js` to the backend.
- **`/server`**: Contains the Express backend.
  - `server.js`: Main entry point for the backend.
  - `/routes/apiRoutes.js`: Defines `/api/classifications` for processing waste images.
  - `/controllers/classificationController.js`: Contains the core logic for image preprocessing, TFJS model inference, and mapping results to rich content.
  - `/data/tfjs_model/`: Directory storing the actual TensorFlow.js model (`model.json` and `.bin` weights).

## How the Model is Implemented (Web Integration)

The application has integrated a real Machine Learning model, replacing the earlier frontend mock service:

1. **Frontend Image Capture:** The user captures an image on the `/scan` page. It is converted into a `Blob` and sent as `multipart/form-data` to the backend.
2. **Backend Processing:** The `POST /api/classifications` route receives the image.
3. **Image Preprocessing:** In `classificationController.js`, `sharp` resizes the image to **224x224**, extracts the RGB channels, and normalizes pixel values to floats between 0.0 and 1.0. It is converted into a tensor of shape `[1, 224, 224, 3]`.
4. **Model Inference:** A TensorFlow.js **Graph Model** is loaded. The image tensor is fed into the model's specific input layer (currently `'input_layer_2'`) using `aiModel.execute()`.
5. **Result Mapping:** The model outputs a probability array. The index with the highest probability is mapped to a label via `CLASS_LABELS`, and rich descriptions are attached via `CLASS_DATA_MAP`.

## Guide for Machine Learning Engineers: How to Update the Model

If you are a Machine Learning Engineer tasked with replacing or updating the AI model, follow these steps:

### 1. Format Your Model for TensorFlow.js
The backend expects a **TensorFlow.js Graph Model** (`tfjs_graph_model`). If your model is in HDF5 (`.h5`) or Keras SavedModel format, convert it to TFJS first using the `tensorflowjs_converter`:
```bash
tensorflowjs_converter --input_format=keras_saved_model /path/to/saved_model /path/to/tfjs_model
```

### 2. Replace Model Files
Place your new model files (`model.json` and associated `.bin` weight files) in the backend model directory, overwriting the old ones:
```
server/data/tfjs_model/
```

### 3. Update Input Parameters in Code
Open `server/controllers/classificationController.js` and update the parameters based on your new model's architecture:
- **Image Size:** If your model expects an input size other than 224x224, update the `.resize(224, 224)` line inside `preprocessImage()`.
- **Input Node Name:** Graph Models require knowing the exact name of the input node. Find the input name in your `model.json` signature and update the `execute` call:
  ```javascript
  const outputMap = aiModel.execute({ 'your_new_input_layer_name': inputTensor });
  ```

### 4. Update Class Labels & Data
If your new model outputs a different number of classes or different categories:
- Update the `CLASS_LABELS` mapping at the top of `classificationController.js` so the array indices match your model's output neurons.
- Ensure every new label has a corresponding data entry in `CLASS_DATA_MAP` to provide users with accurate disposal guides, recycling tips, and environmental impact information.

