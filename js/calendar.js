class InteractiveCalendar {
    constructor() {
        this.currentDate = new Date(2025, 2, 1); // Marzo 2025 para mostrar los datos predeterminados
        this.selectedDates = new Set();
        this.selectionMode = 'work'; // Iniciar en modo trabajo
        this.rangeStart = null;
        this.rangeEnd = null;
        
        // Modo trabajo
        this.currentDayType = 'rest'; // 'rest', 'work', 'advance', 'payment'
        this.workDays = new Map(); // dateString -> {type: 'rest'|'work'|'advance'|'payment', value?: number}
        this.advanceValue = 300;
        this.paymentValue = 1500;
        
        // Datos predeterminados
        this.initializePredefinedData();
        
        this.monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        this.init();
    }

    initializePredefinedData() {
        // Datos basados en el ejemplo proporcionado
        const startDate = new Date('2025-03-17');
        const today = new Date();
        const daysOff = [ 
            '2025-03-20', '2025-03-21', '2025-03-23', '2025-03-24', '2025-03-25', '2025-03-26', 
            '2025-04-06', '2025-04-13', '2025-04-21', '2025-04-22', '2025-04-27', 
            '2025-05-01', '2025-05-14', '2025-05-23', 
            '2025-06-01', '2025-06-08', '2025-06-15', '2025-06-22', '2025-06-29', 
            '2025-07-05', '2025-07-13', '2025-07-19', '2025-07-20', '2025-07-27', 
            '2025-08-03', '2025-08-10', '2025-08-15', '2025-08-16', '2025-08-17', '2025-08-24' 
        ];
        
        const payments = [
            { date: '2025-05-11', amount: 1800 },
            { date: '2025-05-25', amount: 1900 },
            { date: '2025-07-16', amount: 3600 },
            { date: '2025-07-30', amount: 3600 },
            { date: '2025-08-10', amount: 3600 },
            { date: '2025-08-30', amount: 1800 }
        ];

        // Marcar días de descanso predeterminados
        daysOff.forEach(dateStr => {
            this.workDays.set(dateStr, { type: 'rest' });
        });

        // Marcar días de pago predeterminados
        payments.forEach(payment => {
            this.workDays.set(payment.date, { type: 'payment', value: payment.amount });
        });

        // Marcar días de trabajo entre startDate y today (excluyendo descansos y pagos)
        const current = new Date(startDate);
        while (current <= today) {
            const dateStr = this.formatDateString(current);
            
            // Si no es día de descanso ni pago, marcarlo como trabajo
            if (!this.workDays.has(dateStr)) {
                this.workDays.set(dateStr, { type: 'work' });
            }
            
            current.setDate(current.getDate() + 1);
        }

        console.log('Datos predeterminados cargados:', this.workDays.size, 'días');
    }

    init() {
        this.bindEvents();
        
        // Configurar modo inicial
        this.setInitialMode();
        
        this.render();
        this.updateSelectedDatesList();
        this.updateRangeInfo();
        
        // Esperar a que el DOM esté completamente cargado antes de updateWorkInfo
        setTimeout(() => {
            this.updateWorkInfo();
        }, 100);
    }

    setInitialMode() {
        // Establecer modo trabajo como activo inicialmente
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('workSelectMode').classList.add('active');
        
        // Mostrar información del modo trabajo
        document.querySelectorAll('.selection-info').forEach(info => info.classList.remove('active'));
        document.getElementById('workModeInfo').classList.add('active');
    }

    bindEvents() {
        // Navegación entre meses
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });

        // Ir a hoy
        document.getElementById('goToToday').addEventListener('click', () => {
            this.currentDate = new Date();
            this.render();
        });

        // Limpiar selección
        document.getElementById('clearSelection').addEventListener('click', () => {
            this.clearAllSelections();
        });

        // Cambio de modo
        document.getElementById('multiSelectMode').addEventListener('click', () => {
            this.setSelectionMode('multi');
        });

        document.getElementById('rangeSelectMode').addEventListener('click', () => {
            this.setSelectionMode('range');
        });

        document.getElementById('workSelectMode').addEventListener('click', () => {
            this.setSelectionMode('work');
        });

        // Controles modo trabajo
        document.getElementById('restDayType').addEventListener('click', () => {
            this.setCurrentDayType('rest');
        });

        document.getElementById('workDayType').addEventListener('click', () => {
            this.setCurrentDayType('work');
        });

        document.getElementById('advanceDayType').addEventListener('click', () => {
            this.setCurrentDayType('advance');
        });

        document.getElementById('paymentDayType').addEventListener('click', () => {
            this.setCurrentDayType('payment');
        });

        // Control valor adelanto y pago - usar event delegation para asegurar que funcione
        document.addEventListener('input', (e) => {
            if (e.target.id === 'advanceValue') {
                this.advanceValue = parseInt(e.target.value) || 300;
                
                // Actualizar todas las instancias de advance value en el DOM
                const advanceRateElements = document.querySelectorAll('#advanceRate, .advance-rate-display');
                advanceRateElements.forEach(el => {
                    el.textContent = this.advanceValue;
                });
                
                // Recalcular totales
                this.updateWorkInfo();
            } else if (e.target.id === 'paymentValue') {
                this.paymentValue = parseInt(e.target.value) || 1500;
                
                // Recalcular totales
                this.updateWorkInfo();
            }
        });
    }

    setSelectionMode(mode) {
        this.selectionMode = mode;
        this.clearAllSelections();
        
        // Actualizar botones activos
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        if (mode === 'multi') {
            document.getElementById('multiSelectMode').classList.add('active');
        } else if (mode === 'range') {
            document.getElementById('rangeSelectMode').classList.add('active');
        } else if (mode === 'work') {
            document.getElementById('workSelectMode').classList.add('active');
        }
        
        // Mostrar/ocultar información correspondiente
        document.querySelectorAll('.selection-info').forEach(info => info.classList.remove('active'));
        if (mode === 'multi') {
            document.getElementById('multiModeInfo').classList.add('active');
            this.updateSelectedDatesList();
        } else if (mode === 'range') {
            document.getElementById('rangeModeInfo').classList.add('active');
            this.updateRangeInfo(); 
        } else if (mode === 'work') {
            document.getElementById('workModeInfo').classList.add('active');
            // Forzar actualización inmediata y retrasada para asegurar que se muestren los cálculos
            this.updateWorkInfo();
            setTimeout(() => {
                this.updateWorkInfo();
            }, 100);
        }
        
        this.render();
    }

    setCurrentDayType(type) {
        this.currentDayType = type;
        
        // Actualizar botones activos
        document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(type + 'DayType').classList.add('active');
    }

    render() {
        this.updateHeader();
        this.generateCalendar();
    }

    updateHeader() {
        const monthYear = document.getElementById('monthYear');
        monthYear.textContent = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    generateCalendar() {
        const daysContainer = document.getElementById('daysContainer');
        daysContainer.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Primer día del mes
        const firstDay = new Date(year, month, 1);
        // Último día del mes
        const lastDay = new Date(year, month + 1, 0);
        
        // Primer día de la semana (lunes = 1, domingo = 0)
        let startDay = firstDay.getDay();
        if (startDay === 0) startDay = 7; // Convertir domingo a 7
        startDay = startDay - 1; // Ajustar para que lunes sea 0

        // Fecha de hoy
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
        const todayDate = today.getDate();

        // Agregar días del mes anterior para completar la primera semana
        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();
        
        for (let i = startDay - 1; i >= 0; i--) {
            const dayElement = this.createDayElement(
                prevMonthDays - i, 
                false, 
                false, 
                new Date(year, month - 1, prevMonthDays - i)
            );
            dayElement.classList.add('other-month');
            daysContainer.appendChild(dayElement);
        }

        // Agregar días del mes actual
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const isToday = isCurrentMonth && day === todayDate;
            const currentDateObj = new Date(year, month, day);
            const dayElement = this.createDayElement(day, true, isToday, currentDateObj);
            daysContainer.appendChild(dayElement);
        }

        // Completar con días del siguiente mes
        const totalCells = daysContainer.children.length;
        const remainingCells = 42 - totalCells; // 6 semanas * 7 días
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(
                day, 
                false, 
                false, 
                new Date(year, month + 1, day)
            );
            dayElement.classList.add('other-month');
            daysContainer.appendChild(dayElement);
        }
    }

    createDayElement(dayNumber, isCurrentMonth, isToday, dateObj) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = dayNumber;

        if (isToday) {
            dayElement.classList.add('today');
        }

        const dateString = this.formatDateString(dateObj);

        if (this.selectionMode === 'multi') {
            // Modo selección múltiple
            if (this.selectedDates.has(dateString)) {
                dayElement.classList.add('selected');
            }
        } else if (this.selectionMode === 'range') {
            // Modo rango
            if (this.rangeStart && dateString === this.rangeStart) {
                dayElement.classList.add('range-start');
            }
            if (this.rangeEnd && dateString === this.rangeEnd) {
                dayElement.classList.add('range-end');
            }
            if (this.isInRange(dateObj)) {
                dayElement.classList.add('range-middle');
            }
        } else if (this.selectionMode === 'work') {
            // Modo trabajo
            const workDay = this.workDays.get(dateString);
            if (workDay) {
                if (workDay.type === 'rest') {
                    dayElement.classList.add('rest-day');
                } else if (workDay.type === 'work') {
                    dayElement.classList.add('work-day');
                } else if (workDay.type === 'advance') {
                    dayElement.classList.add('advance-day');
                } else if (workDay.type === 'payment') {
                    dayElement.classList.add('payment-day');
                }
            }
        }

        // Solo agregar evento de click para días del mes actual
        if (isCurrentMonth) {
            dayElement.addEventListener('click', () => {
                if (this.selectionMode === 'multi') {
                    this.toggleDateSelection(dateObj, dayElement);
                } else if (this.selectionMode === 'range') {
                    this.handleRangeSelection(dateObj);
                } else if (this.selectionMode === 'work') {
                    this.handleWorkSelection(dateObj);
                }
            });
        }

        return dayElement;
    }

    // Modo selección múltiple
    toggleDateSelection(dateObj, dayElement) {
        const dateString = this.formatDateString(dateObj);
        
        if (this.selectedDates.has(dateString)) {
            this.selectedDates.delete(dateString);
            dayElement.classList.remove('selected');
        } else {
            this.selectedDates.add(dateString);
            dayElement.classList.add('selected');
        }

        this.updateSelectedDatesList();
    }

    // Modo rango
    handleRangeSelection(dateObj) {
        const dateString = this.formatDateString(dateObj);
        
        if (!this.rangeStart) {
            // Primera selección - inicio del rango
            this.rangeStart = dateString;
            this.rangeEnd = null;
        } else if (!this.rangeEnd) {
            // Segunda selección - fin del rango
            const startDate = new Date(this.rangeStart);
            const endDate = new Date(dateString);
            
            if (endDate < startDate) {
                // Si la fecha de fin es anterior, intercambiar
                this.rangeEnd = this.rangeStart;
                this.rangeStart = dateString;
            } else {
                this.rangeEnd = dateString;
            }
        } else {
            // Ya hay un rango completo, iniciar nuevo rango
            this.rangeStart = dateString;
            this.rangeEnd = null;
        }
        
        this.render();
        this.updateRangeInfo();
    }

    // Modo trabajo
    handleWorkSelection(dateObj) {
        const dateString = this.formatDateString(dateObj);
        const currentWorkDay = this.workDays.get(dateString);

        if (currentWorkDay && currentWorkDay.type === this.currentDayType) {
            // Si ya es el mismo tipo, deseleccionar
            this.workDays.delete(dateString);
        } else {
            // Agregar o cambiar tipo
            const workDayData = { type: this.currentDayType };
            if (this.currentDayType === 'advance') {
                workDayData.value = this.advanceValue;
            } else if (this.currentDayType === 'payment') {
                workDayData.value = this.paymentValue;
            }
            this.workDays.set(dateString, workDayData);
        }

        this.render();
        this.updateWorkInfo();
    }

    isInRange(dateObj) {
        if (!this.rangeStart || !this.rangeEnd) return false;
        
        const dateString = this.formatDateString(dateObj);
        const startDate = new Date(this.rangeStart);
        const endDate = new Date(this.rangeEnd);
        const currentDate = new Date(dateString);
        
        return currentDate > startDate && currentDate < endDate;
    }

    calculateDaysDifference() {
        if (!this.rangeStart || !this.rangeEnd) return 0;
        
        const startDate = new Date(this.rangeStart);
        const endDate = new Date(this.rangeEnd);
        const timeDifference = Math.abs(endDate - startDate);
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        
        return daysDifference;
    }

    calculateWorkTotals() {
        let restDays = 0;
        let workDays = 0;
        let advanceDays = 0;
        let paymentDays = 0;
        let advanceTotal = 0;
        let paymentTotal = 0;

        this.workDays.forEach((workDay, dateString) => {
            if (workDay.type === 'rest') {
                restDays++;
            } else if (workDay.type === 'work') {
                workDays++;
            } else if (workDay.type === 'advance') {
                advanceDays++;
                advanceTotal += workDay.value || this.advanceValue;
            } else if (workDay.type === 'payment') {
                paymentDays++;
                paymentTotal += workDay.value || this.paymentValue;
            }
        });

        const restTotal = restDays * 400;
        const workTotal = workDays * 200;
        const earningsTotal = restTotal + workTotal + advanceTotal;
        const finalBalance = earningsTotal - paymentTotal;

        return {
            restDays,
            workDays,
            advanceDays,
            paymentDays,
            restTotal,
            workTotal,
            advanceTotal,
            paymentTotal,
            earningsTotal,
            finalBalance
        };
    }

    updateRangeInfo() {
        const startDateElement = document.getElementById('startDate');
        const endDateElement = document.getElementById('endDate');
        const daysDifferenceElement = document.getElementById('daysDifference');
        
        if (this.rangeStart) {
            startDateElement.textContent = this.formatDisplayDate(this.rangeStart);
            startDateElement.style.color = '#2d3748';
        } else {
            startDateElement.textContent = 'No seleccionado';
            startDateElement.style.color = '#a0aec0';
        }
        
        if (this.rangeEnd) {
            endDateElement.textContent = this.formatDisplayDate(this.rangeEnd);
            endDateElement.style.color = '#2d3748';
        } else {
            endDateElement.textContent = 'No seleccionado';
            endDateElement.style.color = '#a0aec0';
        }
        
        const daysDiff = this.calculateDaysDifference();
        daysDifferenceElement.textContent = daysDiff;
        
        // Cambiar color según la cantidad de días
        if (daysDiff === 0) {
            daysDifferenceElement.style.background = 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)';
        } else if (daysDiff <= 7) {
            daysDifferenceElement.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        } else if (daysDiff <= 30) {
            daysDifferenceElement.style.background = 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)';
        } else {
            daysDifferenceElement.style.background = 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)';
        }
    }

    updateWorkInfo() {
        const totals = this.calculateWorkTotals();

        // Lista de elementos a actualizar
        const updates = [
            {id: 'restDaysCount', value: totals.restDays},
            {id: 'workDaysCount', value: totals.workDays},
            {id: 'advanceDaysCount', value: totals.advanceDays},
            {id: 'paymentDaysCount', value: totals.paymentDays},
            {id: 'restTotal', value: totals.restTotal.toLocaleString()},
            {id: 'workTotal', value: totals.workTotal.toLocaleString()},
            {id: 'advanceTotal', value: totals.advanceTotal.toLocaleString()},
            {id: 'paymentTotal', value: totals.paymentTotal.toLocaleString()},
            {id: 'grandTotal', value: '$' + totals.earningsTotal.toLocaleString()},
            {id: 'totalPayments', value: '$' + totals.paymentTotal.toLocaleString()},
            {id: 'finalBalance', value: '$' + totals.finalBalance.toLocaleString()},
            {id: 'advanceRate', value: this.advanceValue}
        ];

        // Actualizar elementos básicos
        updates.forEach(update => {
            const element = document.getElementById(update.id);
            if (element) {
                element.textContent = update.value;
            }
        });

        // Actualizar cálculos mostrados
        const calcUpdates = [
            {
                selector: '.rest-card .stat-calc',
                html: `${totals.restDays} × $400 = $<span>${totals.restTotal.toLocaleString()}</span>`
            },
            {
                selector: '.work-card .stat-calc',
                html: `${totals.workDays} × $200 = $<span>${totals.workTotal.toLocaleString()}</span>`
            },
            {
                selector: '.advance-card .stat-calc',
                html: `${totals.advanceDays} × $<span class="advance-rate-display">${this.advanceValue}</span> = $<span>${totals.advanceTotal.toLocaleString()}</span>`
            },
            {
                selector: '.payment-card .stat-calc',
                html: `Total: $<span>${totals.paymentTotal.toLocaleString()}</span>`
            }
        ];

        calcUpdates.forEach(update => {
            const element = document.querySelector(update.selector);
            if (element) {
                element.innerHTML = update.html;
            }
        });

        // Cambiar color del balance según si es positivo o negativo
        const balanceElement = document.getElementById('finalBalance');
        if (balanceElement) {
            if (totals.finalBalance >= 0) {
                balanceElement.style.background = 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)';
            } else {
                balanceElement.style.background = 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
            }
        }
    }

    formatDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatDisplayDate(dateString) {
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);
        const dayName = this.getDayName(date.getDay());
        return `${dayName}, ${day}/${month}/${year}`;
    }

    getDayName(dayIndex) {
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        return dayNames[dayIndex];
    }

    updateSelectedDatesList() {
        const selectedList = document.getElementById('selectedDatesList');
        
        if (this.selectedDates.size === 0) {
            selectedList.innerHTML = '<span class="no-selection">Ningún día seleccionado</span>';
            return;
        }

        const sortedDates = Array.from(this.selectedDates).sort();
        selectedList.innerHTML = '';
        
        sortedDates.forEach(dateString => {
            const tag = document.createElement('div');
            tag.className = 'selected-date-tag';
            
            const dateText = document.createElement('span');
            dateText.textContent = this.formatDisplayDate(dateString);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-date';
            removeBtn.innerHTML = '×';
            removeBtn.title = 'Eliminar fecha';
            
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectedDates.delete(dateString);
                this.render();
                this.updateSelectedDatesList();
            });
            
            tag.appendChild(dateText);
            tag.appendChild(removeBtn);
            selectedList.appendChild(tag);
        });
    }

    clearAllSelections() {
        this.selectedDates.clear();
        this.rangeStart = null;
        this.rangeEnd = null;
        this.workDays.clear();
        this.render();
        this.updateSelectedDatesList();
        this.updateRangeInfo();
        this.updateWorkInfo();
    }

    // Métodos públicos para interactuar con el calendario
    getSelectedDates() {
        if (this.selectionMode === 'multi') {
            return Array.from(this.selectedDates);
        } else if (this.selectionMode === 'range') {
            return {
                start: this.rangeStart,
                end: this.rangeEnd,
                daysDifference: this.calculateDaysDifference()
            };
        } else if (this.selectionMode === 'work') {
            const totals = this.calculateWorkTotals();
            return {
                workDays: Object.fromEntries(this.workDays),
                totals: totals
            };
        }
    }

    setSelectedDates(dates) {
        if (this.selectionMode === 'multi') {
            this.selectedDates.clear();
            dates.forEach(date => {
                if (typeof date === 'string') {
                    this.selectedDates.add(date);
                } else if (date instanceof Date) {
                    this.selectedDates.add(this.formatDateString(date));
                }
            });
            this.updateSelectedDatesList();
        }
        this.render();
    }

    setDateRange(startDate, endDate) {
        if (this.selectionMode === 'range') {
            this.rangeStart = typeof startDate === 'string' ? startDate : this.formatDateString(startDate);
            this.rangeEnd = typeof endDate === 'string' ? endDate : this.formatDateString(endDate);
            this.render();
            this.updateRangeInfo();
        }
    }

    setWorkDay(date, type, value = null) {
        if (this.selectionMode === 'work') {
            const dateString = typeof date === 'string' ? date : this.formatDateString(date);
            const workDayData = { type };
            if ((type === 'advance' || type === 'payment') && value !== null) {
                workDayData.value = value;
            }
            this.workDays.set(dateString, workDayData);
            this.render();
            this.updateWorkInfo();
        }
    }

    goToMonth(year, month) {
        this.currentDate = new Date(year, month, 1);
        this.render();
    }

    // Método para obtener información del calendario
    getCalendarInfo() {
        const info = {
            currentMonth: this.currentDate.getMonth() + 1,
            currentYear: this.currentDate.getFullYear(),
            selectionMode: this.selectionMode,
            selectedData: this.getSelectedDates()
        };

        if (this.selectionMode === 'multi') {
            info.selectedDatesCount = this.selectedDates.size;
        } else if (this.selectionMode === 'range') {
            info.selectedDatesCount = this.rangeStart && this.rangeEnd ? this.calculateDaysDifference() + 1 : 0;
        } else if (this.selectionMode === 'work') {
            info.selectedDatesCount = this.workDays.size;
            info.totals = this.calculateWorkTotals();
        }

        return info;
    }

    // Métodos para obtener rangos de fechas específicos
    getRangeDates() {
        if (this.selectionMode !== 'range' || !this.rangeStart || !this.rangeEnd) {
            return [];
        }
        
        const dates = [];
        const startDate = new Date(this.rangeStart);
        const endDate = new Date(this.rangeEnd);
        
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            dates.push(this.formatDateString(new Date(date)));
        }
        
        return dates;
    }

    getWorkDaysData() {
        return {
            workDays: Object.fromEntries(this.workDays),
            totals: this.calculateWorkTotals(),
            currentAdvanceValue: this.advanceValue,
            currentPaymentValue: this.paymentValue
        };
    }

    // Función para agregar múltiples pagos
    addPayments(paymentsArray) {
        paymentsArray.forEach(payment => {
            this.workDays.set(payment.date, { 
                type: 'payment', 
                value: payment.amount 
            });
        });
        this.render();
        this.updateWorkInfo();
    }

    // Función para obtener solo los pagos
    getPayments() {
        const payments = [];
        this.workDays.forEach((workDay, dateString) => {
            if (workDay.type === 'payment') {
                payments.push({
                    date: dateString,
                    amount: workDay.value || this.paymentValue
                });
            }
        });
        return payments.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
}

