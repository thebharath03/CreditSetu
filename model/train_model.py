"""
Trains a logistic regression on the synthetic dataset produced by
generate_dataset.py, and exports the coefficients CreditSetu's web demo
needs to score applicants client-side.

This is a one-time offline step, not part of the shipped app. Run:
    python model/generate_dataset.py
    python model/train_model.py
"""

import csv
import json

from sklearn.linear_model import LogisticRegression

DATASET_PATH = "model/dataset.csv"
WEIGHTS_OUTPUT_PATH = "public/weights.json"

# Order matters: this becomes featureOrder in weights.json, and every
# downstream phase (parseFeatures, scoreApplicant) depends on this exact
# spelling and order.
FEATURE_ORDER = [
    "avgBillAmount",
    "rentRegularity",
    "utilityRegularity",
    "monthsHistory",
]


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

    model = LogisticRegression()
    model.fit(X, y)

    weights = {
        "featureOrder": FEATURE_ORDER,
        "coefficients": model.coef_[0].tolist(),
        "intercept": float(model.intercept_[0]),
    }

    with open(WEIGHTS_OUTPUT_PATH, "w") as f:
        json.dump(weights, f, indent=2)

    train_accuracy = model.score(X, y)
    print(f"Trained on {len(X)} rows, train accuracy: {train_accuracy:.3f}")
    print(f"Wrote {WEIGHTS_OUTPUT_PATH}")
    print(json.dumps(weights, indent=2))


if __name__ == "__main__":
    main()
