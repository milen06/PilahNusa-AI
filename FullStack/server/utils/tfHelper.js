import tf from '@tensorflow/tfjs';

/**
 * Testable wrapper for TensorFlow.js operations.
 * Allows properties to be dynamically stubbed/mocked in unit tests
 * where direct tf namespace mutation is blocked by read-only module bindings.
 */
export const tfHelper = {
  loadGraphModel: async (modelPath) => {
    return await tf.loadGraphModel(modelPath);
  },
  tensor4d: (values, shape) => {
    return tf.tensor4d(values, shape);
  }
};
