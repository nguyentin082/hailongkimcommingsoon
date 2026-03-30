(() => {
    const baseDate = new Date('2026-03-26T00:00:00+07:00');
    const launchDate = new Date(baseDate);
    launchDate.setDate(launchDate.getDate() + 28);

    let currentLang = 'vi';
    let countdownInterval;
    let calendarMonthDate = new Date();
    let activeLinkedDateKey = null;
    let lastTimelineDayKey = '';
    calendarMonthDate = new Date(
        calendarMonthDate.getFullYear(),
        calendarMonthDate.getMonth(),
        1,
    );

    const i18n = {
        vi: {
            title: 'Hai Long Kim Tourist - Hành Trình Khám Phá Sắp Bắt Đầu',
            badge: 'Grand Opening Soon',
            heroLine1: 'Khám Phá',
            heroLine2: 'Đẳng Cấp Mới',
            intro: 'Hai Long Kim Tourist đang kiến tạo những hành trình độc bản, mang phong cách thượng lưu và trải nghiệm trọn vẹn. Hãy cùng chúng tôi viết nên câu chuyện của bạn.',
            days: 'Ngày',
            hours: 'Giờ',
            minutes: 'Phút',
            seconds: 'Giây',
            footer: 'Sự Sang Trọng Trong Từng Điểm Đến',
            launchStarted: 'Hành trình đã bắt đầu!',
            toggle: 'EN',
            timelineTitle: 'Timeline dự án',
            calendarTitle: 'Lịch timeline',
            calendarToday: 'Hôm nay',
            calendarMilestone: 'Mốc timeline',
            calendarTodayInfo: 'Hôm nay: {date}',
            calendarAriaPrev: 'Tháng trước',
            calendarAriaNext: 'Tháng sau',
            weekdaysShort: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
            milestones: [
                'Thiết kế Figma',
                'Khách hàng: Feedback thiết kế',
                'Sửa thiết kế',
                'Phát triển sản phẩm',
                'Khách hàng: Feedback sản phẩm',
                'Fix và bàn giao',
            ],
        },
        en: {
            title: 'Hai Long Kim Tourist - A New Journey Begins Soon',
            badge: 'Grand Opening Soon',
            heroLine1: 'Discover',
            heroLine2: 'A New Standard',
            intro: 'Hai Long Kim Tourist is crafting one-of-a-kind journeys with premium style and complete experiences. Let us help you write your own travel story.',
            days: 'Days',
            hours: 'Hours',
            minutes: 'Minutes',
            seconds: 'Seconds',
            footer: 'Luxury In Every Destination',
            launchStarted: 'The journey has begun!',
            toggle: 'VI',
            timelineTitle: 'Project timeline',
            calendarTitle: 'Timeline calendar',
            calendarToday: 'Today',
            calendarMilestone: 'Timeline milestone',
            calendarTodayInfo: 'Today: {date}',
            calendarAriaPrev: 'Previous month',
            calendarAriaNext: 'Next month',
            weekdaysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            milestones: [
                'Figma design',
                'Client: Feedback design',
                'Fix design',
                'Development',
                'Client: Feedback product',
                'Fix and handover',
            ],
        },
    };

    const timelineMilestones = [
        { date: new Date('2025-03-26T00:00:00+07:00') },
        { date: new Date('2026-04-05T00:00:00+07:00') },
        { date: new Date('2026-04-06T00:00:00+07:00') },
        { date: new Date('2026-04-09T00:00:00+07:00') },
        { date: new Date('2026-04-20T00:00:00+07:00') },
        { date: new Date('2026-04-23T00:00:00+07:00') },
    ];

    const milestoneDateKeys = new Set(
        timelineMilestones.map((item) => toDateKey(item.date)),
    );

    function toDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function setTextById(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
    }

    function parseDateKey(dateKey) {
        const [year, month, day] = dateKey.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    function getTodayDateKey() {
        return toDateKey(new Date());
    }

    function clearLinkedState() {
        document.querySelectorAll('.is-linked-active').forEach((element) => {
            element.classList.remove('is-linked-active');
        });
        activeLinkedDateKey = null;
    }

    function triggerJumpAnimation(element) {
        if (!element) {
            return;
        }

        element.classList.remove('linked-jump');
        void element.offsetWidth;
        element.classList.add('linked-jump');
        setTimeout(() => element.classList.remove('linked-jump'), 380);
    }

    function ensureCalendarMonthHasDate(dateKey) {
        const date = parseDateKey(dateKey);
        const targetYear = date.getFullYear();
        const targetMonth = date.getMonth();

        if (
            calendarMonthDate.getFullYear() !== targetYear ||
            calendarMonthDate.getMonth() !== targetMonth
        ) {
            calendarMonthDate = new Date(targetYear, targetMonth, 1);
            renderCalendar();
        }
    }

    function activateLinkedByDateKey(
        dateKey,
        {
            jumpCalendar = false,
            jumpTimeline = false,
            ensureCalendar = false,
        } = {},
    ) {
        if (!dateKey) {
            return;
        }

        if (ensureCalendar) {
            ensureCalendarMonthHasDate(dateKey);
        }

        clearLinkedState();
        activeLinkedDateKey = dateKey;

        const timelineItems = document.querySelectorAll(
            `.timeline-item[data-date-key="${dateKey}"]`,
        );
        const calendarCell = document.querySelector(
            `.calendar-day[data-date-key="${dateKey}"]`,
        );

        timelineItems.forEach((item) => {
            item.classList.add('is-linked-active');
            if (jumpTimeline) {
                triggerJumpAnimation(item);
            }
        });

        if (calendarCell) {
            calendarCell.classList.add('is-linked-active');
            if (jumpCalendar) {
                triggerJumpAnimation(calendarCell);
            }
        }
    }

    function bindLinkedHoverEvents() {
        const timelineList = document.getElementById('timelineList');
        const calendarGrid = document.getElementById('calendarGrid');

        if (timelineList && !timelineList.dataset.linkedBound) {
            timelineList.dataset.linkedBound = '1';

            timelineList.addEventListener('mouseover', (event) => {
                const item = event.target.closest('.timeline-item');
                if (!item || !timelineList.contains(item)) {
                    return;
                }

                const dateKey = item.dataset.dateKey;
                if (!dateKey) {
                    return;
                }

                activateLinkedByDateKey(dateKey, {
                    jumpCalendar: true,
                    ensureCalendar: true,
                });
            });

            timelineList.addEventListener('mouseleave', () => {
                clearLinkedState();
            });
        }

        if (calendarGrid && !calendarGrid.dataset.linkedBound) {
            calendarGrid.dataset.linkedBound = '1';

            calendarGrid.addEventListener('mouseover', (event) => {
                const cell = event.target.closest(
                    '.calendar-day[data-has-milestone="1"]',
                );
                if (!cell || !calendarGrid.contains(cell)) {
                    return;
                }

                const dateKey = cell.dataset.dateKey;
                if (!dateKey) {
                    return;
                }

                activateLinkedByDateKey(dateKey, {
                    jumpTimeline: true,
                });
            });

            calendarGrid.addEventListener('mouseleave', () => {
                clearLinkedState();
            });
        }
    }

    function shiftCalendarMonth(monthOffset) {
        calendarMonthDate = new Date(
            calendarMonthDate.getFullYear(),
            calendarMonthDate.getMonth() + monthOffset,
            1,
        );
        renderCalendar();
    }

    function setCountdownValue(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = value.toString().padStart(2, '0');
        }
    }

    function formatTimelineDate(date, lang) {
        const locale = lang === 'vi' ? 'vi-VN' : 'en-GB';
        return date.toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    function formatCalendarMonthLabel(date, lang) {
        const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
        return date.toLocaleDateString(locale, {
            month: 'long',
            year: 'numeric',
        });
    }

    function renderCalendar() {
        const t = i18n[currentLang];
        const grid = document.getElementById('calendarGrid');
        if (!grid) {
            return;
        }

        const monthLabel = document.getElementById('calendarMonthLabel');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        setTextById('calendarTitle', t.calendarTitle);
        setTextById('calendarLegendToday', t.calendarToday);
        setTextById('calendarLegendMilestone', t.calendarMilestone);
        setTextById(
            'calendarTodayInfo',
            t.calendarTodayInfo.replace(
                '{date}',
                formatTimelineDate(today, currentLang),
            ),
        );

        const prevBtn = document.getElementById('calendarPrev');
        const nextBtn = document.getElementById('calendarNext');
        if (prevBtn) {
            prevBtn.setAttribute('aria-label', t.calendarAriaPrev);
        }
        if (nextBtn) {
            nextBtn.setAttribute('aria-label', t.calendarAriaNext);
        }

        if (monthLabel) {
            monthLabel.textContent = formatCalendarMonthLabel(
                calendarMonthDate,
                currentLang,
            );
        }

        const firstDay = new Date(
            calendarMonthDate.getFullYear(),
            calendarMonthDate.getMonth(),
            1,
        );
        const daysInMonth = new Date(
            calendarMonthDate.getFullYear(),
            calendarMonthDate.getMonth() + 1,
            0,
        ).getDate();

        const startWeekDay = (firstDay.getDay() + 6) % 7;

        const weekdayHtml = t.weekdaysShort
            .map(
                (day) =>
                    `<div class="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider py-1">${day}</div>`,
            )
            .join('');

        let dayCellsHtml = '';

        for (let i = 0; i < startWeekDay; i += 1) {
            dayCellsHtml += '<div class="h-8"></div>';
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const date = new Date(
                calendarMonthDate.getFullYear(),
                calendarMonthDate.getMonth(),
                day,
            );
            date.setHours(0, 0, 0, 0);
            const dateKey = toDateKey(date);

            const isToday = date.getTime() === today.getTime();
            const isMilestone = milestoneDateKeys.has(dateKey);

            const baseClass =
                'h-8 rounded-md flex items-center justify-center text-xs sm:text-sm';
            const todayClass = isToday
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/50'
                : '';
            const milestoneClass =
                !isToday && isMilestone
                    ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40'
                    : '';
            const defaultClass =
                !isToday && !isMilestone ? 'text-gray-200' : '';

            dayCellsHtml += `<div class="calendar-day ${baseClass} ${todayClass} ${milestoneClass} ${defaultClass}" data-date-key="${dateKey}" data-has-milestone="${isMilestone ? '1' : '0'}">${day}</div>`;
        }

        grid.innerHTML = `${weekdayHtml}${dayCellsHtml}`;

        if (activeLinkedDateKey) {
            activateLinkedByDateKey(activeLinkedDateKey);
        }
    }

    function renderTimeline() {
        const t = i18n[currentLang];
        const timelineList = document.getElementById('timelineList');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let currentIndex = -1;
        for (let i = 0; i < timelineMilestones.length; i += 1) {
            if (timelineMilestones[i].date.getTime() <= today.getTime()) {
                currentIndex = i;
            }
        }

        const hasStarted = currentIndex >= 0;

        if (!timelineList) {
            return;
        }

        timelineList.innerHTML = timelineMilestones
            .map((item, index) => {
                const isDone = hasStarted && index < currentIndex;
                const isCurrent = hasStarted && index === currentIndex;

                const dotClass = isCurrent
                    ? 'bg-amber-400 ring-4 ring-amber-500/25'
                    : isDone
                      ? 'bg-emerald-400'
                      : 'bg-gray-500/60';

                const titleClass = isCurrent
                    ? 'text-amber-200'
                    : isDone
                      ? 'text-emerald-300'
                      : 'text-gray-300';
                const dateKey = toDateKey(item.date);

                return `
                    <div class="timeline-item relative" data-index="${index}" data-date-key="${dateKey}">
                        <span class="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full ${dotClass}"></span>
                        <p class="text-[11px] sm:text-xs text-gray-400">${formatTimelineDate(item.date, currentLang)}</p>
                        <p class="text-sm sm:text-base ${titleClass}">${t.milestones[index] || ''}</p>
                    </div>`;
            })
            .join('');

        if (activeLinkedDateKey) {
            activateLinkedByDateKey(activeLinkedDateKey);
        }
    }

    function renderLaunchStarted() {
        const countdownContainer = document.getElementById('countdown');
        if (!countdownContainer) {
            return;
        }

        countdownContainer.innerHTML = `<p class='text-2xl font-bold text-amber-500 col-span-4 tracking-[0.3em] uppercase'>${i18n[currentLang].launchStarted}</p>`;
    }

    function applyLanguage(lang) {
        currentLang = lang;
        const t = i18n[lang];

        document.documentElement.lang = lang;
        document.title = t.title;
        setTextById('badgeText', t.badge);
        setTextById('heroLine1', t.heroLine1);
        setTextById('heroLine2', t.heroLine2);
        setTextById('introText', t.intro);
        setTextById('labelDays', t.days);
        setTextById('labelHours', t.hours);
        setTextById('labelMinutes', t.minutes);
        setTextById('labelSeconds', t.seconds);
        setTextById('footerSlogan', t.footer);
        setTextById('langToggleText', t.toggle);
        setTextById('timelineTitle', t.timelineTitle);

        renderTimeline();
        renderCalendar();
    }

    function updateCountdown() {
        const now = Date.now();
        const distance = launchDate.getTime() - now;

        if (distance <= 0) {
            clearInterval(countdownInterval);
            renderLaunchStarted();
            renderTimeline();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdownValue('days', days);
        setCountdownValue('hours', hours);
        setCountdownValue('minutes', minutes);
        setCountdownValue('seconds', seconds);

        const todayKey = getTodayDateKey();
        if (todayKey !== lastTimelineDayKey) {
            lastTimelineDayKey = todayKey;
            renderTimeline();
        }
    }

    function init() {
        setTextById('currentYear', new Date().getFullYear().toString());

        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                const nextLang = currentLang === 'vi' ? 'en' : 'vi';
                applyLanguage(nextLang);
            });
        }

        const calendarPrev = document.getElementById('calendarPrev');
        if (calendarPrev) {
            calendarPrev.addEventListener('click', () => {
                shiftCalendarMonth(-1);
            });
        }

        const calendarNext = document.getElementById('calendarNext');
        if (calendarNext) {
            calendarNext.addEventListener('click', () => {
                shiftCalendarMonth(1);
            });
        }

        bindLinkedHoverEvents();
        applyLanguage('vi');
        lastTimelineDayKey = getTodayDateKey();
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
