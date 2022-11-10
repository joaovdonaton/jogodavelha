import tabuleiro from "./tabuleiro.mjs";

let modo;
let jogadorAtual = 'X';

// trocar jogador
const trocarJogador = () => {
    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X'
    document.querySelector('#vez').innerText = 'VEZ DO JOGADOR: ' + jogadorAtual
}

//
function resetJogo(){
    tabuleiro.reset()
    document.querySelector('#vez').style.visibility = 'hidden';
    document.querySelector('#menu').style.visibility = 'visible';
    document.querySelector('#tabuleiro').style.visibility = 'hidden';
    document.querySelector('#voltar').style.visibility = 'hidden';
    jogadorAtual = 'X'
}

// gerar nodes do tabuleiro
const tabuleiroElement = document.querySelector("#tabuleiro")
tabuleiroElement.style.visibility = 'hidden'; //inicialmente invisivel
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        const e = document.createElement('div');
        e.setAttribute('linha', i.toString())
        e.setAttribute('coluna', j.toString())

        // fazer jogada
        e.addEventListener('click', (event) => {
            //jogada com sucesso
            if (tabuleiro.jogar(parseInt(event.target.getAttribute('linha')),
                parseInt(event.target.getAttribute('coluna')),
                jogadorAtual)) {
                //jogada
                tabuleiro.renderizar(tabuleiroElement)

                trocarJogador()

                const vitoria = tabuleiro.verificarVitoria()
                if (vitoria) {
                    alert('Jogador ' + vitoria + ' venceu!')
                    resetJogo()
                }

                else if(tabuleiro.deuVelha()){
                    alert('DEU VELHA!')
                    resetJogo()
                }
                //jogada do bot
                else if (jogadorAtual === 'O' && modo !== 'jogador') {
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
                    tabuleiro.renderizar(tabuleiroElement)
                    trocarJogador()

                    const vitoria = tabuleiro.verificarVitoria()
                    if (vitoria) {
                        alert('Jogador ' + vitoria + ' venceu!')
                        resetJogo()
                    }

                    else if(tabuleiro.deuVelha()){
                        alert('DEU VELHA!')
                        resetJogo()
                    }
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
    tabuleiro.renderizar(tabuleiroElement)

    //atualizar input de voltas
    document.querySelector('#voltarNum').setAttribute('max', `${tabuleiro.historico.length}`)
}

// seleção do modo de jogo
    const menuButtons = document.querySelectorAll(".menuButton")
    menuButtons.forEach(e => e.addEventListener('click', (e) => {
        modo = e.target.getAttribute('value')
        document.querySelector('#menu').style.visibility = 'hidden'
        tabuleiroElement.style.visibility = 'visible';
        document.querySelector('#voltar').style.visibility = 'visible'

        if (modo === 'jogador') {
            document.querySelector('#vez').style.visibility = 'visible'
        }

        tabuleiro.renderizar(tabuleiroElement)
    }))

