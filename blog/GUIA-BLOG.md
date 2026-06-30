# Guia ràpida del blog

Aquesta carpeta funciona amb una sola font de contingut: `blog/content/posts/*.json`.

## Flux recomanat

1. Crea o edita una entrada a `blog/content/posts/<slug>.json`.
2. Executa:

```bash
npm run blog:build
```

3. El script genera automàticament:
- `blog/index.html`
- `blog/<slug>.html` (totes les entrades)
- `blog/posts.json` (manifest generat; no editar a mà)
- `newsletter/output/newsletter-YYYY-MM.html` (per cada mes amb entrades)
- `newsletter/output/index.html`

## Camps clau del JSON d'entrada

- `slug`, `date`, `month`, `kicker`, `title`, `summary`
- `cover`:
  - `palette`: `terracota` | `mostassa` | `verd` | `lila`
  - `image`: URL d'imatge per usar com a fons del resum/cover
  - `eyebrow`, `subtitle`
- `lede`
- `body`: blocs tipus `h2`, `p`, `ul`, `quote`, `note`, `image`, `cta`
- `newsletter`: contingut curt adaptat al format de butlletí (estil diari)

## Exemple de bloc d'imatge orgànic

```json
{
  "type": "image",
  "src": "https://exemple.com/imatge.avif",
  "alt": "Descripció de la imatge",
  "caption": "Peu de foto opcional"
}
```

## Nota important

`blog/posts.json` és un fitxer generat pel build (`generatedFrom: blog/content/posts/*.json`).
No cal ni convé editar-lo manualment.
