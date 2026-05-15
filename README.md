# PilahNusa AI ♻️

PilahNusa AI is a mobile-first web application designed to help users correctly classify waste from photos. It provides intelligent disposal guidance, recycling tips, and maintains a history of user scans to encourage sustainable habits. 

The application utilizes a machine learning model powered by TensorFlow.js, running on a Node.js/Express backend, with a responsive and modern React frontend.

## 🌟 Key Features

- **AI-Powered Waste Classification:** Instantly classify waste types from uploaded or captured images.
- **Smart Disposal Guides:** Receive actionable advice on how to properly dispose of or recycle the scanned item.
- **Scan History:** Keep track of your past classifications and environmental contributions.
- **Mobile-First Design:** Optimized for a seamless experience on mobile devices.

## 💻 Tech Stack

- **Frontend:** React 18, Vite, React Router DOM, Lucide React (Icons)
- **Backend:** Node.js, Express, Multer (Image uploads), Sharp (Image preprocessing)
- **Machine Learning:** TensorFlow.js (`@tensorflow/tfjs` running on Node.js)

## 📂 Project Structure

```text
PilahNusa-AI/
├── public/                 # Static assets
├── server/                 # Express backend application
│   ├── controllers/        # Request handling and ML inference logic
│   ├── data/               # TensorFlow.js model files (`model.json`, `.bin`)
│   ├── middleware/         # Express middlewares
│   ├── models/             # Database/Storage models
│   ├── routes/             # API route definitions
│   └── server.js           # Backend entry point
├── src/                    # React frontend application
│   ├── components/         # Reusable UI components
│   ├── pages/              # Main application views (Home, Scan, History)
│   ├── services/           # API interaction logic
│   └── utils/              # Helper functions
├── .env.example            # Example environment variables
├── package.json            # Project dependencies and scripts
└── vite.config.js          # Vite configuration
```

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd PilahNusa-AI
   ```

2. **Install the dependencies:**
   This command installs both frontend and backend dependencies defined in `package.json`.
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Duplicate the `.env.example` file to create a `.env` file and configure any necessary environment variables.
   ```bash
   cp .env.example .env
   ```

### Running the Application

You can start both the frontend development server and the backend Express server concurrently using a single command:

```bash
npm run dev:all
```

- **Frontend:** Usually accessible at `http://localhost:5173` (Vite)
- **Backend API:** Usually runs on `http://localhost:3000`

---

## 🧠 Machine Learning Integration

PilahNusa AI processes images entirely on the backend to ensure performance and accuracy. Here is how the AI pipeline works:

1. **Capture & Upload:** The frontend captures an image and sends it as `multipart/form-data` to the `/api/classifications` endpoint.
2. **Preprocessing:** The backend uses `sharp` to resize the image to **224x224**, extracts the RGB channels, and normalizes pixel values to floats between 0.0 and 1.0. It converts the image into a tensor of shape `[1, 224, 224, 3]`.
3. **Inference:** A pre-trained **TensorFlow.js Graph Model** is loaded from `server/data/tfjs_model/`. The image tensor is fed into the model's input layer (`input_layer_2`), and the model executes the prediction.
4. **Classification:** The output probability array is analyzed to find the highest match. It is then mapped to predefined `CLASS_LABELS` to attach rich contextual data (disposal guides, recycling tips) which is sent back to the client.

### Updating the Model (For ML Engineers)

If you need to update or replace the AI model:

1. **Format:** Ensure your model is a **TensorFlow.js Graph Model**. Use `tensorflowjs_converter` if converting from Keras (`.h5`) or SavedModel.
2. **Replace Files:** Replace the `model.json` and `.bin` weights in the `server/data/tfjs_model/` directory.
3. **Update Logic:** If your new model has a different input size or input layer name, update the parameters in `server/controllers/classificationController.js`.
4. **Update Classes:** If the classes change, update the `CLASS_LABELS` and `CLASS_DATA_MAP` in the controller to ensure accurate frontend descriptions.
