const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function imprimirTabuleiro(tabuleiro){
    //FAZER - GENERALIZAR ESSA FUNÇÃO
    console.log('-------------')
    tabuleiro.forEach((linha, i, a) => {
        process.stdout.write('|')
        linha.forEach(e => {
            process.stdout.write(` ${e} ` +'|');
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
    const result = []
    //copiar tabuleiro
    for (const e of tabuleiro) {
        result.push([...e])
    }

    if(result[linha][coluna] !== '#') {
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
        if(new Set(tabuleiro[i]).size === 1 && tabuleiro[i][0] !== '#'){
            return tabuleiro[i][0]
        }
    }

    //colunas
    for (let i = 0; i < 3; i++) {
        const col = []
        for (let j = 0; j < 3; j++) {
            col.push(tabuleiro[j][i])
        }
        if(new Set(col).size === 1 && col[0] !== '#'){
            return col[0]
        }
    }

    //diagonal principal
    let dig = []
    for (let i = 0; i < 3; i++) {
        dig.push(tabuleiro[i][i])
    }
    if(new Set(dig).size === 1 && dig[0] !== '#') return dig[0]

    //diagonal secundária
    dig = []
    for (let i = 0; i < 3; i++) {
        dig.push(tabuleiro[i][tabuleiro.length-1-i])
    }
    if(new Set(dig).size === 1 && dig[0] !== '#') return dig[0]
}

function input(texto=''){
    return new Promise((resolve, reject) => {
        readline.question(texto, (i) => {
            resolve(i)
        })
    })
}

let tabuleiro = []

//gerar tabuleiro
for (let i = 0; i < 3; i++) {
    tabuleiro.push([])
    for (let j = 0; j < 3; j++) {
        tabuleiro[i].push('#')
    }
}

async function jogo(){
    let jogadorAtual = 'O'
    while(true) {
        let vitoria;

        imprimirTabuleiro(tabuleiro)
        while(true) {
            const pos = await input(`[${jogadorAtual}] Qual posição deseja jogar (Linha Coluna)? `)

            //validar input
            if(pos.replace(/\s/g, '').split('').length !== 2) {
                console.log("Jogada Impossível!")
                continue;
            }

            //validar jogada
            let new_tabuleiro = jogarTabuleiro(...pos.replace(/\s/g, '').split(''), jogadorAtual, tabuleiro)
            if (new_tabuleiro != null) {
                tabuleiro = new_tabuleiro
                break
            }

            console.log('Jogada Impossível!')
        }
        vitoria = verificarVitoria(tabuleiro)

        if(vitoria) {
            console.log(`VENCEDOR: ${vitoria}`)
            break
        }

        jogadorAtual = jogadorAtual === 'O' ? 'X' : 'O'
    }
}

jogo()