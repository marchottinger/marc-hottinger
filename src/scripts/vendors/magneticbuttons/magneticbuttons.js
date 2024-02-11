magneticButton();

function magneticButton() {
    let magnetic = document.querySelectorAll('.magnetic');

    magnetic.forEach(function (el) {
        
        if(!(el.querySelector('.magnetic-text'))) {
            apndChild("span", "magnetic-text", el);
            
            let innerTextContent = el.innerText;
            el.querySelectorAll('.magnetic-text').forEach(function (el) {
                el.innerText = innerTextContent;
            })
            // console.log(el);
            
            el.removeChild(el.firstChild);
        }
        
        
        if (el.classList.contains('magnetic-fill')) {
            apndChild("div", "magnetic-overlay", el);
        }
        if(window.innerWidth > 540) {
    
            el.addEventListener('mousemove', moveBtn);
            el.addEventListener('mouseleave', function (e) {
                gsap.to(e.currentTarget, 1.5, {
                    x: 0,
                    y: 0,
                    ease: Elastic.easeOut
                });
                gsap.to(this.querySelector('.magnetic-text'), 1.5, {
                    x: 0,
                    y: 0,
                    ease: Elastic.easeOut
                });
            });
    
            function moveBtn(event) {
                let magBtn = event.currentTarget;
                let bounding = magBtn.getBoundingClientRect();
                let magStrength = magBtn.getAttribute('data-strength');
                let magStrengthText = magBtn.getAttribute('data-strength-text');
    
                gsap.to(magBtn, 1.5, {
                    x: (((event.clientX - bounding.left) / magBtn.offsetWidth) - 0.5) * magStrength,
                    y: (((event.clientY - bounding.top) / magBtn.offsetHeight) - 0.5) * magStrength,
                    rotate: "0.001deg",
                    ease: Power4.easeOut
                })
                gsap.to(this.querySelector('.magnetic-text'), 1.5, {
                    x: (((event.clientX - bounding.left) / magBtn.offsetWidth) - 0.5) * magStrengthText,
                    y: (((event.clientY - bounding.top) / magBtn.offsetHeight) - 0.5) * magStrengthText,
                    rotate: "0.001deg",
                    ease: Power4.easeOut
                })
    
                // let x = (((event.clientX - bounding.left) / magBtn.offsetWidth) - 0.5) * magStrength;
                // let y = (((event.clientY - bounding.top) / magBtn.offsetHeight) - 0.5) * magStrength;
    
                // console.log(x, y);
            }
        }
    });

    document.querySelectorAll('.magnetic-fill.magnetic').forEach(function (element) {
        element.addEventListener('mouseenter', function () {
            if (this.querySelector('.magnetic-overlay')) {
                gsap.to(this.querySelector('.magnetic-overlay'), {
                    duration: 0.6,
                    startAt: { y: "76%" },
                    y: "0%",
                    ease: Power2.easeInOut
                });
                gsap.to(this.querySelector('.magnetic-text'), {
                    duration: 0.3,
                    startAt: { color: '#121212' },
                    color: '#FFFFFF',
                    ease: Power3.easeInOut
                });
            }
        });
        element.addEventListener('mouseleave', function () {
            if (this.querySelector('.magnetic-overlay')) {
                gsap.to(this.querySelector('.magnetic-overlay'), {
                    duration: 0.6,
                    y: "-76%",
                    ease: Power2.easeInOut
                });
                gsap.to(this.querySelector('.magnetic-text'), {
                    color: '#121212',
                    ease: Power3.easeInOut,
                    delay: 0.3
                });
            }
        });
    });

    function apndChild(element, itemClass, apndTo) {
        element = document.createElement(`${element}`);
        element.className = `${itemClass}`;
        apndTo.appendChild(element);
    }
}