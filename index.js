
        // Create floating hearts background
        function createFloatingHearts() {
            const heartBg = document.getElementById('heartBg');
            const hearts = ['🐰', '🐥', '💎', '🐶', '🐼', '🐾', '🦋', '✨'];
            
            for (let i = 0; i < 30; i++) {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.top = Math.random() * 100 + '%';
                heart.style.animationDelay = Math.random() * 6 + 's';
                heart.style.animationDuration = (4 + Math.random() * 4) + 's';
                heartBg.appendChild(heart);
            }
        }

        // Scratch card functionality
        const canvas = document.getElementById('scratchCanvas');
        const ctx = canvas.getContext('2d');
        
        let isScratching = false;
        let scratchedPercentage = 0;
        let canvasWidth = 350;
        let canvasHeight = 280;
        let lastX = 0;
        let lastY = 0;
        let isCompleted = false;

        // Make canvas responsive
        function resizeCanvas() {
            const scratchArea = document.querySelector('.scratch-area');
            const rect = scratchArea.getBoundingClientRect();
            canvasWidth = rect.width;
            canvasHeight = rect.height;
            
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            
            if (!isCompleted) {
                createScratchSurface();
            }
        }

        // Create cute scratch surface
        function createScratchSurface() {
            // Create a much more contrasting and cute scratch surface
            const gradient = ctx.createRadialGradient(canvasWidth/2, canvasHeight/2, 0, canvasWidth/2, canvasHeight/2, Math.max(canvasWidth, canvasHeight)/2);
            gradient.addColorStop(0, '#8A2BE2');  // Blue Violet
            gradient.addColorStop(0.3, '#9932CC'); // Dark Orchid
            gradient.addColorStop(0.6, '#BA55D3'); // Medium Orchid
            gradient.addColorStop(1, '#DDA0DD');   // Plum
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // Add cute sparkle pattern
            const patternSize = Math.min(canvasWidth, canvasHeight) / 12;
            ctx.font = `${patternSize}px Arial`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            
            // Create a more organized pattern
            const sparkles = [ '⭐', '💫', '🌟','❤'];
            for (let i = 0; i < 25; i++) {
                const sparkle = sparkles[i % sparkles.length];
                ctx.fillText(sparkle, 
                    (i % 5) * (canvasWidth/5) + Math.random() * 30, 
                    Math.floor(i/5) * (canvasHeight/4) + Math.random() * 30 + 25
                );
            }
            
            // Add main text with better contrast
            const fontSize = Math.min(canvasWidth, canvasHeight) / 10;
            ctx.font = `bold ${fontSize}px Fredoka One`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.strokeStyle = 'rgba(138, 43, 226, 0.8)';
            ctx.lineWidth = 2;
            ctx.textAlign = 'center';
            
            ctx.strokeText('Scratch Me! 🥺', canvasWidth/2, canvasHeight/2 - 5);
            ctx.fillText('Scratch Me! 🥺', canvasWidth/2, canvasHeight/2 - 5);
            
            ctx.font = `${fontSize * 0.6}px Comic Neue`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.strokeStyle = 'rgba(138, 43, 226, 0.6)';
            ctx.lineWidth = 1;
            ctx.strokeText('Hehehehe... 💜', canvasWidth/2, canvasHeight/2 + 25);
            ctx.fillText('Hehehehe... 💜', canvasWidth/2, canvasHeight/2 + 25);
        }

        function startScratch(e) {
            if (isCompleted) return;
            
            isScratching = true;
            const rect = canvas.getBoundingClientRect();
            let x, y;
            
            if (e.type.includes('touch')) {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            } else {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }

            // Scale coordinates
            lastX = (x / rect.width) * canvasWidth;
            lastY = (y / rect.height) * canvasHeight;
            
            scratch(e);
        }

        

        function scratch(e) {
            if (!isScratching || isCompleted) return;

            const rect = canvas.getBoundingClientRect();
            let x, y;
            
            if (e.type.includes('touch')) {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            } else {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }

            // Scale coordinates
            x = (x / rect.width) * canvasWidth;
            y = (y / rect.height) * canvasHeight;

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.lineWidth = Math.min(canvasWidth, canvasHeight) / 8; // Bigger brush for smoother scratching
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();

            lastX = x;
            lastY = y;

            calculateScratchedArea();
        }

        function stopScratch() {
            isScratching = false;
        }

        function calculateScratchedArea() {
            if (isCompleted) return;
            
            const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            const pixels = imageData.data;
            let transparent = 0;

            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] < 255) {
                    transparent++;
                }
            }

            scratchedPercentage = (transparent / (canvasWidth * canvasHeight)) * 100;

            // Auto-complete at 80%
            if (scratchedPercentage >= 80) {
                completeScratch();
            }
        }

        function completeScratch() {
            if (isCompleted) return;
            
            isCompleted = true;
            
            // Clear the entire canvas with animation
            canvas.classList.add('completed');
            
            // Create celebration effect
            createCelebration();
            
            // Show the backup button
            document.querySelector('.popup-btn').style.display = 'inline-block';
            
            // Update instruction text
            document.querySelector('.instruction').textContent = '💝 Tap the button to see my message! 💝';
        }

        function createCelebration() {
            const container = document.querySelector('.card-container');
            const celebrations = ['🎉', '🎊', '💖', '🌟', '✨', '💕'];
            
            for (let i = 0; i < 20; i++) {
                const celebration = document.createElement('div');
                celebration.className = 'celebration-particle';
                celebration.textContent = celebrations[Math.floor(Math.random() * celebrations.length)];
                celebration.style.left = Math.random() * 100 + '%';
                celebration.style.top = Math.random() * 100 + '%';
                container.appendChild(celebration);
                
                setTimeout(() => {
                    celebration.remove();
                }, 2000);
            }
        }

        // Event listeners - updated to prevent conflicts
        canvas.addEventListener('mousedown', startScratch);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', stopScratch);
        canvas.addEventListener('mouseleave', stopScratch);

        // Touch events for mobile
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startScratch(e);
        });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            scratch(e);
        });
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopScratch();
        });

        // Prevent scrolling on touch
        canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
        canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

        // Popup functions
        function showPopup() {
            document.getElementById('popupOverlay').classList.add('show');
        }

        function hidePopup() {
            document.getElementById('popupOverlay').classList.remove('show');
        }

        // Click outside to close popup
        document.getElementById('popupOverlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('popupOverlay')) {
                hidePopup();
            }
        });

        // Initialize
        createFloatingHearts();
        resizeCanvas();
        
        // Handle window resize
        window.addEventListener('resize', resizeCanvas);