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
let totalTentativas = 0; [cite: 21]
let tempoGasto = 0; [cite: 21]
let intervaloCronometro = null;

// Passo 1: Iniciar e registrar presença 
function iniciarTreinamento() {
    const inputNome = document.getElementById("nome-usuario");
    if (inputNome.value.trim() === "") {
        alert("Por favor, digita seu nome completo.");
        return;
    }

    usuarioAtual = inputNome.value.trim();
    localStorage.setItem("usuario_boas_praticas", usuarioAtual); // Grava localmente

    document.getElementById("exibir-nome").innerText = usuarioAtual;
    document.getElementById("tela-login").classList.add("hidden");
    document.getElementById("tela-jogo").classList.remove("hidden");

    gerarTabuleiro();
    iniciarCronometro();
}

// Inicia a contagem de tempo [cite: 21]
function iniciarCronometro() {
    tempoGasto = 0;
    intervaloCronometro = setInterval(() => {
        tempoGasto++;
        document.getElementById("tempo").innerText = tempoGasto;
    }, 1000);
}

// Cria as cartas embaralhadas no tabuleiro [cite: 16]
function gerarTabuleiro() {
    const tabuleiro = document.getElementById("tabuleiro");
    tabuleiro.innerHTML = "";
    
    // Duplica as etapas para fazer os pares (total de 12 cartas)
    let listaCartas = [...etapas, ...etapas];
    
    // Algoritmo para embaralhar as cartas aleatoriamente
    listaCartas.sort(() => Math.random() - 0.5);

    listaCartas.forEach((etapa, index) => {
        const elementoCarta = document.createElement("div");
        elementoCarta.classList.add("carta");
        elementoCarta.dataset.etapaId = etapa.id;
        elementoCarta.dataset.texto = etapa.texto;
        elementoCarta.innerText = "?";
        elementoCarta.addEventListener("click", virarCarta);
        tabuleiro.appendChild(elementoCarta);
    });
}

// Lógica ao clicar em uma carta [cite: 16, 17]
function virarCarta() {
    // Evita cliques em cartas já certas ou se já houver duas viradas na tela
    if (this.classList.contains("virada") || this.classList.contains("revelada") || cartasSelecionadas.length >= 2) {
        return;
    }

    this.classList.add("virada");
    this.innerText = this.dataset.texto;
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

    // 1. Verifica se formam um par idêntico
    if (idEtapa1 === idEtapa2) {
        
        // 2. Trava de segurança: Só valida se for a etapa da vez na linha do tempo! [cite: 17]
        if (idEtapa1 === etapaCronologicaAtual) {
            // Acertou o par na sequência correta! [cite: 17]
            carta1.classList.add("revelada");
            carta2.classList.add("revelada");
            
            mostrarNumeroGigante(etapaCronologicaAtual); // Fixação visual [cite: 18]
            etapaCronologicaAtual++; // Libera a próxima etapa cronológica [cite: 17]
            
            cartasSelecionadas = [];

            // Se chegou ao fim do jogo (etapa 6 concluída)
            if (etapaCronologicaAtual > etapas.length) {
                finalizarTreinamento();
            }
        } else {
            // Encontrou um par, mas violou a cronologia (ex: abriu o passo 3 antes do 2) [cite: 17]
            setTimeout(() => {
                alert(`⚠️ Sequência incorreta! Você precisa encontrar a Etapa ${etapaCronologicaAtual} primeiro.`);
                carta1.classList.remove("virada");
                carta2.classList.remove("virada");
                carta1.innerText = "?";
                carta2.innerText = "?";
                cartasSelecionadas = [];
            }, 600);
        }
    } else {
        // Não formou um par
        setTimeout(() => {
            carta1.classList.remove("virada");
            carta2.classList.remove("virada");
            carta1.innerText = "?";
            carta2.innerText = "?";
            cartasSelecionadas = [];
        }, 1000);
    }
}

// Feedback visual: exibe o número gigante na tela [cite: 18]
function mostrarNumeroGigante(numero) {
    const feedback = document.getElementById("feedback-visual");
    feedback.innerText = numero;
    feedback.classList.remove("hidden");
    
    // Reseta a animação fazendo o elemento sumir
    setTimeout(() => {
        feedback.classList.add("hidden");
    }, 1000);
}

// Passo 4: Fim do Jogo e Emissão do Atestado Local [cite: 19, 23]
function finalizarTreinamento() {
    clearInterval(intervaloCronometro);
    
    document.getElementById("tela-jogo").classList.add("hidden");
    document.getElementById("tela-final").classList.remove("hidden");

    // Preenche os dados do Certificado na tela [cite: 23]
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