# /lagune-verify: demuestra que los controles de seguridad se sostienen

> Demuestra que cada corrección aplicada se sostiene y cierra las que superen la prueba.

URL canónica: https://lagune.ai/es-ES/docs/commands/verify
Idioma: es-ES
Original: https://lagune.ai/docs/commands/verify
Última actualización: 2026-11-03

⚖️ Demuestra que cada corrección aplicada se sostiene leyendo el código y contrastándolo con lo que registró harden, y cierra las que superen la prueba.

## Cómo usarlo

**Verificar todo**

```prompt
/lagune-verify
```

**Indicar rutas**

```prompt
/lagune-verify src/routes/upload.ts
```

**Por prioridad**

```prompt
/lagune-verify prioridad crítica y alta
```

## Cómo funciona

Lee el código en cada punto que registró harden y confirma que de verdad se corresponde con lo que se afirma. La prueba es ese contraste, el código frente al registro. Cada control recibe uno de estos tres veredictos:

| Veredicto                    | Significado                                            |
| ---------------------------- | ------------------------------------------------------ |
| ✅ Risk closed               | El código hace exactamente lo que afirma el registro.  |
| ❌ Risk not closed           | El control sigue abierto. Verify te devuelve a harden. |
| ❓ Cannot tell from the code | La evidencia no se ve solo con el código.              |

Después, con tu confirmación, el riesgo que se demuestra cerrado se da de baja de la cadena. Por ejemplo:

- **Subida de archivos** (Veredicto: **✅ Risk closed**)
  - _Cómo se ha demostrado:_ se ha leído el handler de subida y se ha comprobado que detecta el tipo real del archivo a partir de su contenido, impone un límite de tamaño y rechaza todo lo demás, exactamente como afirma el registro.
  - _Evidencia:_ la función `handleUpload`, que detecta el tipo real del archivo a partir de su contenido.

Si el riesgo no está cerrado, verify lo dice con claridad y te devuelve a [`/lagune-harden`](https://lagune.ai/es-ES/docs/commands/harden), porque la corrección sigue abierta.

**Consejo**

- Se basa por completo en el registro del bastionado.
- Solo lee tu código para juzgarlo, y nunca debilita un control ni reescribe el código para que un veredicto salga favorable.
- Volver a ejecutarlo concilia los veredictos: salen los que han quedado obsoletos, y un riesgo que ya no está cerrado se vuelve a señalar.
- Cuando se demuestra que un riesgo está cerrado, pregunta una vez y después elimina ese hallazgo de toda la cadena (detect, plan, harden y el seguimiento).
- No escribe ningún informe propio: cada veredicto queda en el bloque de su control en `.lagune/memory/harden.md`, donde harden lo lee en la siguiente ejecución.

**Depende de harden**

Verify se basa en [`/lagune-harden`](https://lagune.ai/es-ES/docs/commands/harden).

## El ciclo se cierra

Cuando todo lo que entra en el alcance se ha dado de baja, el ciclo queda en reposo, y solo se reabre cuando cambia el código. La seguridad se puede cerrar, así que el flujo tiene un estado final, no un bucle sin fin.

## Preguntas frecuentes

### ¿Cómo verifica Lagune una corrección?

/lagune-verify lee el código y lo contrasta con lo que registró harden, y devuelve uno de tres veredictos: Risk closed, Risk not closed o Cannot tell from the code.

### ¿Qué significa dar de baja un hallazgo?

Cuando verify demuestra que un riesgo está cerrado, el hallazgo se da de baja: se elimina de toda la cadena, con tu confirmación, para que deje de procesarse una y otra vez.

### ¿Se puede terminar alguna vez el trabajo de seguridad?

Sí. En SDH la seguridad se puede cerrar: un hallazgo que se demuestra cerrado se da de baja, así que el flujo tiene un estado final, no un bucle sin fin.
