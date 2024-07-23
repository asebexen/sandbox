class ElementRef {
  children = [];
  eventListeners = [];

  constructor(id) {
    this.id = id;
    this.ref = document.querySelector(`#${this.id}`);

    if (!this.ref) {
      console.warn(`Unable to find reference to element with id '#${this.id}'`);
    }
  }

  addEventListener(eventName, handler) {
    if (!this.ref) {
      console.error('Cannot attach listener to non-existent element.');
      return this;
    }
    this.ref.addEventListener(eventName, handler);
    this.eventListeners.push({eventName, handler});
    return this;
  }

  removeEventListener(eventName) {
    const toRemove = this.eventListeners.find(listener => listener.eventName === eventName);
    if (!toRemove) {
      console.warn(`Attempt to remove event '${eventName}' from ElementRef '#${this.id}'.`);
      return this;
    }
    this.ref.removeEventListener(toRemove.eventName, toRemove.handler);
  }

  appendChild(element) {
    this.children.push(element);
    this.ref.appendChild(element);
    return this;
  }

  delete() {
    this.children.forEach(child => child.delete());
    this.eventListeners.forEach(listener => this.removeEventListener(listener.eventName, listener.handler));
    this.delete();
  }
}

class Model {
  constructor(name, prices) {
    this.name = name
    this.prices = prices;  // Price per: [1m input, 1m output, 1m input batch, 1m output batch]
  }

}
const MODELS = [
  new Model('gpt-4o', [5.00, 15.00, 2.50, 5.00]),
  new Model('gpt-3.5-turbo-0125', [0.50, 1.50, 0.25, 0.75]),
  new Model('gpt-3.5-turbo-instruct', [1.50, 2.00, 0.75, 1.00])
];

class Request {
  constructor(requestDiv, model, batched, numInput, numOutput) {
    this.element = Request.createElement(requestDiv);
    this.model = model;
    this.batched = batched;
    this.numInput = numInput;
    this.numOutput = numOutput;
  }

  static createElement(requestDiv) {
    const div = document.createElement('div');

    const modelSelect = document.createElement('input');
    modelSelect.type = 'select';
    for (model of MODELS) {
      const option = document.createElement('option');
      
    }

    const batchedCheck = document.createElement('input');
    const 
  }
}

const state = {};


function newQuery() {
  if (!state.queryDiv) {
    console.error('Failed to create query: state.queryDiv is undefined.');
    return;
  }
  state.queries = state.queries ?? [];
  console.log('new query');
}

function newRequest() {
  if (!state.requestDiv) {
    console.error('Failed to create request: state.requestDiv is undefined.');
  }
  state.requests = state.requests ?? [];
  state.requests.push()
}

function createElementRefs() {
  Object.assign(state, {
    queryButton: new ElementRef('new-query').addEventListener('click', newQuery),
    queryDiv: new ElementRef('queries'),
    requestButton: new ElementRef('new-request').addEventListener('click', newRequest),
    requestDiv: new ElementRef('requests'),
  });
}

function main() {
  createElementRefs();
}

window.addEventListener('load', main);