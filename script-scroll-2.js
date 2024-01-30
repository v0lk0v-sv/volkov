window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push(['toc', (listInstances) => {
    window.fsAttributes.toc.loading.then(function (finalResult) {
        const scrollLinks = document.querySelectorAll('.privacy__toc-link');
        const sections = document.querySelectorAll('[fs-toc-element="contents"] div');
        const headerHeight = document.querySelector('.h-main-nav.is-fixed').offsetHeight;
        let isLinkClicked = false;
        let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollDirection = 'down'; 



        scrollLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                isLinkClicked = true;

                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    scrollDirection = getScrollDirection(targetSection.offsetTop, headerHeight);

                    const targetOffset = getTargetOffset(targetSection, headerHeight, scrollDirection) - 50;
                    window.scrollTo({
                        top: targetOffset,
                        behavior: 'smooth'
                    });
                    highlightLink(link); 
                }
            });
        });

        function checkSectionInView() {
            if (!isLinkClicked) {
                sections.forEach(function (section) {
                    const rect = section.getBoundingClientRect();
                    const threshold = 0.1;
                    if (
                        rect.top >= 0 - threshold &&
                        rect.bottom <= window.innerHeight + threshold
                    ) {
                        const sectionId = section.getAttribute('id');
                        const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
                        if (correspondingLink) {
                            highlightLink(correspondingLink);
                        }
                    }
                });
            }
        }

        function getScrollDirection(targetTop, headerHeight) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return scrollTop + headerHeight < targetTop ? 'down' : 'up';
        }

        function getTargetOffset(targetSection, headerHeight, scrollDirection) {
            const targetOffset = targetSection.offsetTop;
            return scrollDirection === 'down' ? targetOffset : targetOffset - headerHeight;
        }

        function highlightLink(link) {
            scrollLinks.forEach(function (disableLink) {
                disableLink.classList.remove('is--active');
            });

            link.classList.add('is--active');
        }

        window.addEventListener('scroll', checkSectionInView);

        window.addEventListener('wheel', function () {
            isLinkClicked = false;
        });
    });
}, ]);