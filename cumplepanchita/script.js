// script.js


// Referencias a los botones
const birthdayButton = document.getElementById('birthday-button');

// Escuchar el clic en el botón "Cumple Panchita?"
birthdayButton.addEventListener('click', () => {
    // 1. Pausar la música
    backgroundMusic.pause();

    // 2. Ocultar el botón "Reproducir Música" y el botón "Cumple Panchita?"
    if (musicToggle) {
        musicToggle.style.display = 'none';
    }
    birthdayButton.style.display = 'none';  // Desaparece el botón que acabamos de clickear

    // 3. Limpiar el contenido de .container, dejando solo el marco blanco
    container.innerHTML = `
        <div class="white-frame" 
             style="display: flex; justify-content: center; align-items: center; position: relative;">
        </div>
    `;
    const whiteFrame = container.querySelector('.white-frame');

    // 4. Tipear el mensaje
    const messageToType = "Muy bien! Descifraste la tan enigmática pista y encontraste el regalo. Te amo!!!";
    let currentIndex = 0;

    // Párrafo donde se escribirá el texto
    const typedParagraph = document.createElement('p');
    typedParagraph.style.color = '#fff';
    typedParagraph.style.textAlign = 'center';
    typedParagraph.style.fontFamily = "'Courier New', Courier, monospace";
    typedParagraph.style.fontSize = '1.4em';
    typedParagraph.style.maxWidth = '60%';
    typedParagraph.style.margin = '20px';
    whiteFrame.appendChild(typedParagraph);

    // Función de tipeo
    const typingInterval = setInterval(() => {
        if (currentIndex < messageToType.length) {
            typedParagraph.textContent += messageToType.charAt(currentIndex);
            currentIndex++;
        } else {
            clearInterval(typingInterval);

            // 5. Esperar 1 segundo y luego mostrar el botón "Felices 2 años corazón" más arriba
            setTimeout(() => {
                const newButton = document.createElement('button');
                newButton.textContent = "Felices 2 años corazón";
                newButton.classList.add("rewards-button");
        
                // Posicionamiento más arriba
                newButton.style.position = 'absolute';
                newButton.style.bottom = '250px';
                newButton.style.left = '50%';
                newButton.style.transform = 'translateX(-50%)';
        
                // Redirección al hacer clic
                newButton.addEventListener('click', () => {
                    window.location.href = "https://drive.google.com/file/d/1aF_ropzAzedptNYMDtZpSgi5IZtVFo7w/view?usp=drivesdk";
                });
        
                whiteFrame.appendChild(newButton);
            }, 1000);
        }
    }, 50);
});


// 1. Crear y reproducir la música de fondo
const backgroundMusic = new Audio('sonidos/panchita.mp3'); // Ruta relativa al archivo script.js
backgroundMusic.loop = true; // Repetir la música indefinidamente
backgroundMusic.volume = 0.5; // Ajusta el volumen según prefieras (0.0 a 1.0)

// Intentar reproducir la música de fondo al cargar la página
backgroundMusic.play().catch(error => {
    console.log("Autoplay falló:", error);
    // Opcional: Puedes manejar el fallo aquí, como mostrar un botón para iniciar la música
});

// Seleccionar el botón de música
const musicToggle = document.getElementById('music-toggle');

// Agregar listener al botón de música
musicToggle.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        musicToggle.textContent = 'Pausar Música';
    } else {
        backgroundMusic.pause();
        musicToggle.textContent = 'Reproducir Música';
    }
});


// 2. Crear el sonido de clic
const clickSound = new Audio('sonidos/click.mp3'); // Ruta relativa al archivo script.js
clickSound.volume = 0.25; // Reducir el volumen del sonido de clic al 50%

// Función para reproducir el sonido de clic
function playClickSound() {
    clickSound.currentTime = 0; // Reiniciar el sonido para permitir múltiples reproducciones rápidas
    clickSound.play();
}

// Seleccionar el contenedor y el botón "Volver"
const container = document.querySelector('.container');
const backButton = document.getElementById('back-button');

