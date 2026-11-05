# Instalar Lagune en Factory Droid como plugin

> Instala Lagune en Factory Droid como plugin, mantenlo actualizado y permite las herramientas de su motor.

URL canónica: https://lagune.ai/es-ES/docs/install/factory-droid
Idioma: es-ES
Original: https://lagune.ai/docs/install/factory-droid
Última actualización: 2026-11-05

Instala el plugin desde tu terminal:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## Actualización

Para actualizar **Lagune**, ejecuta:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## Comandos

Escribe los comandos por su nombre, como `/lagune-charter`.

---

**Permisos**

El motor se ejecuta mediante dos herramientas: `lagune_read` solo lee tu proyecto y `lagune_write` solo escribe en `.lagune/`. Cuando **Factory Droid** pregunte, elige permitir siempre cada una. Vuelve a preguntar tras sincronizar un commit nuevo del marketplace `lagune`, algo que puede hacer al arrancar.

## Preguntas frecuentes

### ¿Cómo instalo Lagune en Factory Droid?

Ejecuta droid plugin marketplace add wellwelwel/lagune y después droid plugin install lagune@lagune.

### ¿Cómo actualizo Lagune en Factory Droid?

Ejecuta droid plugin marketplace update lagune y después droid plugin update lagune@lagune.

### ¿Cómo ejecuto los comandos de Lagune en Factory Droid?

Escríbelos por su nombre, como /lagune-charter.

### ¿Puede Factory Droid ejecutar Lagune sin pedir permiso?

Sí. Elige permitir siempre lagune_read y lagune_write cuando Factory Droid pregunte. Vuelve a preguntar tras sincronizar un commit nuevo del marketplace lagune.
