// Banco de dados simulado com fotos reais de cada etapa da higienização
const etapas = [
    { 
        id: 1, 
        texto: "1. Umedecer as mãos", 
        imagem: "imagens/1.jpg" 
    },
    { 
        id: 2, 
        texto: "2. Passar sabonete", 
        imagem: "imagens/2.jpg" 
    },
    { 
        id: 3, 
        texto: "3. Esfregar palmas", 
        imagem: "imagens/3.jpg" 
    },
    { 
        id: 4, 
        texto: "4. Esfregar dorsos", 
        imagem: "imagens/4.jpg" 
    },
    { 
        id: 5, 
        texto: "5. Enxaguar bem", 
        imagem: "imagens/5.jpg" 
    },
    { 
        id: 6, 
        texto: "6. Secar (Papel)", 
        imagem: "imagens/6.jpg" 
    }
];

// Lista de frases de boas-vindas personalizadas mantidas
// O pool de frases rotativas mantido conforme seu pedido anterior
const frasesBoasVindas = [
    "Encontre os pares seguindo a sequência correta das etapas.",
    "Encontre os pares na ordem certa do passo a passo.",
    "Encontre os pares seguindo o passo a passo correto.",
    "Encontre os pares e monte o passo a passo da lavagem perfeita !",
    "Siga a ordem certa das etapas para liberar os pares!",
    "Combine as cartas na sequência certa da higienização."
];

let usuarioNome = "";
let usuarioDoc = "";
let etapaCronologicaAtual = 1; 
let cartasSelecionadas = [];
let totalTentativas = 0; 
let tempoGasto = 0; 
let intervaloCronometro = null;

// Ao carregar o app, verifica se o usuário marcou para lembrar os dados da última vez
window.addEventListener("DOMContentLoaded", () => {
    const nomeSalvo = localStorage.getItem("lembrar_nome");
    const docSalvo = localStorage.getItem("lembrar_doc");
    if (nomeSalvo && docSalvo) {
        document.getElementById("nome-usuario").value = nomeSalvo;
        document.getElementById("documento-usuario").value = docSalvo;
        document.getElementById("lembrar-dados").checked = true;
    }
});

// Navegação interna
function irParaLogin() {
    document.getElementById("tela-boas-vindas").classList.add("hidden");
    document.getElementById("tela-login").classList.remove("hidden");
}

function voltarParaBoasVindas() {
    document.getElementById("tela-login").classList.add("hidden");
    document.getElementById("tela-boas-vindas").classList.remove("hidden");
}

// Validação e processamento do formulário de login (Tela 2 -> Tela 3)
function autenticarUsuario() {
    const inputNome = document.getElementById("nome-usuario").value.trim();
    const inputDoc = document.getElementById("documento-usuario").value.trim();
    const checkboxLembrar = document.getElementById("lembrar-dados").checked;

    if (inputNome === "" || inputDoc === "") {
        alert("Por favor, preencha todos os campos para registrar sua presença.");
        return;
    }

    usuarioNome = inputNome;
    usuarioDoc = inputDoc;

    // Gerencia o recurso de lembrar dados localmente
    if (checkboxLembrar) {
        localStorage.setItem("lembrar_nome", usuarioNome);
        localStorage.setItem("lembrar_doc", usuarioDoc);
    } else {
        localStorage.removeItem("lembrar_nome");
        localStorage.removeItem("lembrar_doc");
    }

    // Registra a presença em segundo plano conforme exigência do diagnóstico técnico
    console.log(`Presença registrada: ${usuarioNome} - ${usuarioDoc} em ${new Date().toLocaleString()}`);

    // Prepara e abre a Tela 3 (Painel do Usuário)
    document.getElementById("painel-nome").innerText = usuarioNome;
    
    // Altera dinamicamente a frase de instruções/boas-vindas a cada login
    const indiceAleatorio = Math.floor(Math.random() * frasesBoasVindas.length);
    document.getElementById("instrucao-jogo").innerHTML = frasesBoasVindas[indiceAleatorio];

    document.getElementById("tela-login").classList.add("hidden");
    document.getElementById("tela-painel").classList.remove("hidden");
}

// Inicia a partida vindo do Painel de Controle (Tela 3 -> Tela 4)
function iniciarPartidaJogo() {
    document.getElementById("exibir-nome").innerText = usuarioNome;
    document.getElementById("tela-painel").classList.add("hidden");
    document.getElementById("tela-jogo").classList.remove("hidden");

    gerarTabuleiro();
    iniciarCronometro();
}

