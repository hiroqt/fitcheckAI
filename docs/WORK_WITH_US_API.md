# FitCheck AI — Work With Us API Documentation
*Internal System Integration Guide for Co-Developers*

This document specifies the 3 APIs powering the **"Work With Us"** module. These endpoints are built and active in the FitCheck AI Next.js application, featuring CORS support for cross-origin calls from internal dashboards and internal systems.

---

## 🌐 Base URL & Configuration

| Environment | Base URL |
| :--- | :--- |
| **Production** | `https://tryfitcheckai.online` |
| **Local Development** | `http://localhost:3000` |

### Global Request Headers
```http
Content-Type: application/json
Accept: application/json
```
> **CORS:** Cross-Origin Resource Sharing is enabled (`Access-Control-Allow-Origin: *`, `POST, OPTIONS`). You can call these endpoints directly from internal web panels, serverless functions, cron jobs, or backend microservices.

---

## 📌 Endpoint Summary

| Action | HTTP Method | Endpoint Route |
| :--- | :--- | :--- |
| **1. General Inquiry** | `POST` | `/api/work-with-us/general` |
| **2. Pricing & Availability** | `POST` | `/api/work-with-us/pricing` |
| **3. Request a Demo** | `POST` | `/api/work-with-us/demo` |
| *(Unified Endpoint)* | `POST` | `/api/work-with-us` *(pass `"type": "general" \| "pricing" \| "demo"`)* |

---

## 1. General Inquiry API

Use this endpoint when an internal partner or brand has general questions about FitCheck, partnership inquiries, or custom integrations.

- **URL:** `/api/work-with-us/general`
- **Method:** `POST`

### Request Payload (JSON)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `brandName` | `string` | **Yes** | Brand, company, or organization name |
| `contactEmail` | `string` | **Yes** | Primary email address |
| `contactPerson` | `string` | No | Full name of the contact person |
| `phone` | `string` | No | Contact phone number / WhatsApp |
| `storeUrl` | `string` | No | Instagram handle or website link |
| `message` | `string` | **Yes** | Inquiry details, questions, or message |
| `source` | `string` | No | Default: `"internal_system"` |
| `metadata` | `object` | No | Any arbitrary key-value pairs from your internal DB |

### Example Request
```json
{
  "brandName": "Aura Studio Manila",
  "contactEmail": "partnerships@aurastudio.ph",
  "contactPerson": "Maria Santos",
  "phone": "+639171234567",
  "storeUrl": "https://instagram.com/aurastudiomnl",
  "message": "We would like to explore integrating FitCheck AI virtual try-on on our custom Shopify storefront for our upcoming Holiday capsule.",
  "source": "internal_crm"
}
```

### Success Response (`200 OK`)
```json
{
  "success": true,
  "inquiryId": "inq_general_1731557000000_a1b2c3",
  "type": "general",
  "status": "received",
  "message": "General inquiry received successfully.",
  "receivedAt": "2026-11-14T03:42:00.000Z",
  "data": {
    "type": "general",
    "brandName": "Aura Studio Manila",
    "contactEmail": "partnerships@aurastudio.ph",
    "contactPerson": "Maria Santos",
    "phone": "+639171234567",
    "storeUrl": "https://instagram.com/aurastudiomnl",
    "message": "We would like to explore integrating FitCheck AI virtual try-on...",
    "source": "internal_crm",
    "metadata": {}
  }
}
```

---

## 2. Pricing & Availability API

Use this endpoint when an internal lead or prospective brand requests pilot pricing, package tiers, volume allowances, and slot availability.

- **URL:** `/api/work-with-us/pricing`
- **Method:** `POST`

