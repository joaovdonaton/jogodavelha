const tabuleiro = {
    tabuleiro: [[null, null, null], [null, null, null], [null, null, null]],
    historico: [],
    renderizar: function (tabuleiroElemento) {
        for(let child of tabuleiroElemento.children){
            const [l, c] = [parseInt(child.getAttribute('linha')), parseInt(child.getAttribute('coluna'))]
            child.innerText = this.tabuleiro[l][c] ? this.tabuleiro[l][c] : ' '
        }
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

export default tabuleiro