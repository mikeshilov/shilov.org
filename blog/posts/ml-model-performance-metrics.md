---
title: 'ML Model Performance metrics'
---

[Source](https://medium.com/usf-msds/choosing-the-right-metric-for-evaluating-machine-learning-models-part-2-86d5649a5428)

## Classification metrics
**Accuracy** = (Number of correct predictions) / (Total number of predictions)
for binary classification **Accuracy** = (TP + TN) / (TP+TN+FP+FN).
Accuracy doesn’t work well with a class-imbalanced data set.

**Precision** = TP / (TP + FP). Tells what proportion of positive identifications was actually correct.

**Recall** = TP (TP + FN). Tells what proportion of actual positives was identified correctly.

Read more about precision and recall here.

**Specifity** = TN / (TN + FP). In the case of cancer diagnosis task, it tells what proportion of patients that did NOT have cancer, were predicted by the model as non-cancerous.

## Language processing metrics
**Levenshtein distance** – a distance between two words in terms of the minimum number of single-character edits (insertions, deletions or substitutions) required to change one word into the other.

**Perplexity** – a measurement of how well a probability distribution or probability model predicts a sample. It may be used to compare probability models. A low perplexity indicates the probability distribution is good at predicting the sample.
