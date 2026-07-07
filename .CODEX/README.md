# AeroVista Business Suite

Initial extraction scaffold for the business-system domains that should live outside AeroCoreOS.web.

Current modules:

- contacts
- team
- invoices
- tasks
- projects

Goals of this first build:

- prove the shell-only boundary for AeroCoreOS.web
- establish a shared-entity direction
- demonstrate recent activity, universal search, and relationship-aware cards

## Run

```bash
cd /srv/ACOS/AeroCoreOS/apps/AeroVista_BusinessSuite
npm install
npm run dev
```

Default dev URL:

- `http://100.115.9.61:3010`

Production-style local deploy:

```bash
cd /srv/ACOS/AeroCoreOS/apps/AeroVista_BusinessSuite
sudo docker compose up -d --build
```

## Notes

- This is the first extraction foundation, not a finished production suite.
- The current UI uses seeded data to validate the cross-module model before backend extraction work begins.
