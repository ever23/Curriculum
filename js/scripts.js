/* 
    ENYERBER FRANCO // PROFESSIONAL PORTFOLIO 
    CORE LOGIC ENGINE V3.0 (ELITE UPDATE)
    New: Glow Cursor, Scroll Reveal, and IA Snippets
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. INITIALIZE ICONS ---
    try {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    } catch (e) { console.warn("Lucide icons delayed"); }

    // --- 2. GLOW CURSOR ENGINE ---
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    // --- 3. SCROLL REVEAL ENGINE (Intersection Observer) ---
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to main blocks
    document.querySelectorAll('.project-card, .stat-card, section > div').forEach(el => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });

    // --- 4. PROJECT SLIDER ---
    const slider = document.getElementById('projects-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slider && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => slider.scrollBy({ left: -450, behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => slider.scrollBy({ left: 450, behavior: 'smooth' }));
    }

    // --- 5. ACTIVE NAV TRACKING ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 250)) {
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

    // --- 6. MATRIX CODE ENGINE (v3.0 IA EXTENDED) ---
    const matrixBg = document.getElementById('matrix-bg');
    if (matrixBg) {
        const snippets = [
            "const { GoogleGenerativeAI } = require('@google/generative-ai');",
            "const model = genAI.getGenerativeModel({ model: 'gemini-pro' });",
            "async function generateAIResponse(prompt) { const res = await model.generate(prompt); }",
            "CcMvc_Framework.resolve(dependency($container));",
            "sudo sysctl -w net.ipv4.ip_forward=1",
            "g++ -O3 main.cpp -o star_trek_engine",
            "SELECT * FROM alumnos WHERE cedula = ?;",
            "router.post('/import-excel', upload.single('excel'));",
            "if (exisAlumno.length === 0) { console.log('Sin Match'); }",
            "const resInsc = await alumnosTabla.select('id_inscripcion');",
            "while(game_loop_active) { process_input(); update(); draw(); }",
            "$this->view->render('dashboard/index', $data);",
            "npm install @antigravity/core --save-dev",
            "export default defineConfig({ plugins: [vue()] });",
            "const token = jwt.sign({ id: user.id }, process.env.SECRET);",
            "git commit -m 'feat: AI-assisted scanner implemented'"
        ];

        function highlightCode(code) {
            return code
                .replace(/\b(async|await|const|let|var|function|class|extends|super|if|else|while|for|return|import|from|export|new|select|from|where|update)\b/g, '<span class="sh-keyword">$1</span>')
                .replace(/(['"`].*?['"`])/g, '<span class="sh-string">$1</span>')
                .replace(/\b(\w+)(?=\()/g, '<span class="sh-function">$1</span>')
                .replace(/(\/\/.*$)/gm, '<span class="sh-comment">$1</span>')
                .replace(/\b(\d+)\b/g, '<span class="sh-number">$1</span>');
        }

        const MAX_LINES = 35; 

        function createCodeLine(initial = false) {
            if (matrixBg.children.length > MAX_LINES) matrixBg.removeChild(matrixBg.firstChild);

            const line = document.createElement('div');
            const duration = (Math.random() * 8 + 7);
            line.className = 'code-line';
            line.innerHTML = highlightCode(snippets[Math.floor(Math.random() * snippets.length)]);
            line.style.left = Math.random() * 95 + '%';
            line.style.animationDuration = duration + 's';
            
            if (initial) line.style.animationDelay = '-' + (Math.random() * 12) + 's';
            
            matrixBg.appendChild(line);

            const cleanUp = () => { if (line.parentNode) line.remove(); };
            line.addEventListener('animationend', cleanUp);
            setTimeout(cleanUp, duration * 1000 + 100); 
        }

        for (let i = 0; i < 25; i++) createCodeLine(true);
        setInterval(createCodeLine, 400); 
    }
});
