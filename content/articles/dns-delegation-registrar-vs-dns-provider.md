---
title: "DNS Delegation Done Right: Why You Should Not Mix Authoritative Nameservers"
slug: "dns-delegation-registrar-vs-dns-provider"
description: "A deep dive into DNS delegation, covering how registrars, TLDs, authoritative nameservers, recursive resolvers, caching, and TTLs work."
featured: false
---


DNS looks deceptively simple:


```plain text
example.com → some IP address
```


But behind that lookup is a distributed hierarchy involving root servers, TLD nameservers, authoritative nameservers, recursive resolvers, caching, TTLs, and delegation.


A particularly subtle DNS failure happens when a domain is registered with one provider—say Name.com—but DNS is delegated to another provider such as Cloudflare, while the original registrar’s nameservers are accidentally left in place.


This article explains why that is dangerous, how the DNS hierarchy actually works, where caching occurs, how to debug delegation with `dig +trace`, and what a clean registrar + DNS-provider architecture should look like.


---


# First: Domain Registration Is Not DNS Hosting


These concepts are often conflated.


Suppose you purchase:


```plain text
examlo.app
```


from Name.com.


That makes Name.com your **registrar** for the domain.


The registrar manages things such as:

- Domain registration
- Renewal
- Ownership/contact information
- Nameserver delegation

But the registrar does not have to host your DNS.


You can register the domain with Name.com and manage DNS with Cloudflare.


For example:


```plain text
examlo.app
                     │
             registered at
                     │
                  Name.com
                     │
             delegates DNS to
                     │
                  Cloudflare
                     │
            authoritative DNS
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
         A          MX         TXT
       record      record     record
```


This is a very common architecture.


---


# What Does a Nameserver Actually Mean?


A nameserver is not simply “the server where my website lives.”


An authoritative nameserver answers DNS questions for a zone.


For example:


```plain text
examlo.app → 172.67.167.132
```


is a DNS record.


The authoritative nameserver is the server that is trusted to provide that record.


If Cloudflare is authoritative for `examlo.app`, its nameservers might be:


```plain text
albert.ns.cloudflare.com
monroe.ns.cloudflare.com
```


The delegation effectively says:

> “For DNS information about `examlo.app`, ask these servers.”

This distinction is critical:


```plain text
Nameserver
    ↓
Answers DNS questions

DNS record
    ↓
Contains the actual mapping/information
```


---


# The DNS Hierarchy


DNS is hierarchical.


At a high level:


```plain text
Root
                           .
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
           .com           .org          .app
             │             │             │
             ▼             ▼             ▼
       example.com    example.org    examlo.app
                                           │
                                           ▼
                                  Cloudflare DNS
                                           │
                              ┌────────────┼────────────┐
                              ▼            ▼            ▼
                              A           MX           TXT
```


Let’s follow an actual lookup.


Suppose a browser needs to resolve:


```plain text
examlo.app
```


It ultimately needs an address so it can connect to the service.


The resolver follows the DNS hierarchy.


---


# The Root Zone


At the top of DNS is the **root zone**, represented by:


```plain text
.
```


You normally do not type the trailing dot, but technically:


```plain text
examlo.app.
```


has this structure:


```plain text
.              → Root
└── app         → TLD
    └── examlo  → Domain
```


The root zone does not know your application’s IP address.


Instead, it knows where the TLDs are managed.


For example:


```plain text
.
├── com
├── org
├── net
├── in
└── app
```


If a resolver asks:

> “Who handles `.app`?”

the root servers provide the nameservers for the `.app` TLD.


---


# What Is a TLD?


**TLD** means **Top-Level Domain**.


Examples:


```plain text
.com
.org
.net
.in
.dev
.app
```


In:


```plain text
examlo.app
```


`.app` is the TLD.


The `.app` TLD has its own authoritative DNS servers.


In a real lookup, you might see records such as:


```plain text
app. IN NS ns-tld1.charlestonroadregistry.com.
app. IN NS ns-tld2.charlestonroadregistry.com.
...
```


These are `.app` TLD nameservers.


---


# What Is a TLD DNS Zone?


A **DNS zone** is an administratively managed portion of the DNS namespace.


The `.app` zone contains information about the `.app` namespace.


But there is an important detail:


The `.app` zone generally does **not** contain the A record for your application.


Instead, it contains a **delegation** for `examlo.app`.


Conceptually:


```plain text
.app zone

examlo.app. IN NS albert.ns.cloudflare.com.
examlo.app. IN NS monroe.ns.cloudflare.com.
```


This means:

> “`examlo.app` is delegated to these authoritative nameservers.”

