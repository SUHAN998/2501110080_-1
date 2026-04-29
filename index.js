



// 인트로 시퀀스 조절
window.addEventListener('DOMContentLoaded', () => {
    const introLayer = document.getElementById('intro-layer');
    const homeSection = document.getElementById('home');
    const welcomeText = document.querySelector('.welcome-text');

    // 1. Welcome 글자가 사라지는 시점(약 3초 후)에 검은 배경 페이드 아웃 시작
    setTimeout(() => {
        introLayer.style.opacity = '0';
        
        // 2. 배경이 완전히 투명해지면 레이어를 제거하고 메인화면 선명하게
        setTimeout(() => {
            introLayer.style.display = 'none';
            homeSection.classList.add('reveal'); // 흐림 해제
        }, 1500); // CSS transition 시간(1.5s)과 맞춤
        
    }, 3000); // 글자 애니메이션 시간과 맞춤
});




// 기존 스크립트 상단 혹은 적절한 위치에 추가
const title = document.querySelector('.title');

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;

    // --- 메인 타이틀 마우스 반응 로직 추가 ---
    // 마우스가 중앙에서 얼마나 떨어져 있는지 계산 ( -0.5 ~ 0.5 사이 값 )
    const xRel = (event.clientX / window.innerWidth) - 0.5;
    const yRel = (event.clientY / window.innerHeight) - 0.5;

    // 숫자를 조절해 움직임의 폭을 결정하세요 (20~40 정도가 적당히 고급스러움)
    const moveX = xRel * 40; 
    const moveY = yRel * 40;

    // 타이틀 위치 이동
    title.style.transform = `translate(${moveX}px, ${moveY}px)`;
});


const subText = document.querySelector('.move-slow');
const mainText = document.querySelector('.move-fast');

window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;

    // 뒤에 있는 작은 글자는 조금만, 앞에 있는 큰 글자는 더 많이 움직이게!
    subText.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    mainText.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
});





window.addEventListener('scroll', function() {
    const home = document.getElementById('home');
    const about = document.getElementById('about');
    
    // 현재 스크롤 위치값
    const scrollValue = window.scrollY;
    // 브라우저 화면의 높이값
    const windowHeight = window.innerHeight;

    // 1. 홈 화면 어둡게 만들기 (스크롤이 화면 높이의 30% 이상 내려가면)
    if (scrollValue > windowHeight * 0.3) {
        home.classList.add('darken');
    } else {
        home.classList.remove('darken');
    }

    // 2. 만약 about이 '확' 올라오는 느낌을 더 주고 싶다면 (애니메이션 보정)
    // 이 부분은 CSS transition만으로도 충분하지만, 
    // 추가적인 제어가 필요할 때 활용하세요.
});





const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

// 마우스 설정 (밀어내는 반경)
const mouse = {
    x: null,
    y: null,
    radius: 180 
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// 창 밖으로 나갔을 때 마우스 위치 초기화
window.addEventListener('mouseout', function() {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1; // 점 크기 다양화

        // --- 효과 1: 물 같은 흐름을 위한 기본 속도 (아주 느리게) ---
        this.vx = (Math.random() - 0.5) * 0.3; // -0.15 ~ 0.15 사이의 아주 느린 속도
        this.vy = (Math.random() - 0.5) * 0.3;

        this.density = (Math.random() * 30) + 1; // 자석 효과 무게감

        // --- 효과 2: 불규칙한 반짝임을 위한 속성 ---
        this.opacity = Math.random(); // 초기 투명도 랜덤
        this.opacitySpeed = (Math.random() * 0.02) + 0.005; // 반짝이는 속도 랜덤
        this.flickerDirection = Math.random() > 0.5 ? 1 : -1; // 밝아질지 어두워질지 초기 방향
    }

    draw() {
        // 현재 계산된 투명도 적용
        ctx.fillStyle = `rgba(220, 220, 255, ${this.opacity})`; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        // --- 1. 기본 유영 및 반짝임 처리 ---
        
        // 아주 천천히 물처럼 이동
        this.x += this.vx;
        this.y += this.vy;

        // 화면 경계에 닿으면 튕기게 (계속 흐르게 하기 위해)
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // 불규칙한 반짝임 (투명도 조절)
        this.opacity += this.opacitySpeed * this.flickerDirection;
        if (this.opacity > 0.9 || this.opacity < 0.1) {
            this.flickerDirection = -this.flickerDirection; // 한계치에 도달하면 방향 전환
            // 다음 반짝임 속도를 랜덤하게 바꿔 불규칙성 부여
            this.opacitySpeed = (Math.random() * 0.02) + 0.005; 
        }

        // --- 2. 마우스 자석 효과 (피하기) ---
        
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                
                let maxDistance = mouse.radius;
                // 가까울수록 강한 힘
                let force = (maxDistance - distance) / maxDistance; 
                let directionX = forceDirectionX * force * this.density * 0.6; // 너무 빠르지 않게 조절
                let directionY = forceDirectionY * force * this.density * 0.6;

                this.x -= directionX;
                this.y -= directionY;
            }
        }
    }
}

function init() {
    particlesArray = [];
    // 점 밀도
    const numberOfParticles = (canvas.width * canvas.height) / 6000;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
    }
}

// 가까운 점들끼리 선 연결
function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 110) { // 연결 거리 살짝 늘림
                // 두 점의 투명도 중 더 낮은 쪽을 기준으로 선의 투명도 결정
                let minOpacity = Math.min(particlesArray[a].opacity, particlesArray[b].opacity);
                let lineOpacity = minOpacity * (1 - (distance / 110)) * 0.5; // 선은 좀 더 은은하게

                ctx.strokeStyle = `rgba(200, 200, 255, ${lineOpacity})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    // 배경 이미지 위에 그리기 위해 clearRect 대신 반투명 사각형을 그려 잔상 효과(선택)를 주거나,
    // 완전히 지워서 깔끔하게 만듭니다. 여기서는 완전히 지웁니다.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
}

init();
animate();

// 화면 리사이즈 대응
window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});



// 1. About Me & 다른 섹션 등장/퇴장 감시 로직
const sections = document.querySelectorAll('section'); // 모든 섹션 감시

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active'); // 화면에 들어오면 등장
        } else {
            entry.target.classList.remove('active'); // 화면에서 나가면 다시 사라짐 (이걸 원하셨죠!)
        }
    });
}, { threshold: 0.2 });

sections.forEach(sec => observer.observe(sec));

// 2. Arrow-up 작동 보정
const arrowUpBtn = document.querySelector('.arrow-up');
if (arrowUpBtn) {
    arrowUpBtn.addEventListener('click', function() {
        // 특정 변수 대신 window.scrollTo를 쓰면 가장 확실하게 맨 위로 갑니다.
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}




