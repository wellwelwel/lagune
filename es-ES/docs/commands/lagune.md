# /lagune: código seguro mientras tu IA lo escribe

> Crea lo que pides y lo bastiona a medida que se escribe, guiado por tus principios de seguridad y sin ningún flujo que seguir.

URL canónica: https://lagune.ai/es-ES/docs/commands/lagune
Idioma: es-ES
Original: https://lagune.ai/docs/commands/lagune
Última actualización: 2026-11-04

⌨️ Hace el trabajo que pediste y lo protege a medida que se escribe. **`/lagune`** acepta cualquier prompt en cualquier etapa, crea lo que querías y lo bastiona con valores por defecto seguros antes de devolvértelo.

## Cómo usarlo

Añade **`/lagune`** a cualquier prompt y describe el trabajo como siempre lo harías.

**📘 Instrucciones para agentes**

```md
# Instrucciones de mi proyecto para agentes

<!-- ... -->

## Seguridad

- Usa la skill `/lagune` siempre que crees o modifiques código, para que mejore la seguridad por defecto.
```

    - Por ejemplo: **AGENTS.md**, **CLAUDE.md**, **.github/copilot-instructions.md**, **.cursorrules**, etc.

**💬 Una funcionalidad**

```prompt
/lagune permite que los usuarios suban una foto personalizada a su perfil.
```

**💬 Una corrección**

```prompt
/lagune no pasa nada cuando el usuario envía el formulario. Averigua qué puede ser y arréglalo.
```

**💬 Una refactorización**

```prompt
/lagune desacopla y mejora la lógica del payload
```

**Principios de seguridad opcionales, pero mejor con ellos**

**`/lagune`** funciona con principios de seguridad o sin ellos. Con ellos, las reglas propias de tu proyecto dan forma a todo lo que crea. Fíjalas una vez con [`/lagune-charter`](https://lagune.ai/es-ES/docs/commands/charter).

## Cómo funciona

Envuelve el trabajo en tres pasos, sin escribir nada en Lagune:

1. Carga tus principios de seguridad, si existen, para que rijan todo el desarrollo, y recurre a una base segura por defecto cuando aún no tienes ninguno.
2. Lista el [catálogo](https://lagune.ai/es-ES/docs/catalog) de tu proyecto y carga solo las especializaciones relacionadas con tu trabajo, el mismo conocimiento bajo demanda que usa el flujo de auditoría.
3. Aplica la defensa a medida que se escribe el código y luego vuelve a leer su propio resultado para confirmar que los controles se sostienen de verdad antes de devolverte el trabajo.

El resultado es código que funciona en tu proyecto, seguro desde la primera línea.

**Úsalo cuando quieras**

Sin detect, sin plan y sin limpieza posterior. **`/lagune`** encaja igual de bien en un esqueleto de proyecto recién creado que en un cambio sobre un código maduro, y bastiona el trabajo sobre la marcha, no después.

## Lo que no hace

- No escribe nada en la carpeta `.lagune`, ni artefactos ni seguimiento, así que lo único que produce es el código bastionado que pediste.
- No relaja ninguna regla para satisfacer un prompt, así que si lo que pides infringiría uno de tus principios de seguridad, se detiene y te avisa primero, en lugar de construirlo directamente de forma insegura.

## Preguntas frecuentes

### ¿Qué hace /lagune?

Acepta cualquier prompt en cualquier etapa, crea lo que pediste y lo bastiona con valores por defecto seguros antes de devolvértelo. Aplica la defensa a medida que se escribe el código, no después.

### ¿Necesito definir principios de seguridad para usar /lagune?

No. Funciona con ellos o sin ellos. Con ellos, las reglas propias de tu proyecto dan forma a todo lo que crea. Sin ellos, recurre a una base segura por defecto.

### ¿Qué diferencia hay entre /lagune y el flujo Blue Team?

/lagune protege el trabajo nuevo mientras lo escribes, sin ningún flujo que seguir. El flujo Blue Team ejecuta las cinco fases de auditoría en orden sobre un proyecto que ya existe.

### ¿Hace /lagune seguimiento de los hallazgos o escribe artefactos?

No. No escribe nada en la carpeta .lagune, ni artefactos ni seguimiento. Lo único que produce es el código bastionado que pediste.

### ¿Cómo hago que mi agente use /lagune automáticamente?

Añade al archivo de instrucciones de tu agente (AGENTS.md, CLAUDE.md, .cursorrules y similares) una instrucción que le pida usar la skill /lagune siempre que cree o modifique código.