The `.app` TLD is essentially handing responsibility for the child zone to another set of nameservers.


---


# Delegation: The Core Idea Behind DNS


DNS delegation is one of the most important concepts to understand.


Imagine a resolver asks:


```plain text
What is examlo.app?
```


The hierarchy works roughly like this:


```plain text
Root
  │
  │ Who manages .app?
  ▼
.app TLD
  │
  │ Who manages examlo.app?
  ▼
Cloudflare authoritative DNS
  │
  │ What is the A record?
  ▼
172.67.167.132
104.21.82.8
```


Each level points the resolver toward the next authority.


The parent does not need to know every record in the child zone.


It only needs to know:

> “Who is authoritative for this child?”

This is what makes DNS scalable.


---


# Authoritative DNS vs Recursive DNS


These two roles are easy to confuse.


## Recursive Resolver


A recursive resolver is the server your device typically asks.


Examples include:


```plain text
1.1.1.1
8.8.8.8
```


Its job is:

> “Find the answer for me.”

It may query multiple DNS servers and cache the result.


---


## Authoritative Nameserver


An authoritative nameserver owns the DNS answer for a zone.


For example:


```plain text
albert.ns.cloudflare.com
```


may be authoritative for:


```plain text
examlo.app
```


Its job is:

> “I am authoritative for this zone, so here is the DNS data.”

The relationship is:


```plain text
Your machine
     │
     ▼
Recursive resolver
     │
     ├── Root
     ├── TLD
     └── Authoritative DNS
              │
              ▼
          DNS record
```


---


# What Happens When You Type a Domain?


Suppose you enter:


```plain text
https://examlo.app
```


A simplified flow is:


```plain text
Browser
   │
   ▼
OS DNS cache
   │
   ▼
Recursive DNS resolver
   │
   ▼
Root
   │
   ▼
.app TLD
   │
   ▼
Cloudflare authoritative DNS
   │
   ▼
A / AAAA / CNAME record
   │
   ▼
IP address
   │
   ▼
TCP/TLS/HTTP connection
   │
   ▼
Application
```


Notice that DNS happens **before** the browser connects to your web server.


DNS answers:

> “Where should I connect?”

HTTP answers:

> “What resource do I want?”

These are separate layers.


---


# Where DNS Caching Happens


DNS would be unnecessarily expensive if every lookup travelled all the way through:


```plain text
Root → TLD → authoritative server
```


for every user.


DNS therefore relies heavily on caching.


Caching can happen at several layers.


A simplified model is:


```plain text
Browser
   ↓
Operating system
   ↓
Router
   ↓
Recursive resolver
   ↓
Authoritative DNS
```


Not every environment necessarily caches at every layer, but caching can occur at multiple points.


---


# TTL: Time To Live


Every DNS record can have a **TTL**.


For example:


```plain text
examlo.app. 300 IN A 172.67.167.132
```


The:


```plain text
300
```


means:


```plain text
300 seconds
```


or:


```plain text
5 minutes
```


A recursive resolver can cache the answer for that period.


Conceptually:


```plain text
Authoritative DNS
      │
      │ A = 172.67.167.132
      │ TTL = 300
      ▼
Recursive resolver
      │
      ├── 300s remaining
      ├── 200s remaining
      ├── 100s remaining
      └── 0s → expire
```


Once the TTL expires, the resolver needs to obtain a fresh answer.


---


# DNS Caches More Than Successful Answers


This is an important operational detail.


Resolvers can also cache **negative answers**.


For example, suppose you visit:


```plain text
examlo.app
```


before the DNS record exists.


A resolver might receive:


```plain text
NXDOMAIN
```


which means roughly:

> “This domain name does not exist.”

The negative result can be cached.


Later you correctly configure DNS:


```plain text
examlo.app → Cloudflare
```


but a resolver that still has the negative response cached may continue behaving as though the domain does not exist until the relevant negative cache lifetime expires.


This is one reason DNS changes can appear inconsistent during migrations.


---


# The Real-World Failure: Mixing Nameservers


Now we can understand the dangerous configuration.


Suppose you purchased:


```plain text
examlo.app
```


from Name.com.


Then you decide:

> “I want Cloudflare to manage my DNS.”

Cloudflare gives you:


```plain text
albert.ns.cloudflare.com
monroe.ns.cloudflare.com
```


The correct setup is:


```plain text
Name.com
   │
   │ delegates DNS
   ▼
Cloudflare
   ├── albert.ns.cloudflare.com
   └── monroe.ns.cloudflare.com
```


But imagine you accidentally configure:


