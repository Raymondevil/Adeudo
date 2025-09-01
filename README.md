# 📅 Calendario Interactivo con Sistema de Cálculos

Un calendario moderno y completamente funcional desarrollado con HTML, CSS y JavaScript vanilla. Incluye **tres modos de selección especializados** con **datos predeterminados** y sistema de cálculos financieros completo que incluye balance final con abonos recibidos.

## ✨ Características Implementadas

### 🎯 Funcionalidades Principales
- **Triple modo de selección:**
  - **Selección múltiple**: Días individuales con cambio de color
  - **Selección por rango**: Inicio, fin y días intermedios
  - **Modo trabajo**: Sistema de cálculos financieros automático 🆕
- **Sistema de cálculos completo:** 🆕
  - **Días de descanso**: $400 por día (color verde)
  - **Días de trabajo**: $200 por día (color azul)
  - **Días de adelanto**: Valor personalizable (color naranja)
  - **Abonos/Pagos**: Montos variables (color púrpura) 🆕
  - **Balance final**: Total a ganar - Abonos recibidos 🆕
- **Contador de días transcurridos** entre fechas de inicio y fin
- **Colores diferenciados** para cada tipo de día
- **Navegación entre meses** con botones de anterior/siguiente
- **Resaltado del día actual** con estilo distintivo
- **Lista de fechas seleccionadas** con formato legible
- **Eliminación individual** de fechas seleccionadas
- **Botón "Ir a Hoy"** para navegación rápida
- **Botón "Limpiar Selección"** para borrar todas las selecciones

### 🎨 Diseño y UX
- **Diseño moderno** con gradientes y efectos glassmorphism
- **Completamente responsivo** para móviles, tablets y escritorio
- **Animaciones suaves** en hover y transiciones
- **Tipografía moderna** con Google Fonts (Inter)
- **Iconos FontAwesome** para mejor UX
- **Efectos visuales** con sombras y transformaciones 3D

### ⌨️ Atajos de Teclado
- `Ctrl + ←` : Mes anterior
- `Ctrl + →` : Mes siguiente  
- `Ctrl + Home` : Ir a hoy
- `Ctrl + Delete` : Limpiar selección
- `Ctrl + 1` : Cambiar a modo selección múltiple
- `Ctrl + 2` : Cambiar a modo rango
- `Ctrl + 3` : Cambiar a modo trabajo 🆕
- `Ctrl + R` : Seleccionar tipo "Descanso" (modo trabajo) 🆕
- `Ctrl + W` : Seleccionar tipo "Trabajo" (modo trabajo) 🆕
- `Ctrl + A` : Seleccionar tipo "Adelanto" (modo trabajo) 🆕

## 🚀 Cómo Usar

### Modos de Selección
**🔄 Cambiar Modo**: Usa los botones en la parte superior para alternar entre:
- **Selección Múltiple**: Selecciona días individuales (modo tradicional)
- **Selección por Rango**: Selecciona un rango de fechas con inicio y fin
- **Modo Trabajo**: Sistema de cálculos financieros con tipos de días 🆕

### Modo Selección Múltiple
1. **Seleccionar días**: Haz clic en cualquier día del mes actual
2. **Deseleccionar**: Vuelve a hacer clic en un día seleccionado
3. **Ver lista**: Las fechas aparecen listadas bajo el calendario
4. **Eliminar individual**: Botón "×" en cada fecha

### Modo Rango de Fechas
1. **Primer clic**: Selecciona la fecha de **INICIO** (verde)
2. **Segundo clic**: Selecciona la fecha de **FIN** (naranja)
3. **Días intermedios**: Se marcan automáticamente en azul
4. **Contador**: Muestra días transcurridos entre inicio y fin
5. **Tercer clic**: Inicia un nuevo rango