// Definir las pistas para cada color (claves en inglés)
const clues = {
    purple: [ // Caja Lila
        "Hace tiempo estuvimos buscando algo especial en un lugar que solemos frecuentar, te acordas? No lo encontramos, hasta ahora...",
        "Es algo que podes abrazar y tenerlo siempre con vos. Es suave y tierno, como aquello que estuvimos buscando. Su nombre puede ser un poco empalagoso...",
        "Tiene orejas largas que parecen alas, es blanco como una nube, y tiene carita linda (como la tuya). Vive en un mundo mágico tierno y kawaii..."
    ],
    pink: [ // Caja Rosa
        "Este regalo brilla de una forma especial, sin necesidad de ser ostentoso. Te puede acompañar en momentos importantes o cotidianos, es chiquito y bonito como vos...",
        "Existen de diferentes materiales. Hace relativamente poco te abriste (barras) a nuevas posibilidades, este regalo viene para acompañar esa decisión...",
        "Como diría una que conozco, unos lindos de estos te \"visten\", y hace meses estuvimos buscando y mirando varios de estos en un lugar al que solemos ir seguido..."
    ],
    green: [ // Caja Verde
        "Está inspirado en algo que ilumina cualquier día, como un rayo de sol que entra por la ventana. Es, como vos, un símbolo de alegría, optimismo, vida...",
        "Esperá lo inesperado, este es un regalo clásico convertido a algo diferente. En esta forma, tenemos que agregar \"paciencia\" a la lista de la pista anterior...",
        "Armá su tallo, sus pétalos y todas sus partes con paciencia y cariño. No va a buscar el sol pero mantiene la esencia.."
    ]
};

// Traducciones de colores al español
const colorTranslations = {
    pink: 'Rosa',
    green: 'Verde',
    purple: 'Lila'
};

// Variables para manejar el estado de las pistas
let currentColor = null;
let isTyping = {}; // Objeto para manejar el estado de escritura de cada pista
let typingTimeouts = {}; // Objeto para manejar los timeouts de escritura de cada pista
let isAnyTyping = false; // Controla si alguna pista está siendo desplegada

// Variables globales
let usedColors = new Set(); // Almacena los colores ya utilizados
let totalPoints = 0; // Total de puntos para recompensa (puedes ajustar el valor inicial)

// Objeto para almacenar las pistas reveladas
const revealedClues = {
    pink: [],
    green: [],
    purple: []
};

// Función para manejar el clic en un cuadrado
function handleSquareClick(event) {
    
    playClickSound(); // Reproducir sonido de clic al hacer clic en una caja de color

    const colorData = event.currentTarget.getAttribute('data-color'); // "pink", "green", "purple"

    // Verificar si el color ya ha sido usado
    if (usedColors.has(colorData)) {
        return; // No hacer nada si ya ha sido usado
    }

    const colorValue = getComputedStyle(event.currentTarget).color; // Obtiene el valor RGB
    currentColor = colorData;

    // Limpiar el contenido actual
    container.innerHTML = '';

    // Crear y agregar el recuadro de color seleccionado con el valor RGB
    createColoredFrame(colorData, colorValue);

    // Mostrar el botón "Volver"
    backButton.classList.remove('hidden');
}

