/* ENYERBER FRANCO // PROFESSIONAL PORTFOLIO 
    ULTRA-COMPACT ATS ENGINE V13 (APA STYLE FONTS & SPACING)
    1-Page Guarantee + APA Arial/Helvetica 11pt Standard
*/

window.exportPDF = async () => {
            try {
                // --- STEP 1: FETCH DATA ---
                const response = await fetch('README.md?t=' + Date.now());
                const rawMarkdown = (await response.text()).replace(/\r\n/g, '\n');
                const linesStr = rawMarkdown.split('\n');

                const extractData = (keywords) => {
                    const keys = Array.isArray(keywords) ? keywords : [keywords];
                    let capturing = false; let result = [];
                    const sectionHeaderRegex = new RegExp(`^##\\s*(${keys.join('|')})`, 'i');
                    for (let line of linesStr) {
                        const tl = line.trim();
                        if (sectionHeaderRegex.test(tl)) { capturing = true; continue; }
                        if (capturing && /^##\s+/.test(tl) && !sectionHeaderRegex.test(tl)) { capturing = false; break; }
                        if (capturing) result.push(line);
                    }
                    return result.length > 0 ? result.join('\n').trim() : null;
                };

                // --- PDF SETUP ---
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({ unit: 'pt', format: 'a4' });

                // Márgenes más cercanos a APA (1 pulgada = 72pt, usamos 54pt para balancear CV)
                const m = 54;
                const maxWidth = 487; // 595 (A4 width) - (54 * 2)
                let y = 45; // Margen superior inicial

                // --- SMART RICH TEXT ENGINE ---
                const renderRichLine = (text, size, isGlobalBold = false, color = [51, 65, 85], indent = 0, isBullet = false) => {
                    doc.setFontSize(size);
                    doc.setTextColor(color[0], color[1], color[2]);

                    let cleanText = text.trim();
                    if (cleanText.startsWith('### ')) cleanText = cleanText.substring(4);
                    if (cleanText.startsWith('- ')) cleanText = cleanText.substring(2);
                    if (cleanText.startsWith('* ')) cleanText = cleanText.substring(2);

                    const parts = cleanText.split(/(\*\*.*?\*\*)/g);
                    let currentX = m + indent;
                    const lineHeight = size + 4.5; // Interlineado tipo APA adaptado para CV

                    if (isBullet) {
                        doc.setFont('helvetica', 'normal');
                        doc.text("•", m + indent - 12, y);
                    }

                    parts.forEach(part => {
                        if (!part) return;
                        const isPartBold = part.startsWith('**') && part.endsWith('**');
                        const content = isPartBold ? part.replace(/\*\*/g, '') : part;

                        doc.setFont('helvetica', (isGlobalBold || isPartBold) ? 'bold' : 'normal');

                        const words = content.split(' ');
                        words.forEach((word, idx) => {
                            const w = word + (idx < words.length - 1 ? ' ' : '');
                            const width = doc.getTextWidth(w);
                            if (currentX + width > m + maxWidth) {
                                currentX = m + indent;
                                y += lineHeight;
                            }
                            doc.text(w, currentX, y);
                            currentX += width;
                        });
                    });
                    y += lineHeight + 2; // Separación entre párrafos
                };

                const addHeader = (title) => {
                    y += 12; // Más espacio antes del título (Estilo APA)
                    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(15, 23, 42);
                    doc.text(title.toUpperCase(), m, y);
                    y += 5; doc.setDrawColor(200, 200, 200); doc.line(m, y, m + maxWidth, y);
                    y += 14; // Separación después de la línea
                };

                // --- 1. HEADER ---
                doc.setFont('helvetica', 'bold'); doc.setFontSize(24); doc.setTextColor(15, 23, 42);
                doc.text("ENYERBER FRANCO", m, y); y += 18;

                doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(71, 85, 105);
                doc.text("Ingeniero de Sistemas | Arquitecto Full Stack & IA Integrator", m, y); y += 16;

                doc.setFontSize(10); doc.setTextColor(14, 165, 233);
                doc.text("enyerverfranco@gmail.com | Trujillo, Venezuela | github.com/ever23", m, y); y += 10;

                // --- 2. PERFIL ---
                const perfil = extractData(['Perfil', 'Resumen']);
                if (perfil) {
                    addHeader("Perfil Profesional");
                    renderRichLine(perfil, 11); // Tamaño APA estándar (11pt)
                }

                // --- 3. SKILLS ---
                const skills = extractData(['Habilidades', 'Skills']);
                if (skills) {
                    addHeader("Habilidades Técnicas");
                    skills.split('\n').forEach(l => {
                        const tl = l.trim();
                        if (tl.startsWith('-') || tl.startsWith('*')) {
                            renderRichLine(tl, 10.5, false, [51, 65, 85], 14, true);
                        }
                    });
                }

                // --- 4. EXPERIENCE & 5. PROJECTS ---
                const processSection = (dataStr, title) => {
                    if (!dataStr) return;
                    addHeader(title);
                    const lines = dataStr.split('\n');
                    lines.forEach(l => {
                        const tl = l.trim();
                        if (!tl) return;

                        if (tl.startsWith('###')) {
                            y += 6;
                            renderRichLine(tl, 11.5, true, [15, 23, 42], 0, false);
                        }
                        else if (/(\d{4}|presente)/i.test(tl) && !tl.startsWith('-') && !tl.startsWith('*')) {
                            doc.setFont('helvetica', 'italic'); doc.setFontSize(10); doc.setTextColor(100, 116, 139);
                            doc.text(tl.replace(/[\*#•]/g, '').trim(), m, y); y += 14;
                        }
                        else if (tl.startsWith('-') || tl.startsWith('*')) {
                            renderRichLine(tl, 10.5, false, [51, 65, 85], 14, true); // Viñetas legibles
                        }
                        else {
                            renderRichLine(tl, 10.5, false, [51, 65, 85], 0, false);
                        }
                    });
                };

                processSection(extractData(['Experiencia', 'Trayectoria']), "Trayectoria Profesional");
                processSection(extractData('Proyectos'), "Proyectos de Impacto");

                // --- 6. EDUCATION & IDIOMAS ---
                const edu = extractData('Formación') || extractData('Educación');
                if (edu) {
                    addHeader("Formación Académica");
                    edu.split('\n').forEach(l => {
                        const tl = l.trim();
                        if (tl.startsWith('-') || tl.startsWith('*')) {
                            renderRichLine(tl, 10.5, false, [51, 65, 85], 14, true);
                        }
                    });
                }

                doc.save('ENYERBER_FRANCO_CV.pdf');

            } catch (error) { console.error(error); alert("Error al generar PDF."); }
};