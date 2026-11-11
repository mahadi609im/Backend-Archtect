# How the Web Works: From Scratch - 1

Browser-এ একটি URL লিখে Enter চাপলে ভেতরে কী কী ঘটে, তা ধাপে ধাপে ব্যাখ্যা করা
হয়েছে। প্রতিটি ধাপ আগের ধাপের সাথে সংযুক্ত, তাই শুরু থেকে শেষ পর্যন্ত পড়লে
পুরো প্রক্রিয়াটি পরিষ্কার বোঝা যাবে।

**ব্যবহৃত উদাহরণ:** ফোনে রহিমকে কল করা।

- Client = যে কল করে
- Server = যে কল ধরে উত্তর দেয়
- DNS = ফোনের Contact list

---

## Table of Contents

1. [Client-Server Architecture](#1-client-server-architecture)
2. [URL এর তিনটি অংশ](#2-url-এর-তিনটি-অংশ)
3. [DNS, IP Address এবং Port](#3-dns-ip-address-এবং-port)
4. [TCP/IP Socket Connection](#4-tcpip-socket-connection)
5. [HTTP Request](#5-http-request)
6. [HTTP Response](#6-http-response)
7. [Chunk আকারে ডেটা পাঠানো](#7-chunk-আকারে-ডেটা-পাঠানো)
8. [Summary](#8-summary)

---

## 1. Client-Server Architecture

ওয়েবের মূল নিয়ম: একপক্ষ চায়, অন্যপক্ষ দেয়।

- **Client:** যে ডেটা চায়। যেমন Browser, মোবাইল অ্যাপ।
- **Server:** যে ডেটা সংরক্ষণ ও প্রক্রিয়া করে এবং উত্তর দেয়। যেমন YouTube-এর
  Server।
- Client **Request** পাঠায়, Server **Response** ফেরত দেয়।

```
Client  ---- Request ---->  Server
Client  <--- Response ----  Server
```

**উদাহরণ:** তুমি রহিমকে কল করে কিছু জানতে চাইলে। রহিম উত্তর দিল। রহিম নিজে থেকে
কল করে না, আগে Client-কে চাইতে হয়।

**পরের প্রশ্ন:** Server-কে খুঁজে পেতে হলে তার পরিচয় ও ঠিকানা লাগবে। সেটাই URL।

---

## 2. URL এর তিনটি অংশ

URL (Uniform Resource Locator) হলো কোনো রিসোর্সের ঠিকানা।

```
https://www.youtube.com/watch?v=abc123
```

এটি তিন অংশে বিভক্ত:

1. **Protocol** (`https://`)
   - যোগাযোগের নিয়ম।
   - `http` সাধারণ, `https` এনক্রিপ্টেড ও নিরাপদ।
2. **Domain name** (`www.youtube.com`)
   - কোন Server-এর সাথে যোগাযোগ করতে হবে। এটি রহিমের নাম।
3. **Resource** (`/watch?v=abc123`)
   - Server-এর কাছে ঠিক কী চাওয়া হচ্ছে।

**পরের প্রশ্ন:** কম্পিউটার নাম বোঝে না,
     সে নম্বর দিয়ে যোগাযোগ করে। তাই নামকে নম্বরে রূপান্তর করতে হবে। সেটাই
     DNS-এর কাজ।

---

## 3. DNS, IP Address এবং Port

### IP Address

- প্রতিটি Server-এর একটি সংখ্যাভিত্তিক ঠিকানা আছে, যেমন `142.250.190.78`।
- এটি রহিমের **ফোন নম্বর**।

### DNS (Domain Name System)

- DNS **Domain name-কে IP address-এ রূপান্তর করে**।
- এটি ইন্টারনেটের **Contact list** বা ফোনবুক। **উদাহরণ:** তুমি Contact list-এ
  "Rahim" চাপলে ফোন নিজেই নম্বর খুঁজে কল দেয়। একইভাবে Browser `youtube.com`
  দিয়ে DNS-কে জিজ্ঞেস করে, DNS উত্তর দেয় `142.250.190.78`।

- Rahim = Domain name (`youtube.com`)
- ফোন নম্বর = IP address (`142.250.190.78`)
- Contact list = DNS **DNS কীভাবে খোঁজে:**

1. প্রথমে Browser ও কম্পিউটারের **cache** দেখে।
2. না পেলে **DNS Server**-কে জিজ্ঞেস করে।
3. DNS Server IP খুঁজে এনে দেয় এবং ভবিষ্যতের জন্য cache করে রাখে।

### Port

- IP address Server-এর ঠিকানা, আর **Port** হলো ওই Server-এর নির্দিষ্ট সেবার
  দরজা।
- সাধারণ Port:
  - `80` = HTTP
  - `443` = HTTPS
  - `3000` = Node.js development-এ প্রচলিত
- `https` ব্যবহার করলে Browser স্বয়ংক্রিয়ভাবে `443` ধরে নেয়। **ফলাফল:** এখন
  Client জানে Server কোথায় আছে (IP + Port)। এবার সংযোগ স্থাপন করতে হবে।

---

## 4. TCP/IP Socket Connection

ডেটা আদান-প্রদানের আগে দুই পক্ষের মধ্যে একটি **connection** তৈরি করতে হয়।

- **Socket** = IP address + Port এর জোড়া। এটি Client ও Server-এর মধ্যে খোলা
  একটি যোগাযোগ-লাইন।
- **IP:** ডেটা সঠিক ঠিকানায় পৌঁছে দেয়।
- **TCP:** ডেটা সঠিক ক্রমে, সম্পূর্ণ ও হারানো ছাড়া পৌঁছায় কিনা নিশ্চিত করে।

### Three-Way Handshake

1. **SYN:** Client বলে, "সংযোগ করতে চাই।"
2. **SYN-ACK:** Server বলে, "প্রস্তুত আছি। তুমি প্রস্তুত?"
3. **ACK:** Client বলে, "হ্যাঁ, শুরু করা যাক।" **উদাহরণ:** কল করলে রহিম বলল
   "হ্যালো, শুনছি", তুমি বললে "হ্যাঁ, বলো"। এরপর আসল কথা শুরু হয়।

**HTTPS হলে:** handshake শেষে একটি **TLS handshake** হয়, যেখানে দুই পক্ষ ডেটা
এনক্রিপ্ট করার জন্য একটি গোপন চাবি ঠিক করে।

**পরের প্রশ্ন:** সংযোগ তৈরি হলো, কিন্তু কথা বলার জন্য একটি সাধারণ ভাষা বা নিয়ম
দরকার। সেটাই HTTP।

---

## 5. HTTP Request

**HTTP (HyperText Transfer Protocol)** হলো Client ও Server-এর যোগাযোগের নিয়ম।
Client যে বার্তা পাঠায় তাকে **Request** বলে।

একটি Request-এর তিনটি অংশ: **Method, Headers, Body**।

```http
GET /watch?v=abc123 HTTP/1.1
Host: www.youtube.com
Accept: text/html
User-Agent: Chrome
Cookie: session=xyz
```

### 5.1 Method

Method বলে দেয় Client কী করতে চায়।

- **GET:** ডেটা পড়তে চাই। যেমন ভিডিও দেখা।
- **POST:** নতুন ডেটা পাঠাতে চাই। যেমন Login, কমেন্ট।
- **PUT:** বিদ্যমান ডেটা সম্পূর্ণ বদলাতে চাই।
- **PATCH:** বিদ্যমান ডেটার একটি অংশ বদলাতে চাই।
- **DELETE:** ডেটা মুছতে চাই।

### 5.2 Request Headers

Headers হলো Request সম্পর্কে অতিরিক্ত তথ্য।

- `Host`: কোন Server-এর কাছে চাওয়া হচ্ছে
- `Accept`: কী ধরনের উত্তর চাই
- `Content-Type`: Client যে ডেটা পাঠাচ্ছে তার ধরন
- `Authorization` / `Cookie`: Client-এর পরিচয় ও অনুমতির প্রমাণ
- `User-Agent`: কোন Browser বা ডিভাইস থেকে Request এসেছে

### 5.3 Request Body

- Server-কে যে ডেটা পাঠানো হবে, সেটি Body-তে থাকে।
- সাধারণত **JSON** ফরম্যাটে থাকে।
- **GET** Request-এ সাধারণত Body থাকে না।
- **POST, PUT, PATCH** Request-এ Body থাকে।

```http
POST /login HTTP/1.1
Content-Type: application/json

{ "email": "maha@gmail.com", "password": "123456" }
```

---

## 6. HTTP Response

Server Request প্রক্রিয়া করে যে উত্তর পাঠায় তাকে **Response** বলে।

একটি Response-এর তিনটি অংশ: **Status code, Headers, Body**।

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 4500

<html> ... </html>
```

### 6.1 Status Code

Status code জানায় Request-এর ফলাফল কী।

- **2xx (সফল)**
  - `200 OK`: সফল
  - `201 Created`: নতুন রিসোর্স তৈরি হয়েছে
- **3xx (Redirect)**
  - `301`: স্থায়ীভাবে অন্য ঠিকানায় সরেছে
  - `302`: সাময়িকভাবে অন্য ঠিকানায়
- **4xx (Client-এর ভুল)**
  - `400 Bad Request`: Request সঠিক নয়
  - `401 Unauthorized`: Login করা হয়নি
  - `403 Forbidden`: Login আছে, কিন্তু অনুমতি নেই
  - `404 Not Found`: রিসোর্স পাওয়া যায়নি
- **5xx (Server-এর ভুল)**
  - `500 Internal Server Error`: Server-এর ভেতরে সমস্যা

### 6.2 Response Headers

- `Content-Type`: ডেটার ধরন (HTML, JSON, ভিডিও)
- `Content-Length`: ডেটার আকার
- `Set-Cookie`: Browser-কে কিছু তথ্য সংরক্ষণ করতে বলে

### 6.3 Response Body

- Client যে ডেটা চেয়েছিল, সেটিই Body।
- যেমন HTML পেজ, JSON ডেটা, ছবি বা ভিডিও।
- Browser HTML পেয়ে সেটি পেজ আকারে দেখায়। **পরের প্রশ্ন:** HTML ছোট, তাই সহজে
  পাঠানো যায়। কিন্তু ভিডিওর মতো বড় ডেটা কীভাবে পাঠানো হয়?

---

## 7. Chunk আকারে ডেটা পাঠানো

### সমস্যা

- একটি ভিডিও কয়েকশ MB হতে পারে।
- সবটুকু একসাথে পাঠালে ভিডিও চালু হতে অনেক দেরি হবে, আর নেট ধীর হলে সমস্যা আরও
  বাড়বে।

### সমাধান

Server ডেটাকে ছোট ছোট অংশে (**chunk**) ভাগ করে ধাপে ধাপে পাঠায়।

**উদাহরণ:** রহিম একটি লম্বা বিষয় একবারে না বলে অল্প অল্প করে বলছে। তুমি প্রথম
অংশ শুনেই বুঝতে শুরু করো, বাকিটা আসতে থাকে।

**YouTube-এ যা ঘটে:**

1. Browser ভিডিওর প্রথম অংশ চায়।
2. Server শুধু ওই অংশ পাঠায়।
3. Browser ভিডিও চালু করে দেয়।
4. ভিডিও চলার সময় পরের অংশগুলো পেছনে লোড হতে থাকে। (প্লেয়ারের ধূসর বারটি এই
   লোড হওয়া অংশ দেখায়, একে **buffer** বলে।)
5. ভিডিওর মাঝখানে ক্লিক করলে Browser শুধু সেই জায়গার অংশ চায়।

### HTTP-তে এটি কীভাবে কাজ করে

Browser **Range** header দিয়ে নির্দিষ্ট অংশ চায়:

```http
GET /video.mp4 HTTP/1.1
Range: bytes=0-1048575
```

Server শুধু ওই অংশ পাঠায় এবং **`206 Partial Content`** status code দেয়:

```http
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1048575/524288000
```

> বড় প্ল্যাটফর্মগুলো ভিডিওকে ছোট segment-এ ভাগ করে রাখে এবং ইন্টারনেটের গতি
> অনুযায়ী ভিডিওর মান স্বয়ংক্রিয়ভাবে বদলায় (adaptive streaming)। মূল ধারণা
> একই: ডেটা একসাথে নয়, ধাপে ধাপে পাঠানো।

**সুবিধা:**

- ভিডিও দ্রুত চালু হয়।
- ইন্টারনেট ও মেমোরি কম খরচ হয়।
- সংযোগ কেটে গেলে প্রথম থেকে শুরু করতে হয় না।

---

## 8. Summary

`https://www.youtube.com/watch?v=abc123` লিখে Enter চাপলে:

1. **URL বিশ্লেষণ:** Protocol (`https`), Domain (`youtube.com`), Resource
   (`/watch?v=abc123`)।
2. **DNS Server-এ অনুসন্ধান:** Domain-এর IP address জানতে চাওয়া হয়।
3. **IP address প্রাপ্তি:** DNS IP ফেরত দেয়, যেমন `142.250.190.78`।
4. **Client Server-কে খুঁজে পায়:** IP + Port (`443`) জানা হয়।
5. **TCP/IP Socket Connection:** Three-way handshake (SYN, SYN-ACK, ACK) সম্পন্ন
   হয়। HTTPS হলে TLS handshake-ও হয়।
6. **HTTP Request:** Client Method, Headers ও (প্রয়োজনে) Body পাঠায়।
7. **HTTP Response:** Server Status code, Headers ও Body ফেরত দেয়।
8. **Chunk আকারে ডেটা:** বড় ডেটা (যেমন ভিডিও) অংশে অংশে আসে এবং Browser তা ধীরে
   ধীরে দেখায়।

### সম্পূর্ণ প্রবাহ

```
URL → DNS Server → IP Address → Client Server-কে খুঁজে পায় → TCP/IP Socket → HTTP Request → HTTP Response → Chunk আকারে ডেটা
```

### দ্রুত রিভিশন

- **URL:** রিসোর্সের ঠিকানা
- **DNS:** নাম থেকে IP address বের করে (Contact list)
- **IP address:** Server-এর নম্বর
- **Port:** Server-এর নির্দিষ্ট সেবার দরজা
- **TCP/IP Socket:** Client ও Server-এর মধ্যে খোলা যোগাযোগ-লাইন
- **HTTP Request:** Client-এর প্রশ্ন (Method, Headers, Body)
- **HTTP Response:** Server-এর উত্তর (Status code, Headers, Body)
- **Chunk:** বড় ডেটা ছোট ছোট অংশে পাঠানোর পদ্ধতি
