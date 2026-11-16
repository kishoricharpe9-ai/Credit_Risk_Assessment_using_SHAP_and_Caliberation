(() => {
  // Same-origin by default (FastAPI serves this page). Override for local dev if needed:
  // <script>window.API_BASE = "http://127.0.0.1:8000"</script> before this file.
  const API_BASE = (window.API_BASE || "").replace(/\/$/, "");

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const form = $("#form");
  const submitBtn = $("#submit");
  const errorEl = $("#error");
  const result = $("#result");
  const arc = $("#arc");
  const tick = $("#tick");
  const pctEl = $("#pct");
  const pill = $("#pill");
  const ltiField = $("#lti");

  const money = (n) => "$" + Math.round(n).toLocaleString("en-US");

  /* ---------- API status ping ---------- */
  async function checkApi() {
    const box = $("#status");
    const text = $("#status-text");
    try {
      const r = await fetch(`${API_BASE}/`, { cache: "no-store" });
      if (!r.ok) throw new Error();
      box.className = "status ok";
      text.textContent = "API online";
    } catch {
      box.className = "status down";
      text.textContent = "API unreachable";
    }
  }
  checkApi();

  /* ---------- segmented control thumb ---------- */
  function syncSegmented() {
    $$(".segmented").forEach((seg) => {
      const radios = $$("input", seg);
      const i = Math.max(0, radios.findIndex((r) => r.checked));
      seg.style.setProperty("--i", i);
    });
  }
  form.addEventListener("change", (e) => {
    if (e.target.type === "radio") syncSegmented();
  });
  syncSegmented();

  /* ---------- auto loan-to-income ---------- */
  function ratio() {
    const inc = parseFloat(form.person_income.value);
    const amt = parseFloat(form.loan_amnt.value);
    if (!inc || !amt || inc <= 0) return null;
    return amt / inc;
  }
  function updateRatio() {
    const r = ratio();
    if (r === null) {
      ltiField.textContent = "—";
      ltiField.classList.remove("on");
    } else {
      ltiField.textContent = r.toFixed(2) + `  (${Math.round(r * 100)}%)`;
      ltiField.classList.add("on");
    }
  }
  ["person_income", "loan_amnt"].forEach((n) => form[n].addEventListener("input", updateRatio));

  /* ---------- example data ---------- */
  $("#fill-example").addEventListener("click", () => {
    const sample = {
      person_age: 27, person_income: 58000, person_emp_length: 4,
      cb_person_cred_hist_length: 5, loan_amnt: 12000, loan_int_rate: 11.8,
      loan_intent: "EDUCATION", person_home_ownership: "RENT",
      loan_grade: "B", cb_person_default_on_file: "N",
    };
    Object.entries(sample).forEach(([k, v]) => {
      const els = form.elements[k];
      if (els instanceof RadioNodeList) els.value = v;
      else els.value = v;
    });
    syncSegmented();
    updateRatio();
    clearInvalid();
  });

  /* ---------- validation ---------- */
  function clearInvalid() {
    errorEl.hidden = true;
    $$("input.invalid").forEach((i) => i.classList.remove("invalid"));
  }
  form.addEventListener("input", (e) => e.target.classList.remove("invalid"));

  function validate() {
    clearInvalid();
    const bad = [];
    $$('input[type="number"]', form).forEach((inp) => {
      const v = parseFloat(inp.value);
      const min = inp.min !== "" ? parseFloat(inp.min) : -Infinity;
      const max = inp.max !== "" ? parseFloat(inp.max) : Infinity;
      if (inp.value === "" || Number.isNaN(v) || v < min || v > max) bad.push(inp);
    });
    if (bad.length) {
      bad.forEach((b) => b.classList.add("invalid"));
      bad[0].focus();
      errorEl.textContent = "Please check the highlighted fields — some values are missing or out of range.";
      errorEl.hidden = false;
      return false;
    }
    return true;
  }

  /* ---------- animations ---------- */
  function countUp(el, to, ms = 1300) {
    const from = parseFloat(el.textContent) || 0;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    function frame(now) {
      const t = Math.min(1, (now - start) / ms);
      el.textContent = (from + (to - from) * ease(t)).toFixed(1);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function placeTick(threshold) {
    // Semicircle center (110,110), radius 90. 0 -> left, 1 -> right.
    const a = Math.PI * threshold;
    const cx = 110, cy = 110;
    const pt = (r) => [cx - r * Math.cos(a), cy - r * Math.sin(a)];
    const [x1, y1] = pt(78);
    const [x2, y2] = pt(104);
    tick.setAttribute("x1", x1); tick.setAttribute("y1", y1);
    tick.setAttribute("x2", x2); tick.setAttribute("y2", y2);
  }

  function flash(el) {
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
  }

  function setStat(id, value) {
    const el = $(id);
    el.textContent = value;
    flash(el);
  }

  function showResult(data, payload) {
    const p = Math.max(0, Math.min(1, data.default_probability));
    const high = data.default_prediction === 1;

    result.dataset.state = "done";
    result.dataset.risk = high ? "high" : "low";

    // reset then animate, so repeat submissions re-play the arc
    arc.style.transition = "none";
    arc.style.strokeDasharray = "0 100";
    void arc.getBoundingClientRect();
    arc.style.transition = "";
    requestAnimationFrame(() => (arc.style.strokeDasharray = `${p * 100} 100`));

    placeTick(data.threshold);
    pctEl.textContent = "0";
    countUp(pctEl, p * 100);

    pill.textContent = high ? "High risk" : "Low risk";

    setStat("#s-threshold", (data.threshold * 100).toFixed(1) + "%");
    setStat("#s-lti", payload.loan_percent_income.toFixed(2));
    setStat("#s-grade", `${payload.loan_grade} · ${payload.loan_int_rate.toFixed(1)}%`);
  }

  /* ---------- submit ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData(form);
    const income = parseFloat(fd.get("person_income"));
    const amount = parseFloat(fd.get("loan_amnt"));

    const payload = {
      person_age: parseInt(fd.get("person_age"), 10),
      person_income: income,
      person_home_ownership: fd.get("person_home_ownership"),
      person_emp_length: parseFloat(fd.get("person_emp_length")),
      loan_intent: fd.get("loan_intent"),
      loan_grade: fd.get("loan_grade"),
      loan_amnt: Math.round(amount),
      loan_int_rate: parseFloat(fd.get("loan_int_rate")),
      loan_percent_income: Math.round((amount / income) * 100) / 100,
      cb_person_default_on_file: fd.get("cb_person_default_on_file"),
      cb_person_cred_hist_length: parseInt(fd.get("cb_person_cred_hist_length"), 10),
    };

    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    result.dataset.state = "loading";
    delete result.dataset.risk;
    pill.textContent = "Analyzing…";

    // keep the loading state visible long enough to feel intentional
    const minWait = new Promise((r) => setTimeout(r, 700));

    try {
      const [res] = await Promise.all([
        fetch(`${API_BASE}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        minWait,
      ]);

      if (!res.ok) {
        let detail = `Server returned ${res.status}`;
        try {
          const j = await res.json();
          if (j.detail) detail = typeof j.detail === "string" ? j.detail : "Invalid input — check your values.";
        } catch {}
        throw new Error(detail);
      }

      const data = await res.json();
      showResult(data, payload);

      if (window.matchMedia("(max-width: 900px)").matches) {
        result.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (err) {
      result.dataset.state = "idle";
      pill.textContent = "Awaiting input";
      arc.style.strokeDasharray = "0 100";
      errorEl.textContent =
        err instanceof TypeError
          ? "Couldn't reach the API. If it's hosted on Render's free tier, it may be waking up — try again in a few seconds."
          : err.message;
      errorEl.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }
  });
})();
