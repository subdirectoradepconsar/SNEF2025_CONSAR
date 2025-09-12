document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cuestionario");
    const totalInput = document.getElementById("total_puntaje");

    const seccion1 = document.getElementById("seccion1");
    const seccion2 = document.getElementById("seccion2");
    const seccion3 = document.getElementById("seccion3");
    const btnEntrar = document.getElementById("btnEntrar");
    const resultadoDiv = document.getElementById("resultadoUsuario");
    const comentarioDiv = document.getElementById("comentario");
    const imgElemento = document.getElementById("resultado-imagen");

    // Lista de imágenes
    const imagenes = [
        "img/temerario/cofreDelTesoro.png", //temerario_del_gasto.jpg
        "img/temerario/llegadaAlParaiso.png", // corazones_en_mora.jpg
        "img/temerario/mensajeEnUnaBotella.png", // presuntos_ahorradores.jpg
        "img/temerario/olaGigante.png" //herederos_del_futuro.jpg
    ];
    let ultimaImagen = ""; // para controlar la no repetición

    function obtenerImagenAleatoria() {
        // Si por alguna razón no hay imágenes, devolvemos cadena vacía
        if (!imagenes || imagenes.length === 0) return "";

        let nuevaImagen = "";
        // Reintentar hasta que sea diferente a la última (máx. 10 intentos por seguridad)
        let intentos = 0;
        do {
            const indice = Math.floor(Math.random() * imagenes.length);
            nuevaImagen = imagenes[indice];
            intentos++;
        } while (nuevaImagen === ultimaImagen && intentos < 10);

        ultimaImagen = nuevaImagen;
        return nuevaImagen;
    }

    // Ocultamos secciones al iniciar el formulario
    seccion2.style.display = "none";
    seccion3.style.display = "none";

    // Avanzar de sección 1 a 2
    btnEntrar.addEventListener("click", () => {
        const inputsSeccion1 = seccion1.querySelectorAll("select,input");
        let validos = true;

        inputsSeccion1.forEach(campo => {
            if (!campo.checkValidity()) {
                campo.reportValidity();
                validos = false;
            }
        });

        if (validos) {
            seccion1.style.display = "none";
            seccion2.style.display = "block";
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });

    // Manejar envío del formulario en sección 2
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Validar que todas las preguntas tengan respuesta (ahora 4)
        let todasRespondidas = true;
        for (let i = 1; i <= 4; i++) {
            const respuesta = document.querySelector(`input[name="pregunta${i}"]:checked`);
            if (!respuesta) {
                alert(`Por favor responde la pregunta ${i}.`);
                todasRespondidas = false;
                break;
            }
        }
        if (!todasRespondidas) return;

        // Calcular total de respuestas
        let puntajeTotal = 0;
        for (let i = 1; i <= 4; i++) {
            const respuesta = document.querySelector(`input[name="pregunta${i}"]:checked`);
            if (respuesta) {
                puntajeTotal += parseInt(respuesta.value, 10);
            }
        }

        // Guardar en el input oculto
        totalInput.value = puntajeTotal;

        // Mostrar mensaje en resultados (saludo + puntaje)
        const nombre = document.getElementById("nombre").value || "Usuario";
        resultadoDiv.innerHTML = `Bienvenido al juego <strong>${nombre}</strong>.<br> Perteneces al siguinte equipo.`;

        // --- Seleccionar y mostrar imagen aleatoria (sin repetir consecutivo) ---
        const nuevaImg = obtenerImagenAleatoria();
        console.log("Imagen seleccionada:", nuevaImg); // ayuda a debug
        if (imgElemento) {
            if (nuevaImg) {
                imgElemento.src = nuevaImg;
                imgElemento.style.display = "block";
            } else {
                imgElemento.style.display = "none";
            }
        }

        // Limpiamos el comentario de texto (ya no aplica)
        if (comentarioDiv) {
            comentarioDiv.innerHTML = "";
            comentarioDiv.classList.remove("comentario-box");
        }

        // Cambiar de sección 2 a la sección 3
        seccion2.style.display = "none";
        seccion3.style.display = "block";

        // Enviar datos con fetch
        fetch(form.action, {
            method: "POST",
            body: new FormData(form)
        })
        .then(response => console.log("Datos enviados a Google Sheets"))
        .catch(error => console.error("Error al enviar:", error));
    });
});


/*
Llegada al paraíso 
Guardas conchas y perlas hoy para disfrutar mares tranquilos mañana.

Tu velero: Control de Gastos
Navegas ligero, evitas cargas de más y llegas seguro a tu isla del tesoro.


*/