// Inicializar el calendario cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new InteractiveCalendar();
    
    // Exponer métodos útiles globalmente
    window.getSelectedDates = () => window.calendar.getSelectedDates();
    window.clearCalendar = () => window.calendar.clearAllSelections();
    window.getCalendarInfo = () => window.calendar.getCalendarInfo();
    window.getRangeDates = () => window.calendar.getRangeDates();
    window.getWorkData = () => window.calendar.getWorkDaysData();
    window.getPayments = () => window.calendar.getPayments();
    window.addPayments = (payments) => window.calendar.addPayments(payments);
    window.switchToMultiMode = () => window.calendar.setSelectionMode('multi');
    window.switchToRangeMode = () => window.calendar.setSelectionMode('range');
    window.switchToWorkMode = () => window.calendar.setSelectionMode('work');
    
    console.log('📅 Calendario interactivo con modo trabajo cargado exitosamente!');
    console.log('💡 Funciones disponibles en la consola:');
    console.log('   - getSelectedDates(): obtiene las fechas seleccionadas');
    console.log('   - clearCalendar(): limpia todas las selecciones');
    console.log('   - getCalendarInfo(): obtiene información del calendario');
    console.log('   - getRangeDates(): obtiene array de fechas del rango');
    console.log('   - getWorkData(): obtiene datos del modo trabajo con totales');
    console.log('   - getPayments(): obtiene lista de pagos/abonos');
    console.log('   - addPayments([{date, amount}]): agrega múltiples pagos');
    console.log('   - switchToMultiMode(): cambia a modo selección múltiple');
    console.log('   - switchToRangeMode(): cambia a modo rango');
    console.log('   - switchToWorkMode(): cambia a modo trabajo');
});

