# How Node.js Revolutionized the Server Landscape - 3

আগের নোটে আমরা দেখেছি, আধুনিক অ্যাপে Backend একটি **API Server** হিসেবে কাজ করে।
প্রশ্ন হলো, সেই Server কোন প্রযুক্তিতে বানাব? এই নোটে দেখব **Node.js কী, কেন এত
জনপ্রিয়, এবং ভেতরে কীভাবে কাজ করে।**

**ব্যবহৃত উদাহরণ:** একজন বাবুর্চি 👨‍🍳

- Node.js-এর মূল Thread = একজন বাবুর্চি
- অর্ডার = কাজ (Request)
- Event Loop = বাবুর্চির কাজ সামলানোর কৌশল

---

## Table of Contents

1. [Node.js কী?](#1-nodejs-কী)
2. [Built-in Modules](#2-built-in-modules)
3. [Node.js কেন জনপ্রিয়?](#3-nodejs-কেন-জনপ্রিয়)
4. [Data Intensive অ্যাপ্লিকেশন](#4-data-intensive-অ্যাপ্লিকেশন)
5. [Node.js-এর সীমাবদ্ধতা এবং Worker Threads](#5-nodejs-এর-সীমাবদ্ধতা-এবং-worker-threads)
6. [Node.js-এর Dependencies: V8 ও libuv](#6-nodejs-এর-dependencies-v8-ও-libuv)
7. [libuv ও Event Loop](#7-libuv-ও-event-loop)
8. [Thread Pool](#8-thread-pool)
9. [সবশেষে, Node.js আসলে কী?](#9-সবশেষে-nodejs-আসলে-কী)

---

## 1. Node.js কী?

- আগে JavaScript শুধু **Browser-এর ভেতরে** চলত।
- Node.js JavaScript-কে Browser-এর বাইরে, **Server-এ চালানোর সুযোগ** দিয়েছে।
- ফলে একই ভাষা (JavaScript) দিয়ে Frontend ও Backend দুটোই লেখা যায়।
  
> **বিপ্লবটা এখানেই:** একজন Developer একটি ভাষা শিখেই পুরো ওয়েব অ্যাপ বানাতে পারে।

**পরের প্রশ্ন:** Server বানাতে ফাইল পড়া, পথ চেনা, Request ধরা, এসব কাজ লাগে।
Node.js এগুলো কীভাবে দেয়? উত্তর: Built-in Modules।

---

## 2. Built-in Modules

Node.js-এর সাথে কিছু তৈরি করা Module আসে। আলাদা কিছু install করতে হয় না।
সবচেয়ে গুরুত্বপূর্ণ পাঁচটি:

### 2.1 `os` Module (Operating System) 💻

- যে কম্পিউটারে Node.js চলছে, তার তথ্য দেয়।

```js
const os = require('os');

console.log(os.platform()); // win32, linux, darwin
console.log(os.cpus().length); // CPU core সংখ্যা
console.log(os.totalmem()); // মোট RAM (bytes)
```

### 2.2 `fs` Module (File System) 📁

- ফাইল পড়া, লেখা, মোছা ও ফোল্ডার তৈরি করার কাজ করে।

```js
const fs = require('fs');

fs.readFile('note.txt', 'utf8', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```

### 2.3 `path` Module 🧭

- ফাইলের পথ (path) নিরাপদভাবে তৈরি ও বিশ্লেষণ করে।
- Windows (`\`) ও Linux (`/`) এর পার্থক্য নিজেই সামলায়।

```js
const path = require('path');

const filePath = path.join(__dirname, 'files', 'note.txt');
console.log(filePath);
console.log(path.basename(filePath)); // note.txt
console.log(path.extname(filePath)); // .txt
```

### 2.4 `http` Module 🌐

- HTTP Server তৈরি করে। আগের নোটে এটি দেখেছি।

```js
const http = require('http');

http
  .createServer((req, res) => {
    res.end('Hello from Node.js');
  })
  .listen(3000);
```

### 2.5 `url` Module 🔗

- URL ভেঙে তার অংশগুলো (path, query) আলাদা করে।

```js
const myUrl = new URL('https://example.com/products?id=5&color=red');

console.log(myUrl.pathname); // /products
console.log(myUrl.searchParams.get('id')); // 5
```

**একনজরে:**

- `os` = কম্পিউটারের তথ্য
- `fs` = ফাইল নিয়ে কাজ
- `path` = ফাইলের পথ
- `http` = Server তৈরি
- `url` = URL বিশ্লেষণ

**পরের প্রশ্ন:** এত কিছু সহজে পাওয়া যায়। এ ছাড়া আর কী
  কারণে Node.js জনপ্রিয়?

---

## 3. Node.js কেন জনপ্রিয়?

- ✅ **একই ভাষা:** Frontend ও Backend দুটোই JavaScript। শেখা সহজ।
- ✅ **দ্রুত:** Google-এর V8 Engine-এর কারণে কোড দ্রুত চলে (বিস্তারিত পরে)।
- ✅ **Non-blocking:** অনেক কাজ একসাথে সামলাতে পারে (বিস্তারিত পরে)।
- ✅ **npm:** বিশ্বের সবচেয়ে বড় প্যাকেজ ভান্ডারগুলোর একটি। বেশিরভাগ কাজের জন্য
  তৈরি প্যাকেজ পাওয়া যায়।
- ✅ **JSON-বান্ধব:** API-র ডেটা (JSON) JavaScript-এর সাথে স্বাভাবিকভাবে মিলে
  যায়।
- ✅ **বড় কমিউনিটি:** সমস্যায় সাহায্য ও শেখার উপকরণ সহজে মেলে।

---

## 4. Data Intensive অ্যাপ্লিকেশন

### Data Intensive কী?

- যে অ্যাপে **প্রচুর ডেটা আসা-যাওয়া করে**, কিন্তু ভারী হিসাব-নিকাশ কম।
- এই ধরনের কাজকে **I/O-heavy** (Input/Output নির্ভর) বলে।
  - ডেটাবেস থেকে ডেটা আনা
  - ফাইল পড়া ও লেখা
  - হাজার হাজার ব্যবহারকারীর Request সামলানো

### Node.js এখানে সেরা কেন?

- এমন কাজে বেশিরভাগ সময় কেটে যায় **অপেক্ষায়** (ডেটাবেস বা নেটওয়ার্কের
  উত্তরের জন্য)।
- Node.js ওই অপেক্ষার সময় বসে থাকে না, অন্য কাজ করে নেয়। **উপযুক্ত ক্ষেত্র:**

- REST API ও Backend সেবা
- Chat অ্যাপ ও Real-time অ্যাপ
- ভিডিও বা ডেটা Streaming
- E-commerce প্ল্যাটফর্ম

**পরের প্রশ্ন:** তাহলে Node.js কি সব কাজের জন্য ভালো?
  না। কোথায় তার দুর্বলতা?

---

## 5. Node.js-এর সীমাবদ্ধতা এবং Worker Threads

### সীমাবদ্ধতা: CPU-heavy কাজে দুর্বল ⚠️

- Node.js-এর JavaScript কোড **একটি মূল Thread-এ** চলে।
- কোনো কাজ যদি অনেক সময় ধরে CPU-কে ব্যস্ত রাখে (যেমন বিশাল হিসাব, ছবি বা ভিডিও
  প্রসেসিং), তাহলে **বাকি সব কাজ অপেক্ষায় আটকে যায়**।

### বাবুর্চির উদাহরণ 👨‍🍳

- একটি রেস্টুরেন্টে **মাত্র একজন বাবুর্চি** আছে।
- সাধারণ অর্ডার (ডিম ভাজা, চা বানানো) সে দ্রুত সামলে নেয়।
- হঠাৎ একজন ২০ কেজি বিরিয়ানির অর্ডার দিল, যেটা বাবুর্চিকে **একটানা কয়েক
  ঘণ্টা** নিজে রান্না করতে হবে।
- ওই সময় বাকি সব গ্রাহক বসে থাকবে, কেউ চা-ও পাবে না। 😟 এটাই **CPU-heavy কাজে
  Node.js-এর সমস্যা।**

### সমাধান: Worker Threads 👥

- Node.js-এর `worker_threads` Module ভারী কাজকে **আলাদা Thread-এ** পাঠাতে দেয়।
- বাবুর্চির উদাহরণে: বিরিয়ানির জন্য **আলাদা একজন সহকারী বাবুর্চি** রাখা হলো।
  মূল বাবুর্চি আগের মতো সাধারণ অর্ডার সামলাতে থাকে।

```js
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // মূল Thread: ভারী কাজ Worker-কে দেয়
  const worker = new Worker(__filename);
  worker.on('message', result => console.log('Result:', result));
} else {
  // Worker Thread: ভারী হিসাব এখানে হয়
  let sum = 0;
  for (let i = 0; i < 1e9; i++) sum += i;
  parentPort.postMessage(sum);
}
```

**সংক্ষেপে:**

- I/O-heavy কাজ = Node.js-এর মূল শক্তি
- CPU-heavy কাজ = Worker Threads ব্যবহার করো

**পরের প্রশ্ন:** একজন বাবুর্চি
  (Single Thread) এত অর্ডার সামলায় কীভাবে? এর উত্তর Node.js-এর ভেতরের গঠনে,
  অর্থাৎ তার Dependencies-এ।

---

## 6. Node.js-এর Dependencies: V8 ও libuv

Node.js নিজে একা সবকিছু করে না। এর দুটি মূল ভিত্তি আছে:

- **V8 Engine:** JavaScript কোড বোঝে ও চালায়।
- **libuv:** অপেক্ষার কাজগুলো (I/O) সামলায়।

```
          Node.js
     ┌──────┴──────┐
    V8           libuv
 (কোড চালায়)  (অপেক্ষার কাজ সামলায়)
```

### 6.1 V8 Engine ⚙️

- V8 হলো Google-এর তৈরি JavaScript Engine (Chrome Browser-ও এটি ব্যবহার করে)।
- C++ ভাষায় লেখা। **সমস্যা:** কম্পিউটার শুধু **0 ও 1** (Binary) বোঝে। সে
  JavaScript বোঝে না।

**V8-এর কাজ:** JavaScript কোডকে কম্পিউটারের বোঝার ভাষায় (Machine Code) রূপান্তর
করা।

**উদাহরণ:** তুমি লিখলে:

```js
console.log('Hello');
```

ভেতরে যা ঘটে (সরলীকৃত):

```
JavaScript কোড  →  V8  →  Machine Code (0 ও 1)  →  কম্পিউটার চালায়  →  Hello
```

- তুমি মানুষের ভাষায় (JavaScript) লেখো।
- V8 অনুবাদকের মতো সেটাকে 0 ও 1-এর ভাষায় বদলে দেয়।
- কম্পিউটার সেটি চালিয়ে ফল দেখায়।
  > V8 কোড দ্রুত চালানোর জন্য বিশেষ কৌশল (JIT compilation) ব্যবহার করে। এ কারণেই
  > Node.js দ্রুত।

**কিন্তু V8 শুধু কোড চালাতে জানে।** ফাইল পড়া, নেটওয়ার্ক Request, এসব অপেক্ষার
কাজ সামলাতে তার সাহায্য লাগে। সেই কাজ করে libuv।

### 6.2 libuv 🔄

- libuv হলো C ভাষায় লেখা একটি Library।
- এর কাজ: **Asynchronous (অপেক্ষার) কাজগুলো সামলানো।**
- এর দুটি মূল অংশ:
  - **Event Loop**
  - **Thread Pool** পরের দুই অংশে এ দুটি দেখব।

---

## 7. libuv ও Event Loop

### সমস্যাটি বুঝি

ধরো, তুমি একসাথে **অনেকগুলো ফাইল ডাউনলোড** দিলে।

- ❌ **ভুল পদ্ধতি:** একটি ডাউনলোড শেষ না হওয়া পর্যন্ত বাকিগুলো আটকে থাকবে।
- ✅ **সঠিক পদ্ধতি:** সবগুলো ফাইল **একসাথে এগোতে থাকে**। কোনোটি কোনোটির জন্য
  থেমে থাকে না। যেটা আগে শেষ হয়, সেটা আগে পাওয়া যায়। Node.js ঠিক এই সঠিক
  পদ্ধতিতে কাজ করে। একে বলে **Non-blocking**।

### বাবুর্চির উদাহরণ 👨‍🍳

- বাবুর্চি চুলায় **ভাত বসিয়ে** দিল। ভাত হতে সময় লাগবে।
- সে ভাতের পাশে দাঁড়িয়ে অপেক্ষা করে না। সে **সবজি কাটা** শুরু করল।
- ভাত হয়ে গেলে ঘণ্টা (signal) বাজে। বাবুর্চি এসে ভাত নামায়। এই "পরের কাজে
  যাওয়া আর সংকেত এলে ফিরে আসা" বিষয়টাই **Event Loop**-এর কাজ।

### Event Loop কীভাবে কাজ করে

1. JavaScript কোড একটি একটি করে চলে।
2. অপেক্ষার কাজ (ফাইল পড়া, ডেটাবেস Query) এলে সেটি **libuv-কে দিয়ে দেওয়া
   হয়**।
3. মূল Thread **অপেক্ষা না করে** পরের কোডে চলে যায়।
4. কাজ শেষ হলে তার **Callback** (কাজ শেষের ফাংশন) একটি সারিতে (queue) জমা হয়।
5. মূল Thread ফাঁকা হলে **Event Loop** সেই Callback তুলে এনে চালায়।

```
কোড চলছে → অপেক্ষার কাজ libuv-কে দাও → পরের কোডে যাও
                                              ↓
                  কাজ শেষ হলে Callback সারিতে জমা হয়
                                              ↓
                  মূল Thread ফাঁকা → Event Loop Callback চালায়
```

### কোড দিয়ে প্রমাণ

```js
const fs = require('fs');

console.log('1. শুরু');

fs.readFile('big-file.txt', () => {
  console.log('3. ফাইল পড়া শেষ');
});

console.log('2. পরের কাজ');
```

**আউটপুটের ক্রম:**

```
1. শুরু
2. পরের কাজ
3. ফাইল পড়া শেষ
```

- ফাইল পড়া শেষ হওয়ার জন্য Node.js বসে থাকেনি।
- সে আগে `2` চালিয়ে ফেলেছে, পরে `3`।

**পরের প্রশ্ন:** libuv অপেক্ষার কাজগুলো
  নিয়ে যায় কোথায়? সেখানেই Thread Pool-এর ভূমিকা।

---

## 8. Thread Pool

### Thread Pool কী?

- libuv-এর ভেতরে থাকা **কয়েকটি সহায়ক Thread-এর দল।**
- Default-এ **৪টি Thread** থাকে।
- মূল Thread যে অপেক্ষার কাজ libuv-কে দেয়, তার কিছু কাজ এই সহায়কেরা পেছনে করে
  দেয়। **বাবুর্চির উদাহরণে:** বাবুর্চির (মূল Thread) পাশে ৪ জন সহকারী (Thread
  Pool) আছে, যারা বাসন ধোয়া, সবজি ধোয়ার মতো ছোট কাজ করে দেয়। বাবুর্চি নিজে
  ওইসব কাজে সময় দেয় না।

### Thread Pool কোন কাজ করে?

- `fs` Module-এর ফাইল সংক্রান্ত কাজ
- `crypto` (পাসওয়ার্ড Hash করার মতো কাজ)
- `zlib` (ফাইল Compress করা)
- DNS Lookup-এর কিছু কাজ
  > **নোট:** নেটওয়ার্কের কাজ (যেমন HTTP Request ধরা) সাধারণত Operating
  > System-এর নিজস্ব ব্যবস্থায় সামলানো হয়, Thread Pool-এ নয়।

### Thread Pool বনাম Worker Threads

দুটি আলাদা জিনিস, গুলিয়ে ফেলো না:

- **Thread Pool:** Node.js-এর **ভেতরের** ব্যবস্থা। libuv নিজে ব্যবহার করে। I/O
  কাজের জন্য।
- **Worker Threads:** **তুমি নিজে** ব্যবহার করো। তোমার JavaScript-এর ভারী CPU
  কাজের জন্য।

---

## 9. সবশেষে, Node.js আসলে কী?

**Node.js কোনো ভাষা নয়, কোনো Framework-ও নয়।**

> **Node.js হলো একটি JavaScript Runtime Environment**, যা Browser-এর বাইরে
> JavaScript চালায়।

এটি তৈরি হয়েছে:

- **V8 Engine** দিয়ে: JavaScript বুঝে ও দ্রুত চালায়।
- **libuv** দিয়ে: Event Loop ও Thread Pool-এর মাধ্যমে অপেক্ষার কাজ সামলায়।
- **Built-in Modules** দিয়ে: `os`, `fs`, `path`, `http`, `url` ইত্যাদি তৈরি
  সুবিধা দেয়।

### পুরো প্রবাহ এক নজরে

```
Node.js = JavaScript Runtime
│
├── V8 Engine → JavaScript-কে Machine Code-এ বদলে চালায়
│
├── libuv
│     ├── Event Loop  → অপেক্ষার কাজে আটকে না থেকে পরের কাজে যায়
│     └── Thread Pool → I/O-র ভারী কাজ পেছনে সামলায়
│
├── Built-in Modules → os, fs, path, http, url
│
├── শক্তি → I/O-heavy ও Data Intensive অ্যাপ
└── দুর্বলতা → CPU-heavy কাজ (সমাধান: Worker Threads)
```

### দ্রুত রিভিশন

- **Node.js:** Browser-এর বাইরে JavaScript চালানোর Runtime
- **Built-in Modules:** `os`, `fs`, `path`, `http`, `url`
- **Data Intensive:** প্রচুর ডেটা আসা-যাওয়া, কম হিসাব (I/O-heavy)
- **সীমাবদ্ধতা:** CPU-heavy কাজে মূল Thread আটকে যায়
- **Worker Threads:** ভারী কাজ আলাদা Thread-এ পাঠানো (সহকারী বাবুর্চি)
- **V8:** JavaScript-কে Machine Code-এ বদলায়
- **libuv:** অপেক্ষার কাজ সামলায়
- **Event Loop:** অপেক্ষা না করে পরের কাজে যায়, কাজ শেষে Callback চালায়
- **Thread Pool:** libuv-এর ভেতরের ৪ Thread-এর সহায়ক দল
