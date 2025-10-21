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
        "img/temerario/cofreDelTesoro.png",
        "img/temerario/llegadaAlParaiso.png",
        "img/temerario/mensajeEnUnaBotella.png",
        "img/temerario/olaGigante.png"
    ];
    let ultimaImagen = "";

    function obtenerImagenAleatoria() {
        if (!imagenes || imagenes.length === 0) return "";
        let nuevaImagen = "";
        let intentos = 0;
        do {
            const indice = Math.floor(Math.random() * imagenes.length);
            nuevaImagen = imagenes[indice];
            intentos++;
        } while (nuevaImagen === ultimaImagen && intentos < 10);

        ultimaImagen = nuevaImagen;
        return nuevaImagen;
    }

    // Ocultar secciones al inicio
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

    // Manejar envío del formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // ✅ Validar dinámicamente todas las preguntas existentes
        const preguntas = Array.from(new Set(
            [...form.querySelectorAll('input[type="radio"]')]
                .map(r => r.name)
        ));

        let todasRespondidas = true;

        for (let i = 0; i < preguntas.length; i++) {
            const nombre = preguntas[i];
            const respuesta = document.querySelector(`input[name="${nombre}"]:checked`);
            if (!respuesta) {
                alert(`Por favor responde la ${nombre.replace("pregunta", "pregunta ")}.`);
                todasRespondidas = false;
                break;
            }
        }

        if (!todasRespondidas) return;

        // Calcular total de puntaje
        let puntajeTotal = 0;
        preguntas.forEach(nombre => {
            const respuesta = document.querySelector(`input[name="${nombre}"]:checked`);
            if (respuesta) {
                puntajeTotal += parseInt(respuesta.value, 10);
            }
        });

        totalInput.value = puntajeTotal;

        // Mostrar resultado
        const nombreUsuario = document.getElementById("nombre").value || "Usuario";
        resultadoDiv.innerHTML = `Bienvenido al juego <strong>${nombreUsuario}</strong>.<br> Perteneces al siguiente equipo.`;

        // Mostrar imagen aleatoria sin repetir
        const nuevaImg = obtenerImagenAleatoria();
        if (imgElemento) {
            if (nuevaImg) {
                imgElemento.src = nuevaImg;
                imgElemento.style.display = "block";
            } else {
                imgElemento.style.display = "none";
            }
        }

        // Limpiar comentario
        if (comentarioDiv) {
            comentarioDiv.innerHTML = "";
            comentarioDiv.classList.remove("comentario-box");
        }

        // Cambiar a la sección 3
        seccion2.style.display = "none";
        seccion3.style.display = "block";

        // Enviar datos
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