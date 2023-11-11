import { Negociacao } from "./negociacao";

export class Negociacoes {
    private negociacoes: Array<Negociacao> = [];

    adiciona(negociacao: Negociacao){
        this.negociacoes.push(negociacao);
    }

    lista(): ReadonlyArray<Negociacao>{
        return this.negociacoes;
        // return [...this.negociacoes]; Em javascript puro
    }
}

// Bem legal a visualização dos dados pelo typescript:
// const negociacoes = new Negociacoes();
// negociacoes.lista().forEach(n=> {
//     n.data;
//     n.quantidade;
//     n.valor;
//     n.volume;
// })