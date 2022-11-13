import tabuleiro from "./tabuleiro.mjs";

let modo;
let jogadorAtual = 'X'; //iniciar com player (O é o bot)

// trocar jogador
const trocarJogador = () => {
    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X'
    document.querySelector('#vez').innerText = 'VEZ DO JOGADOR: ' + jogadorAtual
}

//
function resetJogo(){
    tabuleiro.reset()
    document.querySelector('#vez').style.visibility = 'hidden';
    document.querySelector('#menu').style.display = 'flex';
    document.querySelector('#tabuleiro').style.visibility = 'hidden';
    document.querySelector('#voltar').style.visibility = 'hidden';
    jogadorAtual = 'X'
}

//
function renderizar(){
    for(let child of document.querySelector('#tabuleiro').children){
        const [l, c] = [parseInt(child.getAttribute('linha')), parseInt(child.getAttribute('coluna'))]
        child.innerText = tabuleiro.tabuleiro[l][c] ? tabuleiro.tabuleiro[l][c] : ' '
    }
}

// verificar condições de fim de jogo (vitória ou velha)
// só consegui fazer funcionar com o setTimeout. Antes parece que o reset acontecia antes dos elementos serem renderizados
function verificarFim(){
    const vitoria = tabuleiro.verificarVitoria()
    if (vitoria) {
        setTimeout(() => {
            resetJogo()
            alert('Jogador ' + vitoria + ' venceu!')
        }, 100)
        return true
    }

    else if(tabuleiro.deuVelha()){
        setTimeout(() => {
            resetJogo()
            alert('DEU VELHA!')
        }, 100)
        return true
    }
}


// gerar nodes do tabuleiro
const tabuleiroElement = document.querySelector("#tabuleiro")
tabuleiroElement.style.visibility = 'hidden'; //inicialmente invisivel
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        const e = document.createElement('div');
        e.setAttribute('linha', i.toString())
        e.setAttribute('coluna', j.toString())
        e.style.fontWeight = 'bold';

        // fazer jogada
        e.addEventListener('click', (event) => {
            //jogada com sucesso
            if (tabuleiro.jogar(parseInt(event.target.getAttribute('linha')),
                parseInt(event.target.getAttribute('coluna')),
                jogadorAtual)) {
                renderizar(tabuleiroElement)

                trocarJogador()

                //jogada do bot
                if (!verificarFim() && jogadorAtual === 'O' && modo !== 'jogador') {
                    const jogadasDisp = tabuleiro.jogadasDisponiveis()

                    if (modo === 'easy') {
                        const [l, c] = jogadasDisp[Math.floor(Math.random() * jogadasDisp.length)]

                        tabuleiro.jogar(l, c, jogadorAtual)
                    }
                    /*
                    * faz uma jogada se ela for vencer pro bot, caso contrário, jogada aleatória (ou bloquear jogada no hard)
                    * */
                    else if (modo === 'normal' || modo === 'hard') {
                        let venci = false;
                        for (const [l, c] of jogadasDisp) {
                            if (tabuleiro.simularJogada(l, c, jogadorAtual)) {
                                tabuleiro.jogar(l, c, jogadorAtual)
                                venci = true
                                break
                            }
                        }

                        let bloqueado = false;
                        if (!venci) {
                            if (modo === 'hard') { //bloquear jogada do outro
                                for (const [l, c] of jogadasDisp) {
                                    if (tabuleiro.simularJogada(l, c, jogadorAtual === 'O' ? 'X' : 'O', tabuleiro)) {
                                        tabuleiro.jogar(l, c, jogadorAtual, tabuleiro)
                                        bloqueado = true;
                                        break;
                                    }
                                }
                            }
                        }

                        if (!venci && !bloqueado) {
                            const [l, c] = jogadasDisp[Math.floor(Math.random() * jogadasDisp.length)]

                            tabuleiro.jogar(l, c, jogadorAtual)
                        }
                    }
                    renderizar(tabuleiroElement)
                    trocarJogador()

                    verificarFim()
                }
            }
            else {
                alert('Jogada Impossível!')
            }

            //atualizar input de voltas
            document.querySelector('#voltarNum').setAttribute('max', `${tabuleiro.historico.length}`)
        })

        tabuleiroElement.appendChild(e)
    }
}

//submit do form de voltar
const voltarForm = document.querySelector('#voltar')
voltarForm.onsubmit = (e) => {
    e.preventDefault()

    const voltar = parseInt(document.querySelector('#voltarNum').value)

    tabuleiro.tabuleiro = tabuleiro.copyTabuleiro(tabuleiro.historico[tabuleiro.historico.length - voltar])
    tabuleiro.historico = tabuleiro.historico.slice(0, tabuleiro.historico.length - voltar)
    renderizar(tabuleiroElement)

    //atualizar input de voltas
    document.querySelector('#voltarNum').setAttribute('max', `${tabuleiro.historico.length}`)
}

// seleção do modo de jogo
    const menuButtons = document.querySelectorAll(".menuButton")
    menuButtons.forEach(e => e.addEventListener('click', (e) => {
        modo = e.target.getAttribute('value')
        document.querySelector('#menu').style.display = 'none'
        tabuleiroElement.style.visibility = 'visible';
        document.querySelector('#voltar').style.visibility = 'visible'

        if (modo === 'jogador') {
            document.querySelector('#vez').style.visibility = 'visible'
        }

        renderizar(tabuleiroElement)
    }))

