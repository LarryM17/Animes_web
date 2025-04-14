document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        alert('Sesión cerrada');
    });

    document.getElementById('toggleFormBtn').addEventListener('click', () => {
        const form = document.getElementById('formulario');
        form.classList.toggle('hidden');
    });

    document.getElementById('toggleThemeBtn').addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });

    // Aplicar tema oscuro por defecto y ocultar formulario
    document.body.classList.add('dark');
    document.getElementById('formulario').classList.add('hidden');

    // Filtro por título + en espera + importante
    let filtroEsperaActivo = false;
    let filtroImportanteActivo = false;

    document.getElementById("searchInput").addEventListener("input", aplicarFiltros);
    document.getElementById("filtrarEsperaBtn").addEventListener("click", function () {
        filtroEsperaActivo = !filtroEsperaActivo;
        this.classList.toggle("active");
        aplicarFiltros();
    });

    document.getElementById("filtrarImportanteBtn").addEventListener("click", function () {
        filtroImportanteActivo = !filtroImportanteActivo;
        this.classList.toggle("active");
        aplicarFiltros();
    });

    function aplicarFiltros() {
        for (const row of document.querySelectorAll("#animeTable tbody tr")) {
            const titulo = row.cells[0].textContent.toLowerCase();
            const incluyeTexto = titulo.includes(document.getElementById("searchInput").value.toLowerCase());
            const enEspera = row.cells[5].querySelector("input").checked;
            const importante = row.cells[4].querySelector("input").checked;

            const mostrar =
                (!filtroEsperaActivo || enEspera) &&
                (!filtroImportanteActivo || importante) &&
                incluyeTexto;

            row.style.display = mostrar ? "" : "none";
        }
    }
});
