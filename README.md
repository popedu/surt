# 🏃 Surt

**Reptes de running i trail a prop teu. Sense competir, només per sortir.**

App de mòbil (iPhone i Android) on cada poble té els seus reptes: setmanals, mensuals, de temporada o permanents. T'hi apuntes, les teves sortides hi sumen i veus com avances tu i com avança tothom. De moment només hi ha l'Alt Penedès.

## Estructura del repositori

```
mobile/   l'app (React Native + Expo)  ← aquí es treballa
web/      primer prototip web (Vite + React), només com a referència
```

## Com provar l'app al teu mòbil

1. Instal·la **Expo Go** al mòbil (App Store o Google Play).
2. Al PC (cal [Node.js](https://nodejs.org)):
   ```bash
   cd mobile
   npm install
   npx expo start
   ```
3. Escaneja el codi QR que surt al terminal amb la càmera de l'iPhone (o amb Expo Go a Android). El mòbil i el PC han d'estar a la mateixa xarxa Wi-Fi.

Cada canvi al codi es veu a l'instant al mòbil.

## Què hi ha fet

- **Entrada en 10 segons**: nom, poble (amb la ubicació del mòbil o cercant) i si surts amb mascota.
- **Explora**: mapa topogràfic amb 8 rutes de mostra (castells, vinyes...). Toques una ruta i veus els seus reptes. Els reptes surten ordenats per proximitat al teu poble.
- **Reptes** de diferents tipus: desnivell setmanal, nombre de sortides, km al mes, km amb mascota, *Ruta dels 5 castells*, repetir una ruta...
- **Progrés sense competició**: barra "entre tots" (objectiu comú), companys de repte sense posicions ni medalles, i botó 👏 per enviar ànims.
- **Afegir sortida** amb el botó taronja ＋. Si tries una ruta, s'omplen els km i el desnivell sols.
- **Comerços**: des del Perfil, un comerç pot crear un repte patrocinat amb premi.

> ⚠️ Les dades es guarden només al mòbil. Els participants són inventats i els traçats de les rutes són orientatius (no són tracks GPS reals). Els comerços que hi surten són d'exemple.

## Decisions

- **App nativa i no web**: el que farà que la gent la faci servir és que les activitats del rellotge entrin soles, i això només es pot fer bé des d'una app.
- **Un sol tipus de compte.** Un comerç és un usuari que, a més, crea reptes.
- **Premi per a tothom qui acaba, o sorteig entre qui acaba**, mai per al més ràpid. Així el patrocini no trenca la idea de no competir.

## Propers passos

1. **Sincronització automàtica** amb Apple Salut (iPhone) i Health Connect (Android). Garmin, COROS, Polar i Suunto hi poden enviar les activitats, així que amb una sola integració els cobrim gairebé tots. Necessita una *development build* (a iPhone, compte d'Apple Developer).
2. **Supabase**: comptes, reptes reals i progrés compartit entre usuaris.
3. **Rutes reals** en GPX i perfil de desnivell.
4. **Strava** i integracions directes amb les marques, quan hi hagi usuaris.
5. **Panell per a comerços** amb pagament i estadístiques.
6. Ampliar a altres comarques i esports.