function iniciarCronometro() {
    tempoGasto = 0;
    if (intervaloCronometro) clearInterval(intervaloCronometro);
    intervaloCronometro = setInterval(() => {
        tempoGasto++;
        document.getElementById("tempo").innerText = tempoGasto;
    }, 1000);
}

function gerarTabuleiro() {
    const tabuleiro = document.getElementById("tabuleiro");
    tabuleiro.innerHTML = "";
    
    let listaCartas = [...etapas, ...etapas];
    listaCartas.sort(() => Math.random() - 0.5);

    listaCartas.forEach((etapa) => {
        const elementoCarta = document.createElement("div");
        elementoCarta.classList.add("carta");
        elementoCarta.dataset.etapaId = etapa.id;

        elementoCarta.innerHTML = `
            <div class="carta-face carta-verso">💧</div>
            <div class="carta-face carta-frente">
                <span class="numero-etapa">${etapa.id}</span>
                <img src="${etapa.imagem}" alt="${etapa.texto}" class="foto-etapa">
                <p class="texto-etapa">${etapa.texto}</p>
            </div>
        `;

        elementoCarta.addEventListener("click", virarCarta);
        tabuleiro.appendChild(elementoCarta);
    });
}

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

function checarPar() {
    const [carta1, carta2] = cartasSelecionadas;
    const idEtapa1 = parseInt(carta1.dataset.etapaId);
    const idEtapa2 = parseInt(carta2.dataset.etapaId);

    if (idEtapa1 === idEtapa2) {
        if (idEtapa1 === etapaCronologicaAtual) {
            carta1.classList.add("revelada");
            carta2.classList.add("revelada");
            
            mostrarNumeroGigante(etapaCronologicaAtual); 
            etapaCronologicaAtual++; 
            cartasSelecionadas = [];

            if (etapaCronologicaAtual > etapas.length) {
                setTimeout(finalizarTreinamento, 800);
            }
        } else {
            setTimeout(() => {
                alert(`⚠️ Sequência incorreta! Você precisa encontrar a Etapa ${etapaCronologicaAtual} primeiro.`);
                carta1.classList.remove("virada");
                carta2.classList.remove("virada");
                cartasSelecionadas = [];
            }, 600);
        }
    } else {
        setTimeout(() => {
            carta1.classList.remove("virada");
            carta2.classList.remove("virada");
            cartasSelecionadas = [];
        }, 1000);
    }
}

function mostrarNumeroGigante(numero) {
    const feedback = document.getElementById("feedback-visual");
    feedback.innerText = numero;
    feedback.classList.remove("hidden");
    
    feedback.style.animation = 'none';
    feedback.offsetHeight; 
    feedback.style.animation = null;

    setTimeout(() => {
        feedback.classList.add("hidden");
    }, 800);
}

function finalizarTreinamento() {
    clearInterval(intervaloCronometro);
    document.getElementById("tela-jogo").classList.add("hidden");
    document.getElementById("tela-final").classList.remove("hidden");

    // Formata a data e hora atual no padrão: DD/MM/AAAA às HH:MMh
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-BR');
    const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + 'h';

    // Injeta de forma dinâmica todos os dados coletados no layout do certificado
    document.getElementById("cert-nome").innerText = usuarioNome;
    document.getElementById("cert-doc").innerText = usuarioDoc;
    document.getElementById("cert-data").innerText = `${dataFormatada} às ${horaFormatada}`;
    document.getElementById("cert-tempo").innerText = tempoGasto;
    document.getElementById("cert-tentativas").innerText = totalTentativas;
}

function reiniciarParaPainel() {
    etapaCronologicaAtual = 1;
    cartasSelecionadas = [];
    totalTentativas = 0;
    document.getElementById("tentativas").innerText = 0;
    document.getElementById("tempo").innerText = 0;
    
    document.getElementById("tela-final").classList.add("hidden");
    
    // Recarrega a tela de painel com uma nova frase randômica para a próxima rodada
    const indiceAleatorio = Math.floor(Math.random() * frasesBoasVindas.length);
    document.getElementById("instrucao-jogo").innerHTML = frasesBoasVindas[indiceAleatorio];
    
    document.getElementById("tela-painel").classList.remove("hidden");
}
