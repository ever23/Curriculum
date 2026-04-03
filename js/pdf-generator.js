/* 
    ENYERBER FRANCO // PROFESSIONAL PORTFOLIO 
    ELITE PDF ENGINE V7.5 (FINAL MASTER RESTORATION)
    Fixes spacing issues and robust section extraction
*/

document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadCV');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            try {
                // --- STEP 1: FETCH REAL README.MD ---
                const response = await fetch('README.md');
                if (!response.ok) throw new Error("Could not find README.md");
                
                const rawMarkdown = (await response.text()).replace(/\r\n/g, '\n');
                const linesStr = rawMarkdown.split('\n'); 

                // --- DATA EXTRACTION LOGIC (ROBUST VERSION) ---
                const extractData = (keywords) => {
                    const keys = Array.isArray(keywords) ? keywords : [keywords];
                    let capturing = false;
                    let result = [];
                    
                    for (let line of linesStr) {
                        const tl = line.trim().toLowerCase();
                        // Check if line is a header containing any of the keywords
                        const isMatch = tl.startsWith('##') && keys.some(k => tl.includes(k.toLowerCase()));
                        
                        if (isMatch) {
                            capturing = true; continue;
                        }
                        if (capturing && tl.startsWith('##')) {
                            capturing = false; break;
                        }
                        if (capturing) result.push(line);
                    }
                    const final = result.join('\n').trim();
                    return final.length > 0 ? final : null;
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

                // --- RICH TEXT RENDERER (V2 - SMART SPACING) ---
                const addRichText = (text, size = 9.5, color = [60,60,60]) => {
                    doc.setFontSize(size);
                    const lineHeight = size / 2.2 + 2.5;
                    let currentX = margin;
                    
                    // Split while keeping delimiters
                    const parts = text.split(/(\*\*.*?\*\*)/g);
                    
                    parts.forEach(part => {
                        if (!part) return;

                        if (part.startsWith('**') && part.endsWith('**')) {
                            doc.setFont('helvetica', 'bold');
                            const boldContent = part.replace(/\*\*/g, '');
                            const words = boldContent.split(' ');
                            words.forEach((w, i) => {
                                const word = w + (i < words.length - 1 ? ' ' : '');
                                const width = doc.getTextWidth(word);
                                if (currentX + width > margin + maxWidth) { currentX = margin; y += lineHeight; }
                                doc.text(word, currentX, y);
                                currentX += width;
                            });
                        } else {
                            doc.setFont('helvetica', 'normal');
                            // Only clean markdown symbols at the VERY START of the whole line if necessary, 
                            // but here we just process the part.
                            const cleanPart = part.replace(/^[#\-\s•>]+/g, ' '); 
                            const words = cleanPart.split(' ');
                            words.forEach((w, i) => {
                                if (!w && i < words.length - 1) { // Handle extra spaces
                                     currentX += doc.getTextWidth(' ');
                                     return;
                                }
                                const word = w + (i < words.length - 1 ? ' ' : '');
                                const width = doc.getTextWidth(word);
                                if (currentX + width > margin + maxWidth) { currentX = margin; y += lineHeight; }
                                doc.text(word, currentX, y);
                                currentX += width;
                            });
                        }
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
                addRichText(extractData(['Perfil']) || "Perfil no disponible.");

                addHeader('Habilidades Técnicas');
                const skillsData = extractData(['Habilidades']);
                if (skillsData) {
                    skillsData.split('\n').filter(l => l.trim()).forEach(l => {
                        addRichText(`• ${l.replace(/^[#\*\-\s•]+/g, '').trim()}`, 9.5);
                    });
                }

                addHeader('Trayectoria Profesional');
                const expRaw = extractData(['Experiencia', 'Trayectoria']);
                if (expRaw) {
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
                                    addRichText(`• ${l.replace(/^[#\*\-\s•>]+/g, '').trim()}`, 9.5); 
                                    foundBullets++;
                                }
                            }
                            y += 1.5;
                        }
                    });
                } else { addRichText("Información no disponible."); }

                addHeader('Proyectos de Impacto');
                const projData = extractData(['Proyectos']);
                if (projData) {
                    projData.split('\n').filter(l => l.trim()).forEach(l => {
                        addRichText(`• ${l.replace(/^### (.*)/gm, '$1').replace(/^[#\*\-\s•>]+/g, '').trim()}`, 9.5);
                    });
                } else { addRichText("Información no disponible."); }

                addHeader('Formación Académica');
                const eduData = extractData(['Educación', 'Formación']);
                if (eduData) {
                    eduData.split('\n').filter(l => l.trim()).forEach(l => {
                        addRichText(l.trim(), 9.5);
                    });
                }

                doc.save(`${fullName.replace(/\s/g, '_')}_CV.pdf`);

            } catch (error) { 
                console.error(error); 
                alert("Error al generar PDF. Asegúrate de estar en un servidor local."); 
            }
        });
    }
});
