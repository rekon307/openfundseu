# OpenFundsEU

Open-source platform helping individuals, freelancers and SMEs across Europe discover, evaluate and apply for EU funding opportunities.

## The Problem

EU funding portals are fragmented, JS-heavy, and difficult to navigate. Billions in available funding go underutilized because smaller actors lack dedicated grant-writing staff or the expertise to navigate the system.

## What OpenFundsEU Does

1. **Portal Aggregation** - Scrapes open calls from EU Funding & Tenders Portal (20+ programmes), Cascade Funding Hub, NLnet/NGI, EIT, EUIPO SME Fund, and national portals
2. **Profile Matching** - Ranks funding opportunities by relevance to your organisation type, sector, region and size
3. **Deadline Tracking** - Monitors call statuses, detects changes and cancellations, generates alerts
4. **Proposal Assistant** - Extracts evaluation criteria from call documents and generates structured proposal outlines

## Status

This is an early prototype built during the exploration phase. The scraping engine and browser automation approach have been validated against live EU portals.

### What Works

- Browser automation extracts live data from JS-rendered EU portals
- Validated against: EU Funding & Tenders Portal, Cascade Funding Hub, ADR Bucuresti-Ilfov (Romania)
- Directive-driven architecture for modular portal scraping

### Architecture

```
_directives/          # SOPs for each module
  research_funding.md   # Portal scraping + opportunity identification
  eligibility_check.md  # Profile-to-criteria matching
  proposal_writing.md   # Proposal structuring assistance
  deadline_tracking.md  # Call monitoring and alerts
_execution/           # Python scripts (to be built)
output/               # Generated reports
```

## Portals Covered

**EU-level (pan-European):**
- EU Funding & Tenders Portal (Horizon Europe, Digital Europe, Erasmus+, Creative Europe, LIFE, CEF, EIC, etc.)
- Cascade Funding Hub (FSTP sub-grants)
- NLnet/NGI programmes
- EIT programmes
- EUIPO SME Fund

**Aggregators (cross-reference):**
- EUFundingPortal.eu
- Grantalist.com
- digitalsme.eu

**National portals (plugin system):**
- Romania (ADR, MIPE/MySMIS) - reference implementation
- Other EU member states via community-contributed plugins

## Tech Stack

- Python (scraping, data processing, API)
- Browser automation (Playwright) for JS-rendered portals
- Open-source LLMs via Ollama for matching and proposal assistance
- Web frontend (planned)

## License

AGPL-3.0

## Funding

This project is seeking funding through the [NGI Zero Commons Fund](https://nlnet.nl/commonsfund/).
