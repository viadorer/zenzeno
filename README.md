# ZENZENO.CZ - E-shop pro Omega-3 produkty

Moderní e-shop pro prodej zdravotních doplňků stravy se zaměřením na Omega-3 produkty a zdravotní testy.

## Funkce

- ✅ **Responzivní design** - funguje na všech zařízeních
- ✅ **Modulární komponenty** - navigace, footer a produkty jsou oddělené
- ✅ **Nákupní košík** - přidávání, odebírání a správa produktů
- ✅ **Filtrování produktů** - podle kategorií, ceny a vyhledávání
- ✅ **30 skutečných produktů** - založených na poskytnutých obrázcích
- ✅ **Lokální úložiště** - košík se zachovává mezi relacemi

## Struktura projektu

```
zenzeno.cz/
├── index.html              # Hlavní stránka
├── produkty.html           # Stránka s produkty
├── css/
│   ├── styles.css          # Hlavní styly
│   ├── components.css      # Styly komponent
│   └── produkty.css        # Styly pro stránku produktů
├── js/
│   ├── components.js       # Navigace a footer komponenty
│   ├── products.js         # Databáze produktů
│   ├── cart.js            # Funkcionalita košíku
│   ├── main.js            # Hlavní JavaScript
│   └── produkty.js        # JavaScript pro stránku produktů
├── images/                # Obrázky produktů (placeholder)
└── README.md             # Tento soubor
```

## Kategorie produktů

1. **Domácí zdravotní testy** - BalanceTest, Vitamin D Test, HbA1c Test
2. **Omega suplementy** - BalanceOil+, Essenz+, R.E.V.O.O
3. **Imunitní podpora** - ZinoShine+, Xtend+, Protect+
4. **Regenerace** - ZinoGene+, Viva+
5. **Zdraví střev** - ZinoBiotic+
6. **Podpora hubnutí** - LeanShake, Energy Bar
7. **Péče o pleť** - Krémy, séra, masky
8. **Výživa pleti** - Collagen Boost

## Jak spustit

1. Otevřete `index.html` v prohlížeči
2. Nebo spusťte lokální server:
   ```bash
   python3 -m http.server 8000
   ```
3. Otevřete `http://localhost:8000`

## Technické detaily

- **Vanilla JavaScript** - žádné závislosti
- **CSS Grid & Flexbox** - moderní layout
- **LocalStorage** - trvalé uložení košíku
- **Responsive design** - mobile-first přístup
- **Modular architecture** - snadno rozšiřitelné

## Budoucí rozšíření

- [ ] Backend integrace
- [ ] Platební brána
- [ ] Uživatelské účty
- [ ] Adminstrační rozhraní
- [ ] Analytics a tracking
- [ ] Email marketing

---

**Vytvořeno pro:** Prodej Omega-3 a zdravotních produktů  
**Technologie:** HTML5, CSS3, Vanilla JavaScript  
**Kompatibilita:** Všechny moderní prohlížeče
