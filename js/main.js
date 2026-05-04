/* ==========================================================================
문학광장 메인 페이지 JavaScript
========================================================================== */

;(function ($) {
    'use strict';

    /* ------------------------------------------------------------------
    공통 상수
    ------------------------------------------------------------------ */
    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AC = 'is-active';

    /* ------------------------------------------------------------------
    GSAP + ScrollTrigger 등록
    ------------------------------------------------------------------ */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* ------------------------------------------------------------------
    GSAP 스크롤 애니메이션
    ------------------------------------------------------------------ */
    function initScrollAnimations() {
        if (REDUCED_MOTION || typeof gsap === 'undefined') return;

        // 각 섹션 내 [data-anim] 요소 순차 등장
        $('[data-anim]').each(function (i, el) {
            const $section = $(el).closest('section');
            gsap.fromTo(
                el,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    }
                }
            );
        });

        // 섹션 레이블 & 섹션 컨텐츠 순차 등장 (stagger)
        gsap.utils.toArray('.sec-inner').forEach((inner) => {
            const label  = inner.querySelector('.sec-label');
            const content = inner.querySelector('.sec-content');
            if (!label || !content) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: inner,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            });

            tl.fromTo(label, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' })
              .fromTo(content, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3');
        });

        // 뉴스 카드 stagger
        gsap.utils.toArray('.news-list, .content-list').forEach((list) => {
            const items = list.querySelectorAll('li');
            gsap.fromTo(
                items,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    ease: 'power2.out',
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: list,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    }
                }
            );
        });

        // 카테고리 그리드 row 순차 등장
        gsap.utils.toArray('.category-row').forEach((row, i) => {
            const items = row.querySelectorAll('.category-item');
            gsap.fromTo(
                items,
                { opacity: 0, scale: 0.96 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.55,
                    ease: 'power2.out',
                    stagger: 0.08,
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                }
            );
        });

        // 아카이브 배너 등장
        const archiveBanners = document.querySelectorAll('.archive-banner');
        if (archiveBanners.length) {
            gsap.fromTo(
                archiveBanners,
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.65,
                    ease: 'power2.out',
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: '.archive-banner-wrap',
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    }
                }
            );
        }

        // 히어로 텍스트 등장
        const heroCover = document.querySelector('.hero-cover-info');
        if (heroCover) {
            gsap.fromTo(
                heroCover.children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                    stagger: 0.15,
                    delay: 0.2,
                }
            );
        }

        // 히어로 아티클 카드 stagger
        gsap.utils.toArray('.hero-col').forEach((col) => {
            const cards = col.querySelectorAll('.hero-item');
            gsap.fromTo(
                cards,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.65,
                    ease: 'power2.out',
                    stagger: 0.12,
                    delay: 0.3,
                }
            );
        });
    }

    /* ------------------------------------------------------------------
    글틴 섹션 텍스트 marquee (선택 인터랙션)
    ------------------------------------------------------------------ */
    // 글틴 섹션 애니메이션 (진입 시)
    function initTeenSection() {
        if (REDUCED_MOTION || typeof gsap === 'undefined') return;

        const teen = document.querySelector('.sec-teen');
        if (!teen) return;

        gsap.fromTo(
            '.teen-heading-wrap',
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: teen,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                }
            }
        );

        gsap.fromTo(
            '.teen-desc',
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                delay: 0.2,
                scrollTrigger: {
                    trigger: teen,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                }
            }
        );
    }

    /* ------------------------------------------------------------------
    탭 컴포넌트 (뉴스 등에서 활용 가능)
    ------------------------------------------------------------------ */
    function tabs(navSel, contSel) {
        const $nav  = $(navSel);
        const $cont = $(contSel);
        if (!$nav.length) return;

        $nav.find('button, a[role="tab"]').on('click', function (e) {
            e.preventDefault();
            const idx = $(this).index();
            $(this).addClass(AC).siblings().removeClass(AC);
            $cont.eq(idx).addClass(AC).siblings().removeClass(AC);
            $(this).attr('aria-selected', 'true').siblings().attr('aria-selected', 'false');
        });

        // 방향키 지원
        $nav.find('button, a[role="tab"]').on('keydown', function (e) {
            const $all = $(navSel).find('button, a[role="tab"]');
            const idx  = $all.index(this);
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                $all.eq((idx + 1) % $all.length).trigger('click').focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                $all.eq((idx - 1 + $all.length) % $all.length).trigger('click').focus();
            }
        });
    }

    /* ------------------------------------------------------------------
    DOM Ready
    ------------------------------------------------------------------ */
    $(function () {

        /* GNB 스크롤 클래스 */
        const $gnb = $('#header');
        let ticking = false;

        $(window).on('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    if ($(window).scrollTop() > 10) {
                        $gnb.addClass('is-scrolled');
                    } else {
                        $gnb.removeClass('is-scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });

        /* 스크롤 애니메이션 초기화 */
        initScrollAnimations();
        initTeenSection();

        /* aria-current 처리 */
        const currentPath = window.location.pathname;
        $('.gnb-link').each(function () {
            if ($(this).attr('href') === currentPath) {
                $(this).attr('aria-current', 'page');
            }
        });

    });

}(jQuery));
