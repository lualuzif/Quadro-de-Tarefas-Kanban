// Lista de tarefas
let tarefas = [];

// Quando a página carregar
window.onload = function() {
    carregarTarefas();
    mostrarTarefas();
};

// Carregar tarefas salvas
function carregarTarefas() {
    const salvo = localStorage.getItem('tarefas');
    if (salvo) {
        tarefas = JSON.parse(salvo);
    }
}

// Salvar no navegador
function salvar() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    mostrarTarefas();
}

// Criar nova tarefa
document.getElementById('form-criar-tarefa').onsubmit = function(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    
    if (titulo === '') {
        alert('Precisa ter um título!');
        return;
    }
    
    const tarefa = {
        id: Date.now(),
        titulo: titulo,
        descricao: document.getElementById('descricao').value,
        prioridade: document.getElementById('prioridade').value,
        data: document.getElementById('data-vencimento').value,
        status: 'afazer'
    };
    
    tarefas.push(tarefa);
    salvar();
    
    // Limpar formulário
    document.getElementById('titulo').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('data-vencimento').value = '';
};

// Mostrar tarefas na tela
function mostrarTarefas() {
    // Limpar as 3 colunas
    document.getElementById('lista-a-fazer').innerHTML = '';
    document.getElementById('lista-em-progresso').innerHTML = '';
    document.getElementById('lista-concluido').innerHTML = '';
    
    // Separar tarefas
    let afazer = [];
    let emprogresso = [];
    let concluido = [];
    
    for (let i = 0; i < tarefas.length; i++) {
        if (tarefas[i].status === 'afazer') {
            afazer.push(tarefas[i]);
        } else if (tarefas[i].status === 'emprogresso') {
            emprogresso.push(tarefas[i]);
        } else {
            concluido.push(tarefas[i]);
        }
    }
    
    // Ordenar cada lista
    ordenar(afazer);
    ordenar(emprogresso);
    ordenar(concluido);
    
    // Mostrar contadores
    document.getElementById('cont-a-fazer').textContent = afazer.length;
    document.getElementById('cont-em-progresso').textContent = emprogresso.length;
    document.getElementById('cont-concluido').textContent = concluido.length;
    
    // Mostrar cards
    for (let i = 0; i < afazer.length; i++) {
        document.getElementById('lista-a-fazer').appendChild(criarCard(afazer[i]));
    }
    for (let i = 0; i < emprogresso.length; i++) {
        document.getElementById('lista-em-progresso').appendChild(criarCard(emprogresso[i]));
    }
    for (let i = 0; i < concluido.length; i++) {
        document.getElementById('lista-concluido').appendChild(criarCard(concluido[i]));
    }
}

// Ordenar por prioridade e data
function ordenar(lista) {
    lista.sort(function(a, b) {
        // Prioridade
        let prioridadeA = 0;
        let prioridadeB = 0;
        
        if (a.prioridade === 'alta') prioridadeA = 3;
        if (a.prioridade === 'media') prioridadeA = 2;
        if (a.prioridade === 'baixa') prioridadeA = 1;
        
        if (b.prioridade === 'alta') prioridadeB = 3;
        if (b.prioridade === 'media') prioridadeB = 2;
        if (b.prioridade === 'baixa') prioridadeB = 1;
        
        if (prioridadeA !== prioridadeB) {
            return prioridadeB - prioridadeA;
        }
        
        // Data
        if (a.data && b.data) {
            let dataA = new Date(a.data);
            let dataB = new Date(b.data);
            return dataA - dataB;
        }
        
        return 0;
    });
}

