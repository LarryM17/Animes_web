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

    document.body.classList.add('dark');
    document.getElementById('formulario').classList.add('hidden');
});
