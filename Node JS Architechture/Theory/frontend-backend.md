# Frontend vs Backend Essentials - 2

আগের নোটে আমরা শিখেছি, Client আর Server কীভাবে HTTP দিয়ে কথা বলে। এই নোটে দেখব,
**একটি ওয়েব অ্যাপ্লিকেশন আসলে কোন কোন অংশ দিয়ে তৈরি** এবং আধুনিক ইন্ডাস্ট্রি
কেন **API মডেল** বেছে নিয়েছে।

**ব্যবহৃত উদাহরণ:** একটি রেস্টুরেন্ট 🍽️

- ডাইনিং হল = **Frontend**
- রান্নাঘর = **Backend**
- ওয়েটার = **API**

---

## Table of Contents

1. [Frontend vs Backend: ওয়েব ইঞ্জিনিয়ারিংয়ের দুই ভাই](#1-frontend-vs-backend-ওয়েব-ইঞ্জিনিয়ারিংয়ের-দুই-ভাই)
2. [Frontend এবং Frontend Frameworks](#2-frontend-এবং-frontend-frameworks)
3. [Backend এবং HTTP Server](#3-backend-এবং-http-server)
4. [Static Website vs Dynamic Website](#4-static-website-vs-dynamic-website)
5. [Dynamic Website: দুটি পদ্ধতি](#5-dynamic-website-দুটি-পদ্ধতি)
6. [Template Based (Server Side Rendering)](#6-template-based-server-side-rendering)
7. [API Based](#7-api-based)
8. [API-এর সুবিধা এবং ইন্ডাস্ট্রি কেন API মডেল বেছে নিল](#8-api-এর-সুবিধা-এবং-ইন্ডাস্ট্রি-কেন-api-মডেল-বেছে-নিল)
9. [Summary](#9-summary)

---

## 1. Frontend vs Backend: ওয়েব ইঞ্জিনিয়ারিংয়ের দুই ভাই

একটি ওয়েব অ্যাপের দুটি প্রধান অংশ থাকে। দুটিই জরুরি, এবং একটি ছাড়া অন্যটি
অসম্পূর্ণ।

- **Frontend:** ব্যবহারকারী যা **দেখে এবং ব্যবহার করে**।
  - বাটন, ফর্ম, ছবি, মেনু, রং, লেআউট
- **Backend:** ব্যবহারকারী যা **দেখে না, কিন্তু যা সব কাজ করে**।
  - ডেটাবেস, Login যাচাই, পেমেন্ট, ব্যবসায়িক নিয়ম **রেস্টুরেন্টের উদাহরণ:**

- তুমি ডাইনিং হলে বসে মেনু দেখো, খাবার খাও। এটাই **Frontend**।
- রান্নাঘরে খাবার তৈরি হয়, তুমি তা দেখো না। এটাই **Backend**।

**আগের নোটের সাথে
  সংযোগ:**

- **Client** = Frontend (Browser-এ চলে)
- **Server** = Backend (Server-এ চলে)
- দুজনের মধ্যে যোগাযোগ হয় **HTTP Request ও Response** দিয়ে।

```
Frontend (Browser)  ---- HTTP Request ---->  Backend (Server)
Frontend (Browser)  <--- HTTP Response ----  Backend (Server)
```

---

## 2. Frontend এবং Frontend Frameworks

### Frontend-এর তিনটি মূল ভিত্তি

- **HTML:** পেজের কাঠামো (বাড়ির দেয়াল)
- **CSS:** সাজসজ্জা ও রং (বাড়ির রং ও ডিজাইন)
- **JavaScript:** আচরণ ও ইন্টারঅ্যাকশন (বাড়ির বিদ্যুৎ ও সুইচ)

### Frontend Framework কেন দরকার?

- বড় অ্যাপে শুধু HTML, CSS ও JavaScript দিয়ে সবকিছু সামলানো কঠিন হয়ে যায়।
- Framework কোড সাজানোর একটি নিয়ম দেয় এবং বারবার ব্যবহারযোগ্য অংশ (component)
  বানাতে সাহায্য করে। জনপ্রিয় Frontend Framework ও Library:

- **React** (বর্তমানে সবচেয়ে জনপ্রিয়)
- **Vue**
- **Angular**
- **Svelte**

> **Frontend-এর কাজ:** ব্যবহারকারীর সামনে সুন্দর UI দেখানো এবং Backend থেকে
  > ডেটা এনে সেটি সাজিয়ে দেখানো।

---

## 3. Backend এবং HTTP Server

### Backend কী করে?

- Request গ্রহণ করে
- ডেটাবেস থেকে ডেটা আনে বা সংরক্ষণ করে
- Login, অনুমতি ও নিরাপত্তা যাচাই করে
- ব্যবসায়িক নিয়ম প্রয়োগ করে (যেমন অর্ডারের দাম হিসাব)
- Response পাঠায়

### Backend Language

Backend অনেক ভাষায় লেখা যায়:

- **JavaScript (Node.js)** ← আমরা এটি শিখছি
- Python, Java, PHP, Go, C#

**Node.js-এর বিশেষ সুবিধা:** Frontend ও Backend দুই
  জায়গাতেই একই ভাষা (JavaScript) ব্যবহার করা যায়।

### HTTP Server

Backend-এর মূল অংশ হলো একটি **HTTP Server**, যা Client-এর Request শোনে এবং
Response পাঠায়।

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello from backend!');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

> **Backend-এর কাজ:** Request বুঝে সঠিক ডেটা তৈরি করে Response পাঠানো।

**পরের প্রশ্ন:** Backend যে Response পাঠায়, সেটি কি সবার জন্য একই থাকে, নাকি
বদলায়? এখান থেকেই Static ও Dynamic ওয়েবসাইটের পার্থক্য আসে।

---

## 4. Static Website vs Dynamic Website

### Static Website 📄

- Server আগে থেকে তৈরি করা **একই ফাইল** সবাইকে পাঠায়।
- সবাই একই কনটেন্ট দেখে।
- ডেটাবেস বা বাড়তি প্রক্রিয়া লাগে না।
- উদাহরণ: পোর্টফোলিও সাইট, ল্যান্ডিং পেজ, ডকুমেন্টেশন **রেস্টুরেন্টের উদাহরণ:**
  ছাপানো মেনু কার্ড। সবাই একই মেনু পায়।

**সুবিধা:** দ্রুত, সস্তা ও নিরাপদ। 
**সীমাবদ্ধতা:** ব্যবহারকারী অনুযায়ী কনটেন্ট
বদলানো যায় না।

### Dynamic Website ⚙️

- ব্যবহারকারী বা ডেটা অনুযায়ী **কনটেন্ট বদলে যায়**।
- Server ডেটাবেস থেকে তথ্য নিয়ে Response তৈরি করে।
- উদাহরণ: Facebook, Daraz, YouTube, Gmail **রেস্টুরেন্টের উদাহরণ:** তুমি যা
  অর্ডার করো, রান্নাঘর সেটিই তৈরি করে দেয়।

**সুবিধা:** ব্যক্তিগত ও সবসময় হালনাগাদ কনটেন্ট। **সীমাবদ্ধতা:** Backend,
ডেটাবেস ও বেশি পরিচালনা দরকার।

---

## 5. Dynamic Website: দুটি পদ্ধতি

Dynamic ওয়েবসাইট তৈরির দুটি প্রধান পদ্ধতি আছে। মূল পার্থক্য: **পেজ কোথায় তৈরি
হয়?**

- **Template Based (Server Side Rendering):** Server পুরো HTML পেজ তৈরি করে
  পাঠায়।
- **API Based:** Server শুধু ডেটা পাঠায়, Frontend সেই ডেটা দিয়ে পেজ তৈরি করে।
  পরের দুটি অংশে প্রতিটি পদ্ধতি আলাদাভাবে দেখব।

---

## 6. Template Based (Server Side Rendering)

### ধারণা

- Server একটি **Template** (HTML-এর ছাঁচ) ও **ডেটাবেসের ডেটা** একসাথে মেলায়।
- তৈরি হওয়া **সম্পূর্ণ HTML পেজ** Browser-কে পাঠায়।
- Browser শুধু সেটি দেখায়। এই পদ্ধতিকে **Server Side Rendering (SSR)** বলে,
  কারণ পেজ তৈরির কাজ Server-এ হয়।

### কীভাবে কাজ করে

```
1. Browser  ---- Request ---->  Server
2. Server    ডেটাবেস থেকে ডেটা আনে
3. Server    Template + ডেটা = সম্পূর্ণ HTML
4. Browser  <--- HTML পেজ ----  Server
```

### Template Engine-এর উদাহরণ

- Node.js: **EJS, Pug, Handlebars**
- PHP: Blade (Laravel)
- Python: Jinja (Django, Flask)

### সুবিধা

- ✅ প্রথমবার পেজ দ্রুত দেখা যায়।
- ✅ Search engine (SEO) সহজে কনটেন্ট পড়তে পারে।
- ✅ সরল ও ছোট প্রজেক্টের জন্য উপযোগী।

### সীমাবদ্ধতা

- ⚠️ প্রতিটি নতুন পেজে সাধারণত পুরো পেজ আবার লোড হয়।
- ⚠️ Frontend ও Backend একসাথে জড়িয়ে থাকে, আলাদা করা কঠিন।
- ⚠️ একই ডেটা মোবাইল অ্যাপে ব্যবহার করা যায় না, কারণ Server শুধু HTML পাঠায়।

**পরের প্রশ্ন:** যদি Server শুধু ডেটা পাঠায় আর পেজ বানানোর দায়িত্ব Frontend
  নেয়, তাহলে কী হবে? সেটাই API Based পদ্ধতি।

---

## 7. API Based

### API কী?

**API (Application Programming Interface)** হলো এমন একটি মাধ্যম, যার মাধ্যমে
একটি সফটওয়্যার অন্য সফটওয়্যারের সাথে কথা বলে।

**রেস্টুরেন্টের উদাহরণ:** ওয়েটার। তুমি সরাসরি রান্নাঘরে যাও না। ওয়েটার তোমার
অর্ডার রান্নাঘরে নিয়ে যায় এবং খাবার ফেরত আনে। API ঠিক ওই ওয়েটারের কাজ করে।

### ধারণা

- Backend শুধু **ডেটা** পাঠায়, সাধারণত **JSON** ফরম্যাটে।
- Frontend সেই ডেটা নিয়ে নিজে UI তৈরি করে।

### কীভাবে কাজ করে

```
1. Browser (Frontend)  ---- GET /api/products ---->  Backend
2. Backend             ডেটাবেস থেকে ডেটা আনে
3. Browser (Frontend)  <--- JSON ডেটা ---------------  Backend
4. Frontend            JSON দিয়ে পেজ তৈরি করে দেখায়
```

### নমুনা API Response

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Shoes", "price": 1200 },
    { "id": 2, "name": "Bag", "price": 800 }
  ]
}
```

লক্ষ করো, এখানে কোনো HTML নেই। শুধু ডেটা।

### জনপ্রিয় Framework

- **React, Vue, Angular** (Frontend)
- **Next.js** (React-ভিত্তিক Framework, API Based অ্যাপ বানাতে খুব জনপ্রিয়)

> **নোট:** Next.js আধুনিক প্রজেক্টে ব্যাপকভাবে ব্যবহৃত হয় এবং এটি API Based ও
> Server Side Rendering, দুটি পদ্ধতিই সমর্থন করে।

### সুবিধা

- ✅ পেজ পুরো রিলোড হয় না, শুধু প্রয়োজনীয় ডেটা আসে, তাই অ্যাপ দ্রুত ও মসৃণ
  মনে হয়।
- ✅ Frontend ও Backend আলাদা থাকে।
- ✅ একই Backend অনেক Client ব্যবহার করতে পারে।

### সীমাবদ্ধতা

- ⚠️ সাধারণ Client-side rendering-এ SEO তুলনামূলক কঠিন (Next.js-এর মতো Framework
  এটি সমাধান করে)।
- ⚠️ দুটি আলাদা অংশ সামলাতে হয়।

---

## 8. API-এর সুবিধা এবং ইন্ডাস্ট্রি কেন API মডেল বেছে নিল

### API-এর প্রধান সুবিধা

1. **একটি Backend, অনেক Client** 📱💻
   - একই Backend ওয়েবসাইট, Android অ্যাপ ও iOS অ্যাপ, সবাইকে ডেটা দিতে পারে।
   - আলাদা আলাদা Backend বানাতে হয় না।
2. **Frontend ও Backend স্বাধীনভাবে কাজ করে** 👥
   - Frontend টিম UI নিয়ে কাজ করে, Backend টিম ডেটা ও লজিক নিয়ে।
   - একে অপরের জন্য অপেক্ষা করতে হয় না।
3. **প্রযুক্তি বদলানো সহজ** 🔄
   - Frontend React থেকে অন্য কিছুতে বদলালেও Backend অপরিবর্তিত থাকে, এবং
     উল্টোটাও সত্যি।
4. **দ্রুত ব্যবহারকারী অভিজ্ঞতা** ⚡
   - পুরো পেজ নয়, শুধু প্রয়োজনীয় ডেটা আসে।
5. **আলাদাভাবে Scale করা যায়** 📈
   - Backend-এ চাপ বাড়লে শুধু Backend বড় করা যায়।
6. **তৃতীয় পক্ষের সাথে সংযোগ সহজ** 🔗
   - পেমেন্ট গেটওয়ে, ম্যাপ, SMS সেবা সবই API দিয়ে যুক্ত হয়।

### ইন্ডাস্ট্রি কেন API মডেল বেছে নিল?

ধারাবাহিকভাবে বোঝার জন্য:

1. **শুরুতে** ওয়েবসাইট মূলত Template Based ছিল। Server HTML বানিয়ে পাঠাত।
2. **তারপর স্মার্টফোন ও মোবাইল অ্যাপ এল।** কোম্পানিগুলোর একই ডেটা ওয়েব ও
   মোবাইল, দুই জায়গায় দরকার হলো।
3. Template Based পদ্ধতিতে Server শুধু HTML দেয়, যা মোবাইল অ্যাপে কাজে লাগে না।
4. সমাধান: Backend শুধু **ডেটা (JSON)** দেবে, আর যার যেমন দরকার, সে নিজের মতো UI
   বানাবে।
5. একই সময়ে **React-এর মতো আধুনিক Frontend Framework** জনপ্রিয় হলো, যা API
   থেকে ডেটা নিয়ে UI বানাতে দক্ষ।
6. বড় কোম্পানিতে **আলাদা Frontend ও Backend টিম** কাজ করে। API তাদের মাঝে একটি
   পরিষ্কার চুক্তি (contract) হিসেবে কাজ করে। **সংক্ষেপে:** একাধিক প্ল্যাটফর্ম,
   টিমের স্বাধীনতা, দ্রুত অভিজ্ঞতা ও সহজ Scale, এই কারণগুলোই API মডেলকে
   ইন্ডাস্ট্রির সাধারণ পছন্দে পরিণত করেছে।

---

## 9. Summary

### পুরো প্রবাহ এক নজরে

```
Web Engineering
├── Frontend  (যা ব্যবহারকারী দেখে)
│     └── React, Vue, Angular, Next.js
└── Backend   (যা পেছনে কাজ করে)
      └── Node.js দিয়ে HTTP Server
            │
            ├── Static Website  → একই ফাইল সবার জন্য
            └── Dynamic Website → কনটেন্ট বদলায়
                  ├── Template Based (SSR) → Server পুরো HTML বানায়
                  └── API Based           → Server শুধু JSON দেয়,
                                            Frontend UI বানায়
```

### দ্রুত রিভিশন

- **Frontend:** ব্যবহারকারী যা দেখে (UI)
- **Backend:** পেছনের লজিক, ডেটাবেস ও Server
- **Static:** সবার জন্য একই ফাইল
- **Dynamic:** ডেটা অনুযায়ী বদলানো কনটেন্ট
- **Template Based (SSR):** Server পুরো HTML পেজ বানিয়ে পাঠায়
- **API Based:** Server শুধু ডেটা পাঠায়, Frontend পেজ বানায়
- **API:** দুই সফটওয়্যারের মধ্যে যোগাযোগের মাধ্যম (ওয়েটার)
- **API মডেলের মূল কারণ:** একটি Backend দিয়ে ওয়েব ও মোবাইল, দুটিই সামলানো এবং
  টিমগুলোকে স্বাধীনভাবে কাজ করতে দেওয়া
