# Loading glyphs — copy till annan AI

Klistra in detta till en annan AI när du vill ha en loading-indikator med dessa glyphs.

---

**Instruktion till AI:** Implementera en loading-indikator som cyklar genom tecken i `spinnerSets`. Använd t.ex. `spinnerSets.moon` eller `spinnerSets[setName]`. Visa ett tecken i taget i ett DOM-element (eller React state) och byt tecken var 80–250 ms tills loading är klar. Glöm inte att stoppa intervallet/timern när loading är klar.

---

## Data (spinnerSets)

```js
const spinnerSets = {
  braille: ['\u280B','\u2819','\u2839','\u2838','\u283C','\u2834','\u2826','\u2827','\u2807','\u280F'],
  arrows:  ['\u2191','\u2197','\u2192','\u2198','\u2193','\u2199','\u2190','\u2196'],
  blocks:  ['\u2596','\u2598','\u259D','\u2597','\u259A','\u259E','\u2588','\u2593','\u2592','\u2591'],
  classic: ['|','/','-','\\','|','/','-','\\'],
  dots:    ['\u28FE','\u28FD','\u28FB','\u28BF','\u287F','\u28DF','\u28AF','\u28B7'],
  moon:    ['\u25D0','\u25D3','\u25D1','\u25D2'],
  line:    ['\u2581','\u2582','\u2583','\u2584','\u2585','\u2586','\u2587','\u2588','\u2587','\u2586','\u2585','\u2584','\u2583','\u2582'],
  hex:     ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'],
  quarter: ['\u25DC','\u25E0','\u25DD','\u25DF','\u25DE','\u25DE','\u25DD','\u25E0'],
};
```

## Minimal logik (vanilla JS)

```js
function startGlyphSpinner(element, setName = 'moon', intervalMs = 100) {
  const chars = spinnerSets[setName] || spinnerSets.moon;
  let i = 0;
  const id = setInterval(() => {
    element.textContent = chars[i % chars.length];
    i++;
  }, intervalMs);
  return () => clearInterval(id); // anropa returnerad funktion för att stoppa
}

// Användning:
// const stop = startGlyphSpinner(document.getElementById('loader'), 'moon');
// … när klar: stop();
```

---

Om du bara vill ge **en rad** till en annan AI (t.ex. bara moon):

```js
moon: ['\u25D0','\u25D3','\u25D1','\u25D2'],
```

Säg då: "Använd denna array som loading-spinner: visa ett tecken i taget och byt var 100 ms."
