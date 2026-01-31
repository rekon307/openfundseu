# Proposal Writing — Asistenta Scriere Propuneri

## Goal
Ajuta la structurarea si scrierea sectiunilor cheie ale unei cereri de finantare europeana.

## Inputs
- **Call/Program**: link sau ID
- **Ideea de proiect**: descriere detaliata
- **Profil organizatie**: experienta, resurse, echipa
- **Buget estimat**: (optional)
- **Parteneri**: (optional) consortiu

## Process
1. Citeste structura ceruta de call (application form template)
2. Identifica sectiunile obligatorii (de obicei):
   - Excelenta / Relevanta (ce problema rezolva)
   - Impact (rezultate asteptate, indicatori)
   - Implementare (plan de lucru, work packages, timeline)
   - Echipa si resurse
   - Buget
3. Pentru fiecare sectiune:
   - Explica ce asteapta evaluatorii
   - Propune structura si puncte cheie
   - Redacteaza draft pe baza inputului user-ului
4. Verifica alinierea cu criteriile de evaluare
5. Genereaza documentul draft

## Tools
- Web fetch pentru template-uri si ghiduri de evaluare
- `_execution/compile_report.py` — Formatare finala

## Output
Draft propunere: `output/proposal_draft_[call_id]_[data].md`

Include:
- Sectiuni structurate conform template-ului call-ului
- Placeholder-uri clare acolo unde lipsesc date specifice: `[DE COMPLETAT: ...]`
- Note pentru user cu sugestii de imbunatatire

## Principii de redactare
- Limbaj clar, concis — evita jargon excesiv
- Fiecare propozitie trebuie sa sustina un argument
- Foloseste indicatori cuantificabili (KPIs) acolo unde e posibil
- Aliniaza fiecare sectiune la criteriile de evaluare ale call-ului
- Respecta limita de caractere/pagini daca e specificata

## Edge Cases
- Template necunoscut: cere user-ului sa uploadeze sau descrie structura
- Call cu mai multi piloni: intreaba user-ul pe care pilon aplica
- Propunere in engleza: redacteaza in engleza, cu note in romana

## Self-Annealing
- Daca descoperi structuri comune la call-uri similare → salveaza ca template in `_execution/templates/`