```plain text
ns1.name.com
ns2.name.com
ns3.name.com
ns4.name.com

albert.ns.cloudflare.com
monroe.ns.cloudflare.com
```


Now the parent zone can advertise **six authoritative nameservers**.


That is the problem.


---


# Why Six Nameservers Are Not “Primary + Backup”


This is a common misconception.


DNS does not interpret this as:


```plain text
Cloudflare = primary
Name.com = backup
```


There is no generic priority mechanism saying:


```plain text
1. Cloudflare
2. Name.com
```


Instead, the delegation effectively says:

> “These are authoritative nameservers for the zone.”

A recursive resolver can select among them.


Therefore, if the providers serve different DNS data, the zone becomes inconsistent.


---


# A Concrete Example


Suppose Cloudflare contains:


```plain text
examlo.app → 172.67.167.132
examlo.app → 104.21.82.8
```


But Name.com contains no A record.


Now ask each provider directly.


### Cloudflare


```bash
dig @albert.ns.cloudflare.com examlo.app
```


You might receive:


```plain text
ANSWER: 2

examlo.app. 300 IN A 172.67.167.132
examlo.app. 300 IN A 104.21.82.8
```


### Name.com


```bash
dig @ns1bcp.name.com examlo.app
```


You might receive:


```plain text
ANSWER: 0
```


Now the same DNS question has two different authoritative outcomes:


```plain text
examlo.app
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      Cloudflare           Name.com
          │                   │
          ▼                   ▼
       A records           No A record
```


That is not a healthy authoritative DNS configuration.


---


# Why This Can Look Like a Random Network Problem


Imagine two users.


User A’s recursive resolver reaches Cloudflare:


```plain text
Resolver A
    ↓
Cloudflare
    ↓
172.67.167.132
    ↓
Website works
```


User B’s resolver reaches Name.com:


```plain text
Resolver B
    ↓
Name.com
    ↓
No A record
    ↓
Website fails
```


Now the developer sees:

> “It works for me but not for another person.”

Or:

> “It works on mobile data but not Wi-Fi.”

That can look like an application, router, or network problem.


But the underlying issue can be **authoritative DNS inconsistency**.


---


# DNS Caching Makes the Situation Even More Confusing


Suppose your Wi-Fi resolver previously reached Name.com and got:


```plain text
No A record
```


It may cache that result.


Then you fix the nameservers.


The authoritative configuration eventually becomes:


```plain text
Cloudflare only
```


But your Wi-Fi resolver might still have an old cached answer.


Meanwhile your mobile network uses another recursive resolver that has already learned the new delegation.


You can therefore temporarily see:


```plain text
Wi-Fi
   ↓
Cached old DNS result
   ↓
❌

Mobile
   ↓
Fresh DNS lookup
   ↓
Cloudflare
   ↓
✅
```


This is why DNS troubleshooting must distinguish between:

1. **Authoritative configuration**
2. **Recursive resolver caching**
3. **Local/browser/OS caching**

Fixing one does not instantly erase all cached answers everywhere.


---


# How to Debug DNS Properly


One of the most useful tools for DNS debugging is:


```bash
dig
```


`dig` means **Domain Information Groper**.


It allows you to query DNS servers directly.


For example:


```bash
dig A examlo.app
```


asks for an A record.


You can query a specific authoritative nameserver:


```bash
dig @albert.ns.cloudflare.com examlo.app
```


This is extremely useful when debugging inconsistent providers because you can compare their answers directly.


---


# `dig +trace`: Following the DNS Hierarchy


One of the most useful commands for understanding delegation is:


```bash
dig +trace NS examlo.app
```


`+trace` tells `dig` to follow the DNS delegation path.


Conceptually:


```plain text
Root
 ↓
.app
 ↓
examlo.app
 ↓
Authoritative nameserver
```


A trace might show:


```plain text
. IN NS a.root-servers.net.
...
```


Then:


```plain text
app. IN NS ns-tld1.charlestonroadregistry.com.
...
```


Then:


```plain text
examlo.app. IN NS albert.ns.cloudflare.com.
examlo.app. IN NS monroe.ns.cloudflare.com.
```


This lets you see **who the public DNS hierarchy believes is authoritative**.


---


# Why `dig +trace` Is Different From a Normal `dig`


Consider:


```bash
dig NS examlo.app
```


Your machine normally asks a recursive resolver.


For example:


```plain text
Your machine
     ↓
1.1.1.1
     ↓
cached answer or recursive lookup
```


But:


```bash
dig +trace NS examlo.app
```


walks the hierarchy from the root.


Conceptually:


