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

    result[linha][coluna] = char.toUpperCase();
    return result
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

imprimirTabuleiro(tabuleiro)

async function pergunta(){
    const pos1 = await input('#O Qual posição deseja jogar (Linha Coluna)? ')
    tabuleiro = jogarTabuleiro(...pos1.split(' '), 'O', tabuleiro)
    const pos2 = await input('#X Qual posição deseja jogar (Linha Coluna)? ')
    tabuleiro = jogarTabuleiro(...pos2.split(' '), 'X', tabuleiro)

    imprimirTabuleiro(tabuleiro)
}

pergunta()