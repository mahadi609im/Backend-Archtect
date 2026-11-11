# Streams, Buffers and the Modular System in Node.js - 5

আগের নোটগুলোতে আমরা দেখেছি, বড় ডেটা (যেমন ভিডিও) **ছোট ছোট অংশে (chunk)**
পাঠানো হয়, আর Node.js **Event-Driven** পদ্ধতিতে কাজ করে। এই নোটে দেখব, Node.js
কীভাবে সেই ডেটা অংশে অংশে সামলায় (**Buffer ও Stream**), এবং নিজের কোড কীভাবে
গুছিয়ে ফাইলে ভাগ করে ব্যবহার করব (**Modular System**)।

**ব্যবহৃত উদাহরণ:**

- Stream ও Buffer: **পিজা** 🍕
- Modular System: **বাংলাদেশ থেকে থাইল্যান্ডে পণ্য রপ্তানি ও আমদানি** 🚢

---

## Table of Contents

1. [Buffer ও Stream কী?](#1-buffer-ও-stream-কী)
2. [পিজার উদাহরণ](#2-পিজার-উদাহরণ)
3. [Stream-এর সুবিধা](#3-stream-এর-সুবিধা)
4. [Stream-এর ধরন](#4-stream-এর-ধরন)
5. [Modular System কেন দরকার](#5-modular-system-কেন-দরকার)
6. [CommonJS ও ESM](#6-commonjs-ও-esm)
7. [আমরা কোনটি ব্যবহার করব?](#7-আমরা-কোনটি-ব্যবহার-করব)
8. [Modular System কোথায় ব্যবহার করি](#8-modular-system-কোথায়-ব্যবহার-করি)
9. [Summary](#9-summary)

---

## 1. Buffer ও Stream কী?

### সমস্যা

- একটি ফাইল বা ভিডিও অনেক বড় হতে পারে।
- পুরোটা একবারে মেমোরিতে নিয়ে কাজ করা ধীর ও ব্যয়বহুল।

### Stream

- **Stream হলো ডেটার প্রবাহ।** ডেটা একবারে না এসে **ছোট ছোট অংশে (chunk)**
  ধারাবাহিকভাবে আসে।
- একটি পাইপ দিয়ে পানি বয়ে যাওয়ার মতো।

### Buffer

- **Buffer হলো একটি অস্থায়ী জায়গা**, যেখানে ডেটার অংশগুলো মেমোরিতে অল্প সময়ের
  জন্য জমা থাকে।
- Buffer-এ ডেটা থাকে **Binary (byte) আকারে**, অর্থাৎ কম্পিউটার যে ভাষা বোঝে।

```js
const buf = Buffer.from('Hi');

console.log(buf); // <Buffer 48 69>
console.log(buf.toString()); // Hi
```

- `48` আর `69` হলো `H` ও `i` অক্ষরের byte মান (hexadecimal)। **সম্পর্কটি এক
  লাইনে:**

> **Stream** ডেটা অংশে অংশে বয়ে আনে, আর **Buffer** সেই অংশগুলো কিছুক্ষণ ধরে
> রাখে।

**পরের প্রশ্ন:** এই দুটির সম্পর্ক সহজে বুঝতে একটি পরিচিত উদাহরণ দেখি।

---

## 2. পিজার উদাহরণ

### পদ্ধতি ১: Stream ছাড়া ❌

- একটি রেস্টুরেন্টে ১০০ জনের জন্য পিজা বানানো হচ্ছে।
- শেফ **১০০টি পিজা একসাথে বানিয়ে শেষ করে**, তারপর পরিবেশন শুরু করল।
- ফলে সবাইকে অনেকক্ষণ অপেক্ষা করতে হলো, আর রান্নাঘরে বিশাল জায়গা লাগল।

### পদ্ধতি ২: Stream দিয়ে ✅

- শেফ **একটি একটি করে পিজা বানিয়ে** সাথে সাথে পরিবেশন করছে।
- গ্রাহক প্রথম পিজা পেয়েই খাওয়া শুরু করল, বাকিগুলো আসতে থাকল।

### Buffer-এর ভূমিকা: প্লেট 🍽️

- শেফ পিজা বানায় **দ্রুত**, তুমি খাও **ধীরে**।
- বাড়তি পিজা প্লেটে **কিছুক্ষণ অপেক্ষা করে**। এই প্লেটটাই **Buffer**।

### পুরো মিল

- **ডেটার উৎস** = শেফ ও ওভেন
- **Stream** = পিজা একটির পর একটি আসার ধারা
- **Chunk** = একটি পিজা বা একটি স্লাইস
- **Buffer** = প্লেট, যেখানে পিজা অস্থায়ীভাবে অপেক্ষা করে
- **ডেটার গন্তব্য** = তুমি, যে খাচ্ছ
  > **Backpressure (চাপ নিয়ন্ত্রণ):** প্লেট ভরে গেলে শেফ সাময়িক থেমে যায়,
  > যাতে পিজা উপচে না পড়ে। Node.js-এ `pipe()` এটি নিজেই সামলায়।

---

## 3. Stream-এর সুবিধা

### সুবিধাগুলো

1. **কম মেমোরি 💾:** পুরো ফাইল না নিয়ে শুধু বর্তমান chunk মেমোরিতে থাকে।
2. **দ্রুত শুরু ⚡:** প্রথম chunk আসামাত্র কাজ শুরু করা যায়, পুরোটার জন্য
   অপেক্ষা করতে হয় না।
3. **বড় ফাইল সামলানো 📦:** কয়েক GB-এর ফাইলও সহজে প্রসেস করা যায়।
4. **কাজ একটির পর একটি জুড়ে দেওয়া:** পড়া, বদলানো ও লেখা পাইপের মতো যুক্ত করা
   যায়।

### YouTube / Netflix উদাহরণ 🎬

- ভিডিও চালালে পুরোটা ডাউনলোড হওয়ার অপেক্ষা করতে হয় না।
- প্রথম অংশ এলেই ভিডিও চলতে শুরু করে, বাকি অংশ পেছনে লোড হতে থাকে।
- যদি পুরো ভিডিও (কয়েকশ MB বা GB) আসার জন্য অপেক্ষা করতে হতো, তাহলে কেউ ভিডিও
  দেখতে চাইত না।
  > বড় প্ল্যাটফর্মগুলো ভিডিওকে ছোট segment-এ ভাগ করে পাঠায়। মূল ধারণা
  > Stream-এর মতোই: **একটু একটু করে পাঠানো, একটু একটু করে ব্যবহার করা।**

### কোডে পার্থক্য

**Stream ছাড়া (পুরো ফাইল মেমোরিতে) ❌**

```js
const fs = require('fs');
const http = require('http');

http
  .createServer((req, res) => {
    fs.readFile('video.mp4', (err, data) => {
      // পুরো ফাইল RAM-এ ঢোকে
      res.end(data);
    });
  })
  .listen(3000);
```

**Stream দিয়ে (অংশে অংশে) ✅**

```js
const fs = require('fs');
const http = require('http');

http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'video/mp4' });
    fs.createReadStream('video.mp4').pipe(res); // chunk আকারে যায়
  })
  .listen(3000);
```

- প্রথম কোডে ১ জিবি ফাইলের জন্য প্রতিটি Request-এ প্রায় ১ জিবি RAM লাগে।
- দ্বিতীয় কোডে একসময়ে শুধু ছোট একটি chunk মেমোরিতে থাকে। **পরের প্রশ্ন:**
  Stream সব একই রকম নয়। কেউ ডেটা দেয়, কেউ নেয়, কেউ বদলায়। চলো চার ধরন দেখি।

---

## 4. Stream-এর ধরন

Node.js-এ Stream চার ধরনের। পিজার দোকানের উদাহরণে মেলাই:

### 4.1 Readable Stream (উৎস) 📤

- যেখান থেকে **ডেটা পড়া যায়।**
- **পিজা উদাহরণ:** ওভেন, যেখান থেকে পিজা বের হয়।
- **উদাহরণ:** `fs.createReadStream()`, সার্ভারে আসা HTTP Request,
  `process.stdin`

```js
const fs = require('fs');
const readStream = fs.createReadStream('note.txt', 'utf8');

readStream.on('data', chunk => console.log('পেলাম:', chunk));
readStream.on('end', () => console.log('ডেটা শেষ'));
```

- Stream আসলে **Event Emitter**। `data` ও `end` হলো তার Event, যা আগের নোটের
  Event-Driven ধারণার সাথে মেলে।

### 4.2 Writable Stream (গন্তব্য) 📥

- যেখানে **ডেটা লেখা যায়।**
- **পিজা উদাহরণ:** তোমার প্লেট বা পিজার বক্স, যেখানে পিজা গিয়ে জমা হয়।
- **উদাহরণ:** `fs.createWriteStream()`, HTTP Response, `process.stdout`

```js
const writeStream = fs.createWriteStream('output.txt');

writeStream.write('প্রথম লাইন\n');
writeStream.end('শেষ লাইন\n');
```

### 4.3 Duplex Stream (দুই দিকেই) 🔄

- **একই সাথে পড়া ও লেখা দুটোই** করা যায়। দুই দিকের প্রবাহ একে অপরের থেকে
  স্বাধীন।
- **উদাহরণ:** ফোন কল। তুমি কথা বলছ (লেখা) এবং একই সাথে শুনছ (পড়া)।
- **Node.js-এ:** TCP Socket (`net.Socket`)। আমরা প্রথম নোটে Socket শিখেছি, যা
  দুই দিকে ডেটা আদান-প্রদান করে।

### 4.4 Transform Stream (বদলে দেয়) 🔧

- Duplex-এর বিশেষ রূপ, যেখানে **ডেটা ভেতর দিয়ে যাওয়ার সময় বদলে যায়।**
- **পিজা উদাহরণ:** পিজা কাটার মেশিন। পুরো পিজা ঢোকে, স্লাইস বেরোয়।
- **উদাহরণ:** `zlib.createGzip()` (ফাইল ছোট করা), Encrypt করা নিজে বানানো ছোট
  একটি উদাহরণ (লেখা বড় হাতের অক্ষরে বদলানো):

```js
const { Transform } = require('stream');

const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

process.stdin.pipe(upperCase).pipe(process.stdout);
```

### চারটি ধরন এক নজরে

- **Readable:** ডেটা দেয় (ওভেন)
- **Writable:** ডেটা নেয় (প্লেট)
- **Duplex:** দুটোই করে, আলাদাভাবে (ফোন কল)
- **Transform:** ডেটা বদলে দেয় (পিজা কাটার মেশিন)

### সব মিলিয়ে একটি পাইপলাইন

```
Readable → Transform → Writable
(ওভেন)   (কাটার মেশিন)  (প্লেট)
```

কোডে: ফাইল পড়ো, Compress করো, নতুন ফাইলে লেখো।

```js
const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream');

pipeline(
  fs.createReadStream('input.txt'), // Readable
  zlib.createGzip(), // Transform
  fs.createWriteStream('input.txt.gz'), // Writable
  err => {
    if (err) console.error('সমস্যা:', err);
    else console.log('সম্পন্ন');
  },
);
```

> `pipe()` সহজ, কিন্তু Error সামলানো ও পরিষ্কার করার জন্য বাস্তব প্রজেক্টে
> `pipeline()` ব্যবহার করা ভালো।

**পরের প্রশ্ন:** এ পর্যন্ত আমরা `fs`, `zlib`, `stream`, এসব Module `require`
করেছি। এই `require` আসলে কী করে? আর নিজের কোড কীভাবে এভাবে ভাগ করব? এবার Modular
System।

---

## 5. Modular System কেন দরকার

### সমস্যা

- সব কোড একটি ফাইলে লিখলে ফাইল হাজার হাজার লাইনের হয়ে যায়।
- খুঁজে পাওয়া, ঠিক করা ও বারবার ব্যবহার করা কঠিন হয়।
- একাধিক মানুষ একসাথে কাজ করলে জট পাকায়।

### সমাধান: Module

- **কোডকে ছোট ছোট ফাইলে ভাগ করা**, যেখানে প্রতিটি ফাইল একটি নির্দিষ্ট কাজ করে।
- প্রতিটি ফাইলকে বলে **Module**।
- যা অন্য ফাইলে দরকার, শুধু সেটাই বাইরে পাঠানো হয় (**export**)। অন্য ফাইল তা
  গ্রহণ করে (**import**)।

### বাংলাদেশ থেকে থাইল্যান্ড 🚢

- **বাংলাদেশ** = একটি ফাইল (Module A)
- **থাইল্যান্ড** = আরেকটি ফাইল (Module B)
- বাংলাদেশ **পণ্য রপ্তানি (export)** করে, থাইল্যান্ড তা **আমদানি (import)** করে।
- বাংলাদেশের কারখানার **ভেতরের প্রক্রিয়া বাইরে যায় না।** শুধু যে পণ্য পাঠানো
  হবে বলে ঠিক হয়েছে, সেটাই যায়। এটাই ফাইলের **private** ভেরিয়েবল ও ফাংশন।
- থাইল্যান্ডকে জানতে হয় **কোন দেশ থেকে** পণ্য আনছে। এটাই ফাইলের **path**।
  **সুবিধা:**

- ✅ কোড গোছানো থাকে।
- ✅ একই কোড বারবার ব্যবহার করা যায়।
- ✅ প্রতিটি ফাইলের ভেতরের নাম আলাদা থাকে, তাই নাম গুলিয়ে যায় না।
- ✅ টিমে ভাগাভাগি করে কাজ করা সহজ।

---

## 6. CommonJS ও ESM

Node.js-এ Module লেখার **দুটি পদ্ধতি** আছে।

### 6.1 CommonJS (CJS)

- Node.js-এর **আসল (পুরনো) পদ্ধতি।**
- রপ্তানি: `module.exports`
- আমদানি: `require()`

```js
// bangladesh.js  (রপ্তানিকারক)
const jute = { name: 'Jute Bag', price: 500 };

function sendProduct(product, country) {
  return `${product.name} sent to ${country}`;
}

module.exports = { jute, sendProduct };
```

```js
// thailand.js  (আমদানিকারক)
const { jute, sendProduct } = require('./bangladesh');

console.log(sendProduct(jute, 'Thailand'));
// Jute Bag sent to Thailand
```

### 6.2 ESM (ES Modules)

- **JavaScript-এর নিজস্ব আধুনিক Module পদ্ধতি** (Browser-ও এটি ব্যবহার করে)।
- রপ্তানি: `export`
- আমদানি: `import`

```js
// bangladesh.js  (রপ্তানিকারক)
export const jute = { name: 'Jute Bag', price: 500 };

export function sendProduct(product, country) {
  return `${product.name} sent to ${country}`;
}
```

```js
// thailand.js  (আমদানিকারক)
import { jute, sendProduct } from './bangladesh.js';

console.log(sendProduct(jute, 'Thailand'));
// Jute Bag sent to Thailand
```

**ESM চালু করার উপায়:** `package.json` ফাইলে লেখো:

```json
{
  "type": "module"
}
```

(অথবা ফাইলের নাম `.mjs` দাও।)

### একটি মাত্র পণ্য পাঠালে (default export)

```js
// CommonJS
module.exports = jute;
const jute = require('./bangladesh');

// ESM
export default jute;
import jute from './bangladesh.js';
```

### দুটির পার্থক্য

- **সিনট্যাক্স:** CJS-এ `require` ও `module.exports`; ESM-এ `import` ও `export`।
- **ফাইলের নাম:** ESM-এ import করার সময় `.js` extension লিখতে হয়।
- **`__dirname` ও `__filename`:** CJS-এ সরাসরি পাওয়া যায়; ESM-এ নেই (বদলে
  `import.meta.url` ব্যবহার হয়)।
- **Top-level `await`:** শুধু ESM-এ চলে।
- **মান:** ESM হলো JavaScript-এর আধুনিক মানদণ্ড, তাই Browser ও Node.js দুই
  জায়গাতেই একই সিনট্যাক্স চলে।
  > **সাবধানতা:** একই ফাইলে `require` আর `import` মেশানো যায় না। প্রজেক্টে একটি
  > পদ্ধতি ঠিক করে সেটিতেই থাকো।

---

## 7. আমরা কোনটি ব্যবহার করব?

### সংক্ষিপ্ত উত্তর

- **নতুন প্রজেক্টে ESM** হলো আধুনিক ও ভবিষ্যতমুখী পছন্দ।
- **CommonJS** এখনো অনেক বিদ্যমান প্রজেক্ট, টিউটোরিয়াল ও Library-তে দেখা যায়,
  তাই **দুটোই চিনতে হবে।**

### বাস্তবে কোথায় কোনটি

- **React, Next.js ও TypeScript:** ESM সিনট্যাক্স (`import`/`export`) ব্যবহার
  হয়।
- **পুরনো Node.js প্রজেক্ট ও অনেক টিউটোরিয়াল:** CommonJS (`require`)।

### শেখার সময় করণীয়

1. কোর্সে বা ক্লাসে যে পদ্ধতিতে শেখানো হচ্ছে, **প্রথমে সেটিই ব্যবহার করো**, যাতে
   গুলিয়ে না যায়।
2. দুটির পার্থক্য বুঝে রাখো, কারণ চাকরিতে দুটোই সামনে আসবে।
3. নতুন নিজের প্রজেক্ট শুরু করলে `"type": "module"` দিয়ে ESM বেছে নেওয়া ভালো।

---

## 8. Modular System কোথায় ব্যবহার করি

**প্রায় সব জায়গায়।** তিনটি প্রধান ক্ষেত্র:

### ১) নিজের প্রজেক্ট গোছাতে

```
project/
├── server.js          ← শুরুর ফাইল
├── routes/            ← কোন URL-এ কী হবে
├── controllers/       ← Request সামলানোর যুক্তি
├── models/            ← ডেটাবেসের কাঠামো
├── config/            ← সেটিংস
└── utils/             ← ছোট সাহায্যকারী ফাংশন
```

- প্রতিটি ফোল্ডার ও ফাইল একটি করে Module। পরবর্তী Express প্রজেক্টে আমরা এভাবেই
  সাজাব।

### ২) Node.js-এর Built-in Module

- `fs`, `path`, `http`, `os`, `url`, `stream`, সবই Module, যা `require` বা
  `import` করে ব্যবহার করি।

### ৩) তৃতীয় পক্ষের Package (npm)

- `express`, `mongoose` ইত্যাদি অন্যদের বানানো Module। `npm install` করে
  `import` বা `require` করি।
- React-এ প্রতিটি Component-ও একটি Module।

---

## 9. Summary

### পুরো প্রবাহ এক নজরে

```
বড় ডেটা → একবারে নয়, অংশে অংশে
│
├── Buffer  → অংশগুলো অস্থায়ীভাবে ধরে রাখে     (প্লেট)
└── Stream  → ডেটা অংশে অংশে বয়ে আনে           (পিজা আসার ধারা)
      │
      ├── সুবিধা → কম মেমোরি, দ্রুত শুরু, বড় ফাইল সামলানো
      │            (YouTube/Netflix-এর মতো)
      │
      └── ধরন
           ├── Readable  → ডেটা দেয়
           ├── Writable  → ডেটা নেয়
           ├── Duplex    → দুটোই
           └── Transform → ডেটা বদলে দেয়

নিজের কোড গোছাতে → Modular System
│
├── CommonJS → require / module.exports   (পুরনো, Node.js-এর নিজস্ব)
└── ESM      → import / export            (আধুনিক, JavaScript-এর মান)
      (বাংলাদেশ রপ্তানি করে, থাইল্যান্ড আমদানি করে)
```

### দ্রুত রিভিশন

- **Stream:** ডেটার প্রবাহ, অংশে অংশে
- **Buffer:** অংশগুলোর অস্থায়ী মেমোরি (প্লেট)
- **Chunk:** ডেটার একটি ছোট অংশ
- **Stream-এর সুবিধা:** কম মেমোরি, দ্রুত শুরু, বড় ফাইল সামলানো
- **Readable / Writable / Duplex / Transform:** দেয় / নেয় / দুটোই / বদলায়
- **`pipe()` ও `pipeline()`:** Stream জুড়ে দেওয়া (`pipeline` Error সামলায়)
- **Module:** কোডের একটি আলাদা ফাইল, যার ভেতরের জিনিস ডিফল্টভাবে private
- **CommonJS:** `require` ও `module.exports`
- **ESM:** `import` ও `export`, আধুনিক পছন্দ
- **ব্যবহার:** প্রজেক্ট গোছানো, Built-in Module, npm Package