### Modo Trabajo 🆕
1. **Seleccionar tipo**: Elige entre Descanso, Trabajo, Adelanto o Abono/Pago
2. **Configurar valores**: Ajusta valores personalizables para adelantos y abonos
3. **Marcar días**: Haz clic en los días para asignarles el tipo seleccionado
4. **Ver cálculos**: Los totales se actualizan automáticamente con balance final
5. **Cambiar tipo**: Vuelve a hacer clic para cambiar el tipo de un día
6. **Deseleccionar**: Clic en un día ya marcado con el mismo tipo lo deselecciona

#### Sistema de Cálculos Completo:
- **🛏️ Descanso**: $400 por día (color verde)
- **💼 Trabajo**: $200 por día (color azul)  
- **🚀 Adelanto**: Valor personalizable (color naranja, default $300)
- **💰 Abono/Pago**: Dinero recibido (color púrpura, default $1500) 🆕
- **📊 Balance Final**: (Descanso + Trabajo + Adelanto) - Abonos Recibidos 🆕

#### Datos Predeterminados 🆕
El calendario se carga con datos de ejemplo desde marzo 2025:
- **30 días de descanso** predefinidos
- **7 abonos/pagos** con montos reales ($1500-$3600)
- **Días de trabajo** automáticos entre fechas
- **Balance calculado** en tiempo real

### Navegación Básica
- **Cambiar mes**: Flechas izquierda/derecha en el header
- **Ir a hoy**: Botón "Ir a Hoy" 
- **Limpiar todo**: Botón "Limpiar Selección"

### API JavaScript
```javascript
// Obtener fechas seleccionadas (según el modo)
getSelectedDates()
// Modo múltiple: ['2024-12-25', '2024-12-31']
// Modo rango: {start: '2024-12-01', end: '2024-12-15', daysDifference: 14}
// Modo trabajo: {workDays: {...}, totals: {restDays: 3, workDays: 5, ...}}

// Obtener todas las fechas del rango (modo rango)
getRangeDates() // ['2024-12-01', '2024-12-02', ..., '2024-12-15']

// Obtener datos completos del modo trabajo 🆕
getWorkData() 
// {
//   workDays: {'2024-12-01': {type: 'rest'}, '2024-12-02': {type: 'work'}, ...},
//   totals: {restDays: 2, workDays: 3, advanceDays: 1, grandTotal: 1900},
//   currentAdvanceValue: 300
// }

// Cambiar modos de selección
switchToMultiMode()
switchToRangeMode()
switchToWorkMode() // 🆕

// Limpiar todas las selecciones
clearCalendar()

// Información del calendario
getCalendarInfo()

// Acceso directo al objeto calendario
window.calendar.setSelectedDates(['2024-12-25', '2024-12-31']) // Modo múltiple
window.calendar.setDateRange('2024-12-01', '2024-12-15')       // Modo rango
window.calendar.setWorkDay('2024-12-01', 'rest')              // Modo trabajo 🆕
window.calendar.setWorkDay('2024-12-02', 'advance', 500)      // Con valor custom 🆕
window.calendar.goToMonth(2024, 11) // Diciembre 2024
```

## 📁 Estructura del Proyecto

```
calendario-interactivo/
├── index.html          # Página principal
├── css/
│   └── style.css      # Estilos principales
├── js/
│   └── calendar.js    # Lógica del calendario
└── README.md          # Documentación
```

## 🎨 Estilos de Selección

### Estados Visuales por Modo

#### Modo Selección Múltiple
- **Día seleccionado**: Gradiente púrpura-azul con sombra pronunciada

#### Modo Rango
- **Fecha INICIO**: Verde (`#48bb78` → `#38a169`) con etiqueta "INICIO"
- **Fecha FIN**: Naranja (`#ed8936` → `#dd6b20`) con etiqueta "FIN"
- **Días intermedios**: Azul claro (`#bee3f8` → `#90cdf4`)

