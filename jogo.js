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

function jogarTabuleiro(linha, coluna, char, tabuleiro){
    const result = []
    //copiar tabuleiro
    for (const e of tabuleiro) {
        result.push([...e])
    }

    if(result[linha][coluna] !== '#') return null //retorna null se não for possível inserir jogada

    result[linha][coluna] = char.toUpperCase();
    return result
}

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

async function pergunta(){
    while(true) {
        let vitoria;

        imprimirTabuleiro(tabuleiro)
        const pos1 = await input('[O] Qual posição deseja jogar (Linha Coluna)? ')
        tabuleiro = jogarTabuleiro(...pos1.replace(' ', '').split(''), 'O', tabuleiro)
        vitoria = verificarVitoria(tabuleiro)

        if(vitoria) {
            console.log(`VENCEDOR: ${vitoria}`)
            break
        }

        imprimirTabuleiro(tabuleiro)
        const pos2 = await input('[X] Qual posição deseja jogar (Linha Coluna)? ')
        tabuleiro = jogarTabuleiro(...pos2.replace(' ', '').split(''), 'X', tabuleiro)
        vitoria = verificarVitoria(tabuleiro)


        if(vitoria) {
            console.log(`VENCEDOR: ${vitoria}`)
            break
        }
    }
}

pergunta()