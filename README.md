# 💳 Credit Risk Assessment & Loan Default Predictor 

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Scikit-Learn](https://img.shields.io/badge/scikit_learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-121212?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io/)

An end-to-end Machine Learning project for predicting loan default risk using borrower and loan-related features. This project combines model development, hyperparameter optimization, probability calibration, threshold optimization, and SHAP-based explainability with a deployed web application built using FastAPI.

🔗 **Live Application:** [https://creditriskassessmentusingshapandcaliberati-production.up.railway.app/](https://creditriskassessmentusingshapandcaliberati-production.up.railway.app/)

---

## 🎯 Project Overview

The objective of this project is to estimate the likelihood of a borrower defaulting on a loan and classify applicants into low-risk and high-risk categories.

The project explores how machine learning models can support credit risk assessment by going beyond default classification to examine probability calibration, decision thresholds, predictive performance, and model interpretability.

## 🛠️ Tech Stack

| Category                | Technologies                     |
| ----------------------- | -------------------------------- |
| Programming             | Python                           |
| Data Processing         | Pandas, NumPy                    |
| Machine Learning        | Scikit-learn, XGBoost            |
| Model Optimization      | RandomizedSearchCV               |
| Probability Calibration | CalibratedClassifierCV (Sigmoid) |
| Explainable AI          | SHAP                             |
| Visualization           | Matplotlib, Seaborn              |
| Backend                 | FastAPI                          |
| Frontend                | HTML5, CSS3, JavaScript          |
| Model Serialization     | Joblib                           |
| Deployment              | Railway                          |
| Version Control         | Git, GitHub                      |

---

## 📊 Machine Learning Workflow

### 1. Data Preprocessing

- Exploratory Data Analysis (EDA)
- Missing-value imputation
- Numerical feature preprocessing
- Categorical feature imputation
- One-hot encoding
- Feature scaling where required
- Stratified train-test splitting
- Class imbalance handling using class weights

Preprocessing transformations are incorporated into Scikit-learn pipelines to maintain consistency during model training and prediction.

### 2. Model Development

Multiple machine learning models were trained and evaluated:

- Logistic Regression — baseline model
- XGBoost — gradient boosting classifier
- Random Forest — ensemble classifier
- AdaBoost — boosting classifier

### 3. Model Evaluation

Models are evaluated using:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC

Stratified 5-fold cross-validation is used during model development to evaluate performance across multiple folds.

### 4. Hyperparameter Optimization

RandomizedSearchCV is used to optimize model hyperparameters.

The XGBoost model is tuned across parameters including:

- Number of estimators
- Maximum tree depth
- Learning rate
- Subsample ratio
- Column sampling
- Minimum child weight
- Gamma

The best XGBoost configuration is selected using ROC-AUC as the refit metric.

### 5. Probability Calibration

The tuned XGBoost model is calibrated using sigmoid calibration through `CalibratedClassifierCV`.

Calibration is used to improve the reliability of the predicted probabilities rather than relying only on the raw model scores.

### 6. Decision Threshold Optimization

Instead of using the default 0.50 classification threshold, an optimized threshold is selected using out-of-fold calibrated predictions generated on the training data.

The threshold is selected to maximize F1-score and then applied to the held-out test set.

**Optimized threshold: 0.58326**

### 7. Model Explainability using SHAP

SHAP (SHapley Additive exPlanations) is used to interpret the underlying tuned XGBoost model.

The analysis includes:

- Global feature importance
- Feature contribution analysis
- Individual prediction explanations
- Positive and negative feature contributions

SHAP analysis helps understand how model features influence predictions. These explanations represent model behavior and do not imply causal relationships.

### 8. Error Analysis

The final calibrated model is further analyzed using:

- False Positives
- False Negatives
- Confusion Matrix

This helps identify cases where the model incorrectly predicts default or non-default and provides a more detailed understanding of model performance.

---

## 📈 Model Performance

### Final Calibrated XGBoost — Test Set

| Metric              |       Score |
| ------------------- | ----------: |
| Accuracy            |  **93.51%** |
| Precision           |  **93.60%** |
| Recall              |  **75.11%** |
| F1-score            |  **83.34%** |
| ROC-AUC             |  **0.9517** |
| Optimized Threshold | **0.58326** |

### Model Comparison — Held-Out Test Set

| Model                          |   Accuracy |  Precision |     Recall |   F1-score |    ROC-AUC |
| ------------------------------ | ---------: | ---------: | ---------: | ---------: | ---------: |
| Logistic Regression (Baseline) |     81.93% |     55.80% |     78.71% |     65.31% |     0.8751 |
| Random Forest (Tuned)          |     92.36% |     88.60% |     74.16% |     80.74% |     0.9356 |
| AdaBoost (Tuned)               |     88.91% |     80.55% |     64.17% |     71.43% |     0.9032 |
| **Calibrated XGBoost**         | **93.51%** | **93.60%** | **75.11%** | **83.34%** | **0.9517** |

### Cross-Validation Results — Baseline Models

| Model               | Accuracy | Precision | Recall | F1-score | ROC-AUC |
| ------------------- | -------: | --------: | -----: | -------: | ------: |
| Logistic Regression |   81.16% |    54.49% | 77.85% |   64.10% |  0.8705 |
| XGBoost             |   91.83% |    81.99% | 79.72% |   80.82% |  0.9476 |

**Best XGBoost hyperparameter-search CV ROC-AUC: 0.94597**

> Cross-validation and held-out test results represent different evaluation stages and should not be compared as if they were the same experiment.

### Confusion Matrix — Final Calibrated Model

|                    | Predicted Non-Default | Predicted Default |
| ------------------ | --------------------: | ----------------: |
| Actual Non-Default |                 4,873 |                70 |
| Actual Default     |                   339 |             1,023 |

Test samples: **6,305**

---

## 🏗️ System Architecture

```text
             ┌──────────────────────────────┐
             │        User Interface      │
             │       HTML / CSS / JS      │
             └──────────────┬──────────────┘
                            │
                            │ JSON Request
                            ▼
             ┌──────────────────────────────┐
             │       FastAPI Backend       │
             │        POST /predict        │
             └──────────────┬──────────────┘
                            │
                            ▼
             ┌──────────────────────────────┐
             │  Calibrated ML Pipeline     │
             │  Preprocessing + XGBoost    │
             └──────────────┬──────────────┘
                            │
                            ▼
             ┌──────────────────────────────┐
             │    Default Probability      │
             │  Optimized Threshold       │
             └──────────────┬──────────────┘
                            │
                            ▼
             ┌──────────────────────────────┐
             │     Risk Classification     │
             │      High Risk / Low Risk  │
             └──────────────────────────────┘
```

---

## 🌐 Web Application

The application provides an interactive interface where users can enter loan applicant details and receive a prediction.

### Features

- Borrower and loan information input
- Asynchronous API requests using JavaScript `fetch()`
- Default probability prediction
- High-risk / low-risk classification
- Optimized threshold-based classification
- FastAPI backend integration

The API returns the predicted default probability, classification, and decision threshold. SHAP explainability is performed in the notebook and is not currently returned by the prediction API.

---

## 📂 Repository Structure

```text
Credit_Risk_Assessment_using_SHAP_and_Caliberation/
│
├── Credit_Risk_Assessment.ipynb
│
├── static/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── credit_risk_dataset.csv
├── credit_risk_model.joblib
├── best_threshold.pkl
├── main.py
├── requirements.txt
├── runtime.txt
└── README.md
```

---

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/kishoricharpe9-ai/Credit_Risk_Assessment_using_SHAP_and_Caliberation.git
```

```bash
cd Credit_Risk_Assessment_using_SHAP_and_Caliberation
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the FastAPI application

```bash
uvicorn main:app --reload
```

### 4. Open the application

Visit:

```text
http://127.0.0.1:8000
```

---

## 🔌 API Endpoint

### `POST /predict`

Accepts loan applicant information and returns the predicted default probability and risk classification.

### Input Fields

| Feature                    | Description                    |
| -------------------------- | ------------------------------ |
| person_age                 | Applicant's age                |
| person_income              | Annual income                  |
| person_home_ownership      | Home ownership status          |
| person_emp_length          | Employment length              |
| loan_intent                | Purpose of loan                |
| loan_grade                 | Loan grade                     |
| loan_amnt                  | Loan amount                    |
| loan_int_rate              | Interest rate                  |
| loan_percent_income        | Loan amount relative to income |
| cb_person_default_on_file  | Previous default record        |
| cb_person_cred_hist_length | Credit history length          |

### Example Response

```json
{
  "default_probability": 0.72,
  "default_prediction": 1,
  "threshold": 0.58326,
  "Result": "High Risk"
}
```

---

## ⚠️ Limitations

- Model performance depends on dataset quality and representativeness.
- Classification threshold optimization is based on F1-score and may not represent the optimal business decision threshold for every lender.
- SHAP values explain model behavior but do not establish causation.
- Evaluation on a held-out dataset does not guarantee performance on future populations or changing economic conditions.
- This project is intended for educational and analytical purposes and is not a substitute for real-world financial underwriting or lending decisions.

---

## 👩‍💻 Author

**Kishori Charpe**

GitHub: [kishoricharpe9-ai](https://github.com/kishoricharpe9-ai)

LinkedIn: [Connect with me](https://www.linkedin.com/)