// Función para crear el recuadro de color seleccionado
function createColoredFrame(colorName, colorValue) {
    const coloredFrame = document.createElement('div');
    coloredFrame.classList.add('colored-frame');
    coloredFrame.style.borderColor = colorValue; // Establece el color del borde
    coloredFrame.style.width = '80%'; // Reducido el ancho al 80%
    coloredFrame.style.maxWidth = '600px'; // Máximo ancho de 600px para mayor control
    coloredFrame.style.height = 'auto'; // Ajuste automático del alto
    container.appendChild(coloredFrame);

    // Crear y agregar el título en español
    const title = document.createElement('h1');
    title.textContent = `Pistas de Caja ${colorTranslations[colorName]}`;
    title.style.color = colorValue;
    title.style.marginBottom = '20px';
    coloredFrame.appendChild(title);

    // Crear el contenedor de las pistas
    const cluesContainer = document.createElement('div');
    cluesContainer.classList.add('clues-container');
    coloredFrame.appendChild(cluesContainer);

    // Crear y agregar los tres párrafos para las pistas
    clues[colorName].forEach((clue, index) => {
        const clueParagraph = document.createElement('p');
        clueParagraph.classList.add('clue-paragraph');
        clueParagraph.dataset.index = index;
        clueParagraph.dataset.fullText = clue; // Guardar el texto completo
        clueParagraph.style.color = colorValue;
        clueParagraph.style.cursor = 'pointer';
        clueParagraph.style.fontSize = '1.2em';
        clueParagraph.style.fontFamily = 'Arial, sans-serif';
        clueParagraph.style.transition = 'background-color 0.3s';
        clueParagraph.style.padding = '10px';
        clueParagraph.style.borderRadius = '5px';
        clueParagraph.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        clueParagraph.style.display = 'block';
        clueParagraph.style.marginTop = '10px';

        // Verificar si la pista ya fue revelada
        if (revealedClues[colorName].includes(index)) {
            clueParagraph.textContent = clue;
            clueParagraph.classList.add('shown');
        } else {
            clueParagraph.textContent = "Hacé click para mostrar la pista...";
            clueParagraph.addEventListener('click', () => toggleClue(clueParagraph, colorName, index));
        }

        cluesContainer.appendChild(clueParagraph);
    });

    // Inicializar el estado de las pistas
    initializeClues(colorName);

    // Crear y agregar el elemento para mostrar los puntos posibles
    const pointsElement = document.createElement("div");
    pointsElement.classList.add("points-possible");
    pointsElement.style.color = colorValue;
    pointsElement.style.marginTop = '20px';
    pointsElement.style.fontSize = '1.2em';
    coloredFrame.appendChild(pointsElement);

    // Actualizar los puntos posibles inicialmente
    updatePointsPossible(colorName);

    // **Inicialmente, ocultar los elementos "Puntos posibles" y el botón "Adivinaste?"**
    pointsElement.style.display = 'none';

    // Crear el botón "Adivinaste?"
    const guessButton = document.createElement('button');
    guessButton.textContent = "Adivinaste?";
    guessButton.classList.add('guess-button', 'disabled-button'); // Añadimos clase 'disabled-button' por defecto
    guessButton.style.marginTop = '10px';
    guessButton.style.padding = '10px 20px';
    guessButton.style.fontSize = '1em';
    guessButton.style.border = `2px solid ${colorValue}`;
    guessButton.style.borderRadius = '5px';
    guessButton.style.backgroundColor = '#ccc'; // Color grisado cuando está deshabilitado
    guessButton.style.color = '#666'; // Texto gris
    guessButton.style.cursor = 'not-allowed'; // Cursor no permitido
    guessButton.disabled = true; // Deshabilitado inicialmente

    // **Actualizar estilos con clases CSS en lugar de estilos inline para mejor manejo**
    // Añadimos y quitamos clases para manejar los estados habilitado/deshabilitado
    // Efecto hover para el botón (solo cuando está habilitado)
    guessButton.addEventListener('mouseover', () => {
        if (!guessButton.disabled) {
            guessButton.style.backgroundColor = colorValue;
            guessButton.style.color = '#fff';
        }
    });

    guessButton.addEventListener('mouseout', () => {
        if (!guessButton.disabled) {
            guessButton.style.backgroundColor = '#fff';
            guessButton.style.color = '#000';
        }
    });

    // Manejar el clic en el botón "Adivinaste?"
    guessButton.addEventListener('click', () => {

        playClickSound(); // Reproducir sonido de clic al hacer clic en "Adivinaste?"

        if (guessButton.disabled) return; // No hacer nada si está deshabilitado

        // Obtener el valor actual de puntos posibles desde el DOM
        const pointsText = pointsElement.textContent;
        const currentPoints = parseInt(pointsText.replace('Puntos posibles para ganar: ', ''), 10);

        // Sumar los puntos posibles al total
        totalPoints += currentPoints;
        updateTotalPoints();

        // Añadir el color a usedColors
        usedColors.add(colorName);

        // Restaurar la vista principal
        restoreOriginalView();
    });

    coloredFrame.appendChild(guessButton);
}

// Función para actualizar el contador de puntos en la interfaz
function updateTotalPoints() {
    const pointsCounter = document.querySelector('.points-counter');
    if (pointsCounter) {
        pointsCounter.textContent = `Puntos para recompensa: ${totalPoints}`;
    }
}

// Función para inicializar las pistas considerando las reveladas
function initializeClues(colorName) {
    const allClues = document.querySelectorAll('.clue-paragraph');
    let highestRevealedIndex = -1;

    allClues.forEach((clue, index) => {
        if (revealedClues[colorName].includes(index)) {
            // Pista ya revelada
            clue.classList.add('shown');
            clue.style.pointerEvents = 'auto';
            clue.style.opacity = '1';
            // Actualizar el índice más alto revelado
            if (index > highestRevealedIndex) {
                highestRevealedIndex = index;
            }
        } else if (index !== 0) {
            // Pistas no reveladas y no la primera
            clue.classList.add('disabled');
            clue.style.pointerEvents = 'none';
            clue.style.opacity = '0.5';
        }
    });

    // Habilitar la siguiente pista después de la más alta revelada
    enableNextClue(colorName, highestRevealedIndex);
}

