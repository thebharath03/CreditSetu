"""
Real SHAP feature attribution — replaces the coefficient-ranking shortcut
used elsewhere in this project (e.g. apps/dashboard's mock fixtures rank
factors by |coefficient|, which ignores each applicant's actual feature
values). SHAP values are computed per applicant, so "top contributing
factors" reflects what actually drove *that* applicant's score, not a
static global ranking.

Uses shap.LinearExplainer against the logistic regression from
train_model.py. SHAP values are computed in log-odds (logit) space, not
probability space — this is standard practice for linear models, since
sigmoid-transforming would break the additivity property SHAP depends on
(values summing to output - base_value). Sign and relative magnitude in
logit space still map directly onto "helped/hurt the score" and "by how
much", which is all apps/dashboard's ExplanationFactor shape needs.

Run standalone to see sample explanations:
    python model/explain_shap.py
"""

import csv

import joblib
import numpy as np
import shap

from features import FEATURE_LABELS, FEATURE_ORDER

DATASET_PATH = "model/dataset.csv"
MODEL_PATH = "model/export/model.joblib"


def load_features(path):
    rows = []
    with open(path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append([float(row[feature]) for feature in FEATURE_ORDER])
    return np.array(rows)


def build_explainer(model, background):
    return shap.LinearExplainer(model, background)


def top_factors(explainer, feature_vector, top_n=2):
    """
    Returns the top_n contributing factors for a single applicant, shaped
    to match apps/dashboard/src/types/contracts.js's ExplanationFactor:
    { feature, label, impactDirection, magnitude }. magnitude is
    normalized 0-1 relative to the largest |SHAP value| among the
    returned factors, for bar-chart sizing.
    """
    shap_values = explainer.shap_values(np.array([feature_vector]))[0]
    ranked = sorted(
        zip(FEATURE_ORDER, shap_values), key=lambda pair: abs(pair[1]), reverse=True
    )[:top_n]

    max_abs = max(abs(value) for _, value in ranked) or 1.0
    return [
        {
            "feature": feature,
            "label": FEATURE_LABELS[feature],
            "impactDirection": "positive" if value >= 0 else "negative",
            "magnitude": round(abs(value) / max_abs, 3),
        }
        for feature, value in ranked
    ]


def main():
    model = joblib.load(MODEL_PATH)
    X = load_features(DATASET_PATH)
    explainer = build_explainer(model, X)

    print(f"Base value (log-odds): {explainer.expected_value:.3f}\n")
    print("Sample explanations:")
    for i in range(5):
        features = dict(zip(FEATURE_ORDER, X[i]))
        factors = top_factors(explainer, X[i])
        print(f"\nApplicant {i}: {features}")
        for factor in factors:
            print(f"  {factor['label']}: {factor['impactDirection']} ({factor['magnitude']})")


if __name__ == "__main__":
    main()
