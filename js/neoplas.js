/*-------------------------------------------------
  title       : 네오플라스 (NEOPLAS) 인터랙션
  Figma       : EL89VNY0qYxz3PJodCGGVL / node 1:2
  animations  : GNB 등장, 슬로건 stagger, NEOPLAS 마스크 리빌,
                사진 패럴랙스, R&D 스케일, 기술소개 순차 등장
--------------------------------------------------*/
$(function () {
  'use strict';

  // ─── GSAP 플러그인 등록 ──────────────────────────────────
  gsap.registerPlugin(ScrollTrigger);

  // ─── prefers-reduced-motion 체크 ─────────────────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── GNB 공통 함수 (reduced-motion / normal 공유) ───────
  // pill 메뉴 초기 상태: xPercent -50 (수평 중앙), y -20, 투명
  gsap.set('#gnb-scroll', { xPercent: -50, y: -20, opacity: 0 });

  let gnbScrolled = false;

  const showScrollGnb = () => {
    if (gnbScrolled) return;
    gnbScrolled = true;
    // #gnb: 위로 슬라이드 아웃
    gsap.to('.gnb', {
      y: -80, opacity: 0, duration: 0.35, ease: 'power2.in', overwrite: true,
      onComplete: () => { document.querySelector('.gnb').style.pointerEvents = 'none'; },
    });
    // #gnb-scroll: 아래로 슬라이드 인
    gsap.to('#gnb-scroll', {
      y: 0, opacity: 1, duration: 0.35, ease: 'power2.out', overwrite: true,
      onStart: () => { document.getElementById('gnb-scroll').style.pointerEvents = 'auto'; },
    });
  };

  const hideScrollGnb = () => {
    if (!gnbScrolled) return;
    gnbScrolled = false;
    // #gnb-scroll: 위로 슬라이드 아웃
    gsap.to('#gnb-scroll', {
      y: -20, opacity: 0, duration: 0.35, ease: 'power2.in', overwrite: true,
      onComplete: () => { document.getElementById('gnb-scroll').style.pointerEvents = 'none'; },
    });
    // #gnb: 아래로 슬라이드 인
    gsap.to('.gnb', {
      y: 0, opacity: 1, duration: 0.35, ease: 'power2.out', overwrite: true,
      onStart: () => { document.querySelector('.gnb').style.pointerEvents = 'auto'; },
    });
  };

  if (prefersReducedMotion) {
    // 모션 비선호: 전환만 즉시 처리, 애니메이션 스킵
    $(window).on('scroll.gnb', () => {
      if (window.scrollY > 100) { gsap.set('.gnb', { opacity: 0, pointerEvents: 'none' }); gsap.set('#gnb-scroll', { xPercent: -50, y: 0, opacity: 1, pointerEvents: 'auto' }); gnbScrolled = true; }
      else { gsap.set('.gnb', { opacity: 1, pointerEvents: 'auto' }); gsap.set('#gnb-scroll', { xPercent: -50, y: -20, opacity: 0, pointerEvents: 'none' }); gnbScrolled = false; }
    });
    return;
  }

  // =========================================================
  // 1. GNB 1 등장 (페이지 로드)
  //    위에서 아래로 (Y -30 → 0), opacity 0 → 1
  // =========================================================
  gsap.from('.gnb', {
    opacity: 0,
    y: -30,
    duration: 0.8,
    ease: 'power2.out',
  });

  // =========================================================
  // 1-2. GNB 전환: 100px 스크롤 기준 즉시 반응
  //   #gnb  → 위로 사라짐
  //   #gnb-scroll → 위에서 아래로 등장
  // =========================================================
  $(window).on('scroll.gnb', () => {
    if (window.scrollY > 100) showScrollGnb();
    else hideScrollGnb();
  });

  // =========================================================
  // 1-3. GNB pill — 활성 섹션 탭 업데이트 (IntersectionObserver)
  //   #business / #tech / #download(footer) 진입 시 해당 탭 활성화
  // =========================================================
  const sectionMap = [
    { id: 'business',  selector: '#business' },
    { id: 'tech',      selector: '#tech' },
    { id: 'download',  selector: '#download' },
  ];

  const setActiveTab = (sectionId) => {
    $('.gnb-scroll-item').each((_, el) => {
      const $el = $(el);
      const match = $el.data('section') === sectionId;
      $el.toggleClass('is-active', match);
      $el.attr('aria-current', match ? 'true' : 'false');
    });
  };

  // 초기 활성 탭: 사업소개
  setActiveTab('business');

  // 섹션 진입 감지
  sectionMap.forEach(({ id, selector }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveTab(id),
      onEnterBack: () => setActiveTab(id),
    });
  });

  // footer 진입 시 '회사소개서' 활성화
  ScrollTrigger.create({
    trigger: '.site-footer',
    start: 'top center',
    onEnter: () => setActiveTab('download'),
    onLeaveBack: () => setActiveTab('tech'),
  });

  // =========================================================
  // 2. 슬로건 순차 등장
  //    한 줄씩 opacity 0 → 1, Y 50 → 0
  //    delay 0.2s / stagger 0.4s
  // =========================================================
  gsap.to('.slogan-line', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.4,
    delay: 0.2,
  });

  // =========================================================
  // 3. NEOPLAS 대형 타이포 마스크 리빌 (Scroll Section A)
  //    스크롤 중 width 0 → 100% (왼쪽에서 오른쪽으로)
  // =========================================================
  gsap.to('.neoplas-text-blue', {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.neoplas-text-wrap',
      start: 'top 85%',
      end: 'top 15%',
      scrub: 1,
    },
  });

  // =========================================================
  // 4. 사진 패럴랙스 (Scroll Section B)
  //    각 사진별 Y 이동값 적용 (scrub)
  // =========================================================
  const photoConfig = [
    { el: '.photo--04', y: 100 },  // Y +100
    { el: '.photo--03', y: 160 },  // Y +160
    { el: '.photo--02', y: -20 },  // Y -20
    { el: '.photo--01', y: -60 },  // Y -60
  ];

  photoConfig.forEach(({ el, y }) => {
    gsap.to(el, {
      y: y,
      ease: 'none',
      scrollTrigger: {
        trigger: '.top-area',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });
  });

  // =========================================================
  // 5. R&D 섹션 7단계 GSAP 타임라인 — 핀 유지 3슬라이드
  //
  //  [Variant 1→2: R&D 등장]
  //  Phase 1  (0.00→0.70): BG1 scale 0.3→1, borderRadius 12→0
  //  Phase 2  (0.50→0.90): overlay opacity 0→1
  //  Phase 3  (0.70→1.00): R&D 타이포 등장
  //  (1.00→1.30): R&D 노출 유지
  //
  //  [Variant 2→3: Energy & Environment]
  //  Phase 4a (1.30→1.55): R&D 타이포 퇴장
  //  Phase 4b (1.35→1.75): BG2(Energy) 크로스페이드
  //  Phase 5  (1.60→1.90): Energy 타이포 등장
  //  (1.90→2.20): Energy 노출 유지
  //
  //  [Variant 3→4: Healthcare]
  //  Phase 6a (2.20→2.45): Energy 타이포 퇴장
  //  Phase 6b (2.25→2.65): BG3(Healthcare) 크로스페이드
  //  Phase 7  (2.50→2.80): Healthcare 타이포 등장
  //
  //  핀 스크롤 거리: 2700px
  // =========================================================
  const rndTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.section-rnd',
      start: 'top top',
      end: '+=2700',
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      pinSpacing: true,
    },
  });

  // ── Variant 1 → 2: R&D ────────────────────────────────
  rndTl.to('.rnd-img-wrap', {
    scale: 1, borderRadius: '0px',
    ease: 'power1.inOut', duration: 0.7,
  }, 0);

  rndTl.to('.rnd-overlay', {
    opacity: 1,
    ease: 'power1.out', duration: 0.4,
  }, 0.5);

  rndTl.fromTo('.rnd-typo--1',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, ease: 'power2.out', duration: 0.3 },
    0.7
  );

  // ── Variant 2 → 3: Energy & Environment ───────────────
  rndTl.to('.rnd-typo--1', {
    opacity: 0, y: -20,
    ease: 'power1.in', duration: 0.25,
  }, 1.3);

  rndTl.to('.rnd-img-wrap-2', {
    opacity: 1,
    ease: 'power1.inOut', duration: 0.4,
  }, 1.35);

  rndTl.fromTo('.rnd-typo--2',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, ease: 'power2.out', duration: 0.3 },
    1.6
  );

  // ── Variant 3 → 4: Healthcare ─────────────────────────
  rndTl.to('.rnd-typo--2', {
    opacity: 0, y: -20,
    ease: 'power1.in', duration: 0.25,
  }, 2.2);

  rndTl.to('.rnd-img-wrap-3', {
    opacity: 1,
    ease: 'power1.inOut', duration: 0.4,
  }, 2.25);

  rndTl.fromTo('.rnd-typo--3',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, ease: 'power2.out', duration: 0.3 },
    2.5
  );

  // ── 접근성: 활성 슬라이드에 따라 aria-hidden 토글 ──────
  ScrollTrigger.create({
    trigger: '.section-rnd',
    start: 'top top',
    end: '+=2700',
    onUpdate: (self) => {
      const p = self.progress;
      const slots = ['.rnd-typo--1', '.rnd-typo--2', '.rnd-typo--3'];
      const active = p < 0.68 ? 0 : p < 0.84 ? 1 : 2;
      slots.forEach((sel, i) => {
        const el = document.querySelector(sel);
        if (el) el.setAttribute('aria-hidden', i === active ? 'false' : 'true');
      });
    },
  });

  // =========================================================
  // 6. 사업소개 섹션 등장 애니메이션
  // =========================================================
  gsap.from('.section-business .section-title-wrap', {
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.section-business',
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  });

  gsap.from('.section-business .section-body', {
    opacity: 0,
    y: 30,
    duration: 0.9,
    delay: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.section-business',
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  });

  // =========================================================
  // 7. 기술소개 — 좌측 타이포 등장
  //    기술소개 섹션 진입 시 fadeIn + Y (sticky 적용 전)
  //    실제 sticky 고정은 CSS position: sticky로 처리
  // =========================================================
  gsap.from('.tech-sticky-col', {
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.section-tech',
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  });

  // =========================================================
  // 8. 기술소개 — 우측 아이템 순차 등장
  //    각 tech-item 뷰포트 진입 시 opacity 0→1, Y 60→0
  // =========================================================
  gsap.utils.toArray('.tech-item').forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      y: 60,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  });

  // =========================================================
  // 9. footer-download — 좌우 분리 등장
  //    .footer-brand (좌)  : 중앙 → 왼쪽
  //    .footer-download-link (우): 중앙 → 오른쪽
  //    뷰포트 진입 시 동시에 퍼지면서 opacity 0 → 1
  // =========================================================
  ScrollTrigger.create({
    trigger: '.footer-download',
    start: 'top 80%',
    toggleActions: 'play none none none',
    onEnter: () => {
      gsap.fromTo('.footer-brand',
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      gsap.fromTo('.footer-download-link',
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    },
  });

  // =========================================================
  // 10. footer-neoplas — outline → fill 왼→오 리빌
  //     scroll 진입 시 clip-path inset(0 100% 0 0) → inset(0 0% 0 0)
  // =========================================================
  ScrollTrigger.create({
    trigger: '.footer-neoplas',
    start: 'top 90%',
    toggleActions: 'play none none none',
    onEnter: () => {
      gsap.to('.footer-neoplas-fill', {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.4,
        ease: 'power2.inOut',
      });
    },
  });

  // =========================================================
  // 11. ScrollTrigger 새로고침 (레이아웃 계산 재적용)
  // =========================================================
  ScrollTrigger.refresh();

});
