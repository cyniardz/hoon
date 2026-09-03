/* ==================================================
   ELEMENTS
================================================== */

const sections =
    document.querySelectorAll(".section");

const navItems =
    document.querySelectorAll(".section-nav-item");

const menuButton =
    document.querySelector(".menu-button");

const logo =
    document.querySelector(".logo");

const scrollGuide =
    document.querySelector(".scroll-guide");

const topGuide =
    document.querySelector(".top-guide");

const introSection =
    document.querySelector("#intro");

const contactSection =
    document.querySelector("#contact");


/* ==================================================
   CURRENT SECTION
================================================== */

let currentSection = "intro";


/* ==================================================
   ACTIVE SECTION UPDATE
================================================== */

function updateActiveSection() {

    const scrollPosition =
        window.scrollY +
        window.innerHeight * 0.45;

    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop;

        const sectionBottom =
            sectionTop +
            section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionBottom
        ) {

            currentSection =
                section.id;
        }

    });


    navItems.forEach((item) => {

        item.classList.toggle(
            "active",
            item.dataset.section === currentSection
        );

    });

}


/* ==================================================
   LOGO VISIBILITY
================================================== */

function updateLogoVisibility() {

    if (!introSection || !logo) {
        return;
    }

    const introBottom =
        introSection.offsetTop +
        introSection.offsetHeight;

    if (window.scrollY >= introBottom) {

        logo.classList.add(
            "logo-hidden"
        );

    } else {

        logo.classList.remove(
            "logo-hidden"
        );

    }

}


/* ==================================================
   SCROLL / TOP VISIBILITY
================================================== */

function updateScrollGuide() {

    if (!contactSection) {
        return;
    }

    const contactTop =
        contactSection.offsetTop;

    if (window.scrollY >= contactTop) {

        scrollGuide.classList.add(
            "hide"
        );

        topGuide.classList.add(
            "show"
        );

    } else {

        scrollGuide.classList.remove(
            "hide"
        );

        topGuide.classList.remove(
            "show"
        );

    }

}


/* ==================================================
   UPDATE PAGE
================================================== */

function updatePageState() {

    updateActiveSection();
    updateLogoVisibility();
    updateScrollGuide();

}


/* ==================================================
   SCROLL EVENT
================================================== */

window.addEventListener(
    "scroll",
    updatePageState,
    {
        passive: true
    }
);


/* ==================================================
   INITIAL LOAD
================================================== */

window.addEventListener(
    "load",
    updatePageState
);


/* ==================================================
   SECTION NAVIGATION
================================================== */

navItems.forEach((item) => {

    item.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            const target =
                document.querySelector(
                    item.getAttribute("href")
                );

            if (!target) {
                return;
            }

            /*
               LIKE / WORK로 직접 이동할 경우
               스토리를 처음부터 시작
            */

            if (
                item.dataset.section === "like" &&
                likeStory
            ) {
                likeStory.reset();
            }

            if (
                item.dataset.section === "work" &&
                workStory
            ) {
                workStory.reset();
            }


            target.scrollIntoView({
                behavior: "smooth"
            });

            document.body.classList.remove(
                "menu-open"
            );

        }
    );

});


/* ==================================================
   SCROLL BUTTON
================================================== */

