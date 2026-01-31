# Deadline Tracking — Monitorizare Termene

## Goal
Monitorizeaza deadlines pentru call-uri deschise si viitoare, si genereaza un overview actualizat.

## Inputs
- **Call-uri de monitorizat**: lista de call IDs / links, sau "toate din ultimul research"
- **Filtru**: (optional) doar un anumit program sau domeniu

## Process
1. Citeste call-urile monitorizate (din `output/tracked_calls.md` sau din ultimul raport de research)
2. Verifica statusul fiecarui call:
   - Inca deschis?
   - Deadline modificat?
   - Informatii noi publicate (FAQ, corrigendum)?
3. Ordoneaza cronologic
4. Genereaza/updateaza overview-ul

## Tools
- `_execution/scrape_eu_portal.py` — Verificare status calls
- `_execution/scrape_ro_portals.py` — Verificare portaluri RO
- Web search ca fallback

## Output
Fisier persistent: `output/tracked_calls.md`

Format:
```
# Call-uri Monitorizate — Ultima actualizare: [data]

## Urgente (< 30 zile)
| Call | Program | Deadline | Zile ramase | Status | Link |
|------|---------|----------|-------------|--------|------|

## Upcoming (30-90 zile)
| ... |

## In pregatire (> 90 zile sau TBD)
| ... |

## Expirate recent
| ... |
```

## Frecventa
- Ruleaza la cererea user-ului
- Recomandat: cel putin o data pe saptamana

## Edge Cases
- Call anulat: marcheaza "ANULAT" si muta la expirate
- Deadline prelungit: updateaza si noteaza "Prelungit de la [data veche]"
- Informatii contradictorii intre surse: noteaza ambele, recomanda verificare pe portalul oficial

## Self-Annealing
- Daca un portal schimba formatul datelor → updateaza parserul → noteaza in aceasta directiva
