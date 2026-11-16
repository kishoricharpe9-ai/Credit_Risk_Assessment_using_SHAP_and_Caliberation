# Credit-Risk-Assessment-using-SHAP-and-Caliberation

```
# 💳 Credit Risk Assessment &amp; Loan Default Predictor

[![Live App]([suspicious link removed])](https://credit-risk-assessment-using-shap-and-dmr4.onrender.com/)
[![FastAPI]([suspicious link removed])]([suspicious link removed])
[![JavaScript]([suspicious link removed])]([suspicious link removed])
[![Scikit-Learn]([suspicious link removed])]([suspicious link removed])
[![XGBoost]([suspicious link removed])]([suspicious link removed])

An end-to-end full-stack Machine Learning application featuring a custom **HTML5/CSS3/JavaScript** frontend interacting asynchronously with a **FastAPI** REST backend. Predicts loan default risk using **Calibrated XGBoost**, **Scikit-Learn Pipelines**, and **SHAP (Explainable AI)**.

🔗 **Live Application**: [https://credit-risk-assessment-using-shap-and-dmr4.onrender.com/](https://credit-risk-assessment-using-shap-and-dmr4.onrender.com/)

---

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
