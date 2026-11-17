# 🗄️ SQL Basics – What is SQL & Data Types

## 1. What is SQL?

- **SQL** = Structured Query Language.
- It is the language we use to **talk to a database**: create, read, update, and
  delete data.
- Popular SQL databases: **PostgreSQL**, MySQL, SQLite, SQL Server.
- In this project we use **PostgreSQL** (on Neon cloud).

## 2. Understand It with a Student Table

Imagine we have a **`students` table**. A table stores one type of data in an
organized way.

- **Table** → the whole sheet (`students`)
- **Attribute (Column)** → one property of a student (id, name, dob...)
- **Record (Row)** → one full student
- **Value** → the actual data inside a column (example: `Maha`) Every attribute
  has a **data type**. The data type tells the database what kind of value is
  allowed in that column.

Attributes of our `students` table:

| Attribute     | Data Type     |
| ------------- | ------------- |
| `ID`          | `SERIAL`      |
| `STUDENT_ID`  | `INTEGER`     |
| `NAME`        | `VARCHAR(50)` |
| `DOB`         | `DATE`        |
| `IS_ENROLLED` | `BOOLEAN`     |

Example data inside this table:

| ID  | STUDENT_ID | NAME  | DOB        | IS_ENROLLED |
| --- | ---------- | ----- | ---------- | ----------- |
| 1   | 1001       | Rahim | 2002-05-10 | true        |
| 2   | 1002       | Sumi  | 2003-01-22 | false       |

> 💡 Analogy: A column is like a form field. A phone number field accepts only
> numbers. A name field accepts text. The data type is that rule.

## 3. Most Used Data Types

Boolean, Numbers, Binary, Date/Time, JSON, Character, UUID, Array, XML.

---

## 4. Numbers

| Data Type                   | Storage  | Best Use Case                          |
| --------------------------- | -------- | -------------------------------------- |
| `SMALLINT` (int2)           | 2 bytes  | Small numbers: age, quantity, rating   |
| `INTEGER` (int4)            | 4 bytes  | Standard choice for most whole numbers |
| `BIGINT` (int8)             | 8 bytes  | Very big numbers: global IDs, counters |
| `REAL` (float4)             | 4 bytes  | Decimal numbers (less exact)           |
| `DOUBLE PRECISION` (float8) | 8 bytes  | Scientific / engineering calculation   |
| `NUMERIC` / `DECIMAL`       | Variable | Money and exact calculation            |
| `SERIAL`                    | 4 bytes  | Auto-increment primary key             |

⚠️ For **money**, always use `NUMERIC` (or `DECIMAL`). `REAL` and
`DOUBLE PRECISION` can give small rounding mistakes.

## 5. Character (Text)

| Data Type    | Storage            | Best Use Case                     |
| ------------ | ------------------ | --------------------------------- |
| `CHAR(n)`    | Fixed `n` bytes    | Known length: country code (`BD`) |
| `VARCHAR(n)` | Variable, max `n`  | Username, email                   |
| `TEXT`       | Variable, no limit | Description, message              |

## 6. Date & Time

| Data Type   | Example                                |
| ----------- | -------------------------------------- |
| `DATE`      | `2025-08-25`                           |
| `TIME`      | `14:30:00`                             |
| `TIMESTAMP` | `2025-08-25 14:30:00`                  |
| `INTERVAL`  | `2 days`, `3 hours` (a length of time) |

## 7. UUID

- **UUID** = Universally Unique Identifier.
- It is a long unique value made of numbers and characters.
- Best use: a **unique primary key**.

| Data Type | Example                                | Best Use Case      |
| --------- | -------------------------------------- | ------------------ |
| `UUID`    | `550e8400-e29b-41d4-a716-446655440000` | Unique primary key |

## 8. Boolean

- Only two values: `TRUE` or `FALSE`.
- Example: `is_enrolled`, `is_active`, `is_verified`.

---

## 9. Example: Create the Students Table

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  name VARCHAR(50) NOT NULL,
  dob DATE,
  is_enrolled BOOLEAN DEFAULT true
);
```

- `PRIMARY KEY` → makes each row unique.
- `NOT NULL` → this value is required.
- `DEFAULT true` → if no value is given, use `true`.

## ✅ Quick Rules to Remember

- Choose the **smallest type that fits** your data.
- Use `NUMERIC` for money.
- Use `VARCHAR(n)` for short text, `TEXT` for long text.
- Use `SERIAL` for simple auto IDs, `UUID` for globally unique IDs.
