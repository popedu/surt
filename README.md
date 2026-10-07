# 🏃 Surt

**Reptes de running i trail a prop teu. Sense competir, només per sortir.**

Prototip d'una web app (pensada per al mòbil) on cada poble té els seus reptes: setmanals, mensuals, de temporada o permanents. T'hi apuntes, afegeixes les teves sortides i veus com avances tu i com avança tothom. De moment només hi ha l'Alt Penedès.

## Com provar-ho

Cal tenir [Node.js](https://nodejs.org) instal·lat.

```bash
npm install
npm run dev
```

Obre http://localhost:5173. Per veure-ho com al mòbil, a Chrome prem `F12` i activa la vista de dispositiu (`Ctrl+Shift+M`).

Per publicar-ho: `npm run build` genera la carpeta `dist/`, que es pot pujar tal qual a Netlify, Vercel o GitHub Pages.

## Què hi ha fet

- **Entrada en 10 segons**: nom, poble i si surts amb mascota. Sense contrasenyes (de moment).
- **Explora**: mapa topogràfic amb 8 rutes de mostra de l'Alt Penedès (castells, vinyes...) i reptes ordenats per proximitat al teu poble.
- **Reptes** de diferents tipus: desnivell setmanal, nombre de sortides, km al mes, km amb mascota, *Ruta dels 5 castells*, repetir una ruta...
- **Progrés sense competició**: barra "entre tots" (objectiu comú), companys de repte sense posicions ni medalles, i botó 👏 per enviar ànims.
- **Afegir sortida** amb un sol botó (＋). Si tries una ruta, s'omplen els km i el desnivell sols.
- **Comerços**: des del Perfil, un comerç pot crear un repte patrocinat amb premi i veure com quedarà abans de publicar-lo.

> ⚠️ Les dades es guarden només al navegador. Els participants són inventats i els traçats de les rutes són orientatius (no són tracks GPS reals). Els comerços que hi surten són d'exemple.

## Decisions

- **Un sol tipus de compte.** Un comerç és un usuari que, a més, crea reptes. Això estalvia pantalles i un segon registre. Quan hi hagi pagaments, s'hi afegirà un petit panell per a comerços.
- **Premi per a tothom qui acaba, o sorteig entre qui acaba**, mai per al més ràpid. Així el patrocini no trenca la idea de no competir.
- **Web app i no app de botiga**: arriba a tothom amb un enllaç i es pot instal·lar al mòbil (PWA). Si funciona, després es pot empaquetar per a iOS/Android.

## Estructura

```
src/
  App.jsx              navegació i pantalles
  store.js             dades (avui localStorage; demà backend)
  logic.js             períodes, progrés, distàncies
  data/                pobles, rutes i reptes de mostra
  components/          pantalles i peces de la interfície
```

## Propers passos

1. **Comptes reals i dades compartides**: [Supabase](https://supabase.com) (login amb Google/email, base de dades Postgres amb PostGIS per als mapes). Té un pla gratuït.
2. **Connexió amb Strava** perquè les sortides entrin soles. Strava ja rep dades de COROS, Garmin, Suunto i Polar, i és l'opció més ràpida. Més endavant es poden afegir integracions directes.
3. **Rutes reals** en GPX (fetes per tu o per clubs locals) i perfil de desnivell.
4. **Validació automàtica** de "he fet aquesta ruta" comparant el track amb la ruta.
5. **PWA**: instal·lable al mòbil i amb notificacions ("Et falten 2 km per acabar el repte!").
6. **Panell per a comerços** amb pagament (Stripe) i estadístiques del seu repte.
7. Ampliar a altres comarques i esports.