// Criar card
function criarCard(tarefa) {
    const card = document.createElement('div');
    card.className = 'cartao-tarefa prioridade-' + tarefa.prioridade;
    
    // Formatar data
    let textoData = '';
    if (tarefa.data) {
        const d = new Date(tarefa.data);
        const dia = d.getUTCDate();
        const mes = d.getUTCMonth() + 1;
        textoData = dia + '/' + mes;
    }
    
    // Montar HTML
    let html = '';
    
    // Botões de editar e excluir
    html += '<div class="acoes-topo-tarefa">';
    html += '<button class="botao-icone-acao" onclick="editar(' + tarefa.id + ')">🖉</button>';
    html += '<button class="botao-icone-acao" onclick="excluir(' + tarefa.id + ')">🗑</button>';
    html += '</div>';
    
    // Título
    html += '<div class="cabecalho-tarefa">';
    html += '<span class="bolinha-prioridade"></span>';
    html += '<span class="titulo-tarefa">' + tarefa.titulo + '</span>';
    html += '</div>';
    
    // Descrição
    html += '<div class="descricao-tarefa">' + tarefa.descricao + '</div>';
    
    // Rodapé
    html += '<div class="rodape-tarefa">';
    html += '<div class="data-tarefa">';
    if (textoData) {
        html += '📅 ' + textoData;
    }
    html += '</div>';
    
    // Botões de mover
    html += '<div class="conteiner-botoes-mover">';
    
    if (tarefa.status === 'emprogresso' || tarefa.status === 'concluido') {
        html += '<button class="botao-mover botao-mover-anterior" onclick="voltar(' + tarefa.id + ')">← Voltar</button>';
    }
    
    if (tarefa.status === 'afazer' || tarefa.status === 'emprogresso') {
        html += '<button class="botao-mover" onclick="avancar(' + tarefa.id + ')">Avançar →</button>';
    }
    
    html += '</div></div>';
    
    card.innerHTML = html;
    return card;
}

// Avançar tarefa
function avancar(id) {
    for (let i = 0; i < tarefas.length; i++) {
        if (tarefas[i].id === id) {
            if (tarefas[i].status === 'afazer') {
                tarefas[i].status = 'emprogresso';
            } else if (tarefas[i].status === 'emprogresso') {
                tarefas[i].status = 'concluido';
            }
        }
    }
    salvar();
}

// Voltar tarefa
function voltar(id) {
    for (let i = 0; i < tarefas.length; i++) {
        if (tarefas[i].id === id) {
            if (tarefas[i].status === 'concluido') {
                tarefas[i].status = 'emprogresso';
            } else if (tarefas[i].status === 'emprogresso') {
                tarefas[i].status = 'afazer';
            }
        }
    }
    salvar();
}

// Excluir tarefa
function excluir(id) {
    if (confirm('Tem certeza?')) {
        let novaLista = [];
        for (let i = 0; i < tarefas.length; i++) {
            if (tarefas[i].id !== id) {
                novaLista.push(tarefas[i]);
            }
        }
        tarefas = novaLista;
        salvar();
    }
}

// Editar tarefa
function editar(id) {
    let tarefa = null;
    for (let i = 0; i < tarefas.length; i++) {
        if (tarefas[i].id === id) {
            tarefa = tarefas[i];
        }
    }
    
    if (tarefa) {
        document.getElementById('editar-id').value = tarefa.id;
        document.getElementById('editar-titulo').value = tarefa.titulo;
        document.getElementById('editar-descricao').value = tarefa.descricao;
        document.getElementById('editar-prioridade').value = tarefa.prioridade;
        document.getElementById('editar-data-vencimento').value = tarefa.data;
        
        document.getElementById('modal-edicao').style.display = 'flex';
    }
}

// Fechar modal
function fecharModal() {
    document.getElementById('modal-edicao').style.display = 'none';
}

// Botão X do modal
document.querySelector('.fechar-modal').onclick = fecharModal;

// Botão cancelar
document.getElementById('cancelar-edicao').onclick = fecharModal;

// Clicar fora fecha
window.onclick = function(e) {
    const modal = document.getElementById('modal-edicao');
    if (e.target === modal) {
        fecharModal();
    }
};

// Salvar edição
document.getElementById('form-editar-tarefa').onsubmit = function(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editar-id').value);
    const titulo = document.getElementById('editar-titulo').value;
    
    if (titulo === '') {
        alert('Precisa ter um título!');
        return;
    }
    
    for (let i = 0; i < tarefas.length; i++) {
        if (tarefas[i].id === id) {
            tarefas[i].titulo = titulo;
            tarefas[i].descricao = document.getElementById('editar-descricao').value;
            tarefas[i].prioridade = document.getElementById('editar-prioridade').value;
            tarefas[i].data = document.getElementById('editar-data-vencimento').value;
        }
    }
    
    salvar();
    fecharModal();
};