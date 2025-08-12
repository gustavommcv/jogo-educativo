# Jogo Educativo - Ciclo da Água

## Descrição

Jogo educativo interativo desenvolvido para a **Arco Educação** como parte do teste prático para Analista de Desenvolvimento Pleno. O jogo simula a criação de um ODA (Objeto Digital de Aprendizagem) interativo baseado em conteúdo pedagógico estruturado.

## Objetivo

Criar um jogo educativo simples sobre o "Ciclo da Água" que demonstre:

1. **Interatividade pedagógica** através de drag-and-drop
2. **Estrutura reutilizável** alimentada por arquivo JSON externo
3. **Automação de conteúdo** para geração em larga escala

## Funcionalidades Implementadas

### **Requisitos Obrigatórios **

#### 1. **Tela Inicial**

- Título do jogo carregado dinamicamente do JSON
- Botão "Iniciar" para começar o jogo

#### 2. **Tela do Jogo**

- **4 alvos fixos** com nomes das etapas do ciclo da água
- **4 blocos arrastáveis** com descrições detalhadas
- **Sistema de drag-and-drop** funcional e responsivo
- **Validação inteligente**:
  - **Correto**: Fundo verde + bloqueio de movimento
  - **Incorreto**: Retorno automático + feedback visual

#### 3. **Sistema de Pontuação**

- **Contador em tempo real** (X/4 pontos)
- **Atualização automática** conforme acertos

#### 4. **Tela Final**

- Mensagem de parabéns personalizada
- Pontuação total e porcentagem de acerto
- Botão "Jogar Novamente" para reiniciar

### **Funcionalidades Extras Implementadas**

#### **Temporizador Configurável**

- **Tempo padrão**: 60 segundos
- **Constante centralizada**: `GAME_TIME_SECONDS` para manutenção
- **Sistema de tempo esgotado** com opções de retry

#### **Sistema de Reset Inteligente**

- **Embaralhamento automático** dos blocos a cada rodada
- **Reset completo** quando o tempo acabar
- **Opções flexíveis**: tentar novamente ou voltar ao início

#### **Feedback Visual**

- **Estados visuais distintos** para cada situação
- **Transições suaves** entre estados
- **Indicadores claros** de progresso

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com variáveis CSS e responsividade
- **JSON**: Estrutura de dados externa e reutilizável

## Estrutura do Projeto

```
📁 raiz/
├── 📄 index.html          # Estrutura principal do jogo
├── 📄 script.js           # Lógica completa do jogo
├── 📄 styles.css          # Estilos e responsividade
├── 📄 jogo.json           # Dados estruturados do jogo
├── 📁 assets/             # Recursos estáticos
│   └── favicon.ico        # Ícone do jogo
└── 📄 README.md           # Este arquivo
```

## Como Jogar

### **1. Início**

- Clique em "Iniciar" na tela inicial
- O jogo carrega com 60 segundos de tempo

### **2. Objetivo**

- **Arraste os blocos** para os targets corretos na ordem:
  - `Evaporação` → Primeira posição
  - `Condensação` → Segunda posição
  - `Precipitação` → Terceira posição
  - `Infiltração` → Quarta posição

### **3. Validação**

- **Clique em "Verificar"** quando todos os targets estiverem preenchidos
- **Blocos corretos**: Ficam verdes e travados
- **Blocos incorretos**: Voltam automaticamente para posição original

### **4. Conclusão**

- **Sucesso**: Tela final com pontuação e parabéns
- **Tempo esgotado**: Opções para tentar novamente ou voltar ao início

## 🔧 Configuração e Personalização

### **Alterar Tempo do Jogo**

```javascript
// No arquivo script.js, linha ~25
const GAME_TIME_SECONDS = 60; // Mude para qualquer valor
```

### **Modificar Conteúdo**

```json
// No arquivo jogo.json
{
  "titulo": "Seu Título Aqui",
  "etapas": [
    {
      "nome": "Nome da Etapa",
      "descricao": "Descrição detalhada da etapa"
    }
  ]
}
```

### **Adicionar Mais Etapas**

- Simplesmente adicione mais objetos no array `etapas`
- O sistema se adapta automaticamente
- Pontuação máxima é calculada dinamicamente

## Responsividade

- **Elementos adaptáveis** para diferentes tamanhos de tela
- **Grid flexível** que se ajusta ao conteúdo

## Características de Design

### **Sistema de Cores**

- **Primária**: Azul (#4a90e2) para elementos principais
- **Sucesso**: Verde (#28a745) para acertos
- **Erro**: Vermelho (#dc3545) para incorretos
- **Aviso**: Amarelo (#ffcc00) para feedback

### **Estados Visuais**

- **Vazio**: Borda tracejada cinza
- **Ocupado**: Borda sólida azul
- **Correto**: Borda sólida verde
- **Incorreto**: Borda sólida vermelha

## Como Executar

### **1. Clone o Repositório**

```bash
git clone [URL_DO_REPOSITORIO]
cd jogo-educativo
```

### **2. Servidor Local**

```bash
# Live server
live-server .

# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

### **3. Acesse no Navegador**

http://localhost:8000

## 👨‍💻 Desenvolvedor

**Nome**: [Gustavo Monnerat]  
**Cargo**: Candidato a Analista de Desenvolvimento Pleno

## 📄 Licença

Este projeto foi desenvolvido como teste técnico para a **Arco Educação**. Todos os direitos reservados.
