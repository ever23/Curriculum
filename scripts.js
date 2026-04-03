/* 
    ENYERBER FRANCO // PROFESSIONAL PORTFOLIO 
    CORE LOGIC ENGINE V2.0 
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    lucide.createIcons();

    // 2. Project Slider Navigation
    const slider = document.getElementById('projects-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slider && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -450, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 450, behavior: 'smooth' });
        });
    }

    // 3. Active Navigation Tracking
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 4. Matrix Code Animation Engine
    const matrixBg = document.getElementById('matrix-bg');
    if (matrixBg) {
        const snippets = [
            "async function syncGrades() { await inscripcion.update(data); }",
            "const app = express(); app.use('/api', router);",
            "CcMvc_Framework.resolve(dependency($container));",
            "sudo sysctl -w net.ipv4.ip_forward=1",
            "g++ -O3 main.cpp -o star_trek_engine",
            "SELECT * FROM alumnos WHERE cedula = ?;",
            "router.post('/import-excel', upload.single('excel'));",
            "if (exisAlumno.length === 0) { console.log('Sin Match'); }",
            "const resInsc = await alumnosTabla.select('id_inscripcion');",
            "calculate_collision_matrix(e);",
            "while(game_loop_active) { process_input(); update(); draw(); }",
            "class ProjectArchitect extends Person { constructor() { super(); } }",
            "$this->view->render('dashboard/index', $data);",
            "npm install @antigravity/core --save-dev"
        ];

        function highlightCode(code) {
            return code
                .replace(/\b(async|await|const|let|var|function|class|extends|super|if|else|while|for|return|import|from|export|new|select|from|where|update)\b/g, '<span class="sh-keyword">$1</span>')
                .replace(/(['"`].*?['"`])/g, '<span class="sh-string">$1</span>')
                .replace(/\b(\w+)(?=\()/g, '<span class="sh-function">$1</span>')
                .replace(/(\/\/.*$)/gm, '<span class="sh-comment">$1</span>')
                .replace(/\b(\d+)\b/g, '<span class="sh-number">$1</span>');
        }

        function createCodeLine(initial = false) {
            const line = document.createElement('div');
            line.className = 'code-line';
            line.innerHTML = highlightCode(snippets[Math.floor(Math.random() * snippets.length)]);
            line.style.left = Math.random() * 95 + '%';
            line.style.animationDuration = (Math.random() * 8 + 6) + 's';
            
            if (initial) {
                line.style.animationDelay = '-' + (Math.random() * 12) + 's';
            }
            
            matrixBg.appendChild(line);
            line.addEventListener('animationend', () => { line.remove(); });
        }

        // Initial populate and continuous stream
        for (let i = 0; i < 35; i++) createCodeLine(true);
        setInterval(createCodeLine, 280);
    }
});