if (scrollGuide) {

    scrollGuide.addEventListener(
        "click",
        () => {

            const sectionList =
                Array.from(sections);

            const currentIndex =
                sectionList.findIndex(
                    (section) => section.id === currentSection
                );

            const nextSection =
                sectionList[currentIndex + 1];

            if (!nextSection) {
                return;
            }

            nextSection.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}


/* ==================================================
   TOP BUTTON
================================================== */

if (topGuide) {

    topGuide.addEventListener(
        "click",
        () => {

            if (!introSection) {
                return;
            }

            introSection.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}


/* ==================================================
   03 LIKE / 04 WORK
   SCROLL STORY CONTROLLER

   기본 구조

   LIKE
   ↓
   INTRO
   ↓
   01
   ↓
   02
   ↓
   03
   ↓
   04
   ↓
   WORK

   위로 스크롤하면 반대로 이동
================================================== */

function createStoryController(
    sectionSelector,
    itemSelector,
    counterSelector
) {

    const section =
        document.querySelector(sectionSelector);

    const items =
        document.querySelectorAll(itemSelector);

    const counterCurrent =
        document.querySelector(counterSelector);

    let storyIndex = 0;

    /*
       너무 빠르게 여러 번 스크롤되는 것을 방지
    */

    let storyLocked = false;


    /* ==================================================
       UPDATE STORY
    ================================================== */

    function update() {

        if (!section || !items.length) {
            return;
        }


        /*
           모든 콘텐츠 비활성화
        */

        items.forEach((item, index) => {

            item.classList.toggle(
                "active",
                index === storyIndex - 1
            );

        });


        /*
           첫 화면인지
           스토리 화면인지 구분
        */

        section.classList.toggle(
            "is-story",
            storyIndex > 0
        );

        section.classList.toggle(
            "story-active",
            storyIndex > 0
        );


        /*
           현재 번호 표시
        */

        if (
            counterCurrent &&
            storyIndex > 0
        ) {

            counterCurrent.textContent =
                String(storyIndex).padStart(2, "0");

        }

    }


    /* ==================================================
       CHANGE STORY
    ================================================== */

    function change(direction) {

        if (
            !section ||
            storyLocked
        ) {
            return false;
        }


        const nextIndex =
            storyIndex + direction;


        /*
           범위를 벗어났다면
           섹션 이동을 허용하기 위해 false
        */

        if (
            nextIndex < 0 ||
            nextIndex > items.length
        ) {

            return false;

        }


        storyLocked = true;

        storyIndex =
            nextIndex;

        update();


        /*
           스크롤 연속 입력 방지
        */

        window.setTimeout(
            () => {

                storyLocked = false;

            },
            700
        );


        return true;

    }


    /* ==================================================
       CHECK SECTION VISIBILITY
    ================================================== */

    function isInView() {

        if (!section) {
            return false;
        }


        const rect =
            section.getBoundingClientRect();


        /*
           현재 화면에서 섹션이
           충분히 보일 때만 스토리 스크롤 작동
        */

        const visibleHeight =
            Math.min(
                rect.bottom,
                window.innerHeight
            ) -
            Math.max(
                rect.top,
                0
            );


        return (
            visibleHeight >=
            window.innerHeight * 0.65
        );

    }


    /* ==================================================
       RESET
    ================================================== */

    function reset() {

        storyIndex = 0;

        update();

    }


    update();


    return {

        section,
        items,
        change,
        isInView,
        reset,

        getIndex: () => storyIndex

    };

}


/* ==================================================
   CREATE LIKE STORY
================================================== */

const likeStory =
    createStoryController(
        "#like",
        ".like-item",
        ".like-counter-current"
    );


/* ==================================================
   CREATE WORK STORY
================================================== */

const workStory =
    createStoryController(
        "#work",
        ".work-item",
        ".work-counter-current"
    );


/* ==================================================
   STORY CONTROLLERS
================================================== */

const storyControllers = [
    likeStory,
    workStory
];


let storyTouchStartY = 0;


/* ==================================================
   WHEEL SCROLL
================================================== */

window.addEventListener(
    "wheel",
    (event) => {

        const controller =
            storyControllers.find(
                (item) =>
                    item &&
                    item.isInView()
            );


        /*
           LIKE / WORK가 아니면
           일반 페이지 스크롤
        */

        if (!controller) {
            return;
        }


        /* ==================================================
           DOWN

           화면이 고정된 상태에서
           내용만 다음 단계로 변경
        ================================================== */

        if (event.deltaY > 0) {

            /*
               아직 마지막 내용이 아니라면
               브라우저의 실제 페이지 스크롤을 막음
            */

            if (
                controller.getIndex() <
                controller.items.length
            ) {

                event.preventDefault();

                controller.change(1);

                return;

            }


            /*
               마지막 내용까지 모두 본 상태

               여기서는 preventDefault 하지 않음.
               따라서 다음 섹션으로 정상 이동
            */

            return;

        }


        /* ==================================================
           UP

           이전 내용으로 돌아감
        ================================================== */

        if (event.deltaY < 0) {

            if (
                controller.getIndex() > 0
            ) {

                event.preventDefault();

                controller.change(-1);

                return;

            }


            /*
               첫 화면에서 위로 스크롤하면
               이전 섹션으로 정상 이동
            */

            return;

        }

    },
    {
        passive: false
    }
);


/* ==================================================
   TOUCH START
   MOBILE
================================================== */

window.addEventListener(
    "touchstart",
    (event) => {

        const controller =
            storyControllers.find(
                (item) =>
                    item &&
                    item.isInView()
            );


        if (!controller) {
            return;
        }


        storyTouchStartY =
            event.touches[0].clientY;

    },
    {
        passive: true
    }
);


/* ==================================================
   TOUCH END
   MOBILE
================================================== */

window.addEventListener(
    "touchend",
    (event) => {

        const controller =
            storyControllers.find(
                (item) =>
                    item &&
                    item.isInView()
            );


        if (!controller) {
            return;
        }


        const touchEndY =
            event.changedTouches[0].clientY;


        const distance =
            storyTouchStartY -
            touchEndY;


        /*
           너무 작은 움직임은 무시
        */

        if (
            Math.abs(distance) < 45
        ) {

            return;

        }


        /* ==================================================
           SWIPE UP
           다음 내용
        ================================================== */

        if (distance > 0) {

            if (
                controller.getIndex() <
                controller.items.length
            ) {

                controller.change(1);

            }

            /*
               마지막 내용이면
               브라우저의 기본 스크롤을 허용
            */

            return;

        }


        /* ==================================================
           SWIPE DOWN
           이전 내용
        ================================================== */

        if (distance < 0) {

            if (
                controller.getIndex() > 0
            ) {

                controller.change(-1);

            }

            /*
               첫 내용이면
               이전 섹션으로 이동 가능
            */

            return;

        }

    },
    {
        passive: true
    }
);


/* ==================================================
   STORY NAVIGATION RESET
================================================== */

navItems.forEach((item) => {

    item.addEventListener(
        "click",
        () => {

            if (
                item.dataset.section === "like"
            ) {

                likeStory.reset();

            }


            if (
                item.dataset.section === "work"
            ) {

                workStory.reset();

            }

        }
    );

});


/* ==================================================
   05 FUTURE — SLIDER
================================================== */

const futureTrack =
    document.querySelector(".future-track");

const futureSlides =
    document.querySelectorAll(".future-slide");

const futurePrev =
    document.querySelector(".future-prev");

const futureNext =
    document.querySelector(".future-next");

const futureNavCurrent =
    document.querySelector(".future-nav-current");


let futureIndex = 0;


/* ==================================================
   UPDATE FUTURE SLIDER
================================================== */

function updateFutureSlider() {

    if (
        !futureTrack ||
        !futureSlides.length
    ) {

        return;

    }


    /*
       한 번에 하나의 슬라이드만 표시
    */

    futureTrack.style.transform =
        `translateX(-${futureIndex * 100}%)`;


    /*
       현재 번호
    */

    if (futureNavCurrent) {

        futureNavCurrent.textContent =
            String(
                futureIndex + 1
            ).padStart(2, "0");

    }


    /*
       PREV
    */

    if (futurePrev) {

        futurePrev.disabled =
            futureIndex === 0;

    }


    /*
       NEXT
    */

    if (futureNext) {

        futureNext.disabled =
            futureIndex ===
            futureSlides.length - 1;

    }

}


/* ==================================================
   FUTURE PREV
================================================== */

if (futurePrev) {

    futurePrev.addEventListener(
        "click",
        () => {

            if (
                futureIndex > 0
            ) {

                futureIndex -= 1;

                updateFutureSlider();

            }

        }
    );

}


/* ==================================================
   FUTURE NEXT
================================================== */

if (futureNext) {

    futureNext.addEventListener(
        "click",
        () => {

            if (
                futureIndex <
                futureSlides.length - 1
            ) {

                futureIndex += 1;

                updateFutureSlider();

            }

        }
    );

}


/* ==================================================
   FUTURE INITIALIZE
================================================== */

updateFutureSlider();


/* ==================================================
   MOBILE MENU
================================================== */

if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "menu-open"
            );

        }
    );

}


