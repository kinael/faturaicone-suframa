localStorage.removeItem('historicoCalculos');

var historicoCalculos = [];
var modoEscuroAtivado = false;

function exibirModalSobre() {
    var modalSobre = document.getElementById('modalSobre');
    modalSobre.style.display = 'block';
}

function fecharModalSobre() {
    var modalSobre = document.getElementById('modalSobre');
    modalSobre.style.display = 'none';
}

function formatarDataHora() {
    var agora = new Date();
    return agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR');
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor);
}

function adicionarAoHistorico() {
    const dataHoraAtual = formatarDataHora();
    const valorMascarado = 'XXX,XXX';

    const itemMascarado = {
        valor: valorMascarado,
        data: dataHoraAtual,
        pis: valorMascarado,
        coffins: valorMascarado,
        calculoN: valorMascarado,
        importadostotal: valorMascarado,
        icmstotal: valorMascarado
    };

    historicoCalculos.unshift(itemMascarado);

    if (historicoCalculos.length > 5) {
        historicoCalculos.pop();
    }

    atualizarHistorico();
    salvarHistorico();
    document.querySelector('.historico').style.display = 'block';
}

function exibirDetalhesHistorico(index) {
    var historicoItem = historicoCalculos[index];
    var mensagem = `PIS: ${historicoItem.pis}\nCOFINS: ${historicoItem.coffins}\nICMS: ${historicoItem.calculoN}\nTOTAL IMPORTADOS: ${historicoItem.importadostotal}\nTOTAL ICMS: ${historicoItem.icmstotal}`;
    alert(mensagem);
}

function atualizarHistorico() {
    var lista = document.getElementById('historicoLista');
    lista.innerHTML = '';
    historicoCalculos.forEach(function (item, index) {
        var li = document.createElement('li');
        li.innerHTML = `<span class="valor">${item.valor}</span> <span class="data">${item.data}</span>`;
        li.classList.add(index === 0 ? 'ultimo-calculo' : 'calculo-anterior');
        li.style.pointerEvents = 'none'; 
        li.style.filter = 'blur(5px)'; 
        li.style.opacity = '0.5'; 
        lista.appendChild(li);
    });
}

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwz3TuUjHEvk_68Rdm05t8_vex7tOIHxoynyf09tuYUU_ekcRgBpJEIN5Zl8qb6Bpwg/exec"; 

function enviarEmailRegistroConsulta(payloadExtra = {}) {
  const payload = {
    subject: "Novo registro de consulta!",
    bodyText: "Novo registro de consulta!",
    bodyHtml: "<p><b>Novo registro de consulta!</b></p>",
    ...payloadExtra
  };

  fetch(WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {
    console.log("Solicitação de email enviada.");
  });
}


function calcularDesconto() {
    var valorTotal = parseFloat(document.getElementById('valorTotal').value.replace('.', '').replace(',', '.'));
    var valorTotalN = parseFloat(document.getElementById('valorTotalN').value.replace('.', '').replace(',', '.'));

    var resultado = document.getElementById('resultado');
    var valorDesconto = document.getElementById('valorDesconto');
    var pisResult = document.getElementById('pisResult');
    var coffinsResult = document.getElementById('coffinsResult');
    var calculoNResult = document.getElementById('calculoNResult');
    var importadostotalResult = document.getElementById('importadostotalResult');
    var icmstotalResult = document.getElementById('icmstotalResult');

    if (isNaN(valorTotal) || isNaN(valorTotalN)) {
        alert('Preencha todos os campos corretamente.');
        return false;
    }

    if (!isNaN(valorTotal) && !isNaN(valorTotalN)) {
        var pis = 999;
        var coffins = 999;
        var calculo_N = 999;
        var importadostotal = 999;
        var icmstotal = 999;

        var desconto = 999;
        resultado.textContent = formatarMoeda(desconto);
        valorDesconto.classList.remove('hidden');
        pisResult.textContent = formatarMoeda(pis);
        coffinsResult.textContent = formatarMoeda(coffins);
        calculoNResult.textContent = formatarMoeda(calculo_N);
        importadostotalResult.textContent = formatarMoeda(importadostotal);
        icmstotalResult.textContent = formatarMoeda(icmstotal);

        document.getElementById('pisValue').classList.remove('hidden');
        document.getElementById('coffinsValue').classList.remove('hidden');
        document.getElementById('calculoNValue').classList.remove('hidden');
        document.getElementById('importadostotalValue').classList.remove('hidden');
        document.getElementById('icmstotalValue').classList.remove('hidden');

        document.querySelectorAll('#valorDesconto, #pisValue, #coffinsValue, #calculoNValue, #importadostotalValue, #icmstotalValue').forEach(el => {
            el.classList.add('animated');
        });

        adicionarAoHistorico();


enviarEmailRegistroConsulta({
  valores: {
    desconto: document.getElementById('resultado').textContent,
    pis: document.getElementById('pisResult').textContent,
    cofins: document.getElementById('coffinsResult').textContent,
    icms: document.getElementById('calculoNResult').textContent,
    importados: document.getElementById('importadostotalResult').textContent,
    icmsTotal: document.getElementById('icmstotalResult').textContent,
    dataHora: new Date().toLocaleString('pt-BR')
  }
});


        document.querySelectorAll('#resultado, #pisResult, #coffinsResult, #calculoNResult, #importadostotalResult, #icmstotalResult')
            .forEach(el => el.classList.add('resultado-borrado'));

        if (!document.getElementById('avisoAcesso')) {
            const aviso = document.createElement('p');
            aviso.id = 'avisoAcesso';
            aviso.className = 'aviso-acesso';
            aviso.textContent = 'Este é apenas um exemplo! Para obter acesso completo ao sistema, entre em contato pelo e-mail wrubly@outlook.com e solicite informações sobre valores.';
            document.querySelector('.container').appendChild(aviso);
        }
    }
}

