# 💳 Credit Risk Assessment & Loan Default Predictor 

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Scikit-Learn](https://img.shields.io/badge/scikit_learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-121212?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io/)


An end-to-end full-stack Machine Learning application featuring a custom **HTML5/CSS3/JavaScript** frontend interacting asynchronously with a **FastAPI** REST backend. Predicts loan default risk using **Calibrated XGBoost**, **Scikit-Learn Pipelines**, and **SHAP (Explainable AI)**.

🔗 **Live Application**: [(https://creditriskassessmentusingshapandcaliberati-production.up.railway.app/)]

---
🛠️ Project Structure
## 📁 Repository Structure

```text
Credit_Risk_Assessment_using_SHAP_and_Caliberation/
│
├── static/                         # Frontend assets
│   ├── index.html                  # HTML5 User Interface
│   ├── style.css                   # Custom Modern CSS styling
│   └── script.js                   # Async fetch() API & DOM manipulation logic
│
├── main.py                         # FastAPI server & REST API endpoints
├── credit_risk_pipeline.pkl        # Exported Scikit-Learn preprocessing & XGBoost model
├── shap_explainer.pkl              # Saved SHAP TreeExplainer object
├── requirements.txt                # Python dependencies
└── README.md                       # Project documentation

## 🌟 Key Engineering &amp; Architecture Highlights

* 💻 **Custom Full-Stack Architecture**: Built a lightweight, custom HTML/CSS/JS client communicating with an asynchronous FastAPI backend via `fetch()` API calls, eliminating heavy framework wrappers.
* ⚙️ **Leakage-Free Preprocessing Pipeline**: Integrated `StandardScaler`, `SimpleImputer`, and `OneHotEncoder(handle_unknown='ignore')` inside a unified `Scikit-Learn` `ColumnTransformer` pipeline.
* 🎯 **Probability Calibration**: Applied `CalibratedClassifierCV` (Sigmoid/Platt Scaling) to align raw model probabilities with empirical financial risk likelihoods.
* 🔍 **Explainable AI (SHAP)**: Generated feature attributions using `SHAP` (`TreeExplainer`) to break down individual applicant risk factors into positive and negative contributions.
* 📈 **Optimal Threshold Tuning**: Tuned the classification boundary to **0.7724** to optimize the F1-score on imbalanced credit default data.

---

## 📊 Model Performance Benchmarks

Evaluated using 5-Fold Stratified Cross-Validation on financial loan records:

| Model | ROC-AUC Score | F1-Score | Accuracy |
| :--- | :---: | :---: | :---: |
| Logistic Regression | 0.8420 | 0.5210 | 80.1% |
| Random Forest | 0.9280 | 0.7410 | 91.5% |
| XGBoost (Tuned) | 0.9516 | 0.7930 | 93.4% |
| **Calibrated XGBoost** | **0.9516** | **0.8010** | **93.8%** |

---

## 🏗️ System Flow Diagram

```text
[ Applicant UI Input ]
         │
         ▼  (Asynchronous JSON POST via fetch())
[ FastAPI Endpoint (/predict) ]
         │
         ▼
[ Scikit-Learn Pipeline ] ──► (Scale, Impute, One-Hot Encode)
         │
         ▼
[ Calibrated XGBoost ] ──► Probability Calculation
         │
         ▼
[ SHAP TreeExplainer ] ──► Top Risk &amp; Mitigating Factors
         │
         ▼  (JSON Response Payload)
[ JS Client Dynamic DOM ] ──► Risk Gauge &amp; Impact Visualizer

```

---

## 🚀 Running Locally

1. **Clone Repo**:

```
git clone [suspicious link removed]
cd Credit_Risk_Assessment_using_SHAP_and_Caliberation

```

1. **Install Dependencies**:

```
pip install -r requirements.txt

```

1. **Start FastAPI Backend**:

```
uvicorn main:app --reload

```

Open `http://localhost:8000` in your browser.



View Training and EDA process done in this notebook: 
https://github.com/kishoricharpe9-ai/Credit_Risk_Assessment_using_SHAP_and_Caliberation/blob/main/notebooks/credit_risk_eda_and_training.ipynb.ipynb
