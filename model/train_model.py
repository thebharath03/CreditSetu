"""
Trains a logistic regression on the synthetic dataset produced by
generate_dataset.py, and saves the fitted model for explain_shap.py and
export_weights.py to consume.

Model choice: logistic regression, not a gradient-boosted ensemble.
Two reasons, both concrete rather than a default:
1. TFLite conversion — a single dense layer (weights + sigmoid) converts
   trivially, with none of a tree ensemble's op-support and size concerns
   on-device.
2. It's already the shape apps/dashboard's client-side scoring assumes
   (sigmoid of a dot product, see apps/dashboard/src/lib/scoring.js) and
   what the what-if simulator recomputes against live in the browser —
   switching model families would mean redesigning that contract too, for
   no accuracy benefit at this dataset's size and feature count.
Linearity also makes the SHAP step in explain_shap.py exact rather than
approximated (shap.LinearExplainer), which is a better fit for a small,
low-dimensional feature set like this one than a tree-based explainer.

This is a one-time offline step, not part of the shipped app. Run:
    python model/generate_dataset.py
    python model/train_model.py
    python model/export_weights.py
"""

import csv
import os

import joblib
from sklearn.linear_model import LogisticRegression

from features import FEATURE_ORDER

DATASET_PATH = "model/dataset.csv"
MODEL_OUTPUT_PATH = "model/export/model.joblib"


def load_dataset(path):
    X, y = [], []
    with open(path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            X.append([float(row[feature]) for feature in FEATURE_ORDER])
            y.append(int(row["label"]))
    return X, y


def main():
    X, y = load_dataset(DATASET_PATH)

    # Default max_iter=100 doesn't converge here: avgBillAmount's scale
    # (up to 12000) dwarfs the 0-1 regularity features. Not rescaling
    # features, since scoring.js's client-side dot product expects raw
    # feature values, not standardized ones — just letting lbfgs run longer.
    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)

    os.makedirs(os.path.dirname(MODEL_OUTPUT_PATH), exist_ok=True)
    joblib.dump(model, MODEL_OUTPUT_PATH)

    train_accuracy = model.score(X, y)
    print(f"Trained on {len(X)} rows, train accuracy: {train_accuracy:.3f}")
    print(f"Wrote {MODEL_OUTPUT_PATH}")


if __name__ == "__main__":
    main()
