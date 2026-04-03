/* 
    ENYERBER FRANCO // PROFESSIONAL PORTFOLIO 
    ELITE PDF ENGINE V7.4 (FETCH PRODUCTION VERSION)
    Loads README.md dynamically via Fetch API
*/

document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadCV');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            try {
                // --- STEP 1: FETCH REAL README.MD ---
                const response = await fetch('README.md');
                if (!response.ok) throw new Error("Could not find README.md file.");
                
                const rawMarkdown = (await response.text()).replace(/\r\n/g, '\n');
                const linesStr = rawMarkdown.split('\n'); 

                // --- DATA EXTRACTION LOGIC ---
                const extractData = (keyword) => {
                    let capturing = false;
                    let result = [];
                    for (let line of linesStr) {
                        const tl = line.trim().toLowerCase();
                        if (tl.startsWith('##') && tl.includes(keyword.toLowerCase())) {
                            capturing = true; continue;
                        }
                        if (capturing && (tl.startsWith('##'))) {
                            capturing = false; break;
                        }
                        if (capturing) result.push(line);
                    }
                    return result.join('\n').trim() || "Información no disponible.";
                };

                const getSingleContact = (label) => {
                    for(let l of linesStr) {
                        if(l.toLowerCase().includes(label.toLowerCase())) {
                            const parts = l.split('|');
                            const target = parts.find(p => p.toLowerCase().includes(label.toLowerCase()));
                            if(target) return target.split(':').pop().replace(/[\*\:\[\]]|(\(.*\))/g, '').trim();
                        }
                    }
                    return "";
                };

                const fullName = "ENYERBER FRANCO";
                const location = getSingleContact('Ubicación');
                const email    = "enyerverfranco@gmail.com";
                const github   = getSingleContact('GitHub');
                const linkedin = getSingleContact('LinkedIn');

                // --- PDF CONFIG ---
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                const margin = 15;
                const maxWidth = 180;
                let y = margin;

                // --- RICH TEXT RENDERER ---
                const addRichText = (text, size = 9.5, color = [60,60,60]) => {
                    doc.setFontSize(size);
                    const lineHeight = size / 2.2 + 2.5;
                    let currentX = margin;
                    const tokens = [];
                    const parts = text.split(/(\*\*.*?\*\*)/g);
                    
                    parts.forEach(part => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            const boldContent = part.replace(/\*\*/g, '');
                            boldContent.split(' ').forEach((w, i, arr) => {
                                if (w) tokens.push({ text: w + (i < arr.length - 1 ? ' ' : ''), bold: true });
                            });
                        } else {
                            const cleanPart = part.replace(/^[#\*\-\s•>]+/g, '');
                            cleanPart.split(' ').forEach((w, i, arr) => {
                                if (w || i < arr.length - 1) tokens.push({ text: w + (i < arr.length - 1 ? ' ' : ''), bold: false });
                            });
                        }
                    });

                    tokens.forEach(token => {
                        doc.setFont('helvetica', token.bold ? 'bold' : 'normal');
                        doc.setTextColor(color[0], color[1], color[2]);
                        const wordWidth = doc.getTextWidth(token.text);
                        if (currentX + wordWidth > margin + maxWidth) { currentX = margin; y += lineHeight; }
                        doc.text(token.text, currentX, y);
                        currentX += wordWidth;
                    });
                    y += lineHeight + 0.8;
                };

                const addHeader = (title) => {
                    y += 3; doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(15, 23, 42); 
                    doc.text(title.toUpperCase(), margin, y);
                    y += 1.5; doc.setDrawColor(226, 232, 240); doc.line(margin, y, 195, y); y += 5;
                };

                // --- DOCUMENT BUILD ---
                doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor(15, 23, 42);
                doc.text(fullName, margin, y); y += 9;
                doc.setFontSize(9.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 100, 100);
                doc.text(`${location} | ${email}`, margin, y); y += 6;
                doc.setTextColor(14, 165, 233); 
                doc.text(`GitHub: ${github} | LinkedIn: ${linkedin}`, margin, y); y += 9;

                addHeader('Perfil Profesional');
                addRichText(extractData('Perfil'), 9.5);

                addHeader('Habilidades Técnicas');
                extractData('Habilidades').split('\n').filter(l => l.trim()).forEach(l => {
                    addRichText(`• ${l.replace(/^[#\*\-\s•]+/g, '').trim()}`, 9.5);
                });

                addHeader('Trayectoria Profesional');
                const expRaw = extractData('Experiencia') || extractData('Trayectoria');
                const expBlocks = expRaw.split('\n\n');
                expBlocks.forEach(block => {
                    const lines = block.split('\n').filter(l => l.trim());
                    if (lines.length > 0) {
                        doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(15, 23, 42);
                        doc.text(lines[0].replace(/^[#\*\s]+/g, '').trim(), margin, y); y += 5;
                        let foundBullets = 0;
                        for(let i=1; i < lines.length; i++){
                            let l = lines[i].trim();
                            if(/(\d{4}|presente)/i.test(l) && l.length < 35) {
                                doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5); doc.setTextColor(120, 120, 120);
                                doc.text(l.replace(/[\*#•]/g, '').trim(), margin, y); y += 4.5;
                            } else if (foundBullets < 1) {
                                addRichText(`• ${l}`, 9.5); foundBullets++;
                            }
                        }
                        y += 1.5;
                    }
                });

                addHeader('Proyectos de Impacto');
                extractData('Proyectos').split('\n').filter(l => l.trim()).forEach(l => {
                    addRichText(`• ${l.replace(/^### (.*)/gm, '$1').replace(/^[#\*\s]+/g, '').trim()}`, 9.5);
                });

                addHeader('Formación Académica');
                extractData('Educación').split('\n').filter(l => l.trim()).forEach(l => {
                    addRichText(l.trim(), 9.5);
                });

                doc.save(`${fullName.replace(/\s/g, '_')}_CV.pdf`);

            } catch (error) { console.error(error); alert("Error al generar PDF: Asegúrate de correr el sitio desde un servidor (Live Server) para cargar el README.md."); }
        });
    }
});