// Función para alternar la escritura de una pista
function toggleClue(paragraph, colorName, index) {
    if (isAnyTyping && !paragraph.classList.contains('shown')) {
        // Si ya se está escribiendo otra pista y esta pista no está mostrada, no hacer nada
        return;
    }

    if (isTyping[index]) {
        // Si está escribiendo, detener la escritura
        clearInterval(typingTimeouts[index]);
        isTyping[index] = false;
        paragraph.textContent = paragraph.dataset.fullText || "";
        isAnyTyping = false;
        // Rehabilitar las pistas que no han sido mostradas
        enableNextClue(colorName, index);
    } else {
        if (paragraph.classList.contains('shown')) {
            // Si ya está mostrada, no hacer nada
            return;
        }
        // Iniciar la escritura
        paragraph.textContent = '';
        isTyping[index] = true;
        isAnyTyping = true;

        // **Gestionar la visibilidad y estado de "Puntos posibles" y "Adivinaste?"**
        const coloredFrame = container.querySelector('.colored-frame');
        const pointsElement = coloredFrame.querySelector('.points-possible');
        const guessButton = coloredFrame.querySelector('.guess-button');

        if (index === 0) {
            // Ocultar los elementos mientras se despliega la primera pista
            pointsElement.style.display = 'none';
            // guessButton.style.display = 'none';
        } else {
            // Mostrar los elementos si ya están visibles y deshabilitar el botón mientras se despliega
            pointsElement.style.display = 'block';
            guessButton.classList.add('disabled-button');
            guessButton.disabled = true;
            guessButton.style.cursor = 'not-allowed';
            guessButton.style.backgroundColor = '#ccc'; // Gris
            guessButton.style.color = '#666'; // Texto gris
        }

        // Deshabilitar el botón "Adivinaste?" durante la escritura de la pista
        if (index !== 0) {
            guessButton.disabled = true;
            guessButton.style.cursor = 'not-allowed';
            guessButton.style.backgroundColor = '#ccc'; // Gris
            guessButton.style.color = '#666'; // Texto gris
        }

        // Deshabilitar solo las pistas que no han sido mostradas
        const allClues = document.querySelectorAll('.clue-paragraph');
        allClues.forEach((clue, i) => {
            if (i !== index && !clue.classList.contains('shown')) {
                clue.classList.add('disabled');
                clue.style.pointerEvents = 'none';
                clue.style.opacity = '0.5';
            }
        });

        let charIndex = 0;
        typingTimeouts[index] = setInterval(() => {
            if (charIndex < paragraph.dataset.fullText.length) {
                paragraph.textContent += paragraph.dataset.fullText.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typingTimeouts[index]);
                isTyping[index] = false;
                isAnyTyping = false;
                paragraph.classList.add('shown'); // Marcar como mostrada
                // Registrar la pista revelada
                if (!revealedClues[colorName].includes(index)) {
                    revealedClues[colorName].push(index);
                }
                // Habilitar la siguiente pista
                enableNextClue(colorName, index);

                // Actualizar los puntos posibles después de revelar una pista
                updatePointsPossible(colorName);

                // Gestionar la visibilidad y estado de los elementos después de revelar la pista
                if (index === 0) {
                    pointsElement.style.display = 'block';
                    guessButton.style.display = 'block';
                    guessButton.disabled = false;
                    guessButton.classList.remove('disabled-button');
                    guessButton.style.cursor = 'pointer';
                    guessButton.style.backgroundColor = '#fff'; // Restaurar color original
                    guessButton.style.color = '#000'; // Restaurar color de texto
                } else {
                    guessButton.disabled = false;
                    guessButton.classList.remove('disabled-button');
                    guessButton.style.cursor = 'pointer';
                    guessButton.style.backgroundColor = '#fff'; // Restaurar color original
                    guessButton.style.color = '#000'; // Restaurar color de texto
                }
            }
        }, 50); // Ajusta la velocidad de escritura aquí (50ms por carácter)
    }
}

// Función para habilitar la siguiente pista después de completar la actual
function enableNextClue(colorName, currentIndex) {
    const allClues = document.querySelectorAll('.clue-paragraph');
    const nextIndex = currentIndex + 1;
    if (nextIndex < allClues.length) {
        const nextClue = allClues[nextIndex];
        if (!nextClue.classList.contains('shown')) {
            nextClue.classList.remove('disabled');
            nextClue.style.pointerEvents = 'auto';
            nextClue.style.opacity = '1';
        }
    }
}

