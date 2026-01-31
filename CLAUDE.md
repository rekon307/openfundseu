# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

## About This Agent

**eu-funds-agent** - Cercetare fonduri europene, verificare eligibilitate, asistenta propuneri, monitorizare deadlines

**Type**: Research
**Created**: 2026-01-31

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**
- SOPs in `_directives/` define goals, inputs, tools, outputs, and edge cases
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**
- You (the AI) route tasks, call execution tools, handle errors, update directives with learnings

**Layer 3: Execution (Doing the work)**
- Deterministic Python scripts in `_execution/`
- Handle API calls, data processing, file operations

**Why this works:** 90% accuracy per step = 59% success over 5 steps. Push complexity into deterministic code.

## Operating Principles

**1. Check for tools first**
Before writing a script, check `_execution/`. Only create new scripts if none exist.

**2. Self-anneal when things break**
- Read error message and stack trace
- Fix the script and test it again
- Update the directive with what you learned

**3. Update directives as you learn**
Directives are living documents. Update them when you discover constraints, better approaches, or common errors.

## File Organization

- `.tmp/` - Intermediate files (never commit, always regenerated)
- `_execution/` - Python scripts (appears first in directory listing)
- `_directives/` - SOPs in Markdown (appears first in directory listing)
- `.env` - Environment variables (if needed)

## Agent-Specific Instructions

### Domeniu
Fonduri si proiecte europene — atat programe EU (Horizon Europe, Digital Europe, COSME, Erasmus+, InvestEU, LIFE, CEF, etc.) cat si programe nationale romanesti cofinantate EU (PNRR, POC, POCU, POR, MySMIS/SMIS2021+).

### Surse de date
**Portaluri EU:**
- Funding & Tenders Portal (ec.europa.eu/info/funding-tenders)
- CORDIS (cordis.europa.eu)
- European Structural and Investment Funds (cohesiondata.ec.europa.eu)
- EIC Accelerator, EIT, EDIH portals

**Portaluri RO:**
- MySMIS / SMIS2021+ (mysmis2021.gov.ro)
- MIPE (mfe.gov.ro)
- ADR-uri regionale
- Ghidurile solicitantului publicate pe site-urile AM/OI

### Module
1. **Research Funding** (`_directives/research_funding.md`) — Identificare oportunitati
2. **Eligibility Check** (`_directives/eligibility_check.md`) — Verificare eligibilitate
3. **Proposal Writing** (`_directives/proposal_writing.md`) — Structurare propuneri
4. **Deadline Tracking** (`_directives/deadline_tracking.md`) — Monitorizare termene

### Limba
Directivele si output-ul sunt in romana. Cand se cauta pe portaluri EU, cautarea se face in engleza.

### Output
Rapoarte markdown in `output/`. Fiecare raport include surse, link-uri directe, si date relevante.