/* ==================================================
   BACKGROUND MUSIC
================================================== */

const bgm =
    document.querySelector("#bgm");

const musicToggle =
    document.querySelector(".music-toggle");

if (bgm && musicToggle) {

    bgm.volume = 0.2;


    /* 실제 재생/일시정지 상태에 맞춰 버튼 표시 동기화 */

    bgm.addEventListener(
        "play",
        () => {

            musicToggle.classList.remove(
                "is-muted"
            );

        }
    );

    bgm.addEventListener(
        "pause",
        () => {

            musicToggle.classList.add(
                "is-muted"
            );

        }
    );


    /*
       페이지 진입 시 자동 재생 시도.

       브라우저 정책상 사용자의 클릭 등
       상호작용 없이는 소리 재생이
       차단될 수 있어서, 실패하면
       첫 상호작용 시점에 재생한다.
    */

    function tryAutoplay() {

        const playPromise =
            bgm.play();

        if (playPromise) {

            playPromise.catch(() => {

                musicToggle.classList.add(
                    "is-muted"
                );

                const startOnFirstInteraction =
                    () => {

                        bgm.play();

                        [
                            "click",
                            "touchstart",
                            "keydown"
                        ].forEach((eventName) => {

                            window.removeEventListener(
                                eventName,
                                startOnFirstInteraction
                            );

                        });

                    };

                [
                    "click",
                    "touchstart",
                    "keydown"
                ].forEach((eventName) => {

                    window.addEventListener(
                        eventName,
                        startOnFirstInteraction,
                        {
                            once: true
                        }
                    );

                });

            });

        }

    }

    tryAutoplay();


    musicToggle.addEventListener(
        "click",
        () => {

            if (bgm.paused) {

                bgm.play();

            } else {

                bgm.pause();

            }

        }
    );

}