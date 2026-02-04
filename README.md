# Real-time Illustrator / Visualizer

Quyidagi hujjat **Real-time AI Visualizer** loyihasi uchun **eng optimal, ishonchli va amaliy blueprint** (reja) bo‘lib, sizga Codex orqali loyiha skeletini tezda qurish, keyin esa bosqichma-bosqich production darajasiga olib chiqish uchun xizmat qiladi.

> **Asosiy tamoyil:** *AI faqat **DashboardSpec JSON** ishlab beradi, rendering va hisob-kitoblar esa deterministik backend/frontend tomonidan bajariladi.*

---

## 1. Maqsad va umumiy g‘oya
**Maqsad:** foydalanuvchi xom datani (CSV/Excel/JSON/Text) berishi bilan:
1) data avtomatik tozalanadi (clean),
2) parse qilinadi,
3) muhim metrikalar ajratiladi,
4) AI **dashboardspec** yaratadi,
5) tizim grafiklar, KPI kartalar, jadval va filtlarni ko‘rsatadi,
6) natijalarni **PNG/SVG/PDF** sifatida yuklab olish mumkin bo‘ladi.

**Ishonchlilik uchun:** AI hech qachon “bevosita grafik chizmaydi”, faqat **valid JSON spec** beradi.

---

## 2. Tavsiya etiladigan Tech Stack (optimal va ishonchli)

### Frontend
- **Next.js (React + TypeScript)**
- **TailwindCSS** (tez UI ishlash)
- **Charting**: **ECharts** yoki **Plotly**
- UI komponentlar: **shadcn/ui** (ixtiyoriy)

### Backend
- **FastAPI (Python)**
- **WebSocket** yoki **SSE** real-time uchun
- **DuckDB** (CSV/Parquet analytics uchun juda tez)
- **Pandas/PyArrow** (data cleaning)

### Storage
- Local yoki **S3-compatible** (raw & cleaned data)
- Specs & exports versioning

### Export
- Frontend chart eksport (PNG/SVG)
- Server-side eksport: **Playwright** (PDF/PNG)

---

## 3. Ish jarayoni (Pipeline)

1) **Ingestion** → file upload/paste
2) **Profiling** → schema + stats
3) **Cleaning/Transform** → typed dataset
4) **AI Spec Generation** → strict DashboardSpec JSON
5) **Renderer** → chart engine spec’ni chizadi
6) **Export** → PNG/SVG/PDF

---

## 4. DashboardSpec JSON (Asosiy contract)
**AI faqat quyidagi JSON schema ichida javob beradi.**

```json
{
  "title": "Sales Dashboard",
  "summary": "Key drivers of revenue.",
  "datasets": ["cleaned_main"],
  "kpis": [
    {"label": "Total Revenue", "metric": "sum", "field": "revenue", "format": "currency"},
    {"label": "Avg Order Value", "metric": "mean", "field": "order_value", "format": "currency"}
  ],
  "filters": [
    {"type": "date_range", "field": "date"},
    {"type": "multi_select", "field": "region"},
    {"type": "range", "field": "revenue"}
  ],
  "charts": [
    {
      "id": "rev_time",
      "type": "line",
      "title": "Revenue Over Time",
      "x": {"field": "date", "transform": "day"},
      "y": {"field": "revenue", "agg": "sum"},
      "groupBy": ["region"]
    },
    {
      "id": "top_products",
      "type": "bar",
      "title": "Top 10 Products",
      "x": {"field": "product"},
      "y": {"field": "revenue", "agg": "sum"},
      "sort": {"by": "y", "order": "desc"},
      "limit": 10
    }
  ],
  "layout": {
    "grid": [
      {"area": "kpis", "row": 0, "col": 0, "w": 12, "h": 2},
      {"area": "rev_time", "row": 2, "col": 0, "w": 12, "h": 5},
      {"area": "top_products", "row": 7, "col": 0, "w": 12, "h": 5}
    ]
  },
  "export": {
    "allow_png": true,
    "allow_svg": true,
    "allow_pdf": true
  }
}
```

