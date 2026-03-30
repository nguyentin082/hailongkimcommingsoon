(() => {
    const baseDate = new Date('2026-03-26T00:00:00+07:00');
    const launchDate = new Date(baseDate);
    launchDate.setDate(launchDate.getDate() + 28);

    let currentLang = 'vi';
    let countdownInterval;

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
            timelineNowLabel: 'Giai đoạn hiện tại',
            timelineNotStartedText: 'Chưa bắt đầu',
            timelineDoneText: 'Hoàn tất toàn bộ timeline',
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
            timelineNowLabel: 'Current stage',
            timelineNotStartedText: 'Not started yet',
            timelineDoneText: 'All timeline milestones completed',
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

    function setTextById(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
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
        const allDone =
            hasStarted && currentIndex === timelineMilestones.length - 1;

        setTextById(
            'timelineCurrentPhase',
            !hasStarted
                ? t.timelineNotStartedText
                : allDone
                  ? t.timelineDoneText
                  : t.milestones[currentIndex] || '',
        );

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

                return `
                    <div class="relative">
                        <span class="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full ${dotClass}"></span>
                        <p class="text-[11px] sm:text-xs text-gray-400">${formatTimelineDate(item.date, currentLang)}</p>
                        <p class="text-sm sm:text-base ${titleClass}">${t.milestones[index] || ''}</p>
                    </div>`;
            })
            .join('');
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
        setTextById('timelineNowLabel', t.timelineNowLabel);

        renderTimeline();
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

        renderTimeline();
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

        applyLanguage('vi');
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
