import fs from 'fs';
import path from 'path';

/**
 * Custom IO Handler for loading a TF.js Graph Model from local filesystem.
 * Works with tfjs_graph_model format (format: "graph-model").
 */
export function localFileHandler(modelJsonPath) {
  return {
    load: async () => {
      const dirName = path.dirname(modelJsonPath);
      const rawJson = JSON.parse(fs.readFileSync(modelJsonPath, 'utf8'));

      const weightsManifest = rawJson.weightsManifest;
      const buffers = [];
      const weightSpecs = [];

      for (const group of weightsManifest) {
        for (const filePath of group.paths) {
          const weightPath = path.join(dirName, filePath);
          buffers.push(fs.readFileSync(weightPath));
        }
        if (group.weights) {
          weightSpecs.push(...group.weights);
        }
      }

      const concatBuffer = Buffer.concat(buffers);
      const weightData = new Uint8Array(concatBuffer).buffer;

      return {
        modelTopology: rawJson.modelTopology,
        weightSpecs,
        weightData,
        format: rawJson.format,
        generatedBy: rawJson.generatedBy,
        convertedBy: rawJson.convertedBy,
        // For graph models, include signature
        signature: rawJson.signature || undefined,
        userDefinedMetadata: rawJson.userDefinedMetadata || undefined,
      };
    }
  };
}
