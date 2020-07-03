var canvas, canvasContext;
var bolaX = 75;
var bolaY = 75;
var bolaVelocidadeX = 5;
var bolaVelocidadeY = 7;

const BARRA_LARGURA = 100;
const BARRA_ESPESSURA = 10;
const BARRA_BORDA = 60;
var barraX = 400;

var mouseX = 0;
var mouseY = 0;

const BLOCO_W = 80;
const BLOCO_H = 20;
const BLOCO_COlS = 10;
const BLOCO_ROWS = 14;
const BLOCO_GAP = 2;
var blocoGrid = new Array(BLOCO_COlS * BLOCO_ROWS);
// var blocoCores = ['blue','red','yellow','pink'];


window.onload = function () {
    canvas = document.querySelector('#gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPorSegundo = 30;
    setInterval(atualizarAll,1000/framesPorSegundo);

    canvas.addEventListener('mousemove',atualizarMouse);

    blocoReset();
    resetarBola();
}

function atualizarMouse(evt) {
    //pega a posição do mouse no retangulo
    var retangulo = canvas.getBoundingClientRect();
    var raiz = document.documentElement;

    //pega pelo pixel //verifica se vai sair do canvas
    mouseX = evt.clientX - retangulo.left - raiz.scrollLeft;
    mouseY = evt.clientY - retangulo.top - raiz.scrollTop;

    barraX = mouseX - BARRA_LARGURA/2; //centraliza o mouse na barra


    corTexto(mouseX+","+mouseY,mouseX,mouseY,'yellow');
}

function atualizarAll() {
    moverAll();
    desenharAll();
}

function resetarBola() {
    bolaX = canvas.width/2;
    bolaY = canvas.height/2;
}

function moverAll() {
    bolaX += bolaVelocidadeX;
    bolaY += bolaVelocidadeY;

    //fazer a velocidade ficar negativa para voltar a bola
    if (bolaX > canvas.width) { // margem direita
        bolaVelocidadeX *= -1;
    }

    if (bolaX < 0) { // margem esquerda
        bolaVelocidadeX *= -1;
    }

    if (bolaY > canvas.height) { // margem parte inferior
        resetarBola();
        // bolaVelocidadeY *= -1;
    }

    if (bolaY < 0) { // margem superior
        bolaVelocidadeY *= -1;
    }

    // definindo a localização das margens
    var barraTopoY = canvas.height - BARRA_BORDA;
    var barraInferiorY = barraTopoY + BARRA_ESPESSURA;
    var barraEsquerdaX = barraX;
    var barraDireitaX = barraEsquerdaX + BARRA_LARGURA;

    //para saber pelo ponteiro do mouse a posição dos blocos
    var bolaBlocoCol = Math.floor(bolaX / BLOCO_W);
    var bolaBlocoLine = Math.floor(bolaY / BLOCO_H);
    var blocoIndexUnderBola= linhaColToArrayIndex(bolaBlocoCol,bolaBlocoLine);
    corTexto(bolaBlocoCol+','+bolaBlocoLine+':'+blocoIndexUnderBola,mouseX,mouseY,'yellow')

    if(bolaBlocoCol >= 0 && bolaBlocoCol < BLOCO_COlS &&
        bolaBlocoLine >= 0 && bolaBlocoLine < BLOCO_ROWS){

        if(blocoGrid[blocoIndexUnderBola]) {
            blocoGrid[blocoIndexUnderBola] = false;
            bolaVelocidadeY *= -1;
        }

    }

    //caso a bola toque nas margens ela irá refletir
    if( bolaY > barraTopoY &&
        bolaY < barraInferiorY &&
        bolaX > barraEsquerdaX &&
        bolaX < barraDireitaX){

        bolaVelocidadeY *= -1;

        var centroDaBarra = barraX + BARRA_LARGURA/2; // pega o centro da barra
        var distDaBolaCentro = bolaX - centroDaBarra; //distância da bola em relação ao centro da barra
        bolaVelocidadeX = distDaBolaCentro * 0.35; //fica mais rápida quando toca nas bordas
    }
}

function blocoReset() {
    for(var x=0;x<BLOCO_COlS * BLOCO_ROWS;x++){
        blocoGrid[x] = true;
    }
}

/**
 *  separar as linhas das colunas
 */
function linhaColToArrayIndex(col,row) {
    return col + BLOCO_COlS * row;
}

function desenharBlocos() {
    for (var eachRow=0;eachRow<BLOCO_ROWS;eachRow++) {
        for (var eachCol = 0; eachCol < BLOCO_COlS; eachCol++) {

            var arrayIndex = linhaColToArrayIndex(eachCol,eachRow);
            
            if (blocoGrid[arrayIndex]) {
                corRetangulo(BLOCO_W * eachCol,  BLOCO_H*eachRow, BLOCO_W - BLOCO_GAP,
                    BLOCO_H - BLOCO_GAP, 'blue');
            }
        }
    }
}

function desenharAll() {
    corRetangulo(0,0,canvas.width,canvas.height,'black'); //limpa a tela
    corCirculo(bolaX,bolaY,10,'white'); //desenha a bola
    corRetangulo(barraX,canvas.height - BARRA_BORDA, BARRA_LARGURA,BARRA_ESPESSURA)//desenha a barra
    desenharBlocos();
}

function corRetangulo(topEsquerdoX,topoDireitoY, larguraCaixa,alturaCaixa,cor) {
    canvasContext.fillStyle = cor;
    canvasContext.fillRect(topEsquerdoX,topoDireitoY, larguraCaixa,alturaCaixa,);
}

function corCirculo(centroX,centroY, radio,cor) {
    canvasContext.fillStyle = cor;
    canvasContext.beginPath();
    canvasContext.arc(centroX,centroY,radio,0,Math.PI*2,true);
    canvasContext.fill();
}

function corTexto(palavra,textX,textY,cor) {
    canvasContext.fillStyle = cor;
    canvasContext.fillText(palavra,textX,textY);
}