// Función para restaurar la vista original
function restoreOriginalView() {
    // Limpiar el contenido actual
    container.innerHTML = `
        <div class="white-frame">
            <div class="title-container">
                <!-- Imagen principal -->
                <img src="gif/fc2.png" alt="Feliz Cumple Panchita" class="main-image">

                <!-- Nuevas instancias de sparks1.webp -->
                <img src="gif/sparks1.webp" alt="Spark Left" class="spark-left">
                <img src="gif/sparks1.webp" alt="Spark Right" class="spark-right">
            </div>
            
            <!-- Contenedor superior de GIFs (Taylor) -->
            <div class="top-gif-container">
                <div class="taylor1-container">
                    <img src="gif/taylor1.webp" alt="Taylor 1" class="gif taylor1">
                </div>
                <div class="taylor2-container">
                    <img src="gif/taylor2.webp" alt="Taylor 2" class="gif taylor2">
                </div>
            </div>
            <!-- Fin del contenedor superior de GIFs -->
            
            <div class="color-squares-container">
                <div class="color-square pink" data-color="pink"></div>
                <div class="color-square green" data-color="green"></div>
                <div class="color-square purple" data-color="purple"></div>
            </div>
            
            <!-- Contenedor inferior de GIFs (Gato y 23.webp) -->
            <div class="bottom-gif-container">
                <!-- Gato invertido a la izquierda -->
                <img src="gif/gato1.webp" alt="Gato Izquierda" class="gif gato1 izquierda">
                
                <!-- Nuevo GIF 23.webp en el centro sin rotación -->
                <img src="gif/23.webp" alt="Nuevo Gato" class="gif nuevo-gato">
                
                <!-- Gato original a la derecha con rotación -->
                <img src="gif/gato1.webp" alt="Gato Derecha" class="gif gato1 derecha">
            </div>
            <!-- Fin del contenedor inferior de GIFs -->
            
            <div class="footer">
                <span class="points-counter">Puntos para recompensa: ${totalPoints}</span>
                <button id="rewards-button" class="rewards-button">Recompensas</button>
            </div>
        </div>
    `;
    // Ocultar el botón "Volver"
    backButton.classList.add('hidden');
    // Reaplicar los eventos de clic a los nuevos cuadrados
    addClickEvents();
    // Reasignar funcionalidad al botón de recompensas
    const newRewardsButton = document.getElementById("rewards-button");
    if (newRewardsButton) {
        newRewardsButton.addEventListener("click", handleRewardsClick);
    }

    // Re-iniciar las animaciones de las chispas
    initializeSparkAnimations();

    // Actualizar el contador de puntos
    updateTotalPoints();
}

// Función para agregar eventos de clic a los cuadrados de color
function addClickEvents() {
    const colorSquares = document.querySelectorAll('.color-square');
    colorSquares.forEach(square => {
        const color = square.getAttribute('data-color');
        if (!usedColors.has(color)) {
            square.addEventListener('click', handleSquareClick);
        } else {
            // Aplicar estilos de deshabilitado
            square.classList.add('disabled');
            square.style.cursor = 'not-allowed';
        }
    });
}

// Manejar clic en el botón "Volver"
backButton.addEventListener('click', () => {

    playClickSound(); // Reproducir sonido de clic al hacer clic en "Volver"

    // Limpiar cualquier temporizador activo
    Object.values(typingTimeouts).forEach(timeout => clearInterval(timeout));
    typingTimeouts = {};
    isTyping = {};
    isAnyTyping = false;
    // Restaurar la vista original
    restoreOriginalView();
});

