# DRishti ResNet-50 Deep Learning Diagnostic Models

This directory stores the offline ONNX diagnostic models used by DRishti for automated Diabetic Retinopathy grading and explainable Grad-CAM lesion localization (SIH Problem Statement #26038).

## Expected Production Model File:
- `drishti_resnet50_v1.0.2.5.onnx` (~90 MB)

### Model Specification:
- **Architecture**: Dual-Head ResNet-50 with MathWorks Rayleigh CLAHE Preprocessing
- **Input**: `fundus_input` [batch_size, 3, 224, 224] (RGB normalized)
- **Output 1**: `probabilities` [batch_size, 5] (Softmax DR grades 0 to 4)
- **Output 2**: `gradcam_features` [batch_size, 2048, 7, 7] (Layer 4 feature activations for Grad-CAM)
- **Training Cohort**: APTOS 2019 Blindness Detection + Messidor-2 Multi-Center Dataset