### Request Payload (JSON)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `brandName` | `string` | **Yes** | Brand or company name |
| `contactEmail` | `string` | **Yes** | Primary business email |
| `contactPerson` | `string` | No | Full name of contact |
| `phone` | `string` | No | Contact phone number |
| `storeUrl` | `string` | No | Store URL or Instagram link |
| `selectedPlan` | `string` | No | `"Starter · ₱499"`, `"Growth · ₱1,799"`, `"Larger business · ₱4,999/mo"`, or `"Custom"` |
| `garmentStyles` | `string` | No | e.g. `"dresses, barong, tailored coats"` |
| `averagePrice` | `number\|string` | No | Average item price in PHP (e.g. `1200`) |
| `monthlyVolume` | `string` | No | Estimated monthly visitors / try-on sessions |
| `message` | `string` | No | Notes on brand requirements or timeline |
| `source` | `string` | No | Default: `"internal_system"` |

### Example Request
```json
{
  "brandName": "Solara Atelier",
  "contactEmail": "founder@solaraatelier.com",
  "contactPerson": "Gabriel Cruz",
  "phone": "+639189876543",
  "storeUrl": "https://solaraatelier.com",
  "selectedPlan": "Growth · ₱1,799",
  "garmentStyles": "Tailored linen shirts, casual blazers",
  "averagePrice": 2400,
  "monthlyVolume": "2,000 monthly active shoppers",
  "message": "Interested in starting a 14-day pilot next month. Would like to verify garment onboarding availability.",
  "source": "internal_crm"
}
```

### Success Response (`200 OK`)
```json
{
  "success": true,
  "inquiryId": "inq_pricing_1731557000000_d4e5f6",
  "type": "pricing",
  "status": "received",
  "message": "Pricing & availability inquiry received successfully.",
  "receivedAt": "2026-11-14T03:42:00.000Z",
  "data": {
    "type": "pricing",
    "brandName": "Solara Atelier",
    "contactEmail": "founder@solaraatelier.com",
    "contactPerson": "Gabriel Cruz",
    "phone": "+639189876543",
    "storeUrl": "https://solaraatelier.com",
    "selectedPlan": "Growth · ₱1,799",
    "garmentStyles": "Tailored linen shirts, casual blazers",
    "averagePrice": "2400",
    "monthlyVolume": "2,000 monthly active shoppers",
    "message": "Interested in starting a 14-day pilot next month...",
    "source": "internal_crm",
    "metadata": {}
  }
}
```

---

## 3. Request a Demo API

Use this endpoint when a brand requests a live interactive walkthrough of the FitCheck virtual try-on engine, camera pipeline, or storefront widget.

- **URL:** `/api/work-with-us/demo`
- **Method:** `POST`

### Request Payload (JSON)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `brandName` | `string` | **Yes** | Brand or company name |
| `contactEmail` | `string` | **Yes** | Primary business email |
| `contactPerson` | `string` | No | Full name of the requester |
| `phone` | `string` | No | Contact number |
| `storeUrl` | `string` | No | Website or Instagram URL |
| `annualRevenue` | `string` | No | Revenue bracket (e.g. `₱1M–₱5M`, `Under ₱1M`) |
| `companySize` | `string` | No | e.g. `"5-15 employees"`, `"Solo founder"` |
| `preferredDate` | `string` | No | Preferred demo slot (e.g. `"Next Tuesday 2:00 PM PHT"`) |
| `garmentCategories` | `string` | No | Categories to demo (e.g. `"evening gowns, streetwear"`) |
| `message` | `string` | No | Specific goals or questions for the demo |
| `source` | `string` | No | Default: `"internal_system"` |

### Example Request
```json
{
  "brandName": "Harlan Denim Co.",
  "contactEmail": "leads@harlandenim.ph",
  "contactPerson": "Katrina Reyes",
  "phone": "+639175550192",
  "storeUrl": "https://harlandenim.ph",
  "preferredDate": "Thursday, 3:00 PM PHT",
  "garmentCategories": "Selvedge denim jackets, chore coats",
  "companySize": "10-25 employees",
  "message": "We want to see how real-time texture and cut drape on varied shopper heights.",
  "source": "internal_crm"
}
```