// Evento de clic en el botón "Recompensas"
function handleRewardsClick() {

    playClickSound(); // Reproducir sonido de clic al hacer clic en "Recompensas"

    // Limpiar todo excepto el marco blanco (esto eliminará los GIFs y las chispas)
    container.innerHTML = `
        <div class="white-frame" style="display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative;">
        </div>
    `;

    // Crear el contenedor para las recompensas
    const rewardsContainer = document.createElement("div");
    rewardsContainer.classList.add("rewards-container");

    rewardsContainer.style.display = "flex";
    rewardsContainer.style.flexDirection = "column";
    rewardsContainer.style.alignItems = "center";
    rewardsContainer.style.width = "100%";
    rewardsContainer.style.maxWidth = "600px";
    rewardsContainer.style.gap = "30px";
    rewardsContainer.style.position = "relative";
    rewardsContainer.style.bottom = "50px";

    // Crear el elemento para mostrar los puntos
    const pointsElement = document.createElement("div");
    pointsElement.classList.add("rewards-points");
    pointsElement.textContent = `Puntos para recompensa: ${totalPoints}`;
    rewardsContainer.appendChild(pointsElement);

    // Crear el contenedor para los GIFs de caramelos
    const candiesContainer = document.createElement("div");
    candiesContainer.classList.add("candies-container");

    // Crear y agregar los cuatro GIFs de caramelos
    const candies = ["candy1.webp", "candy2.webp", "candy3.webp", "candy4.webp"];
    candies.forEach((candy, index) => {
        const img = document.createElement("img");
        img.src = `gif/${candy}`;
        img.alt = `Caramelo ${index + 1}`;
        img.classList.add("candy-gif", `candy-${index + 1}`);
        candiesContainer.appendChild(img);
    });

    rewardsContainer.appendChild(candiesContainer);

    // Lista de recompensas
    const rewardsList = document.createElement("div");
    rewardsList.classList.add("rewards-list");

    const rewards = [
        { points: 7, name: "1 chocolate Block 300" },
        { points: 6, name: "1 paquete de Skittles" },
        { points: 5, name: "1 tubo de papas Pringles" },
        { points: 4, name: "1 paquete de Rocklets" },
        { points: 3, name: "1 chocolate KitKat" },
        { points: 2, name: "1 paquete de gomitas Mogul (normales o ácidas)" },
        { points: 1, name: "1 caramelo Butter Toffee o 1 Flynn Paff" },
        { points: 0, name: "Besos y abrazos (viene incluido en cualquier paquete)", alwaysChecked: true },
    ];

    // Crear cada ítem de recompensa
    rewards.forEach((reward, index) => {
        const itemContainer = document.createElement("div");
        itemContainer.classList.add("reward-item");

        // Nombre de la recompensa
        const rewardName = document.createElement("span");
        rewardName.textContent = reward.name;
        rewardName.classList.add("reward-name");

        // Puntos requeridos
        const rewardPoints = document.createElement("span");
        rewardPoints.textContent = `${reward.points} puntos`;
        rewardPoints.classList.add("reward-points");

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("reward-checkbox");
        checkbox.dataset.points = reward.points;
        checkbox.dataset.name = reward.name;
        if (reward.alwaysChecked) {
            checkbox.checked = true;
            checkbox.disabled = true; // Siempre seleccionado y no editable
        }

        // Agregar elementos al contenedor
        itemContainer.appendChild(rewardName);
        itemContainer.appendChild(rewardPoints);
        itemContainer.appendChild(checkbox);

        // Agregar ítem al contenedor de recompensas
        rewardsList.appendChild(itemContainer);
    });

    rewardsContainer.appendChild(rewardsList);

    // Crear el contenedor para los GIFs de caramelos en la parte inferior
    const candiesBottomContainer = document.createElement("div");
    candiesBottomContainer.classList.add("candies-container", "candies-bottom");

    // Invertir el orden de los caramelos para la parte inferior
    const reversedCandies = [...candies].reverse(); // Crea una copia invertida del array
    reversedCandies.forEach((candy, index) => {
        const img = document.createElement("img");
        img.src = `gif/${candy}`;
        img.alt = `Caramelo ${index + 1}`;
        img.classList.add("candy-gif", `candy-bottom-${index + 1}`);
        candiesBottomContainer.appendChild(img);
    });

    rewardsContainer.appendChild(candiesBottomContainer);

    // Crear el botón "Canjear"
    const canjearButton = document.createElement("button");
    canjearButton.textContent = "Canjear";
    canjearButton.classList.add("canjear-button");
    canjearButton.disabled = true; // Deshabilitado inicialmente
    canjearButton.style.padding = '10px 20px';
    canjearButton.style.fontSize = '1em';
    canjearButton.style.border = 'none';
    canjearButton.style.borderRadius = '5px';
    canjearButton.style.backgroundColor = '#28a745';
    canjearButton.style.color = '#fff';
    canjearButton.style.cursor = 'not-allowed';
    canjearButton.style.transition = 'background-color 0.3s';

    // Hover effect para el botón "Canjear" cuando está habilitado
    canjearButton.addEventListener('mouseover', () => {
        if (!canjearButton.disabled) {
            canjearButton.style.backgroundColor = '#218838';
        }
    });

    canjearButton.addEventListener('mouseout', () => {
        if (!canjearButton.disabled) {
            canjearButton.style.backgroundColor = '#28a745';
        }
    });

    rewardsContainer.appendChild(canjearButton);

    // Añadir el contenedor de recompensas al marco blanco
    const whiteFrameNew = container.querySelector(".white-frame");
    whiteFrameNew.appendChild(rewardsContainer);

    // Mostrar el botón "Volver"
    backButton.classList.remove('hidden');

    // Seleccionar todos los checkboxes
    const checkboxes = rewardsList.querySelectorAll('.reward-checkbox');

    // Estado de selección
    let selectedItems = [];

    // Función para actualizar el resumen y manejar habilitaciones
    function updateSelection() {
        // Filtrar los checkboxes que están seleccionados y no están deshabilitados
        selectedItems = Array.from(checkboxes).filter(cb => cb.checked && !cb.disabled);

        // Calcular el total de puntos seleccionados
        const totalSelectedPoints = selectedItems.reduce((acc, cb) => acc + parseInt(cb.dataset.points, 10), 0);

        // Calcular los puntos restantes
        const remainingPoints = totalPoints - totalSelectedPoints;

        // **Eliminar la actualización del resumen "Vas a canjear:"**
        // const names = selectedItems.map(cb => cb.dataset.name);
        // canjeSummary.textContent = `Vas a canjear: ${names.join(' + ')}`;

        // Actualizar los puntos posibles en la parte superior
        pointsElement.textContent = `Puntos para recompensa: ${totalPoints} - ${totalSelectedPoints} = ${remainingPoints}`;

        // Habilitar o deshabilitar los checkboxes según los puntos restantes
        checkboxes.forEach(cb => {
            if (cb.dataset.points === '0') return; // Ignorar las recompensas que siempre están seleccionadas

            const rewardPoints = parseInt(cb.dataset.points, 10);
            if (!cb.checked && rewardPoints > remainingPoints) {
                cb.disabled = true;
                cb.parentElement.classList.add('disabled-reward');
            } else if (!cb.checked) {
                cb.disabled = false;
                cb.parentElement.classList.remove('disabled-reward');
            }
        });

        // Actualizar el estado del botón "Canjear"
        if (selectedItems.length > 0 && remainingPoints >= 0) {
            canjearButton.disabled = false;
            canjearButton.style.cursor = 'pointer';
        } else {
            canjearButton.disabled = true;
            canjearButton.style.cursor = 'not-allowed';
        }
    }

    // Añadir eventos a los checkboxes
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            updateSelection();
        });

        // Inicializar el estado de los checkboxes al cargar
        if (cb.dataset.points > totalPoints && cb.dataset.points != '0') {
            cb.disabled = true;
            cb.parentElement.classList.add('disabled-reward');
        }
    });

    // Inicializar la selección al cargar
    updateSelection();

    // Manejar el clic en el botón "Canjear"
    canjearButton.addEventListener('click', () => {
        // Calcular el total de puntos seleccionados
        const totalSelectedPoints = selectedItems.reduce((acc, cb) => acc + parseInt(cb.dataset.points, 10), 0);

        if (totalSelectedPoints > totalPoints) {
            alert("No tienes suficientes puntos para canjear estos ítems.");
            return;
        }

        // Obtener los nombres de los ítems seleccionados
        const selectedNames = selectedItems.map(cb => cb.dataset.name);

        // Limpiar el contenido actual del white-frame
        const whiteFrame = container.querySelector('.white-frame');
        whiteFrame.innerHTML = ''; // Eliminar todo el contenido existente

        // Crear el mensaje de confirmación
        const message = document.createElement('div');
        message.innerHTML = `
            <h2>¡Listo!</h2>
            <p>Canjeaste estos premios:</p>
            <ul>
                ${selectedNames.map(name => `<li>${name}</li>`).join('')}
            </ul>
            <h2>Te Amo!!!</h2>
            <img src="gif/gato2.webp" alt="Gato" class="gato2-gif">
        `;
        whiteFrame.appendChild(message);

        // Actualizar los puntos totales
        totalPoints -= totalSelectedPoints; // Deduce los puntos canjeados
        updateTotalPoints();

        // No se agrega ningún botón adicional
    });
}

