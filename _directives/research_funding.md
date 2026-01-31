# Research Funding — Identificare Oportunitati

## Goal
Cauta si identifica oportunitati de finantare europeana relevante pentru un domeniu/profil dat.

## Inputs
- **Domeniu/sector**: ex. digitalizare, agricultura, energie verde, IMM-uri, cercetare
- **Tip organizatie**: IMM, ONG, institutie publica, universitate, startup
- **Buget estimat proiect**: (optional) pentru a filtra calls relevante
- **Tara/Regiune**: Romania + regiune de dezvoltare (daca relevant)

## Process
1. Primeste cerinta de la user (domeniu, tip organizatie)
2. **Web search** pentru context initial — cautare in engleza (EU) si romana (RO)
3. **Browser automation** pentru verificare live pe portaluri JS-rendered (vezi sectiunea Tools)
4. Filtreaza doar calls deschise sau upcoming
5. Pentru fiecare oportunitate extrage: nume program, call ID, deadline, buget disponibil, rata cofinantare, link direct
6. Genereaza raport markdown in `output/`
7. **Verificare finala** — deschide portalurile in browser si confirma ca datele sunt accurate

## Tools

### Prioritar: Browser Automation (Chrome MCP)
Portalurile EU si RO sunt JS-rendered — WebFetch nu le poate citi. Foloseste browser automation:

1. `mcp__claude-in-chrome__tabs_context_mcp` — verifica tab-uri existente
2. `mcp__claude-in-chrome__tabs_create_mcp` — creeaza tab-uri noi
3. `mcp__claude-in-chrome__navigate` — deschide URL-ul portalului
4. `mcp__claude-in-chrome__computer` (wait 3-5s) — asteapta randarea JS
5. `mcp__claude-in-chrome__get_page_text` — extrage textul paginii
6. `mcp__claude-in-chrome__javascript_tool` — fallback daca get_page_text returneaza gol:
   ```javascript
   // Extrage toate link-urile de call-uri
   const links = document.querySelectorAll('a[href*="open-call/"]');
   const results = []; const seen = new Set();
   links.forEach(l => {
     if (!seen.has(l.href)) { seen.add(l.href); results.push({title: l.innerText.trim(), href: l.href}); }
   });
   JSON.stringify(results, null, 2)
   ```
7. `mcp__claude-in-chrome__computer` (screenshot) — pentru verificare vizuala cand JS extraction nu e suficient

### Portaluri de verificat

| Portal | URL | Metoda |
|--------|-----|--------|
| Cascade Funding Hub | cascadefunding.eu/open-calls/ | JS exec (links `a[href*="open-call/"]`) |
| EU Funding & Tenders | ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/calls-for-proposals | get_page_text (randeaza dupa ~5s) |
| ADR Bucuresti-Ilfov | regiobucuresti-ilfov.ro/calendar-apeluri | get_page_text (functioneaza direct) |
| NLnet / NGI | nlnet.nl/commonsfund/ | get_page_text |

### Secundar: Web Search
- Cautare initiala pentru identificare rapida de surse si context
- Fallback cand browser automation nu e disponibil

### Optional: Execution Scripts
- `_execution/scrape_eu_portal.py` — Scrape Funding & Tenders Portal (de construit daca e nevoie de automatizare periodica)
- `_execution/scrape_ro_portals.py` — Scrape portaluri romanesti (idem)

## Output
Raport markdown: `output/funding_opportunities_[data].md`

Format per oportunitate:
```
### [Nume Program] — [Call ID]
- **Deadline**: DD.MM.YYYY
- **Buget total call**: €X
- **Cofinantare**: X%
- **Eligibil pentru**: [tip organizatie]
- **Link**: [URL direct]
- **Rezumat**: 2-3 propozitii
```

## Edge Cases
- Portal indisponibil: noteaza in raport, continua cu celelalte surse
- Call expirat recent: exclude, dar mentioneaza daca urmeaza o noua runda
- Informatii incomplete: marcheaza campurile lipsa cu "De verificat"
- `get_page_text` returneaza gol: pagina e full JS — foloseste `javascript_tool` cu DOM queries
- Cookie banner/popup blocheaza: click dismiss inainte de extragere (Reject All / X button)
- Portal loading lent: wait 5-8s in loc de 3

## Self-Annealing
- Daca un portal isi schimba structura HTML → updateaza selectoarele JS din aceasta directiva
- Daca descoperi surse noi relevante → adauga-le in tabelul "Portaluri de verificat" de mai sus
- Daca un selector CSS nu mai gaseste call-uri → screenshot + inspectare manuala → update selector

## Lessons Learned (31.01.2026)
- **cascadefunding.eu**: `get_page_text` returneaza gol — trebuie JS exec cu `a[href*="open-call/"]`
- **EU Funding & Tenders Portal**: randeaza dupa ~5s, `get_page_text` poate returna gol — screenshot ca fallback
- **ADR Bucuresti-Ilfov**: `get_page_text` functioneaza direct, fara JS exec
- **NLnet/NGI**: rolling calls la fiecare 2 luni — verifica mereu deadline-ul curent
- **Web search**: datele pot fi outdated (ex. PR BI 1.7 raportat "ian 2026" cand de fapt e "sept 2026") — intotdeauna verifica pe portalul oficial cu browser
