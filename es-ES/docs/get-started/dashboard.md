# Dashboard

> Esta página está desactualizada respecto a su versión en inglés. [Leer la versión original](https://lagune.ai/docs/get-started/dashboard).

> Consulta los principios de seguridad, los hallazgos y el catálogo de tu proyecto en una vista local y en tiempo real que se abre con un solo comando.

URL canónica: https://lagune.ai/es-ES/docs/get-started/dashboard
Idioma: es-ES
Original: https://lagune.ai/docs/get-started/dashboard
Última actualización: 2026-11-05

Ejecuta **Lagune** directamente, sin subcomando, para ver `.lagune/` en una vista interactiva y en tiempo real. Arranca un dashboard y lo abre en un puerto aleatorio:

```bash
npx lagune
```

- [x] **Recarga automática**
- [x] **Privado** y **local**
- [x] Muestra todo lo que contenga `.lagune/`, desde el primer charter
- [x] **Gestiona** las categorías del proyecto directamente desde tu navegador
- [x] No necesita `node_modules` ni `package.json` 📦

![Charter en el dashboard de Lagune](https://lagune.ai/img/dashboard/02.webp)

![Hallazgos en el dashboard de Lagune](https://lagune.ai/img/dashboard/03.webp)

![Side quests en el dashboard de Lagune](https://lagune.ai/img/dashboard/04.webp)

![Detalle de un hallazgo en el dashboard de Lagune](https://lagune.ai/img/dashboard/05.webp)

![Catálogo en el dashboard de Lagune](https://lagune.ai/img/dashboard/06.webp)

**Consejo**

- 🚪 Usa `--port` para indicar un puerto personalizado.
- ⏏️ Pulsa `Ctrl+C` para detenerlo.

## Preguntas frecuentes

### ¿Cómo abro el dashboard de Lagune?

Ejecuta npx lagune sin subcomando en la raíz de tu proyecto. Arranca una vista en tiempo real de .lagune/ en un puerto aleatorio y la abre en tu navegador.

### ¿El dashboard es privado?

Sí. Solo se ejecuta en tu propio equipo, en una dirección local a la que ningún otro ordenador puede acceder.

### ¿Puedo modificar mi proyecto desde el dashboard?

Solo sus categorías, desde tu navegador. Todo lo demás que muestra el dashboard es de solo lectura.