// Función para inicializar las animaciones de las chispas al restaurar la vista original
function initializeSparkAnimations() {
    const sparkLeft = document.querySelector('.spark-left');
    const sparkRight = document.querySelector('.spark-right');

    if (sparkLeft || sparkRight) {
        // Función para generar un número aleatorio dentro de un rango
        function getRandomDelay(min, max) {
            return Math.random() * (max - min) + min;
        }

        // Función para generar una duración aleatoria dentro de un rango
        function getRandomDuration(min, max) {
            return Math.random() * (max - min) + min;
        }

        // Función para animar una chispa
        function animateSpark(spark, swingKeyframe, swingDurationRange, swingDelayRange, blinkKeyframe, blinkDurationRange, blinkDelayRange) {
            // Función para iniciar la animación swing
            function startSwing() {
                // Asignar una duración y delay aleatorios para swing
                const swingDuration = getRandomDuration(...swingDurationRange).toFixed(2);
                const swingDelay = getRandomDelay(...swingDelayRange).toFixed(2);
                spark.style.animation = `${swingKeyframe} ${swingDuration}s`;
                spark.style.animationDelay = `${swingDelay}s`;

                // Escuchar el fin de la animación swing
                spark.addEventListener('animationend', handleSwingEnd, { once: true });
            }

            // Manejar el fin de la animación swing
            function handleSwingEnd() {
                // Iniciar la animación blink después de un delay aleatorio
                const blinkDuration = getRandomDuration(...blinkDurationRange).toFixed(2);
                const blinkDelay = getRandomDelay(...blinkDelayRange).toFixed(2);

                // Aplicar la animación blink
                spark.style.animation = `${blinkKeyframe} ${blinkDuration}s`;
                spark.style.animationDelay = `${blinkDelay}s`;

                // Escuchar el fin de la animación blink
                spark.addEventListener('animationend', handleBlinkEnd, { once: true });
            }

            // Manejar el fin de la animación blink
            function handleBlinkEnd() {
                // Esperar un delay aleatorio antes de reiniciar las animaciones
                const delay = getRandomDelay(1, 3); // Delay entre 1s y 3s
                setTimeout(() => {
                    startSwing();
                }, delay * 1000);
            }

            // Iniciar el ciclo de animación
            startSwing();
        }

        // Configurar animaciones para spark-left
        if (sparkLeft) {
            animateSpark(
                sparkLeft,
                'swing-left',       // Keyframe para swing-left
                [2.5, 3.5],         // Rango de duración para swing-left
                [0, 2],             // Rango de delay para swing-left
                'blink',            // Keyframe para blink (usa 'blink' para ambos)
                [0.8, 1.2],         // Rango de duración para blink
                [0, 2]              // Rango de delay para blink
            );
        }

        // Configurar animaciones para spark-right
        if (sparkRight) {
            animateSpark(
                sparkRight,
                'swing-right',      // Keyframe para swing-right
                [3, 4],             // Rango de duración para swing-right
                [2, 4],             // Rango de delay para swing-right
                'blink',            // Keyframe para blink (usa 'blink' para ambos)
                [1.3, 1.7],         // Rango de duración para blink
                [3, 6]              // Rango de delay para blink
            );
        }
    }
}

