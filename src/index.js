import './index.scss';

const Demo = class {
  chatGPTHist = [];

  constructor() {
    this.el = document.querySelector('#app');
  }

  async blockchainRequest() {
    return fetch('https://blockchain.info/tobtc?currency=EUR&value=1', {
      method: 'GET'
    });
  }

  async agifyRequest(name) {
    const response = await fetch(`https://api.agify.io?name=${name}&country_id=FR`, {
      method: 'GET'
    });
    const data = await response.json();
    return data.age;
  }

  async chatGPTRequest(inputText) {
    // Je n'ai pas pu tester si le chat fonctionnait car
    // je n'avais plus de crédit sur mon compte openAI
    this.chatGPTHist.push([{ role: 'user', content: inputText }]);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: this.chatGPTHist
      })
    });
    const data = await response.json();
    return data.choices[0].text.trim();
  }

  addMessageEvent() {
    const button = document.getElementById('sendBtn');
    const input = document.getElementById('inputMessage');
    input.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        button.click();
      }
    });
    button.addEventListener('click', async () => {
      if (input.value !== '') {
        button.disabled = 'true';
        button.innerHTML = '<i class="bi bi-three-dots"></i>';
        this.sendMessage(input.value);
        input.value = '';
        const messageContainer = document.getElementById('messageContainer');
        messageContainer.scrollIntoView(false);
      }
    });
  }

  sendMessage(content) {
    let command = 'chat';
    const button = document.getElementById('sendBtn');
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML += this.renderMessage(content, 'user');
    if (content.startsWith('/')) {
      command = content.split(' ')[0].replace('/', '');
    }
    setTimeout(() => {
      switch (command) {
        case 'chat':
          this.chatGPTRequest(content).then((response) => {
            messageContainer.innerHTML += this.renderMessage(response, 1);
            messageContainer.scrollIntoView(false);
          }, () => {
            messageContainer.innerHTML += this.renderMessage('Le chat est actuellement indisponible, utilisez la commande /help pour découvrir mes autres fonctionnalités', 1);
            messageContainer.scrollIntoView(false);
          });
          break;
        case 'hello':
          messageContainer.innerHTML += this.renderMessage('Bonjour à toi', 1);
          messageContainer.innerHTML += this.renderMessage('Hello !', 2);
          messageContainer.innerHTML += this.renderMessage('Salutation jeune entrepreneur', 3);
          messageContainer.scrollIntoView(false);
          break;
        case 'age':
          if (content.split(' ').length > 1) {
            const name = content.split(' ')[1];
            this.agifyRequest(name).then((response) => {
              messageContainer.innerHTML += this.renderMessage(`Je pense que ${name} a ${response} ans`, 2);
              messageContainer.scrollIntoView(false);
            }, () => {
              messageContainer.innerHTML += this.renderMessage('Je ne connais pas ce nom, désolé', 2);
              messageContainer.scrollIntoView(false);
            });
          }
          break;
        case 'bitcoin':
          this.blockchainRequest().then((response) => {
            response.text().then((text) => {
              messageContainer.innerHTML += this.renderMessage(`Actuellement, 1€ vaut ${text} Bitcoin`, 3);
              messageContainer.scrollIntoView(false);
            });
          }, () => {
            messageContainer.innerHTML += this.renderMessage('Le cours du Bitcoin est actuellement indisponible', 3);
            messageContainer.scrollIntoView(false);
          });
          break;
        case 'help':
          messageContainer.innerHTML += this.renderMessage('<p>Voici la liste des commandes disponibles :</p>'
              + '<p>/chat : Permet de discuter avec ChatGPT (c\'est également la commande par défaut)</p>'
              + '<p>/hello : Permet de dire bonjour à tous les bots</p>'
              + '<p>/age {nom} : Prédit l\'âge d\'une personne compte tenu de son nom</p>'
              + '<p>/bitcoin : Donne la valeur actuelle en Bitcoin de 1€</p>'
              + '<p>/help : Permet d\'afficher ce message</p>', 1);
          messageContainer.scrollIntoView(false);
          break;
        default:
          messageContainer.innerHTML += this.renderMessage(`La commande '/${command}' n'est pas reconnu, vous pouvez utiliser la commande /help pour découvrir toutes mes fonctionnalités`, 1);
      }
      button.disabled = '';
      button.innerHTML = '<i class="bi bi-send"></i>';
    }, 1000);
  }

  renderMessage(content, sender) {
    let position = 'end';
    let color = 'light';
    let leftDisplay = 'none';
    let rightDisplay = 'flex';
    if (sender > 0) {
      position = 'start';
      color = 'dark';
      leftDisplay = 'flex';
      rightDisplay = 'none';
    }

    return `
<div class="row">
  <div class="col-1">
    <img class="avatar" alt="Team icon" src="https://www.gravatar.com/avatar/${sender}?d=monsterid&f=y" style="display: ${leftDisplay}" />
  </div>
  <div id="chat-messages" class="col-10 alert alert-${color} text-${position}"  style="border-radius: 30px">
    ${content}
  </div>
  <div class="col-1">
    <img class="avatar" alt="Team icon" src="https://www.gravatar.com/avatar/${sender}?d=monsterid&f=y" style="display: ${rightDisplay}" />
  </div>
</div>
    `;
  }

  render() {
    return `
<div class="container mt-3">
  <div class="row vh-100">
    <div class="col-3 list-group">
      <a href="#" class="list-group-item">
        <img class="avatar" alt="Team icon" src="https://www.gravatar.com/avatar/1?d=monsterid&f=y" /> Bot 1        
      </a>
      <a href="#" class="list-group-item">
        <img class="avatar" alt="Team icon" src="https://www.gravatar.com/avatar/2?d=monsterid&f=y" /> Bot 2
      </a>
      <a href="#" class="list-group-item">
        <img class="avatar" alt="Team icon" src="https://www.gravatar.com/avatar/3?d=monsterid&f=y" /> Bot 3
      </a>
    </div>
    <div class="col-9">
      <div class="card">
        <div class="card-header">
          ChatBot.io
        </div>
        <div class="card-body">
          <div class="container-fluid overflow-auto mb-0" style="height: 80vh">
            <div id="messageContainer" class="row">
                <div class="col-12">
                  <div class="row mb-3">
                    Bienvenue dans le chatbot de l'application ChatBot.io
                  </div>
                </div>  
            </div>
          </div>
        </div>
        <div class="row m-3">
          <div class="col-11">
            <input type="text" class="form-control" id="inputMessage" placeholder="Envoyer un message...">
          </div>
          <div class="col-1">
            <button class="btn btn-primary" id="sendBtn" type="submit"><i class="bi bi-send"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    `;
  }

  run() {
    this.el.innerHTML = this.render();
    this.addMessageEvent();
  }
};

const demo = new Demo();

demo.run();
