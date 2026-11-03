# /lagune-charter: Set Your Security Principles

> Establish your project's security principles, the rules every later phase respects, and record the specialization categories its reading supports.

Canonical: https://lagune.ai/docs/commands/charter
Last updated: 2026-11-03

🧬 Tell **Lagune** what your project is, and it turns that into your security rules (or, with no description, works them out from the project alone).

The charter is the governing layer: a set of security-first principles every later phase must respect. Think of it as the compile-time check for your project's security posture.

## Run it

**Describe it**

```prompt
/lagune-charter My project is an online store that sells video games. Customers add products to a cart and pay by credit card or bank slip. They can see their orders and the status of each one.
```

**Let Lagune propose**

```prompt
/lagune-charter
```

> _I see a payment library, a login setup, and an order model tied to a customer. This looks like an online store that sells something. Customers pay and track their own orders..._ ☁️

## What it works out

**Lagune** takes your description or **PRD** as the direction and works out what it implies for security, then reads the project to go further than you named. For example:

- A cart that holds orders means there is a **database**:
  - e.g., `"Where does the data live?"`, `"Who can reach it?"`, `"Whether it leaks?"`.
- Customers who can see their own orders means there is some kind of **login or access control**:
  - e.g., `"Can one customer reach another's orders?"`, `"Are sessions protected?"`.
- Taking card and bank slip payments means **money and sensitive data are involved**:
  - e.g., `"Is card data stored?"`, `"Are payments verified?"`.

Your description and the project add up, so while your description sets the intent, reading the dependencies, the README, and the configuration surfaces what you did not mention. If something important is still unclear, **Lagune** asks a short, plain question rather than guess.

From there, **Lagune** builds a tailored set of security rules for the project, which you can review and adjust whenever you need.

**Get the most out of it**

- You can also define your own security rules for the project.
- The more relevant detail you give, the better the final report:
  - Explain the project, how it works, and what happens under the hood.
  - Who is the end user? What can users do, and what can they not?
  - Behavioral detail is as valuable as technical detail.
- The charter memory lives in `.lagune/memory/charter.md`.

## The categories it records

Specializations, the security knowledge the later phases load on demand, join your project's [catalog](https://lagune.ai/docs/catalog) by [category](https://lagune.ai/docs/categories). While your project has no category recorded, the charter records each one its reading supports, such as your project's language, calls to an LLM, or containers, and names them in its summary.

Once categories are recorded, the charter leaves them as they are and only names a category your project does not use yet. Change them yourself anytime:

```bash
npx lagune write add --categories python
npx lagune write remove --categories python
```

## Next

With the rules set, map what your system actually does: [`/lagune-detect`](https://lagune.ai/docs/commands/detect).

## Frequently Asked Questions

### What is a charter in Lagune?

The charter is Lagune's governing layer, a set of security-first principles every later phase must respect. Think of it as the compile-time check for your project's security posture.

### Where is the charter stored?

At .lagune/memory/charter.md.

### Can I write my own charter rules?

Yes. Lagune proposes rules from your description and your code, and you can reword, drop, add, or scope them down.

### Does the charter choose my specialization categories?

Only while none is recorded. It then records each category its reading supports, such as your language or calls to an LLM. Once categories are recorded, it never changes them.
