# Eligibility Check — Verificare Eligibilitate

## Goal
Analizeaza daca o organizatie/proiect se incadreaza in criteriile de eligibilitate pentru un call specific.

## Inputs
- **Profil organizatie**: tip, dimensiune, domeniu activitate, CUI (optional), regiune
- **Call target**: link sau ID-ul call-ului de verificat
- **Ideea de proiect**: scurta descriere a ce vrea sa faca

## Process
1. Descarca/citeste ghidul solicitantului sau call document-ul
2. Extrage criteriile de eligibilitate:
   - Tip organizatie eligibila
   - Dimensiune (numar angajati, cifra afaceri)
   - Domenii CAEN / NACE eligibile
   - Restrictii geografice
   - Conditii financiare (nu in insolventa, datorii la stat, etc.)
   - Parteneriat obligatoriu? (consortiu minim)
3. Compara profilul organizatiei cu criteriile
4. Genereaza raport cu verdictul: ELIGIBIL / NEELIGIBIL / PARTIAL (cu explicatii)

## Tools
- Web fetch pentru ghiduri publicate online
- `_execution/check_eligibility.py` — Parsare si matching criterii

## Output
Raport markdown: `output/eligibility_[call_id]_[data].md`

Format:
```
## Rezultat: [ELIGIBIL / NEELIGIBIL / DE VERIFICAT]

### Criterii indeplinite ✓
- ...

### Criterii neindeplinite ✗
- ...

### De verificat manual
- ...

### Recomandari
- ...
```

## Edge Cases
- Ghid in engleza: traduce criteriile in romana in raport
- Criterii ambigue: marcheaza "De verificat manual" si explica ambiguitatea
- Informatii lipsa despre organizatie: cere user-ului sa completeze

## Self-Annealing
- Daca un tip de criteriu apare frecvent si nu e acoperit → adauga-l in checklist-ul standard
