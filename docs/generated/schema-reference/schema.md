# Schema Reference

Generated directly from `design/schema.xsd` - a schema change flows through
automatically, with no hand-maintained copy.


> Documentation générée automatiquement depuis le schéma XSD par `xsd2doc.py`. Ne pas éditer à la main : modifier le `.xsd` puis régénérer.

## Sommaire

- **Fichiers racine** : [foundationRegistry](#foundationregistry), [documentation](#documentation), [tokens](#tokens), [themes](#themes)
- **Types complexes** : [CatalogsType](#catalogstype), [ColorRefType](#colorreftype), [DeterminismRuleType](#determinismruletype), [DeterminismType](#determinismtype), [DocArticleType](#docarticletype), [DocSectionType](#docsectiontype), [DocumentationType](#documentationtype), [IndexType](#indextype), [MetaType](#metatype), [NativeVariantType](#nativevarianttype), [OffsetType](#offsettype), [OutputsType](#outputstype), [PipelineType](#pipelinetype), [RoleMapType](#rolemaptype), [RuleParamType](#ruleparamtype), [ThemeType](#themetype), [ThemesItemsType](#themesitemstype), [TokenType](#tokentype), [TokenValueType](#tokenvaluetype), [TokenValuesType](#tokenvaluestype), [TokensItemsType](#tokensitemstype)
- **Types simples / énumérations** : [SeverityType](#severitytype), [TokenKindType](#tokenkindtype)

## Fichiers racine

### foundationRegistry

*Root of the manifest. Declares the project meta, the determinism rules and the registries (tokens, themes) that the pipeline compiles.*

| Attribut | Type | Contrainte | Description |
|---|---|---|---|
| `schema` | `string` | optional, figé à `flipova.foundation/registry/1` | — |

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `meta` | 1..1 | [`MetaType`](#metatype) | — |
| `catalogs` | 1..1 | [`CatalogsType`](#catalogstype) | — |
| `index` | 1..1 | [`IndexType`](#indextype) | — |

**Contraintes d'intégrité :**

- `DeterminismRuleIdUnique` (*unique*) : `@id` doit être unique parmi `./meta/determinism/rule`.

### documentation

*Root of design/documentation.xml, separated from the manifest: this file is the SINGLE source of documentary truth of the repository.*

**Contraintes d'intégrité :**

- `DocSectionIdUnique` (*unique*) : `@id` doit être unique parmi `./section`.
- `DocArticleIdUnique` (*unique*) : `@id` doit être unique parmi `./section/article`.
- `DocArticleSlugUnique` (*unique*) : `@slug` doit être unique parmi `./section/article`.

### tokens

*Root of the tokens registry. Tokens are the atomic values of the design system: spacing, colors, typography, shadows, animations, etc.*

| Attribut | Type | Contrainte | Description |
|---|---|---|---|
| `schema` | `string` | optional, figé à `flipova.foundation/registry/1` | — |
| `register` | `string` | optional, figé à `tokens` | — |

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `items` | 1..1 | [`TokensItemsType`](#tokensitemstype) | — |

**Contraintes d'intégrité :**

- `TokenIdUnique` (*unique*) : `@id` doit être unique parmi `./items/token`.

### themes

*Root of the themes registry. A theme maps semantic roles (the gluestack/nativewind CSS variable names, e.g. "background", "primary-foreground") to color token references, for the light/dark modes and beyond.*

| Attribut | Type | Contrainte | Description |
|---|---|---|---|
| `schema` | `string` | optional, figé à `flipova.foundation/registry/1` | — |
| `register` | `string` | optional, figé à `themes` | — |
| `default` | `string` | required | Id of the default theme (e.g. "light"). |

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `items` | 1..1 | [`ThemesItemsType`](#themesitemstype) | — |

**Contraintes d'intégrité :**

- `ThemeIdUnique` (*unique*) : `@id` doit être unique parmi `./items/theme`.

## Types complexes

### CatalogsType

*Collection of catalogs; each points to the source file of a registry (tokens, themes).*

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `catalog` | 1..∞ | `CatalogsType.catalog` (en ligne) | — |

### ColorRefType

*Reference to a colour token value (format "$ref.<register>.<id>.<path>").*

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `ref` | 1..1 | `string` | — |

### DeterminismRuleType

*A declarative determinism rule. The checker (checker.py) applies each rule through the handler selected by `kind`. New rules can be declared in the manifest without touching the schema; the matching handler is resolved at runtime (a warning is emitted while no handler is registered for that `kind`).*

| Attribut | Type | Contrainte | Description |
|---|---|---|---|
| `id` | `string` | required | Unique rule id (xs:unique constraint at the root level). |
| `kind` | `string` | required | Rule nature; selects the handler in checker.py. |
| `severity` | `SeverityType` | optional, défaut `error` | Severity: "error" (default) or "warning". |

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `description` | 1..1 | `string` | Plain-language explanation of the rule. |
| `applyTo` | 0..1 | `string` | Glob (fnmatch, e.g. "*.xml") of the files the rule applies to, relative to the root passed to the checker. Default: "*.xml". |
| `params` | 0..1 | `DeterminismRuleType.params` (en ligne) | Key/value parameters of the handler. |

### DeterminismType

*Rules guaranteeing a reproducible, deterministic generation. A declarative, extensible list: each rule is described by a unique id, a nature (kind), a severity, the targeted files (applyTo) and free parameters consumed by checker.py. The order of the rules does not matter: the rule's `kind` alone selects the handler.*

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `rule` | 1..∞ | [`DeterminismRuleType`](#determinismruletype) | — |

### DocArticleType

*One documentation page. `content` is the page body in Markdown: it is the single source of truth for that topic -- docgen.py renders it as-is (or combined with schema/registry-derived content for the schema-reference/api-reference pages) and no copy of that text should live anywhere else in the repository (no stray READMEs): everything is centralized in documentation.xml.*

| Attribut | Type | Contrainte | Description |
|---|---|---|---|
| `id` | `string` | required | Unique article id within documentation.xml. |
| `title` | `string` | required | Display title (page and navigation). |
| `slug` | `string` | required | Relative output path (no extension), e.g. "theming/tokens" -> docs/generated/theming/tokens.md. |

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `content` | 0..1 | `string` | Markdown body of the article. Absent for pages generated dynamically (e.g. schema-reference) from another source of truth (schema.xsd, tokens.xml, themes.xml). |

### DocSectionType

*A chapter of the generated documentation, grouping articles and ordered by `order` in the navigation.*

| Attribut | Type | Contrainte | Description |
|---|---|---|---|
| `id` | `string` | required | — |
| `title` | `string` | required | — |
| `order` | `integer` | required | Position of the chapter in the generated navigation (ascending order). |

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `article` | 1..∞ | [`DocArticleType`](#docarticletype) | — |

### DocumentationType

*Table of contents AND full content of the Flipova Foundation documentation site, carried by design/documentation.xml (separated from the manifest). docgen.py consumes it (plus schema.xsd for the schema reference and tokens.xml/themes.xml for the registry reference) and regenerates the whole site under docs/. Any documentation found elsewhere in the repository (extra READMEs, introductory comments in the scripts, etc.) is a duplicate to remove.*

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `section` | 1..∞ | [`DocSectionType`](#docsectiontype) | — |

### IndexType

*Index of every registry entry, for a fast lookup without walking the source files.*

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `register` | 1..∞ | `IndexType.register` (en ligne) | — |

### MetaType

*Registry metadata: project identity and the determinism rules of the generation pipeline. The project version is NOT stored here - it is owned by the root package.json.*

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `project` | 1..1 | `string` | Project name (e.g. "flipova foundation"). |
| `license` | 1..1 | `string` | License (e.g. "MIT"). |
| `language` | 1..1 | `string` | Default language code (e.g. "en"). |
| `registryRoot` | 1..1 | `string` | Root directory of the registry files (e.g. "design"). |
| `pipeline` | 1..1 | [`PipelineType`](#pipelinetype) | — |
| `determinism` | 1..1 | [`DeterminismType`](#determinismtype) | — |

### NativeVariantType

*React Native platform variant. Either a plain string (e.g. "system", "monospace") or a list of named values (e.g. '<v>' for a cubic easing, or damping/stiffness/mass for a spring).*

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `v` | 1..1 | `string` | Numeric component of a variant (e.g. easing). (choix) |
| `damping` | 1..1 | `string` |  (choix) |
| `stiffness` | 1..1 | `string` |  (choix) |
| `mass` | 1..1 | `string` |  (choix) |

### OffsetType

*Shadow offset (x, y).*

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `x` | 1..1 | `string` | — |
| `y` | 1..1 | `string` | — |

### OutputsType

*Files generated from the registries: the colour vars (themes.xml) and the design-token theme fragment (tokens.xml).*

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `gluestackConfig` | 0..1 | `string` | Path of the nativewind config.ts (light/dark vars) consumed by GluestackUIProvider. |
| `gluestackTokens` | 0..1 | `string` | Path of the Tailwind/nativewind theme fragment (CommonJS) consumed by tailwind.config.js. |

### PipelineType

*Generation pipeline configuration: the source registry files (tokens, themes) and the path of the produced gluestack-ui config file.*

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `source` | 1..1 | `string` | Source files pattern (e.g. "design/tokens.xml, design/themes.xml"). |
| `outputs` | 1..1 | [`OutputsType`](#outputstype) | — |

### RoleMapType

*Maps semantic roles (the gluestack/nativewind CSS variable names) to a literal colour value or a token reference.*

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `role` | 1..∞ | `RoleMapType.role` (en ligne) | — |

### RuleParamType

*Free parameter of a rule (name + value), interpreted by the `kind` handler in checker.py. E.g. pattern, selectors, mode. Parameters let new rules be declared without touching the schema.*

Contenu textuel simple, extension de `string`.

| Attribut | Type | Contrainte | Description |
|---|---|---|---|
| `name` | `string` | required | — |

### ThemeType

*A theme: maps semantic roles to colour token references, for a coherent application across modes.*

| Attribut | Type | Contrainte | Description |
|---|---|---|---|
| `id` | `string` | required | Theme id (e.g. "light", "dark"). Uniqueness enforced by constraint. |
| `mode` | `string` | required | Theme mode (e.g. "light", "dark"). |

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `roleMap` | 1..1 | [`RoleMapType`](#rolemaptype) | — |

### ThemesItemsType

*Collection of theme definitions.*

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `theme` | 1..∞ | [`ThemeType`](#themetype) | — |

### TokenType

*A design token: an atomic value of the visual language. Kinds: scale (numeric scale), map (named values without a scale), font (families with platform variants), color (palette with shades), shadow (drop shadow), animation (duration and easing).*

| Attribut | Type | Contrainte | Description |
|---|---|---|---|
| `id` | `string` | required | Unique token id (e.g. "spacing", "color"). Uniqueness enforced by constraint. |
| `kind` | `TokenKindType` | required | Token classification. |
| `unit` | `string` | optional | Unit of measure (e.g. "px", "ms"). |
| `base` | `string` | optional | Base value for computed scales. |
| `formula` | `string` | optional | Formula used to compute the scale values. |
| `mode` | `string` | optional | Mode for breakpoints (e.g. "min-width"). |

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `values` | 1..1 | [`TokenValuesType`](#tokenvaluestype) | — |

### TokenValueType

*A token value. Shapes observed in the registries (the XSD accepts them all through mixed content; mutual exclusivity is enforced by the generator): - scalar: plain text content (e.g. "0") or a lone `value` attribute (e.g. spacing, opacity, color); - cross-platform: `native`/`web` children (e.g. font); - structured variant: `native` holding `v`, damping/stiffness/mass (e.g. easing); - shadow: `color`/`offset`/`opacity`/`radius`/`elevation` children.*

| Attribut | Type | Contrainte | Description |
|---|---|---|---|
| `id` | `string` | required | Value id within the token. |
| `value` | `string` | optional | Direct scalar value (attribute form, alternative to text content). |

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `native` | 1..1 | [`NativeVariantType`](#nativevarianttype) | React Native variant. (choix) |
| `web` | 1..1 | `string` | Web variant. (choix) |
| `color` | 1..1 | [`ColorRefType`](#colorreftype) | Colour of a shadow, by reference. (choix) |
| `offset` | 1..1 | [`OffsetType`](#offsettype) | Offset of a shadow. (choix) |
| `opacity` | 1..1 | `string` |  (choix) |
| `radius` | 1..1 | `string` |  (choix) |
| `elevation` | 1..1 | `string` |  (choix) |

### TokenValuesType

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `value` | 1..∞ | [`TokenValueType`](#tokenvaluetype) | — |

### TokensItemsType

*Collection of token definitions.*

| Élément | Occurrences | Type | Description |
|---|---|---|---|
| `token` | 1..∞ | [`TokenType`](#tokentype) | — |

## Types simples / énumérations

### SeverityType

*Severity of a determinism rule. "error" makes the checker fail; "warning" reports without blocking.*

Type de base : `string`

Valeurs autorisées : `error`, `warning`

### TokenKindType

*The six token natures recognized by the pipeline.*

Type de base : `string`

Valeurs autorisées : `scale`, `map`, `font`, `color`, `shadow`, `animation`
