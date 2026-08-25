"""
Loads the fitted model from train_model.py and exports the coefficients
CreditSetu's dashboard needs to score applicants client-side, in the same
shape apps/dashboard/src/lib/scoring.js and the what-if simulator already
consume: { featureOrder, coefficients, intercept }.

Writes to model/export/weights.json (the canonical model artifact) and
copies to apps/dashboard/public/weights.json (what the dashboard actually
loads at runtime).

Run after train_model.py:
    python model/export_weights.py
"""

import json
import shutil

import joblib

from features import FEATURE_ORDER

MODEL_PATH = "model/export/model.joblib"
WEIGHTS_EXPORT_PATH = "model/export/weights.json"
DASHBOARD_WEIGHTS_PATH = "apps/dashboard/public/weights.json"


def main():
    model = joblib.load(MODEL_PATH)

    weights = {
        "featureOrder": FEATURE_ORDER,
        "coefficients": model.coef_[0].tolist(),
        "intercept": float(model.intercept_[0]),
    }

    with open(WEIGHTS_EXPORT_PATH, "w") as f:
        json.dump(weights, f, indent=2)
    print(f"Wrote {WEIGHTS_EXPORT_PATH}")

    shutil.copyfile(WEIGHTS_EXPORT_PATH, DASHBOARD_WEIGHTS_PATH)
    print(f"Copied to {DASHBOARD_WEIGHTS_PATH}")

    print(json.dumps(weights, indent=2))


if __name__ == "__main__":
    main()