**Qoida:** backend har doim schema-validatsiya qiladi (Pydantic/Zod). Agar xato bo‘lsa – AI’dan repair so‘raladi.

---

## 5. AI Prompting Strategiyasi

### System Prompt (AI Analyst)
```
You are a data analyst.
Return ONLY valid DashboardSpec JSON.
Never invent columns not in the schema.
Keep charts 5–9 max.
```

### Modelga beriladigan input:
- Column list + type
- Stats (min/max, missing %, unique count)
- 5–20 sample rows
- User goal (optional)

### Two-step flow (eng optimal)
1) **InsightDraft** → nimani ko‘rsatish kerak?
2) **DashboardSpec** → vizualizatsiya specs

Bu yondashuv “hallucination” xavfini kamaytiradi.

---

## 6. Real-time ishlash optimizatsiyasi
- Har update’da AI chaqirilmaydi
- AI faqat:
  - yangi dataset upload
  - schema o‘zgarishi
  - user goal o‘zgarsa
  - drift/anomaly aniqlansa

Real-time flow:
- Aggregates har N sekund qayta hisoblanadi
- AI faqat “muhim o‘zgarish” bo‘lsa ishlaydi

---

## 7. Export va Download
- **PNG/SVG**: client-side chart export
- **PDF**: server-side Playwright rendering

---

## 8. Xavfsizlik (muammosiz bo‘lishi uchun)
- AI hech qachon kod ishlatmaydi (faqat JSON spec)
- File upload limit va validation
- Rate limit OpenAI API
- Versioned specs + exports

---

## 9. API Endpointlar (minimal, ishlaydigan set)

### Backend Endpoints
- `POST /ingest` → file upload
- `POST /profile` → schema + stats
- `POST /dashboard/generate` → OpenAI → DashboardSpec
- `POST /dashboard/data` → aggregates for charts
- `POST /export/png` → chart image
- `POST /export/pdf` → full dashboard

---

## 10. Repo Strukturasi (Codex uchun “tayyor skeleton”)
```
/real-time-illustrator
  /apps
    /web (Next.js)
    /api (FastAPI)
  /packages
    /spec (DashboardSpec schema + validator)
    /charts (spec → chart options mapper)
  /storage
    /raw
    /cleaned
    /exports
  /docs
    architecture.md
    api.md
```

---

## 11. Implementation Milestones (tezkor va ishonchli)

### ✅ Milestone 1 (MVP)
- Upload CSV → clean+profile → AI spec → render dashboard → export PNG

### ✅ Milestone 2
- Filters, saved dashboards, PDF export, multi-dataset support

### ✅ Milestone 3
- Real-time streaming + anomaly insights + narratives

---

## 12. Codex uchun “Task List” (copy/paste)

- Next.js UI: upload, preview, dashboard, export
- FastAPI backend:
  - /ingest
  - /profile
  - /dashboard/generate
  - /dashboard/data
  - /export/png
  - /export/pdf
- DashboardSpec validator (Pydantic)
- Chart renderer: spec → ECharts/Plotly
- Caching aggregates
- Versioning datasets/specs/exports

---

## Yakuniy xulosa
Bu blueprint **optimal**, **muammosiz**, va **production’ga tayyor bo‘ladigan** tizimni bosqichma-bosqich qurish imkonini beradi. Siz OpenAI API’dan faqat **analitik xulosa va spec ishlab berish** uchun foydalanasiz — barcha rendering va hisob-kitoblar **deterministik va ishonchli** kod bilan bajariladi.

Agar hohlasangiz keyingi bosqichda men:
- FastAPI + Next.js project skeleton
- Pydantic DashboardSpec schema
- AI prompting setup
- Minimal working demo

ni ham to‘liq tayyorlab beraman.
