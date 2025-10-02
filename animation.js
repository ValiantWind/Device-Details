const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function createRipple(event) {
    const button = event.currentTarget;

    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];

    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', createRipple);
    });

    document.querySelectorAll('.collapsible-section').forEach(details => {
        const summary = details.querySelector('.section-header');
        const content = details.querySelector('.details-grid');

        summary.addEventListener('click', (event) => {
            event.preventDefault();

            if (motionQuery.matches) {
                details.toggleAttribute('open');
                return;
            }

            if (details.open) {
                const closingAnimation = content.animate({
                    height: [`${content.offsetHeight}px`, '0px']
                }, {
                    duration: 150,
                    easing: 'cubic-bezier(0.83, 0, 0.17, 1)'
                });

                closingAnimation.onfinish = () => {
                    details.removeAttribute('open');
                };

            } else {
                details.setAttribute('open', '');

                const openingAnimation = content.animate({
                    height: ['0px', `${content.offsetHeight}px`]
                }, {
                    duration: 150,
                    easing: 'cubic-bezier(0.83, 0, 0.17, 1)'
                });
            }
        });
    });
});