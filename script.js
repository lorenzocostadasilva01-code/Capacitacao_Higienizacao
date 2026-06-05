// Banco de dados simulado com as etapas corretas da higienização [cite: 11]
const etapas = [
    { id: 1, texto: "1. Umedecer as mãos" },
    { id: 2, texto: "2. Passar sabonete" },
    { id: 3, texto: "3. Esfregar palmas" },
    { id: 4, texto: "4. Esfregar dorsos" },
    { id: 5, texto: "5. Enxaguar bem" },
    { id: 6, texto: "6. Secar (Papel)" }
];

let usuarioAtual = "";
let etapaCronologicaAtual = 1; // Controla a trava sequencial obrigatória [cite: 17]
let cartasSelecionadas = [];
let totalTentativas = 0; // [cite: 21]
let tempoGasto = 0; // [cite: 21]
let intervaloCronometro = null;

// Passo 1: Iniciar e registrar presença
function iniciarTreinamento() {
    const inputNome = document.getElementById("nome-usuario");
    if (inputNome.value.trim() === "") {
        alert("Por favor, digite seu nome completo.");
        return;
    }

    usuarioAtual = inputNome.value.trim();
    localStorage.setItem("usuario_boas_praticas", usuarioAtual); 

    document.getElementById("exibir-nome").innerText = usuarioAtual;
    document.getElementById("tela-login").classList.add("hidden");
    document.getElementById("tela-jogo").classList.remove("hidden");

    gerarTabuleiro();
    iniciarCronometro();
}

// Inicia a contagem de tempo [cite: 21]
function iniciarCronometro() {
    tempoGasto = 0;
    // Evita acumular múltiplos intervalos se reiniciar o jogo
    if (intervaloCronometro) clearInterval(intervaloCronometro);
    
    intervaloCronometro = setInterval(() => {
        tempoGasto++;
        document.getElementById("tempo").innerText = tempoGasto;
    }, 1000);
}

// Cria as cartas embaralhadas no tabuleiro com estrutura 3D [cite: 16]
function gerarTabuleiro() {
    const tabuleiro = document.getElementById("tabuleiro");
    tabuleiro.innerHTML = "";
    
    let listaCartas = [...etapas, ...etapas];
    listaCartas.sort(() => Math.random() - 0.5);

    listaCartas.forEach((etapa) => {
        const elementoCarta = document.createElement("div");
        elementoCarta.classList.add("carta");
        elementoCarta.dataset.etapaId = etapa.id;
        elementoCarta.dataset.texto = etapa.texto;

        // Estrutura necessária para o efeito de rotação 3D do CSS
        elementoCarta.innerHTML = `
            <div class="carta-face carta-verso">💧</div>
            <div class="carta-face carta-frente">${etapa.texto}</div>
        `;

        elementoCarta.addEventListener("click", virarCarta);
        tabuleiro.appendChild(elementoCarta);
    });
}

// Lógica ao clicar em uma carta [cite: 16, 17]
function virarCarta() {
    if (this.classList.contains("virada") || this.classList.contains("revelada") || cartasSelecionadas.length >= 2) {
        return;
    }

    this.classList.add("virada");
    cartasSelecionadas.push(this);

    if (cartasSelecionadas.length === 2) {
        totalTentativas++;
        document.getElementById("tentativas").innerText = totalTentativas;
        checarPar();
    }
}

// Regra crucial: Checa o par e valida a ordem cronológica [cite: 17]
function checarPar() {
    const [carta1, carta2] = cartasSelecionadas;
    const idEtapa1 = parseInt(carta1.dataset.etapaId);
    const idEtapa2 = parseInt(carta2.dataset.etapaId);

    if (idEtapa1 === idEtapa2) {
        if (idEtapa1 === etapaCronologicaAtual) {
            // Acertou o par na sequência correta! [cite: 17]
            carta1.classList.add("revelada");
            carta2.classList.add("revelada");
            
            mostrarNumeroGigante(etapaCronologicaAtual); // Fixação visual [cite: 18]
            etapaCronologicaAtual++; 
            
            cartasSelecionadas = [];

            if (etapaCronologicaAtual > etapas.length) {
                setTimeout(finalizarTreinamento, 800);
            }
        } else {
            // Encontrou um par, mas violou a cronologia [cite: 17]
            setTimeout(() => {
                alert(`⚠️ Sequência incorreta! Você precisa encontrar a Etapa ${etapaCronologicaAtual} primeiro.`);
                carta1.classList.remove("virada");
                carta2.classList.remove("virada");
                cartasSelecionadas = [];
            }, 600);
        }
    } else {
        // Não formou um par
        setTimeout(() => {
            carta1.classList.remove("virada");
            carta2.classList.remove("virada");
            cartasSelecionadas = [];
        }, 1000);
    }
}

// Feedback visual: exibe o número gigante na tela [cite: 18]
function mostrarNumeroGigante(numero) {
    const feedback = document.getElementById("feedback-visual");
    feedback.innerText = numero;
    feedback.classList.remove("hidden");
    
    // Força o reset da animação CSS
    feedback.style.animation = 'none';
    feedback.offsetHeight; // Truque para reiniciar animações no navegador
    feedback.style.animation = null;

    setTimeout(() => {
        feedback.classList.add("hidden");
    }, 800);
}

// Passo 4: Fim do Jogo e Emissão do Atestado Local [cite: 19, 23]
function finalizarTreinamento() {
    clearInterval(intervaloCronometro);
    
    document.getElementById("tela-jogo").classList.add("hidden");
    document.getElementById("tela-final").classList.remove("hidden");

    document.getElementById("cert-nome").innerText = usuarioAtual;
    document.getElementById("cert-data").innerText = new Date().toLocaleDateString('pt-BR');
    document.getElementById("cert-tempo").innerText = tempoGasto;
    document.getElementById("cert-tentativas").innerText = totalTentativas;
}

// Permite reiniciar a atividade [cite: 25]
function reiniciarJogo() {
    etapaCronologicaAtual = 1;
    totalTentativas = 0;
    document.getElementById("tentativas").innerText = 0;
    document.getElementById("tempo").innerText = 0;
    document.getElementById("tela-final").classList.add("hidden");
    document.getElementById("tela-jogo").classList.remove("hidden");
    gerarTabuleiro();
    iniciarCronometro();
}