#### Modo Trabajo 🆕
- **Día DESCANSO**: Verde (`#9f7aea` → `#805ad5`) con etiqueta "DESCANSO" - $400
- **Día TRABAJO**: Azul (`#4299e1` → `#3182ce`) con etiqueta "TRABAJO" - $200
- **Día ADELANTO**: Naranja (`#f6ad55` → `#ed8936`) con etiqueta "ADELANTO" - Personalizable
- **Día ABONO**: Púrpura (`#b794f6` → `#9f7aea`) con etiqueta "ABONO" - Monto variable 🆕

#### Estados Generales
- **Día normal**: Fondo blanco, hover con efecto turquesa
- **Día actual**: Gradiente dorado con sombra
- **Días de otros meses**: Color gris claro, no seleccionables

### Colores del Contador (Modo Rango)
- **0 días**: Gris (`#a0aec0` → `#718096`)
- **1-7 días**: Verde (`#48bb78` → `#38a169`) 
- **8-30 días**: Naranja (`#ed8936` → `#dd6b20`)
- **31+ días**: Rojo (`#e53e3e` → `#c53030`)

### Colores del Total (Modo Trabajo) 🆝
- **Total general**: Verde (`#48bb78` → `#38a169`) con formato monetario
- **Tarjetas de resumen**: Bordes de colores según el tipo de día
- **Cálculos dinámicos**: Se actualizan en tiempo real

## 📱 Compatibilidad Responsive

### Breakpoints
- **Desktop**: > 768px - Diseño completo
- **Tablet**: 768px - Ajustes de espaciado
- **Mobile**: < 480px - Layout optimizado

### Adaptaciones Móviles
- Botones más grandes para touch
- Texto escalado apropiadamente
- Grid responsive del calendario
- Menús apilados verticalmente

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con flexbox/grid
- **JavaScript ES6+**: Lógica interactiva con clases
- **Google Fonts**: Tipografía Inter
- **FontAwesome**: Iconografía

## 🔧 Funciones JavaScript Avanzadas

### Clase InteractiveCalendar
```javascript
// Métodos principales
.render()              // Re-renderiza el calendario
.toggleDateSelection() // Cambia selección de fecha
.updateSelectedDatesList() // Actualiza lista visual
.formatDateString()    // Formato YYYY-MM-DD
.getSelectedDates()    // Array de fechas seleccionadas
```

### Eventos y Listeners
- Click en días del calendario
- Navegación de meses
- Atajos de teclado
- Eliminación de fechas individuales

## 🎯 Casos de Uso

### Modo Selección Múltiple
- **Planificación de eventos**: Seleccionar múltiples fechas para eventos
- **Recordatorios**: Marcar fechas importantes específicas
- **Citas médicas**: Días de consultas programadas
- **Fechas especiales**: Cumpleaños, aniversarios, etc.

### Modo Rango
- **Reservas de hotel**: Fecha de entrada y salida con duración
- **Períodos vacacionales**: Calcular días de vacaciones
- **Proyectos**: Duración de tareas con inicio y fin definidos
- **Eventos largos**: Conferencias, cursos, tratamientos
- **Períodos de facturación**: Calcular días laborables
- **Gestión de disponibilidad**: Marcar períodos ocupados/libres

### Modo Trabajo 🆕
- **Nóminas y pagos**: Calcular sueldos por días trabajados
- **Freelancers**: Facturación por días de trabajo/descanso
- **Proyectos con tarifas**: Diferentes tarifas según tipo de día
- **Gestión de equipos**: Costos por días de trabajo vs descanso
- **Consultoría**: Tarifas diferenciadas por tipo de servicio
- **Construcción**: Cálculo de jornales y días extras
- **Servicios profesionales**: Honorarios por categoría de día

## 🔄 Próximas Mejoras Sugeridas

