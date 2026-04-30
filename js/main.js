$(function () { 

	/* swiper slides */	
	const btnNext = ".swiper-button-next",
		  btnPrev = ".swiper-button-prev",
		  paging = ".swiper-pagination"

	var slides = { 

		visual: new Swiper(".main-vban-wrap .swiper", {	
			//lazy: true,	
			//spaceBetween: 20,	
			slidesPerView: "auto",
			centeredSlides: true,
			autoplay: {
				delay: 5000,
				pauseOnMouseEnter: true,
			},
			loop: true,
			//loopAdditionalSlides: 1,
			navigation: {
				nextEl: btnNext,
				prevEl: btnPrev,
			},
			pagination: {
				el: paging,
				clickable: true,
				renderBullet: function (index, className) {
					return `<span class="${className}" role="button"> 상단 메인배너 ${index + 1}번 슬라이드로 이동</span>`;
				}
			}
		}),

		popupzone: new Swiper(".popupzone .swiper", {
			//lazy: true,
			autoplay: {
				delay: 4000
			},
			loop: this.SwiperLength > 1,
			watchOverflow: true,
			//effect: "fade",
			navigation: {
				nextEl: btnNext,
				prevEl: btnPrev,
			},
			pagination: {
				el: paging,				
				type: "fraction"
			}
		}),
	
		banner: new Swiper(".site-banner .swiper", { 
			//lazy: true,
			slidesPerView: 1,
			centeredSlides: true,			
			autoplay: true,
			loop: true,
			navigation: {
				nextEl: btnNext,
				prevEl: btnPrev,
			},
			pagination: {
				el: paging,
				clickable: true,
				renderBullet: function (index, className) {
                    return `<span class="${className}" role="button"> 하단 사이트 롤링배너 ${index + 1}번 슬라이드로 이동</span>`;
                }
			},
			breakpoints: {
				1024: {
					slidesPerView: 3,
					//spaceBetween: 20
				},
				1280: {
					slidesPerView: 5,
					//spaceBetween: 20
				}
			}
		})
	};

	$(".swiper-autoplay button").on("click", function(){
		let slideType = $(this).data("swiper");
		var swiperSlide = slides[slideType];
		$(this).removeClass(AC).siblings().addClass(AC);
		$(this).hasClass("swiper-button-pause") ? swiperSlide.autoplay.stop() : swiperSlide.autoplay.start();
	})

	$('.swiper-pagination-current').before('<span class="sr-only">현재 슬라이드</span>')
	$('.swiper-pagination-total').before('<span class="sr-only">전체 슬라이드 개수</span>')
	$(btnPrev).add(btnNext).removeAttr('aria-label');

	tabs(".news-wrap .tab-nav", ".news-wrap .tab-cont")

})

/* ============================================================
fullPage.js 초기화
============================================================ */
;(function () {
	if (!document.getElementById('fullpage')) return;

	const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	/* scss _mixins $pad(1024px) 이하에서 일반 스크롤 — 미만이므로 1025 */
	const FP_RESPONSIVE_WIDTH = 1025;

	new fullpage('#fullpage', {
		licenseKey: 'gplv3-license',

		responsiveWidth: FP_RESPONSIVE_WIDTH,

		autoScrolling: true,
		scrollHorizontally: false,
		keyboardScrolling: true,
		touchSensitivity: 15,
		scrollingSpeed: REDUCED_MOTION ? 0 : 700,
		easing: 'easeInOutCubic',
		easingcss3: 'ease',
		css3: true,

		anchors: ['visual', 'service', 'news', 'contact', 'footer'],
		navigation: true,
		navigationPosition: 'right',
		navigationTooltips: ['메인 비주얼', '서비스 안내', '소식 및 공지', '연락처', '푸터'],
		showActiveTooltip: false,

		credits: { enabled: false },

		afterLoad: (origin, destination) => {
			const $section = $(destination.item);
			const $heading = $section.find('[tabindex="-1"]').first();
			if ($heading.length) $heading.focus();

			let label = ($section.attr('aria-label') || '').trim();
			if (!label) {
				const lbId = ($section.attr('aria-labelledby') || '').trim().split(/\s+/)[0];
				if (lbId) label = ($('#' + lbId).text() || '').trim();
			}
			$('#sr-announce').text(label ? `${label} 섹션으로 이동했습니다.` : '섹션으로 이동했습니다.');
		},

		onLeave: (origin) => {
			$(origin.item).find('[tabindex="-1"]').blur();
		}
	});
}());