function limpar() {
    document.getElementById('valorTotal').value = '';
    document.getElementById('valorTotalN').value = '';

    document.getElementById('resultado').textContent = 'XXX,XXX';
    document.getElementById('pisResult').textContent = 'XXX,XXX';
    document.getElementById('coffinsResult').textContent = 'XXX,XXX';
    document.getElementById('calculoNResult').textContent = 'XXX,XXX';
    document.getElementById('importadostotalResult').textContent = 'XXX,XXX';
    document.getElementById('icmstotalResult').textContent = 'XXX,XXX';

    document.getElementById('valorDesconto').classList.add('hidden');
    document.getElementById('pisValue').classList.add('hidden');
    document.getElementById('coffinsValue').classList.add('hidden');
    document.getElementById('calculoNValue').classList.add('hidden');
    document.getElementById('importadostotalValue').classList.add('hidden');
    document.getElementById('icmstotalValue').classList.add('hidden');

    document.querySelectorAll('#resultado, #pisResult, #coffinsResult, #calculoNResult, #importadostotalResult, #icmstotalResult')
        .forEach(el => el.classList.remove('resultado-borrado'));

    const avisoExistente = document.getElementById('avisoAcesso');
    if (avisoExistente) avisoExistente.remove();

    document.querySelectorAll('#valorDesconto, #pisValue, #coffinsValue, #calculoNValue, #importadostotalValue, #icmstotalValue')
        .forEach(el => el.classList.remove('animated'));
}

function limparHistorico() {
    historicoCalculos = [];
    salvarHistorico();
    atualizarHistorico();
}

function salvarHistorico() {
    localStorage.setItem('historicoCalculos', JSON.stringify(historicoCalculos));
}

function salvarModoEscuro() {
    localStorage.setItem('modoEscuro', modoEscuroAtivado);
}

function carregarHistorico() {
    var historicoSalvo = localStorage.getItem('historicoCalculos');
    if (historicoSalvo) {
        historicoCalculos = JSON.parse(historicoSalvo);
        atualizarHistorico();
        document.querySelector('.historico').style.display = 'block';
    }
}

function carregarModoEscuro() {
    var modoEscuroSalvo = localStorage.getItem('modoEscuro');
    if (modoEscuroSalvo !== null) {
        modoEscuroAtivado = JSON.parse(modoEscuroSalvo);
        aplicarModoEscuro();
    }
}

function aplicarModoEscuro() {
    var body = document.body;
    body.classList.toggle('dark-mode', modoEscuroAtivado);

    var modoEscuroBtn = document.querySelector('.modo-escuro-btn');
    modoEscuroBtn.textContent = modoEscuroAtivado ? 'Modo Claro' : 'Modo Escuro';
}

function alternarModo() {
    modoEscuroAtivado = !modoEscuroAtivado;
    salvarModoEscuro();
    aplicarModoEscuro();
}

function adicionarBotaoMinimizar() {
    var tituloHistorico = document.querySelector('.titulo-historico');
    var botaoMinimizar = document.createElement('button');
    botaoMinimizar.id = 'toggleHistorico';
    botaoMinimizar.title = 'Minimizar o histórico';
    botaoMinimizar.textContent = '-';
    tituloHistorico.appendChild(botaoMinimizar);

    botaoMinimizar.addEventListener('click', function () {
        var infoHistorico = document.getElementById('infoHistorico');
        var historicoLista = document.getElementById('historicoLista');
        var limparHistoricoBtn = document.getElementById('limparHistorico');
        var isHistoricoVisible = infoHistorico.style.visibility !== 'hidden';

        infoHistorico.style.visibility = isHistoricoVisible ? 'hidden' : 'visible';
        infoHistorico.style.height = isHistoricoVisible ? '0' : 'auto';

        historicoLista.style.visibility = isHistoricoVisible ? 'hidden' : 'visible';
        historicoLista.style.height = isHistoricoVisible ? '0' : 'auto';

        limparHistoricoBtn.style.display = isHistoricoVisible ? 'none' : 'block';

        this.title = isHistoricoVisible ? 'Maximizar o histórico' : 'Minimizar o histórico';
        this.textContent = isHistoricoVisible ? '+' : '-';
    });
}

adicionarBotaoMinimizar();

document.getElementById('limparHistorico').addEventListener('click', function () {
    if (confirm("Tem certeza que deseja limpar o histórico?")) {
        limparHistorico();
    }
});

document.getElementById('valorTotal').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        calcularDesconto();
    }
});

document.getElementById('valorTotalN').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        calcularDesconto();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    carregarHistorico();
    carregarModoEscuro();
});
