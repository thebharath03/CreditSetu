"""
Generates a synthetic dataset for CreditSetu's demo credit-scoring model.

This is illustrative data, not real applicant data. See model/README.md for
the full rationale.

Labeling rule (plain language): an applicant is labeled *creditworthy*
(label = 1) when they show regular rent and utility payments over a longer
observed history, with a plausible (not extreme) average bill amount. The
trained model's output is therefore P(creditworthy) — a 0-1 score where
higher means lower default risk, which maps directly onto the demo's
"higher score is better" display. Concretely, we compute a weighted
"reliability score" from the four features and threshold it, then flip a
small fraction of labels at random to avoid a perfectly separable (and
therefore unrealistic) dataset:

    reliability = 0.45 * rentRegularity
                + 0.35 * utilityRegularity
                + 0.20 * min(monthsHistory / 24, 1)
                - 0.10 * extreme_amount_penalty

    label = 1 (creditworthy / lower default risk) if reliability >= threshold, else 0

where extreme_amount_penalty grows as avgBillAmount moves far from a
"typical" range, and threshold is chosen so the dataset is roughly balanced.
"""

import csv
import random

RNG_SEED = 42
N_ROWS = 400
OUTPUT_PATH = "model/dataset.csv"

TYPICAL_BILL_MIN = 800
TYPICAL_BILL_MAX = 6000


def extreme_amount_penalty(amount):
    if TYPICAL_BILL_MIN <= amount <= TYPICAL_BILL_MAX:
        return 0.0
    if amount < TYPICAL_BILL_MIN:
        distance = (TYPICAL_BILL_MIN - amount) / TYPICAL_BILL_MIN
    else:
        distance = (amount - TYPICAL_BILL_MAX) / TYPICAL_BILL_MAX
    return min(distance, 1.0)


def generate_row(rng):
    avg_bill_amount = round(rng.uniform(300, 12000), 2)
    rent_regularity = round(rng.uniform(0, 1), 3)
    utility_regularity = round(rng.uniform(0, 1), 3)
    months_history = rng.randint(1, 36)

    reliability = (
        0.45 * rent_regularity
        + 0.35 * utility_regularity
        + 0.20 * min(months_history / 24, 1)
        - 0.10 * extreme_amount_penalty(avg_bill_amount)
    )

    # Threshold picked empirically so the label distribution is roughly balanced.
    threshold = 0.5
    label = 1 if reliability >= threshold else 0

    # Flip ~8% of labels at random to simulate noisy real-world signal and
    # avoid a perfectly linearly separable synthetic dataset.
    if rng.random() < 0.08:
        label = 1 - label

    return {
        "avgBillAmount": avg_bill_amount,
        "rentRegularity": rent_regularity,
        "utilityRegularity": utility_regularity,
        "monthsHistory": months_history,
        "label": label,
    }


def main():
    rng = random.Random(RNG_SEED)
    rows = [generate_row(rng) for _ in range(N_ROWS)]

    with open(OUTPUT_PATH, "w", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "avgBillAmount",
                "rentRegularity",
                "utilityRegularity",
                "monthsHistory",
                "label",
            ],
        )
        writer.writeheader()
        writer.writerows(rows)

    n_creditworthy = sum(r["label"] for r in rows)
    print(f"Wrote {len(rows)} rows to {OUTPUT_PATH}")
    print(
        f"Label balance: {n_creditworthy} creditworthy / "
        f"{len(rows) - n_creditworthy} higher-risk"
    )


if __name__ == "__main__":
    main()
