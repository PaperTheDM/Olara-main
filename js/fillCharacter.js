window.onload = function() {
    // Form submission event
    document.getElementById("formData").addEventListener("submit", function(event) {
        event.preventDefault();

        
        const characterName = document.getElementById("characterName").value;
        const className = document.getElementById("class").value;
        const subClassName = document.getElementById("subClass").value;
        const level = document.getElementById("level").value;
        const PB = Math.floor(2 + ((level - 1)/4));
        const race = document.getElementById("race").value;
        const origin = document.getElementById("origin").value;

        const strength = document.getElementById("strength").value;
        const dexterity = document.getElementById("dexterity").value;
        const constitution = document.getElementById("constitution").value;
        const intelligence = document.getElementById("intelligence").value;
        const wisdom = document.getElementById("wisdom").value;
        const charisma = document.getElementById("charisma").value;

        const modSTR = Math.floor((strength - 10)/2);
        const modDEX = Math.floor((dexterity - 10)/2);
        const modCON = Math.floor((constitution - 10)/2);
        const modINT = Math.floor((intelligence - 10)/2);
        const modWIS = Math.floor((wisdom - 10)/2);
        const modCHA = Math.floor((charisma - 10)/2);

        const armor = document.getElementById("armor").value;
        const speed = document.getElementById("speed").value;
        const size = document.getElementById("size").value;
        const maxHP = document.getElementById("maxHP").value;
        const maxHD = document.getElementById("maxHD").value;
        const pP = document.getElementById("pP").value;

        const weapons = document.getElementById("weapons").value;
        const tools = document.getElementById("tools").value;
        const speciesTraits = document.getElementById("speciesTraits").value;
        const classFeat = document.getElementById("classFeat").value;
        const feat = document.getElementById("feat").value;

        let miscInit = 0;
        const checker = document.getElementById("init");
        if (checker !== null) {
            miscInit = parseInt(checker.value) || 0; 
        }
        const initiative = modDEX + miscInit;

        // Create the canvas
        const canvas = document.getElementById("formCanvas");
        const ctx = canvas.getContext("2d");

        // Load the background image
        const background = new Image();
        background.src = "images/CharacterSheet-2024-pg1.png"; // Path to the uploaded image
        background.onload = function() {
            // Set canvas dimensions based on background image
            const aspectRatio = background.naturalWidth / background.naturalHeight;
            const largeWidth = 2400;
            const largeHeight = largeWidth / aspectRatio;

            canvas.width = largeWidth;
            canvas.height = largeHeight;

            // Draw the image as the background
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            // Add form data onto the canvas with specific positions
            ctx.font = "bold 36px Arial";
            ctx.fillStyle = "#000";

            // Position text on the character sheet image
            ctx.fillText(characterName, 100, 110);
            ctx.fillText(className, 590, 185);
            ctx.fillText(subClassName, 590, 275);
            ctx.fillText(level, 1080, 170);
            ctx.fillText("+" + PB, 210, 600);
            ctx.fillText(race, 100, 275);
            ctx.fillText(origin, 100, 185);

            ctx.fillText(strength, 275, 920);
            ctx.fillText(dexterity, 275, 1390);
            ctx.fillText(constitution, 275, 1970);
            ctx.fillText(intelligence, 700, 600);
            ctx.fillText(wisdom, 700, 1300);
            ctx.fillText(charisma, 700, 1990);
            ctx.fillText("+" + modSTR, 150, 900);
            ctx.fillText("+" + modDEX, 150, 1370);
            ctx.fillText("+" + modCON, 150, 1950);
            ctx.fillText("+" + modINT, 570, 590);
            ctx.fillText("+" + modWIS, 570, 1285);
            ctx.fillText("+" + modCHA, 570, 1970);

            ctx.fillText(armor, 1320, 190);
            ctx.fillText(speed, 1390, 575);
            ctx.fillText(size, 1725, 575);
            ctx.fillText(maxHP, 1775, 275);
            ctx.fillText(maxHD, 1975, 275);
            ctx.fillText(pP, 2150, 575);
            ctx.fillText("+" + initiative, 1030, 575);
           
            const initialFontSize = 36; // Set this to your desired starting font size
            const maxHeight = 200; // Set this to your desired max height for the text block

            drawWrappedText(ctx, weapons, 200, 2700, 500, maxHeight, initialFontSize, 35);
            drawWrappedText(ctx, tools, 200, 2950, 500, maxHeight, initialFontSize, 35);
            drawWrappedText(ctx, speciesTraits, 950, 2380, 500, 550, initialFontSize, 35);
            drawWrappedText(ctx, classFeat, 980, 1440, 1000, 600, initialFontSize, 35);
            drawWrappedText(ctx, feat, 1700, 2380, 500, 550, initialFontSize, 35);
            
            // Fill in bubbles based on skills
            submitSkills();

            function drawWrappedText(ctx, text, x, y, maxWidth, maxHeight, initialFontSize, lineHeight) {
                if (typeof text !== 'string') {
                    console.error('Invalid text provided:', text);
                    return; // Exit if the text is not a valid string
                }

                let words = text.split(' ');
                let line = '';
                let fontSize = initialFontSize;
                let totalHeight = 0; // Track total height of drawn text
                ctx.font = `${fontSize}px Arial`;

                // Save the initial y position for resetting later
                const initialY = y;

                // Loop until the text is fully processed
                for (let i = 0; i < words.length; i++) {
                    let testLine = line + words[i] + ' ';
                    let testWidth = ctx.measureText(testLine).width;

                    // If the current line exceeds maxWidth
                    if (testWidth > maxWidth && line) {
                        // Draw the line only if it fits
                        ctx.fillText(line, x, y);
                        totalHeight += lineHeight; // Update total height
                        line = words[i] + ' '; // Start a new line with the current word
                        y += lineHeight; // Move to the next line
                    } else {
                        line = testLine; // Continue adding to the current line
                    }

                    // Check if total height exceeds maxHeight
                    if (totalHeight + lineHeight > maxHeight) {
                        // Decrease font size and reset line height
                        fontSize -= 2; // Decrease font size (adjust as necessary)
                        ctx.font = `${fontSize}px Arial`;
                        totalHeight = 0; // Reset total height for recalculation
                        y = initialY; // Reset y position to the starting y position
                        line = ''; // Reset line for the new font size
                        i = -1; // Reset word index to reprocess the line

                        // Check if the font size has reached a minimum limit
                        if (fontSize <= 8) { // Minimum font size threshold
                            console.warn('Text too long to fit in specified dimensions. Stopping size reduction.');
                            break; // Prevent infinite loop if text is too large
                        }
                    }
                }

                // Draw the last line, if any
                if (line) {
                    ctx.fillText(line, x, y);
                }
            }
            // Function to handle bubble filling
            function submitSkills() {
                const selectedSkills = [];
                const checkboxes = document.querySelectorAll('input[name="skills"]:checked');
                
                checkboxes.forEach((checkbox) => {
                    selectedSkills.push(checkbox.value);
                });

                selectedSkills.forEach((skill) => {
                    switch(skill) {
                        case "Charisma Save":fillBubble(508, 2130, 15);break;
                        case "Strength Save":fillBubble(86, 1055, 15);break;
                        case "Dexterity Save":fillBubble(86, 1525, 15);break;
                        case "Constitution Save":fillBubble(86, 2105, 15);break;
                        case "Intelligence Save":fillBubble(508, 749, 15);break;
                        case "Wisdom Save":fillBubble(508, 1440, 15);break;
                        case "acrobatics":fillBubble(86, 1605, 15);break;
                        case "animalHandling":fillBubble(508, 1520, 15);break;
                        case "arcana":fillBubble(508, 829, 15);break;
                        case "athletics":fillBubble(86, 1135, 15);break;
                        case "deception":fillBubble(508, 2210, 15);break;
                        case "history":fillBubble(508, 885, 15);break;
                        case "insight":fillBubble(508, 1576, 15);break;
                        case "intimidation":fillBubble(508, 2266, 15);break;
                        case "investigation":fillBubble(508, 941, 15);break;
                        case "medicine":fillBubble(508, 1632, 15);break;
                        case "nature":fillBubble(508, 997, 15);break;
                        case "perception":fillBubble(508, 1688, 15);break;
                        case "performance":fillBubble(508, 2322, 15);break;
                        case "persuasion":fillBubble(508, 2378, 15);break;
                        case "religion":fillBubble(508, 1053, 15);break;
                        case "sleightOfHand":fillBubble(86, 1661, 15);break;
                        case "stealth":fillBubble(86, 1717, 15);break;
                        case "survival":fillBubble(508, 1744, 15);break;
                        case "light":fillBubble(252,2577,15);break;
                        case "medium":fillBubble(384,2577,15);break;
                        case "heavy":fillBubble(568,2577,15);break;
                        case "shield":fillBubble(713,2577,15);break;
                        default:console.log("Unknown skill selected");break;
                    }
                });
            }

            // Function to fill in the bubble
            function fillBubble(x, y, radius) {
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = 'black';
                ctx.fill();
            }

            // Convert canvas to image
            const image = canvas.toDataURL("image/png");
            console.log("Image URL:", image);

            // Create a download link for the image
            const link = document.createElement('a');
            link.href = image;
            link.download = 'character-sheet.png';
            link.click();
        };
    });
};