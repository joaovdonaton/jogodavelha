const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const tabuleiro = {
    tabuleiro: [[null, null, null], [null, null, null], [null, null, null]],
    historico: [],
    imprimir: function () {
        console.log('-------------')
        this.tabuleiro.forEach((linha, i, a) => {
            process.stdout.write('|')
            linha.forEach(e => {
                process.stdout.write(` ${e ? e : '#'} ` + '|');
            })
            console.log(i === a.length - 1 ? '\n-------------' : '\n|---|---|---|')
        })
    },
    jogar: function (linha, coluna, char) {
        if (this.tabuleiro[linha][coluna] === null) {
            this.historico.push(this.copyTabuleiro(this.tabuleiro))
            this.tabuleiro[linha][coluna] = char;
            return true
        }

        return false
    },
    verificarVitoria: function () {
        //linhas
        for (let i = 0; i < 3; i++) {
            if (new Set(this.tabuleiro[i]).size === 1 && this.tabuleiro[i][0]) {
                return this.tabuleiro[i][0]
            }
        }

        //colunas
        for (let i = 0; i < 3; i++) {
            const col = []
            for (let j = 0; j < 3; j++) {
                col.push(this.tabuleiro[j][i])
            }
            if (new Set(col).size === 1 && col[0]) {
                return col[0]
            }
        }

        //diagonal principal
        let dig = []
        for (let i = 0; i < 3; i++) {
            dig.push(this.tabuleiro[i][i])
        }
        if (new Set(dig).size === 1 && dig[0]) return dig[0]

        //diagonal secundária
        dig = []
        for (let i = 0; i < 3; i++) {
            dig.push(this.tabuleiro[i][this.tabuleiro.length - 1 - i])
        }
        if (new Set(dig).size === 1 && dig[0]) return dig[0]
    },
    deuVelha: function () {
        for (const linha of this.tabuleiro) {
            for (const e of linha) {
                if (e === null) return false;
            }
        }
        return true;
    },
    copyTabuleiro: function (t) {
        const result = []
        for (const e of t) {
            result.push([...e])
        }

        return result
    },
    jogadasDisponiveis: function () {
        const result = []

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!this.tabuleiro[i][j]) {
                    result.push([i, j])
                }
            }
        }

        return result
    },
    simularJogada: function (l, c, char){
        const copia = this.copyTabuleiro(this.tabuleiro)
        this.jogar(l, c, char)
        this.historico.pop() //remover jogada simulada do historico
        const vitoria = this.verificarVitoria()
        this.tabuleiro = copia
        return vitoria
    }

}

function input(texto = '') {
    return new Promise((resolve, reject) => {
        readline.question(texto, (i) => {
            resolve(i)
        })
    })
}

const dificuldades = {
    0: 'EASY',
    1: 'NORMAL',
    2: 'HARD'
}
let dificuldade = 'EASY';

async function jogo() {
    console.log("-------------JOGO DA VELHA-------------")
    console.log("[1] Jogador X Jogador")
    console.log("[2] Jogador X Computador")

    const opcao = await input('Escolha uma opção: ')


    console.log(`-------------COMO JOGAR-----------
Digite a linha e a coluna (começando em zero): 
exemplo: 10 (linha 2, coluna 1)

Ou digite - (menos) seguido da quantidade de jogadas que deseja voltar, para voltar no tempo
exemplo: -5 (voltar 5 jogadas)
---------------------------------------------`)
    if (opcao === '2') {
        console.log("[1] Easy")
        console.log("[2] Normal")
        console.log("[3] Hard")

        dificuldade = dificuldades[parseInt(await input('Escolha uma opção: ')) - 1]
    }

    let jogadorAtual = 'X'
    while (true) { //realizar prompt de jogada e ir para o próximo jogador a cada loop
        let vitoria;

        tabuleiro.imprimir()

        if (opcao === '2' && jogadorAtual === 'O') { //fazer jogada do bot
            console.log("Fazendo jogada do bot [O]...")
            const jogadasDisp = tabuleiro.jogadasDisponiveis()

            if (dificuldade === 'EASY') {
                const [l, c] = jogadasDisp[Math.floor(Math.random() * jogadasDisp.length)]

                tabuleiro.jogar(l, c, jogadorAtual)
            }
            /*
            * faz uma jogada se ela for vencer pro bot, caso contrário, jogada aleatória (ou bloquear jogada no hard)
            * */
            else if (dificuldade === 'NORMAL' || dificuldade === 'HARD') {
                let venci = false;
                for (const [l, c] of jogadasDisp) {
                    if(tabuleiro.simularJogada(l, c, jogadorAtual)){
                        tabuleiro.jogar(l, c, jogadorAtual)
                        venci = true
                        break
                    }
                }

                let bloqueado = false;
                if (!venci) {
                    if (dificuldade === 'HARD') { //bloquear jogada do outro
                        for (const [l, c] of jogadasDisp) {
                            if(tabuleiro.simularJogada(l, c, jogadorAtual === 'O' ? 'X' : 'O', tabuleiro)){
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
        } else {
            while (true) {

                const pos = await input(`[${jogadorAtual}] Qual posição deseja jogar (LINHA COLUNA ou -QUANTIDADE_DE_JOGADAS_PARA_VOLTAR)?`)

                //validar input
                if (pos.startsWith('-')) {
                    const voltar = Number.parseInt(pos.replace('-', ''))

                    if (voltar > tabuleiro.historico.length) {
                        console.log(`Não é possível voltar ${voltar} jogadas, pois só foram feitas ${tabuleiro.historico.length} jogadas`)
                    } else {
                        console.log(`Voltando ${voltar} jogadas...`)
                        tabuleiro.tabuleiro = tabuleiro.copyTabuleiro(tabuleiro.historico[tabuleiro.historico.length - voltar])
                        tabuleiro.historico = tabuleiro.historico.slice(0, tabuleiro.historico.length - voltar)
                    }
                    tabuleiro.imprimir()
                    continue
                }
                if (pos.replace(/\s/g, '').split('').length !== 2) {
                    console.log("Jogada Impossível!")
                    continue;
                }

                //validar jogada
                if(!tabuleiro.jogar(...pos.replace(/\s/g, '').split(''), jogadorAtual)) console.log('Jogada Impossível!')
                else{break}
            }
        }
        vitoria = tabuleiro.verificarVitoria()

        if (vitoria) {
            console.log(`VENCEDOR: ${vitoria}`)
            tabuleiro.imprimir()
            break
        } else if (tabuleiro.deuVelha()) {
            console.log("DEU VELHA!")
            tabuleiro.imprimir()
            break;
        }

        jogadorAtual = jogadorAtual === 'O' ? 'X' : 'O'
    }
}

jogo()