### Success Response (`200 OK`)
```json
{
  "success": true,
  "inquiryId": "inq_demo_1731557000000_g7h8i9",
  "type": "demo",
  "status": "received",
  "message": "Demo request received successfully.",
  "receivedAt": "2026-11-14T03:42:00.000Z",
  "data": {
    "type": "demo",
    "brandName": "Harlan Denim Co.",
    "contactEmail": "leads@harlandenim.ph",
    "contactPerson": "Katrina Reyes",
    "phone": "+639175550192",
    "storeUrl": "https://harlandenim.ph",
    "preferredDate": "Thursday, 3:00 PM PHT",
    "garmentCategories": "Selvedge denim jackets, chore coats",
    "companySize": "10-25 employees",
    "message": "We want to see how real-time texture and cut drape...",
    "source": "internal_crm",
    "metadata": {}
  }
}
```

---

## ⚠️ Validation & Error Handling

If required fields are missing or invalid, the API returns `400 Bad Request` with an `errors` object detailing each field:

```json
{
  "success": false,
  "type": "general",
  "status": "received",
  "message": "Validation failed for General Inquiry",
  "receivedAt": "2026-11-14T03:42:00.000Z",
  "errors": {
    "brandName": "Brand name or company name is required.",
    "contactEmail": "A valid contact email is required.",
    "message": "Inquiry message or questions are required."
  }
}
```

---

## 💻 Code Snippets for Internal System Integration

### Axios (JavaScript / TypeScript)
```typescript
import axios from "axios";

const fitcheckApi = axios.create({
  baseURL: "https://tryfitcheckai.online",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// 1. General Inquiry
export const sendGeneralInquiry = (data: {
  brandName: string;
  contactEmail: string;
  message: string;
  contactPerson?: string;
  phone?: string;
  storeUrl?: string;
  source?: string;
}) => fitcheckApi.post("/api/work-with-us/general", data);

// 2. Pricing & Availability
export const sendPricingInquiry = (data: {
  brandName: string;
  contactEmail: string;
  selectedPlan?: string;
  garmentStyles?: string;
  averagePrice?: number | string;
  monthlyVolume?: string;
  contactPerson?: string;
  phone?: string;
  storeUrl?: string;
  message?: string;
}) => fitcheckApi.post("/api/work-with-us/pricing", data);

// 3. Request a Demo
export const sendDemoRequest = (data: {
  brandName: string;
  contactEmail: string;
  preferredDate?: string;
  garmentCategories?: string;
  companySize?: string;
  annualRevenue?: string;
  contactPerson?: string;
  phone?: string;
  storeUrl?: string;
  message?: string;
}) => fitcheckApi.post("/api/work-with-us/demo", data);
```

### Fetch (Native JavaScript / TypeScript)
```typescript
async function submitGeneralInquiry(data: {
  brandName: string;
  contactEmail: string;
  message: string;
  storeUrl?: string;
}) {
  const response = await fetch("https://tryfitcheckai.online/api/work-with-us/general", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to submit inquiry");
  }
  return result;
}
```

### cURL
```bash
# 1. General Inquiry
curl -X POST https://tryfitcheckai.online/api/work-with-us/general \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Aura Studio",
    "contactEmail": "info@aurastudio.ph",
    "message": "Inquiring about collaboration."
  }'

# 2. Pricing & Availability
curl -X POST https://tryfitcheckai.online/api/work-with-us/pricing \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Aura Studio",
    "contactEmail": "info@aurastudio.ph",
    "selectedPlan": "Growth · ₱1,799"
  }'

# 3. Request a Demo
curl -X POST https://tryfitcheckai.online/api/work-with-us/demo \
  -H "Content-Type: application/json" \
  -d '{
    "brandName": "Aura Studio",
    "contactEmail": "info@aurastudio.ph",
    "preferredDate": "Friday 2PM"
  }'
```

### Python
```python
import requests

payload = {
    "brandName": "Aura Studio",
    "contactEmail": "info@aurastudio.ph",
    "message": "We would like to test FitCheck on our new drop."
}

res = requests.post(
    "https://tryfitcheckai.online/api/work-with-us/general",
    json=payload,
    headers={"Content-Type": "application/json"}
)

print(res.status_code, res.json())
```