### Funcionalidades Avanzadas
- [x] **Selección por rango** (desde-hasta) ✅ IMPLEMENTADO
- [x] **Contador de días transcurridos** ✅ IMPLEMENTADO
- [x] **Colores diferenciados para inicio/fin** ✅ IMPLEMENTADO
- [x] **Sistema de cálculos financieros** ✅ IMPLEMENTADO
- [x] **Tipos de días especializados** (descanso, trabajo, adelanto) ✅ IMPLEMENTADO
- [x] **Valores personalizables** para adelantos ✅ IMPLEMENTADO
- [x] **Cálculos automáticos en tiempo real** ✅ IMPLEMENTADO
- [ ] **Múltiples rangos simultáneos** con diferentes colores
- [ ] **Exportación de cálculos** (PDF, Excel)
- [ ] **Historial de cálculos** con fechas
- [ ] **Notas en fechas** con tooltips
- [ ] **Exportación** de fechas seleccionadas (JSON/CSV)
- [ ] **Importación** de fechas desde archivo
- [ ] **Múltiples calendarios** en vista
- [ ] **Vista semanal/mensual/anual**
- [ ] **Exclusión de fines de semana** del conteo
- [ ] **Diferentes monedas** y formatos

### Mejoras UX
- [ ] **Temas personalizables** (oscuro/claro)
- [ ] **Colores personalizados** para diferentes tipos
- [ ] **Arrastrar para seleccionar** múltiples días
- [ ] **Vista en miniatura** del año completo
- [ ] **Integración con APIs** de calendario externos

### Características Técnicas
- [ ] **LocalStorage** para persistir selecciones
- [ ] **Modo offline** completo
- [ ] **PWA** (Progressive Web App)
- [ ] **Tests unitarios** con Jest
- [ ] **Optimización de rendimiento**

## 📊 Estado del Proyecto

### ✅ Completado (100%)
- ✅ Estructura HTML básica
- ✅ Estilos CSS modernos y responsivos  
- ✅ Lógica JavaScript completa
- ✅ Funcionalidad de selección múltiple
- ✅ **Modo de selección por rango** 
- ✅ **Contador de días transcurridos** 
- ✅ **Colores diferenciados (inicio/fin/intermedio)** 
- ✅ **Modo trabajo con sistema de cálculos** 🆕
- ✅ **Tipos de días especializados** 🆕
- ✅ **Cálculos financieros automáticos** 🆕
- ✅ **Valores personalizables para adelantos** 🆕
- ✅ **Interface de gestión de trabajo** 🆕
- ✅ **Cambio dinámico entre tres modos** 
- ✅ Cambios de color dinámicos
- ✅ Navegación entre meses
- ✅ Interfaz de gestión de fechas
- ✅ Atajos de teclado ampliados
- ✅ Documentación completa actualizada

### 🎯 Listo para Usar
El calendario está completamente funcional con **tres modos especializados** y sistema de cálculos automático. Perfecto para proyectos que requieren gestión de tiempo y cálculos financieros. Todos los requisitos han sido cumplidos exitosamente.

## 💼 Ejemplo de Uso del Modo Trabajo

```javascript
// Cambiar al modo trabajo
switchToWorkMode();

// Marcar días con diferentes tipos
window.calendar.setWorkDay('2024-12-01', 'rest');        // $400
window.calendar.setWorkDay('2024-12-02', 'work');        // $200  
window.calendar.setWorkDay('2024-12-03', 'advance', 500); // $500 personalizado

// Obtener cálculos totales
const data = getWorkData();
console.log(`Total calculado: $${data.totals.grandTotal}`);
// Resultado: "Total calculado: $1,100"
```

## 🧮 Fórmulas de Cálculo

- **Días Descanso**: `cantidad × $400`
- **Días Trabajo**: `cantidad × $200`  
- **Días Adelanto**: `cantidad × valor_personalizable`
- **Total General**: `suma_descanso + suma_trabajo + suma_adelanto`

---

**Desarrollado con ❤️ usando JavaScript vanilla - Sin dependencias externas**