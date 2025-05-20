// Função de exemplo
function init() {
    console.log('Aplicação inicializada!');
    
    // Exemplo de função
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Botão clicado!');
        });
    });
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);
