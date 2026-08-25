"""
Shared feature definitions — imported by generate_dataset.py, train_model.py,
explain_shap.py, and export_weights.py so the feature order and
plain-language labels can't drift between them.
"""

# Order matters: this becomes featureOrder in weights.json, and every
# downstream consumer (parseFeatures, scoreApplicant, the what-if simulator)
# depends on this exact spelling and order.
FEATURE_ORDER = [
    "avgBillAmount",
    "rentRegularity",
    "utilityRegularity",
    "monthsHistory",
]

# Plain-language labels shown in explanation factors — must match the
# wording already used in apps/dashboard/src/lib/mockDataSource.js so mock
# and model-derived explanations read consistently.
FEATURE_LABELS = {
    "avgBillAmount": "Average bill amount",
    "rentRegularity": "Regular rent payments",
    "utilityRegularity": "Consistent utility bill payments",
    "monthsHistory": "Months of payment history",
}
