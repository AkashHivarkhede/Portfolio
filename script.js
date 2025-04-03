
$(document).ready(function() {
    // Cache selectors
    var $navbarLinks = $('.navbar-nav .nav-link');
    var $sections = $('section');

    // Function to remove active class from all links
    function removeActiveClass() {
        $navbarLinks.removeClass('active');
    }

    // Function to add active class based on scroll position
    function setActiveLink() {
        var scrollPos = $(document).scrollTop();
        $sections.each(function() {
            var sectionTop = $(this).offset().top - 50; // Adjust for fixed navbar height
            var sectionBottom = sectionTop + $(this).outerHeight();
            var sectionId = $(this).attr('id');

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                removeActiveClass();
                $('.navbar-nav .nav-link[href="#' + sectionId + '"]').addClass('active');
            }
        });
    }

    // Smooth scrolling for navbar links
    $navbarLinks.on('click', function(event) {
        event.preventDefault(); // Prevent default anchor click behavior
        var target = $(this).attr('href'); // Get the target section
        $('html, body').animate({
            scrollTop: $(target).offset().top - 50 // Adjust for fixed navbar height
        }, 500, function() {
            // Update the active link after scrolling
            removeActiveClass();
            $(this).addClass('active');
        }.bind(this)); // Bind 'this' to maintain context
    });

    // On scroll, update active link
    $(window).on('scroll', function() {
        setActiveLink();
    });

    // On page load, set the active link
    setActiveLink();
});


document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for navbar height
                    behavior: "smooth"
                });
            }
        });
    });
});


// for mouse scroll

document.addEventListener("DOMContentLoaded", function () {
    let sections = document.querySelectorAll("section");
    let currentIndex = 0;
    let isScrolling = false;

    function scrollToSection(index) {
        if (index >= 0 && index < sections.length) {
            isScrolling = true;
            window.scrollTo({
                top: sections[index].offsetTop,
                behavior: "smooth"
            });
            setTimeout(() => {
                isScrolling = false;
            }, 800); // Delay to prevent multiple fast scrolls
        }
    }

    window.addEventListener("wheel", function (event) {
        if (isScrolling) return; // Prevent multiple triggers

        if (event.deltaY > 0) {
            // Scroll down
            currentIndex++;
        } else {
            // Scroll up
            currentIndex--;
        }

        // Ensure the index is within bounds
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex >= sections.length) currentIndex = sections.length - 1;

        scrollToSection(currentIndex);
    });
});

// end mouse scroll


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particalArray = [];
let hue = 0;






window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const mouse = {
    x: undefined,
    y: undefined,
}

canvas.addEventListener('click', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 10; i++) {
        particalArray.push(new partical());

    }
});

canvas.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 5; i++) {
        particalArray.push(new partical());

    }
});

class partical {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 10 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'hsl(' + hue + ',100%, 50%)';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function handlePartical() {
    for (let i = 0; i < particalArray.length; i++) {
        particalArray[i].update();
        particalArray[i].draw();

        for (let j = i; j < particalArray.length; j++) {
            const dx = particalArray[i].x - particalArray[j].x;
            const dy = particalArray[i].y - particalArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = particalArray[i].color;
                ctx.lineWidth = 0.2;
                ctx.moveTo(particalArray[i].x, particalArray[i].y);
                ctx.lineTo(particalArray[j].x, particalArray[j].y);
                ctx.stroke();
            }
        }

        if (particalArray[i].size <= 0.3) {
            particalArray.splice(i, 1);
            console.log(particalArray.length);
            i--;
        }

    }
}

canvas.addEventListener('mousemove', function (event) {
    // Get canvas position
    var rect = canvas.getBoundingClientRect();

    // Calculate mouse position on canvas
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    console.log("Cursor Position: X=" + x + ", Y=" + y);
});


// Resize canvas dynamically
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Call initially

// Simple animation effect (Optional)
function animateBackground() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // handlePartical();
    // hue++;
    // hue += 2;
    // requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animateBackground);
}
animateBackground();



function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    handlePartical();
    hue++;
    hue += 2;
    requestAnimationFrame(animate);
}
animate();

// Button click function
function handleButtonClick() {
    window.location.href = "https://www.google.com"; // Change URL if needed
}