```plain text
+trace

Root
 ↓
TLD
 ↓
Authoritative DNS
 ↓
Answer
```


This makes it especially valuable when you suspect a delegation problem.


---


# Reading a `dig +trace` Output


When debugging, look for these layers.


### Root


```plain text
. IN NS ...
```


This identifies the root nameservers.


### TLD


```plain text
app. IN NS ...
```


This identifies the `.app` nameservers.


### Domain delegation


```plain text
examlo.app. IN NS ...
```


This is extremely important.


It tells you which nameservers the parent zone believes are authoritative for the domain.


### Final authoritative answer


Eventually you might see:


```plain text
examlo.app. IN A 172.67.167.132
```


That is the actual DNS record.


---


# A Useful Mental Model for DNS


Think of DNS like a chain of authority:


```plain text
Root
 │
 │ "Who handles .app?"
 ▼
.app TLD
 │
 │ "Who handles examlo.app?"
 ▼
Cloudflare
 │
 │ "What is the A record?"
 ▼
172.67.167.132
```


The key idea is:

> **Each layer delegates responsibility to the next layer.**

This is why the parent `.app` zone doesn’t need to know your application’s IP.


It only needs to know:


```plain text
examlo.app → authoritative nameservers
```


Those authoritative nameservers then know:


```plain text
examlo.app → DNS records
```


---


# Registrar vs TLD vs Authoritative DNS


It helps to separate these concepts completely.


| Component                  | Responsibility                                          |
| -------------------------- | ------------------------------------------------------- |
| Registrar                  | Registers your domain and lets you configure delegation |
| Root zone                  | Delegates TLDs such as `.app`                           |
| `.app` TLD zone            | Delegates `examlo.app` to its authoritative nameservers |
| Authoritative DNS provider | Stores and answers DNS records for `examlo.app`         |
| Recursive resolver         | Finds answers on behalf of clients and caches them      |
| Browser / OS / router      | May also cache DNS information                          |


Your registrar does not need to be your DNS provider.


For example:


```plain text
Registrar:        Name.com
DNS provider:     Cloudflare
Application:      Cloudflare / Vercel / AWS / GCP / etc.
```


This is perfectly normal.


---


# But Aren’t Multiple Nameservers Normal?


Yes—and this distinction is important.


Cloudflare itself gives you multiple nameservers:


```plain text
albert.ns.cloudflare.com
monroe.ns.cloudflare.com
```


That’s completely normal.


Both are authoritative for the **same zone** and are designed to provide consistent DNS data.


The problem isn’t:

> “Having multiple nameservers.”

The problem is:

> **Having independent authoritative DNS providers serving inconsistent versions of the same zone.**

So:


```plain text
Cloudflare NS1
Cloudflare NS2
Cloudflare NS3
```


is fine if they serve the same authoritative zone.


But:


```plain text
Cloudflare NS1
Cloudflare NS2
Name.com NS1
Name.com NS2
```


can be problematic if the two providers aren’t deliberately synchronized.


---


# A Practical DNS Debugging Workflow


When a domain behaves differently across networks, don’t immediately blame the application.


Work from the bottom up.


### 1. Check delegation


```bash
dig +trace NS example.com
```


Ask:

> Which nameservers does the parent zone advertise?

### 2. Query each authoritative provider directly


```bash
dig @ns1.example-provider.com example.com
dig @ns2.example-provider.com example.com
```


Ask:

> Are they returning consistent data?

### 3. Check the record itself


```bash
dig A example.com
dig AAAA example.com
dig CNAME www.example.com
```


### 4. Check different recursive resolvers


For example:


```bash
dig @1.1.1.1 example.com
dig @8.8.8.8 example.com
```


Ask:

> Are different recursive resolvers seeing different answers?

### 5. Consider caching


If authoritative DNS is correct but a client still sees an old answer, investigate:

- Recursive resolver cache
- Router cache
- OS cache
- Browser cache
- TTLs

---


## Useful Commands


```bash
# Query an A record
dig A examlo.app

# Query nameservers
dig NS examlo.app

# Query a specific authoritative server
dig @albert.ns.cloudflare.com examlo.app

# Query another authoritative server
dig @ns1bcp.name.com examlo.app

# Trace the DNS hierarchy
dig +trace NS examlo.app

# Query a specific recursive resolver
dig @1.1.1.1 examlo.app
dig @8.8.8.8 examlo.app
```


When DNS behaves strangely, don’t just ask:

> “Does the domain resolve?”

Ask:

> **“Who is authoritative, what are they returning, and which layer is caching the answer I am seeing?”**

That question leads you to the real problem.

