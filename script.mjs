import tabuleiro from "./tabuleiro.mjs";

let modo;
let jogadorAtual = 'X';

// trocar jogador
const trocarJogador = () => {
    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X'
    document.querySelector('#vez').innerText = 'VEZ DO JOGADOR: ' + jogadorAtual
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
            if(tabuleiro.jogar(parseInt(event.target.getAttribute('linha')),
                parseInt(event.target.getAttribute('coluna')),
                jogadorAtual)) {
                tabuleiro.renderizar(tabuleiroElement)

                const vitoria = tabuleiro.verificarVitoria()
                if(vitoria){
                    alert('Jogador ' + vitoria + ' venceu!')
                }

                trocarJogador()

                //jogada do bot
                if(jogadorAtual === 'O'){

                }
            }
            else{
                alert('Jogada Impossível!')
            }
        })
        tabuleiroElement.appendChild(e)
    }
}

// seleção do modo de jogo
const menuButtons = document.querySelectorAll(".menuButton")
menuButtons.forEach(e => e.addEventListener('click', (e) => {
    modo = e.target.getAttribute('value')
    document.querySelector('#menu').style.visibility = 'hidden'
    tabuleiroElement.style.visibility = 'visible';

    if(modo === 'jogador'){
        document.querySelector('#vez').style.visibility = 'visible'
    }

    tabuleiro.renderizar(tabuleiroElement)
}))

