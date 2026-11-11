# Node.js Event-Driven Architecture and Event Loop

আগের নোটে আমরা Event Loop ও Thread Pool-এর মূল ধারণা পেয়েছি। এই নোটে আরও গভীরে
যাব: **Node.js কেন Event-Driven**, **একসাথে অনেক Request সে কীভাবে সামলায়**,
**কোথায় সে দুর্বল**, এবং **Event Loop-এর ভেতরে ঠিক কোন কাজ কোন ক্রমে চলে।**

**ব্যবহৃত উদাহরণ:** আমার চিপস খেতে ইচ্ছা করছে 🍟

- আমি = Node.js-এর মূল Thread
- আমার ছোট ভাই = যে কাজটি পেছনে করে দেয়
- দোকান থেকে চিপস আনা = অপেক্ষার কাজ (I/O)

---

## Table of Contents

1. [Event-Driven Architecture](#1-event-driven-architecture)
2. [Process ও Thread](#2-process-ও-thread)
3. [Synchronous, Asynchronous, Single Thread ও Multi Thread](#3-synchronous-asynchronous-single-thread-ও-multi-thread)
4. [একসাথে অনেক Request](#4-একসাথে-অনেক-request)
5. [I/O Intensive বনাম CPU Intensive](#5-io-intensive-বনাম-cpu-intensive)
6. [Scaling: Vertical ও Horizontal](#6-scaling-vertical-ও-horizontal)
7. [Node.js কীভাবে অনেক Request সামলায়](#7-nodejs-কীভাবে-অনেক-request-সামলায়)
8. [Event Loop কীভাবে কাজ করে](#8-event-loop-কীভাবে-কাজ-করে)
9. [process.nextTick() ও Microtask Queue](#9-processnexttick-ও-microtask-queue)
10. [Summary](#10-summary)

---

## 1. Event-Driven Architecture

### ধারণা

**Event-Driven** মানে: কোনো **ঘটনা (Event)** ঘটলে তবেই নির্দিষ্ট কাজ চলবে।
Node.js সবকিছু এই নিয়মে সাজানো।

### চিপসের উদাহরণ 🍟

ধরো, আমার চিপস খেতে ইচ্ছা করছে।

1. আমি ছোট ভাইকে বললাম, "দোকান থেকে চিপস কিনে এনে দে।"
2. আমি দরজায় দাঁড়িয়ে অপেক্ষা করলাম না। আমি **নিজের পড়াশোনা চালিয়ে গেলাম।**
3. ভাই চিপস নিয়ে ফিরে এসে **ঘণ্টা বাজাল।**
4. ঘণ্টা শুনে আমি পড়া থামিয়ে চিপস নিলাম। এই চারটি ধাপের প্রতিটির একটি নাম আছে:

- **Event** = চিপস এসে পৌঁছানো (ঘটনা)
- **Event Emitter** = ছোট ভাই, যে ঘণ্টা বাজিয়ে সংকেত (emit) দেয়
- **Event Listener** = আমি, যে কান পেতে আছি "ঘণ্টা বাজলে কী করব"
- **Callback** = ঘণ্টা শুনে যে কাজটি করব (চিপস নিয়ে খাওয়া)
- **Event Loop** = যে বারবার দেখে কোনো ঘণ্টা বাজল কিনা এবং বাজলে সঠিক Callback
  চালিয়ে দেয়

### কোড দিয়ে দেখি

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Listener: ঘণ্টা বাজলে কী করব, তা আগে থেকে ঠিক করে রাখা
emitter.on('chipsArrived', shop => {
  console.log(`চিপস এসেছে ${shop} থেকে, এবার খাই!`); // Callback
});

console.log('ভাইকে দোকানে পাঠালাম');

// Emitter: ২ সেকেন্ড পরে ভাই ঘণ্টা বাজাল
setTimeout(() => emitter.emit('chipsArrived', 'কোণার দোকান'), 2000);

console.log('আমি পড়াশোনা করছি');
```

**আউটপুটের ক্রম:**

```
ভাইকে দোকানে পাঠালাম
আমি পড়াশোনা করছি
চিপস এসেছে কোণার দোকান থেকে, এবার খাই!
```

- অপেক্ষার সময়ে আমি (Node.js) বসে থাকিনি। পড়াশোনার কাজ চালিয়ে গেছি।
- ঘণ্টা বাজার পর Callback চলেছে।
  > **মনে রাখার সূত্র:** Node.js-এ প্রায় সবকিছুই **"কাজ শুরু করো, অপেক্ষা কোরো
  > না, শেষ হলে Callback চালাও"** নিয়মে চলে।

**পরের প্রশ্ন:** "আমি" আর "ভাই" আসলে Node.js-এ কারা? এটি বুঝতে Process আর Thread
জানতে হবে।

---

## 2. Process ও Thread

### Process

- কম্পিউটারে **চলমান একটি প্রোগ্রামকে** Process বলে।
- প্রতিটি Process-এর নিজস্ব আলাদা মেমোরি থাকে।
- তুমি `node server.js` চালালে একটি Node.js Process তৈরি হয়।

### Thread

- Process-এর ভেতরে **কাজ করার একক** হলো Thread।
- একটি Process-এর ভেতরের সব Thread **একই মেমোরি ভাগ করে** ব্যবহার করে। **বাড়ির
  উদাহরণ 🏠**

- **Process** = পুরো বাড়ি (নিজস্ব জায়গা, জিনিসপত্র)
- **Thread** = বাড়ির সদস্য, যে কাজ করে
- বাড়ির সব সদস্য একই রান্নাঘর ও ফ্রিজ ব্যবহার করে (shared memory)

### Node.js Process-এর ভেতরে কী আছে?

- একটি **মূল Thread:** তোমার JavaScript কোড এখানে চলে। (আমি)
- libuv-এর **Thread Pool:** ফাইল পড়ার মতো ভারী I/O কাজ করে। (ছোট ভাই ও তার
  সহায়কেরা) **পরের প্রশ্ন:** বাড়িতে একজন কাজ করবে, নাকি অনেকজন? এবং কাজ কি
  একটার পর একটা হবে, নাকি একসাথে? এখান থেকে Single/Multi Thread আর Sync/Async
  আসে।

---

## 3. Synchronous, Asynchronous, Single Thread ও Multi Thread

দুটি আলাদা প্রশ্ন, গুলিয়ে ফেলো না:

- **কতজন কাজ করছে?** → Single Thread / Multi Thread
- **কাজগুলো কীভাবে চলছে?** → Synchronous / Asynchronous

### Synchronous (Blocking) ⏳

- একটি কাজ **শেষ না হওয়া পর্যন্ত পরেরটি শুরু হয় না।**
- চিপসের উদাহরণ: আমি নিজে দোকানে গেলাম, লাইনে দাঁড়ালাম, চিপস কিনে ফিরে এলাম। এই
  পুরো সময় আমি আর কিছু করতে পারিনি।

### Asynchronous (Non-blocking) ⚡

- কাজ শুরু করে **অপেক্ষা না করে** পরের কাজে চলে যাওয়া। শেষ হলে Callback চলে।
- চিপসের উদাহরণ: ভাইকে পাঠিয়ে আমি পড়াশোনা করলাম।

### Single Thread

- **একজন কর্মী**, একসময়ে একটি কাজ।
- Node.js-এ তোমার **JavaScript কোড একটি মূল Thread-এই চলে।**

### Multi Thread

- **একাধিক কর্মী**, একসাথে একাধিক কাজ।
- পরম্পরাগত অনেক Server প্রতিটি Request-এর জন্য আলাদা Thread খোলে।

### Thread Pool

- আগেই থেকে তৈরি রাখা **কয়েকটি Thread-এর দল** (Node.js-এ default ৪টি)।
- Node.js ফাইল পড়ার মতো কাজ এদের দিয়ে করায়।
  > **ভুল ধারণা সংশোধন:** "Node.js Single Thread" মানে শুধু **তোমার JavaScript
  > কোড** একটি Thread-এ চলে। পেছনে Thread Pool-এর অনেক Thread কাজ করে।

---

## 4. একসাথে অনেক Request

ধরো, একটি Server-এ **চারটি Request একসাথে** এল। প্রতিটিতে ডেটাবেস থেকে উত্তর
আনতে সময় লাগে:

- Request A: **1 সেকেন্ড**
- Request B: **2 সেকেন্ড**
- Request C: **5 সেকেন্ড**
- Request D: **10 সেকেন্ড**

### পদ্ধতি ১: Synchronous (একটার পর একটা) ❌

Server একটি Request শেষ করে তারপর পরেরটি ধরে।

```
A: ■                    → শেষ হলো ১ সেকেন্ডে
B:  ■■                  → শেষ হলো ৩ সেকেন্ডে  (১ + ২)
C:    ■■■■■             → শেষ হলো ৮ সেকেন্ডে  (৩ + ৫)
D:         ■■■■■■■■■■   → শেষ হলো ১৮ সেকেন্ডে (৮ + ১০)
```

- D ব্যবহারকারীকে **১৮ সেকেন্ড** বসে থাকতে হলো, যদিও তার নিজের কাজ ১০ সেকেন্ডের।

### পদ্ধতি ২: Asynchronous, Non-blocking (Node.js) ✅

Server সবগুলো Request শুরু করে দেয়, অপেক্ষার সময়ে বসে থাকে না।

```
A: ■            → শেষ ১ সেকেন্ডে
B: ■■           → শেষ ২ সেকেন্ডে
C: ■■■■■        → শেষ ৫ সেকেন্ডে
D: ■■■■■■■■■■   → শেষ ১০ সেকেন্ডে
```

- সবাই নিজের প্রয়োজনীয় সময়েই উত্তর পেল। **একজনের জন্য অন্যজন আটকে থাকেনি।**

### পদ্ধতি ৩: Multi Thread (প্রতি Request-এ একটি Thread)

- এখানেও চারজন নিজের সময়েই শেষ হয়।
- কিন্তু প্রতিটি Thread মেমোরি খরচ করে। হাজার হাজার Request এলে হাজার হাজার
  Thread লাগে, যা ব্যয়বহুল। **পরের প্রশ্ন:** পদ্ধতি ২ তো দারুণ। তাহলে কি
  Node.js সব ধরনের কাজেই সেরা? নির্ভর করে কাজটি কী ধরনের তার ওপর।

---

## 5. I/O Intensive বনাম CPU Intensive

Request-এ সময় লাগার কারণ দুই রকম হতে পারে।

### I/O Intensive: কাজ **অপেক্ষায়** আটকে থাকে 🕐

- ডেটাবেস, ফাইল বা নেটওয়ার্কের উত্তরের জন্য অপেক্ষা।
- এই সময়ে CPU প্রায় ফাঁকা।
- **চিপসের উদাহরণ:** ভাই দোকানে গেছে, আমি শুধু অপেক্ষায় আছি।
- **Node.js এখানে দুর্দান্ত।** অপেক্ষার সময়ে অন্য কাজ করে নেয়।

### CPU Intensive: কাজ **নিজেই ভারী** 🔥

- বিশাল হিসাব, ছবি বা ভিডিও প্রসেসিং, বড় ডেটা Encrypt করা।
- এখানে CPU সারাক্ষণ ব্যস্ত, অপেক্ষার কোনো ফাঁক নেই।
- **চিপসের উদাহরণ:** আমাকে নিজে ১০০টি অঙ্ক করতে হবে। আমি কাউকে দিয়ে করাতে পারছি
  না, নিজেই করতে হবে, আর সেই সময়ে বাকি সব কাজ বন্ধ।
- **Node.js এখানে সমস্যায় পড়ে।**

### CPU Intensive কাজ কেন সমস্যা করে?

```js
const http = require('http');

http
  .createServer((req, res) => {
    if (req.url === '/heavy') {
      // ভারী হিসাব: মূল Thread আটকে যায়
      let sum = 0;
      for (let i = 0; i < 5e9; i++) sum += i;
      return res.end('Heavy done');
    }
    res.end('Hello'); // হালকা Request
  })
  .listen(3000);
```

- কেউ `/heavy` খুললে মূল Thread হিসাবে ব্যস্ত হয়ে যায়।
- ওই সময় `/` (হালকা Request) খুললেও **উত্তর আসে না**, কারণ Event Loop আটকে আছে।
- এখানে Async বা Non-blocking কাজ করে না, কারণ কাজটি অপেক্ষার নয়, **নিজেই
  ভারী।** **পরের প্রশ্ন:** এই দুর্বলতা মেটাতে আমরা কী করতে পারি? প্রথমে ভাবা
  যায়, Server বড় করা বা বাড়ানো। সেটাই Scaling।

---

## 6. Scaling: Vertical ও Horizontal

Scaling মানে চাপ বাড়লে সিস্টেমের সক্ষমতা বাড়ানো।

### Vertical Scaling (শক্তিশালী মেশিন) ⬆️

- **একই Server-কে আরও শক্তিশালী করা**: বেশি CPU, বেশি RAM।
- **উদাহরণ:** একজন কর্মীকে আরও ভালো যন্ত্র দেওয়া।
- **সুবিধা:** সহজ, কোড বদলাতে হয় না।
- **সীমাবদ্ধতা:**
  - একটি মেশিনকে একটি সীমার পর আর বাড়ানো যায় না।
  - বড় মেশিন অনেক ব্যয়বহুল।
  - Node.js-এর মূল Thread শুধু **একটি CPU core** ব্যবহার করে। তাই বেশি core
    থাকলেও JavaScript কোড নিজে থেকে সেগুলো কাজে লাগায় না।

### Horizontal Scaling (বেশি মেশিন) ➡️

- **আরও Server (বা Instance) যোগ করে** Load Balancer দিয়ে চাপ ভাগ করা।
- **উদাহরণ:** একজনের বদলে অনেক কর্মী নিয়োগ।
- **সুবিধা:** প্রায় সীমাহীনভাবে বাড়ানো যায়।
- **সীমাবদ্ধতা:**
  - খরচ ও পরিচালনার জটিলতা বাড়ে (Load Balancer, একাধিক Server)।
  - প্রতিটি ভারী কাজের জন্য নতুন Server ভাড়া করা অপচয়। **পরের প্রশ্ন:** তাহলে
    কি প্রতিটি ভারী কাজের জন্য নতুন Server লাগবে? নাকি আমরা **একই মেশিনের
    ভেতরেই** একাধিক core কাজে লাগাতে পারি? পারি, এবং সেটাই Node.js-এর সমাধান।

---

## 7. Node.js কীভাবে অনেক Request সামলায়

এ পর্যন্ত পুরো যুক্তির ধারা এক জায়গায়:

1. **অনেক Request এলে** Node.js প্রতিটির জন্য আলাদা Thread খোলে না।
2. সে **Non-blocking I/O** ব্যবহার করে: অপেক্ষার কাজ শুরু করে দিয়ে পরের Request
   ধরে।
3. কাজ শেষ হলে **Event Loop** সঠিক Callback চালিয়ে দেয়।
4. ফলে এক Thread দিয়েই হাজার হাজার **I/O-ভিত্তিক Request** সামলানো যায়।
5. **কিন্তু** CPU Intensive কাজে এই পদ্ধতি আটকে যায় (Event Loop ব্লক হয়)।

### সমাধান: Multithreading (Worker Threads) 👥

- ভারী CPU কাজ **আলাদা Thread-এ** পাঠানো হয়।
- মূল Thread হালকা Request সামলাতে থাকে।
- আলাদা Thread-গুলো **মেশিনের বাকি CPU core**-এ চলতে পারে। **চিপসের উদাহরণে:**
  আমার ১০০টি অঙ্কের কাজ আমি ছোট ভাইকে দিয়ে দিলাম। আমি অন্য কাজ সামলাতে থাকলাম।

**এর ফলে কী লাভ?**

- ভারী কাজগুলো সুন্দরভাবে ভাগ হয়ে **একই মেশিনের সব core ব্যবহার করে।**
- প্রতিটি ভারী কাজের জন্য আলাদা Server বাড়ানোর চাপ কমে।
- Vertical ও Horizontal Scaling-এর খরচ ও জটিলতা কমানো যায়।
  > **নোট:** একই মেশিনে একাধিক core কাজে লাগানোর আরেকটি পদ্ধতি `cluster` Module।
  > এই নোটে আমরা Worker Threads নিয়েই থাকছি।

**পরের প্রশ্ন:** Non-blocking কাজের ভেতরে Event Loop ঠিক কোন ক্রমে Callback
চালায়? সেটি এবার দেখি।

---

## 8. Event Loop কীভাবে কাজ করে

### Callback Queue

- অপেক্ষার কাজ শেষ হলে তার Callback একটি **সারিতে (Callback Queue)** জমা হয়।
- মূল Thread ফাঁকা হলে Event Loop সারি থেকে Callback তুলে এনে চালায়।

### Event Loop-এর ধাপগুলো (সরল রূপ)

Event Loop একটি **চক্রে** ঘোরে। প্রতি চক্রে এই ধাপগুলো পরপর চলে:

```
শুরু
 ↓
1. Timers        → মেয়াদ শেষ হওয়া setTimeout / setInterval-এর Callback
 ↓
2. I/O Polling   → ফাইল, ডেটাবেস, নেটওয়ার্কের কাজ শেষ হলে তাদের Callback
 ↓
3. Check         → setImmediate-এর Callback
 ↓
4. Close         → বন্ধ হওয়ার Callback (যেমন socket close)
 ↓
কাজ বাকি থাকলে আবার ১ নম্বরে ফিরে যায়
```

**ধাপগুলো সহজ ভাষায়:**

1. **Timers:** "ঘড়িতে যাদের সময় হয়ে গেছে, তাদের আগে চালাও।"
2. **I/O Polling:** "যাদের ফাইল বা নেটওয়ার্কের কাজ শেষ, তাদের চালাও।"
3. **Check (setImmediate):** "অপেক্ষার কাজ সামলে নেওয়ার পরপরই চালাও।"
4. **Close:** "যা বন্ধ হয়েছে, তার শেষ পরিষ্কারের কাজ করো।"
   > Node.js-এর ভেতরে আরও দুটি ছোট অভ্যন্তরীণ ধাপ আছে। শুরুর জন্য উপরের ৪টি মনে
   > রাখাই যথেষ্ট।

### ছোট একটি জানার বিষয়

- `setTimeout(fn, 0)` ও `setImmediate(fn)` একসাথে **মূল ফাইলে** লিখলে কোনটি আগে
  চলবে, তা নিশ্চিত নয়।
- কিন্তু কোনো **I/O Callback-এর ভেতরে** লিখলে `setImmediate` সবসময় আগে চলে।
  কারণ I/O Polling-এর ঠিক পরেই Check ধাপ আসে। **পরের প্রশ্ন:** উপরের চার ধাপের
  **মাঝখানে** আরও দুটি জরুরি সারি আছে, যারা সবার আগে চলে। সেগুলো কী?

---

## 9. process.nextTick() ও Microtask Queue

Event Loop এক ধাপ থেকে পরের ধাপে যাওয়ার আগে **দুটি বিশেষ সারি** খালি করে নেয়।
এরা সাধারণ Callback Queue-র চেয়ে বেশি অগ্রাধিকার পায়।

- **nextTick Queue:** `process.nextTick()`-এর Callback। **সর্বোচ্চ অগ্রাধিকার।**
- **Microtask Queue:** `Promise.then()`, `async/await` ও `queueMicrotask()`-এর
  Callback। **চিপসের উদাহরণ:** আমি দুই ধাপের মাঝে থামলেই দুটি জরুরি চিরকুট দেখি।
  আগে **লাল চিরকুট** (nextTick), তারপর **হলুদ চিরকুট** (Promise), তবেই পরের ধাপে
  যাই।

### অগ্রাধিকারের ক্রম

```
চলমান কোড শেষ
   ↓
1. process.nextTick() Queue    ← সবার আগে
   ↓
2. Microtask Queue (Promise)   ← তারপর
   ↓
3. Event Loop-এর ধাপ (Timers → I/O → Check → Close)
```

### কোড দিয়ে প্রমাণ

(`require` ব্যবহার করা CommonJS ফাইলের জন্য)

```js
console.log('1. Start');

setTimeout(() => console.log('5. Timer (setTimeout)'), 0);

Promise.resolve().then(() => console.log('4. Promise (Microtask)'));

process.nextTick(() => console.log('3. nextTick'));

console.log('2. End');
```

**আউটপুট:**

```
1. Start
2. End
3. nextTick
4. Promise (Microtask)
5. Timer (setTimeout)
```

**কেন এই ক্রম?**

- `1` ও `2`: সাধারণ কোড, ওপর থেকে নিচে চলে।
- `3`: কোড শেষ হওয়ার পর সবার আগে nextTick Queue খালি হয়।
- `4`: তারপর Microtask (Promise) Queue খালি হয়।
- `5`: সবশেষে Event Loop-এর Timers ধাপে `setTimeout` চলে।
  > **সাবধানতা:** `process.nextTick()` বারবার নিজেকে ডাকলে Event Loop অন্য ধাপে
  > যেতে পারে না, ফলে I/O আটকে যায়। তাই এটি সীমিত ও সতর্কভাবে ব্যবহার করো।

---

## 10. Summary

### পুরো প্রবাহ এক নজরে

```
Node.js = Event-Driven Architecture
│
├── Event Emitter  → সংকেত দেয়        (ভাই ঘণ্টা বাজায়)
├── Event Listener → কান পেতে থাকে     (আমি অপেক্ষা করি)
├── Callback       → সংকেতে যা চলে     (চিপস নিয়ে খাই)
└── Event Loop     → সংকেত দেখে Callback চালায়
        │
        ├── Single Thread + Non-blocking I/O
        │      → হাজার হাজার I/O Request সহজে সামলায় ✅
        │
        └── CPU Intensive কাজে আটকে যায় ❌
               ├── Vertical Scaling   → শক্তিশালী মেশিন (সীমা ও খরচ আছে)
               ├── Horizontal Scaling → বেশি মেশিন (জটিলতা ও খরচ আছে)
               └── Worker Threads     → ভারী কাজ আলাদা Thread/core-এ ✅
```

### Event Loop-এর ক্রম

```
nextTick Queue → Microtask Queue → Timers → I/O Polling → Check (setImmediate) → Close
```

### দ্রুত রিভিশন

- **Event-Driven:** ঘটনা ঘটলে তবেই কাজ চলে
- **Emitter / Listener / Callback:** সংকেত দেয় / কান পেতে থাকে / সংকেতে যা চলে
- **Process:** চলমান প্রোগ্রাম, **Thread:** তার ভেতরের কর্মী
- **Synchronous:** একটার পর একটা (blocking), **Asynchronous:** অপেক্ষা না করে
  এগিয়ে যাওয়া (non-blocking)
- **Single Thread:** একজন কর্মী, **Multi Thread:** অনেক কর্মী
- **Thread Pool:** libuv-এর তৈরি রাখা সহায়ক Thread-এর দল
- **I/O Intensive:** অপেক্ষার কাজ (Node.js-এর শক্তি)
- **CPU Intensive:** নিজে ভারী কাজ (Node.js-এর দুর্বলতা)
- **Vertical Scaling:** মেশিন শক্তিশালী করা, **Horizontal Scaling:** মেশিনের
  সংখ্যা বাড়ানো
- **Worker Threads:** ভারী কাজ আলাদা Thread-এ পাঠানো
- **nextTick > Microtask > Event Loop-এর ধাপ:** অগ্রাধিকারের ক্রম
