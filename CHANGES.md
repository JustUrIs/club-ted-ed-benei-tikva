# Changelog

## 2026-05-29 — Mobile-first redesign + identidad TED-Ed

Cambios pedidos por feedback del cliente. Resumen: reducir scroll/secciones,
priorizar mobile, agregar identidad visual TED-Ed (caras de speakers
distribuidas), nuevo efecto de círculo rojo en hero, FAQ con íconos de manos.

### Secciones eliminadas

- **`#programa` (Para quién es / "Esto es para vos si…")** — quitada por completo.
  Contenido movido al FAQ como "¿Para quién es?".
- **`.learn` (Qué vas a aprender / 8 herramientas)** — quitada. La gente ya
  asume qué se aprende en un Club TED-Ed.
- **`.gallery` (Speakers strip)** — quitada como sección dedicada. Las caras de
  speakers ahora aparecen distribuidas como **elementos de identidad** a lo
  largo de la página (hero, identity strip, FAQ, CTA) — no concentradas en una
  sola sección.
- **`.partners` (Llevá Clubes TED-Ed a tu escuela)** — quitada.
- **`.ig` (Instagram section)** — quitada. Instagram se mantiene únicamente
  como link en el footer.

### Manifiesto

- Reducido de **6 paneles → 3 paneles**:
  1. Una **idea**.
  2. Puede empezar una **conversación**.
  3. Puede cambiar un **aula**.
- En desktop sigue siendo horizontal-pin (GSAP `ScrollTrigger.pin`).
- En **mobile** los paneles se apilan verticalmente con reveal individual
  (`opacity + y` por panel). No hay scroll horizontal en mobile.

### Hero — nuevo efecto de círculo rojo

- **Animación de entrada** (igual): el círculo entra escala 0 → 1.
- **Nuevo:** al hacer scroll, la sección hero queda **pinned** (`ScrollTrigger
  pin: true`) y el círculo **crece** de scale 1 → ~4.5 (desktop) / ~3.6 (mobile)
  durante 110% del viewport.
- **El círculo tapa el texto** mientras crece. Para que la "letra roja sobre
  rojo" siga siendo legible se aplicó `mix-blend-mode: difference` sobre
  `.hero__inner` y el título se pintó todo en rojo
  (`.hero__title { color: var(--red); }`).
  - Resultado matemático del blend mode:
    - rojo sobre fondo negro → rojo (visible)
    - rojo sobre fondo rojo → **negro** (visible, como pediste)
  - Las áreas que el círculo tapa "perforan" el texto a negro.
- Después de que termina el pin, el scroll continúa normal y entra Manifiesto.

### Identidad TED-Ed distribuida

Speakers ya no viven en una grilla; aparecen como elementos sutiles:

- **Hero:** dos caras decorativas en las esquinas (`.hero__face--a/--b`),
  blanco y negro, baja opacidad. Foto3 + Foto7.
- **Identity strip** (nueva sección entre Manifiesto y Timeline): 1–3 caras
  + un quote ("Caras reales. Voces reales. Esta es la familia TED-Ed.").
  Foto1 + Foto5 + Foto8.
- **FAQ:** Foto2 como watermark a baja opacidad en el lateral.
- **CTA:** Foto4 como acento en la esquina inferior derecha.

Las imágenes usan los assets existentes en `assets/photos/Foto1-8.png`.

### FAQ — íconos de manos (en vez de `+`)

- Cada `<summary>` ahora muestra un **ícono de puño cerrado** (SVG inline).
- Al abrir el `<details>`, el ícono se intercambia por una **palma abierta**.
- CSS-only swap usando `[open]` selector:
  ```css
  .faq__hand-icon--open { display: none; }
  .faq__item[open] .faq__hand-icon--closed { display: none; }
  .faq__item[open] .faq__hand-icon--open { display: block; }
  ```
- Sutil rotación + scale en el estado abierto para reforzar el gesto.

#### Pregunta agregada al FAQ
- **"¿Para quién es?"** — absorbe el contenido de la sección eliminada
  `para-quien` (estudiantes secundaria + sin experiencia previa + comunidad
  judía + email de contacto).
- **"¿Cuánto tarda la postulación?"** — absorbe el micro-copy del CTA
  "Tarda 3 minutos".

### Mobile-first

`styles.css` fue reorganizado de **desktop-first** (override con `max-width`) a
**mobile-first** (base mobile, override con `min-width`). Cambios concretos:

- Reset de `--pad-x` mínimo más chico (`1.1rem` vs `1.5rem`) para más espacio
  útil en pantallas estrechas.
- `--section-y` mínimo bajado a `4.5rem` para no quemar viewport en mobile.
- Hero: tipografía `clamp(2.6rem, 13vw, …)` arranca usable en celular.
- Hero: padding superior `5rem` reservado para el nav en mobile.
- Hero meta lateral (`hero__rail`, `hero__meta--tl/tr`) ocultos por default;
  aparecen en `min-width: 820px`.
- Nav: estructura mobile primero (burger + drawer), nav desktop activado en
  `min-width: 820px`.
- Manifesto: stack vertical default (panels `min-height: 60svh`), horizontal-pin
  solo en `min-width: 821px`.
- Timeline: grid `24px 1fr` y `gap: 1rem` en mobile, escala progresivamente
  a `50px 1fr` (≥720px) y `80px 1fr` (≥1024px).
- FAQ: tipografía `clamp(1rem, 2.5vw, 1.25rem)` legible en cualquier viewport,
  padding interno reducido a `1.4rem 0` en mobile.
- Footer: stack vertical default, fila en `≥720px`.

### Footer — simplificado

- Links footer: **Postulate · FAQ · Contacto · @beneitikva**.
- Removidos los links a secciones eliminadas (`#partners`, etc.).
- IG vive solo acá (no hay sección IG propia ya).

### JavaScript — limpieza

`script.js` actualizado:

- Removido el bloque de **gallery drag-to-scroll** (sección eliminada).
- Removidas las animaciones de `.para-quien__item`, `.learn__card`,
  `.partners__inner`, `.ig__link`.
- Reemplazado el viejo parallax del hero (`yPercent: -25; scale: 0.85`) por el
  nuevo **pin + grow** descrito arriba.
- Agregado branch mobile del Manifesto (reveal vertical en lugar de horizontal).
- Agregado reveal de la nueva Identity strip.
- Agregado `resize` debounced + `ST.refresh()` para que el nuevo pin recalcule
  correctamente al rotar el celular.

### Archivos tocados

```
website/index.html      — estructura HTML completa
website/styles.css      — design system mobile-first
website/script.js       — coreografía GSAP/Lenis
website/CHANGES.md      — este archivo (nuevo)
```

### Notas de QA

- Probar pin del hero en iOS Safari (`100svh` debería evitar saltos de URL bar).
- Si `mix-blend-mode: difference` causa flicker en Android Chrome viejo,
  considerar swap a SVG mask o quitar el blend en `< 600px`.
- Manifesto horizontal solo arriba de 820px; si tablets en landscape sufren,
  bajar el breakpoint.
