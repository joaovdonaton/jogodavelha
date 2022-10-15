function imprimirTabuleiro(tabuleiro){
    //FAZER - GENERALIZAR ESSA FUNÇÃO
    console.log('-------------')
    tabuleiro.forEach((linha, i, a) => {
        process.stdout.write('|')
        linha.forEach(e => {
            process.stdout.write(` ${e} ` +'|'); //imprimir sem dar newline
        })
        console.log( i === a.length-1 ? '\n-------------': '\n|---|---|---|')
    })
}

const tabuleiro = []

//gerar tabuleiro
for (let i = 0; i < 3; i++) {
    tabuleiro.push([])
    for (let j = 0; j < 3; j++) {
        tabuleiro[i].push('#')
    }
}

imprimirTabuleiro(tabuleiro)