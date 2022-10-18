/* FAZER
* Melhorar validação do input
* Generalizar função de imprimir tabuleiro
* Deixar função perguntar mais arrumada
* */

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function imprimirTabuleiro(tabuleiro){
    console.log('-------------')
    tabuleiro.forEach((linha, i, a) => {
        process.stdout.write('|')
        linha.forEach(e => {
            process.stdout.write(` ${e ? e: '#'} ` +'|');
        })
        console.log( i === a.length-1 ? '\n-------------': '\n|---|---|---|')
    })
}


/**
 * @param {string|number} linha index da linha
 * @param {string|number} coluna index da coluna
 * @param {string} char quem está fazendo a jogada
 * @param {[]}tabuleiro array 2D do tabuleiro
 */
function jogarTabuleiro(linha, coluna, char, tabuleiro){
    const result = copyTabuleiro(tabuleiro)

    if(result[linha][coluna] !== null) {
        return null
    } //retorna null caso não seja possível inserir jogada

    result[linha][coluna] = char.toUpperCase();
    return result
}

/**
 * @param {[]} tabuleiro array 2D do tabuleiro
 * @return retorna undefined caso não há nenhuma condição de vitória. Retorna o char vencedor ('X' ou 'O') caso
 * haja vencedor
 */
function verificarVitoria(tabuleiro){
    //linhas
    for (let i = 0; i < 3; i++) {
        if(new Set(tabuleiro[i]).size === 1 && tabuleiro[i][0]){
            return tabuleiro[i][0]
        }
    }

    //colunas
    for (let i = 0; i < 3; i++) {
        const col = []
        for (let j = 0; j < 3; j++) {
            col.push(tabuleiro[j][i])
        }
        if(new Set(col).size === 1 && col[0]){
            return col[0]
        }
    }

    //diagonal principal
    let dig = []
    for (let i = 0; i < 3; i++) {
        dig.push(tabuleiro[i][i])
    }
    if(new Set(dig).size === 1 && dig[0]) return dig[0]

    //diagonal secundária
    dig = []
    for (let i = 0; i < 3; i++) {
        dig.push(tabuleiro[i][tabuleiro.length-1-i])
    }
    if(new Set(dig).size === 1 && dig[0]) return dig[0]
}

function deuVelha(tabuleiro){
    for (const linha of tabuleiro) {
        for(const e of linha){
            if(e === null) return false;
        }
    }
    return true;
}

function input(texto=''){
    return new Promise((resolve, reject) => {
        readline.question(texto, (i) => {
            resolve(i)
        })
    })
}

function copyTabuleiro(tabuleiro){
    const result = []
    //copiar tabuleiro
    for (const e of tabuleiro) {
        result.push([...e])
    }

    return result
}

let tabuleiro = []

//gerar tabuleiro
for (let i = 0; i < 3; i++) {
    tabuleiro.push([])
    for (let j = 0; j < 3; j++) {
        tabuleiro[i].push(null)
    }
}

let historicTabuleiro = [copyTabuleiro(tabuleiro)]

async function jogo(){
    let jogadorAtual = 'O'
    while(true) {
        let vitoria;

        imprimirTabuleiro(tabuleiro)
        while(true) {
            const pos = await input(`[${jogadorAtual}] Qual posição deseja jogar (LINHA COLUNA ou -QUANTIDADE_DE_JOGADAS_PARA_VOLTAR)?`)

            //validar input
            if(pos.startsWith('-')){
                const voltar = Number.parseInt(pos.replace('-', ''))
                console.log(`Voltando ${voltar} jogadas...`)
                console.log(historicTabuleiro[historicTabuleiro.length-voltar])
                tabuleiro = copyTabuleiro(historicTabuleiro[historicTabuleiro.length-voltar])
                historicTabuleiro = historicTabuleiro.slice(0, tabuleiro.length-voltar-1)
                break
            }
            if(pos.replace(/\s/g, '').split('').length !== 2) {
                console.log("Jogada Impossível!")
                continue;
            }

            //validar jogada
            let new_tabuleiro = jogarTabuleiro(...pos.replace(/\s/g, '').split(''), jogadorAtual, tabuleiro)
            if (new_tabuleiro != null) {
                historicTabuleiro.push(copyTabuleiro(tabuleiro))
                tabuleiro = new_tabuleiro
                break
            }

            console.log('Jogada Impossível!')
        }
        vitoria = verificarVitoria(tabuleiro)

        if(vitoria) {
            console.log(`VENCEDOR: ${vitoria}`)
            imprimirTabuleiro(tabuleiro)
            break
        }

        else if(deuVelha(tabuleiro)){
            console.log("DEU VELHA!")
            imprimirTabuleiro(tabuleiro)
            break;
        }

        jogadorAtual = jogadorAtual === 'O' ? 'X' : 'O'
    }
}

jogo()