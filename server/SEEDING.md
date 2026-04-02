# Demo Data Seeding

Use this guide to seed realistic 3-5 month financial data for Ghost/dashboard testing.

## Purpose

The seed script creates mixed habit patterns (good, caution, overspending) so team members can demo:

- Ghost suggestions and severity states
- Spending and debt charts
- Savings capacity behavior
- Transaction history density

## Prerequisites

- MongoDB is running
- `server/.env` contains `MONGO_URI`
- Dependencies are installed in `server/`

## Script

Run from the `server` directory:

```bash
npm run seed:ghost-demo
```

## Common Usage

Default demo user and dataset:

```bash
npm run seed:ghost-demo
```

Custom account, 5 months, and reset previous records:

```bash
npm run seed:ghost-demo -- --email teammate@demo.com --password Demo1234! --months 5 --reset
```

## Options

- `--email` user email for seeded records
- `--password` user password for login
- `--months` range `3..5`
- `--reset` remove existing financial records for that user before reseeding

## Notes

- The script only targets the specified user.
- `--reset` clears this user's income, expense, debt, and transaction records before reseeding.
- Re-run any time to regenerate demo scenarios for testing.