// Función para actualizar los puntos posibles en el DOM
function updatePointsPossible(colorName) {
    const coloredFrame = container.querySelector('.colored-frame');
    if (!coloredFrame) return;

    // Log para verificar el estado actual de revealedClues

    const revealedCount = revealedClues[colorName].length;

    let pointsPossible;

    if (revealedCount === 0 || revealedCount === 1) {
        pointsPossible = 3;
    } else if (revealedCount === 2) {
        pointsPossible = 2;
    } else if (revealedCount === 3) {
        pointsPossible = 1;
    }

    const pointsElement = coloredFrame.querySelector('.points-possible');
    if (pointsElement) {
        pointsElement.textContent = `Puntos posibles para ganar: ${pointsPossible}`;
    } else {
    }
}

// Función para reiniciar la aplicación
function resetApp() {
    // Reiniciar las variables de estado
    totalPoints = 0;
    usedColors.clear();
    revealedClues.pink = [];
    revealedClues.green = [];
    revealedClues.purple = [];

    // Restaurar la vista original
    restoreOriginalView();
}

// **Inicializar animaciones y eventos al cargar la página**
initializeSparkAnimations();
addClickEvents();
updateTotalPoints(); // Añadido para reflejar el total inicial

// Adjuntar listener al botón "Recompensas" en la carga inicial
const initialRewardsButton = document.getElementById("rewards-button");
if (initialRewardsButton) {
    initialRewardsButton.addEventListener("click", handleRewardsClick);
}

document.head.appendChild(style);