// Atajos de teclado actualizados
document.addEventListener('keydown', (e) => {
    if (!window.calendar) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            if (e.ctrlKey) {
                e.preventDefault();
                document.getElementById('prevMonth').click();
            }
            break;
        case 'ArrowRight':
            if (e.ctrlKey) {
                e.preventDefault();
                document.getElementById('nextMonth').click();
            }
            break;
        case 'Home':
            if (e.ctrlKey) {
                e.preventDefault();
                document.getElementById('goToToday').click();
            }
            break;
        case 'Delete':
            if (e.ctrlKey) {
                e.preventDefault();
                document.getElementById('clearSelection').click();
            }
            break;
        case '1':
            if (e.ctrlKey) {
                e.preventDefault();
                window.calendar.setSelectionMode('multi');
            }
            break;
        case '2':
            if (e.ctrlKey) {
                e.preventDefault();
                window.calendar.setSelectionMode('range');
            }
            break;
        case '3':
            if (e.ctrlKey) {
                e.preventDefault();
                window.calendar.setSelectionMode('work');
            }
            break;
        case 'r':
            if (e.ctrlKey && window.calendar.selectionMode === 'work') {
                e.preventDefault();
                window.calendar.setCurrentDayType('rest');
            }
            break;
        case 'w':
            if (e.ctrlKey && window.calendar.selectionMode === 'work') {
                e.preventDefault();
                window.calendar.setCurrentDayType('work');
            }
            break;
        case 'a':
            if (e.ctrlKey && window.calendar.selectionMode === 'work') {
                e.preventDefault();
                window.calendar.setCurrentDayType('advance');
            }
            break;
    }
});
