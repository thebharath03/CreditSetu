"""
Loads the fitted model from train_model.py and exports what both
apps/dashboard's scoring.js and apps/api's scoringService.js/explainService.js
need to score and explain applicants: { featureOrder, coefficients,
intercept, featureMeans }.

featureMeans is the training set's per-feature mean — it's the baseline
apps/api's explainService.js needs to compute real SHAP values in JS
without shelling out to Python: for a linear model, shap_i =
coefficient_i * (x_i - mean_i) is the exact closed-form SHAP value under
an independent-feature baseline, verified numerically to match
shap.LinearExplainer's output exactly (see explain_shap.py's masker,
which uses this same mean as its background).

Writes to model/export/weights.json (the canonical model artifact) and
copies to apps/dashboard/public/weights.json (what the dashboard actually
loads at runtime; it only reads featureOrder/coefficients/intercept, so
the extra field is harmless there).

Run after train_model.py:
    python model/export_weights.py
"""

import csv
import json
import shutil

import joblib
import numpy as np

from features import FEATURE_ORDER

MODEL_PATH = "model/export/model.joblib"
DATASET_PATH = "model/dataset.csv"
WEIGHTS_EXPORT_PATH = "model/export/weights.json"
DASHBOARD_WEIGHTS_PATH = "apps/dashboard/public/weights.json"


def load_feature_means(path):
    X = []
    with open(path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            X.append([float(row[feature]) for feature in FEATURE_ORDER])
    return np.mean(np.array(X), axis=0).tolist()


def main():
    model = joblib.load(MODEL_PATH)
    feature_means = load_feature_means(DATASET_PATH)

    weights = {
        "featureOrder": FEATURE_ORDER,
        "coefficients": model.coef_[0].tolist(),
        "intercept": float(model.intercept_[0]),
        "featureMeans": feature_means,
    }

    with open(WEIGHTS_EXPORT_PATH, "w") as f:
        json.dump(weights, f, indent=2)
    print(f"Wrote {WEIGHTS_EXPORT_PATH}")

    shutil.copyfile(WEIGHTS_EXPORT_PATH, DASHBOARD_WEIGHTS_PATH)
    print(f"Copied to {DASHBOARD_WEIGHTS_PATH}")

    print(json.dumps(weights, indent=2))


if __name__ == "__main__":
    main()
