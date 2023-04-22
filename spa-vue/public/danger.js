const xhr = new XMLHttpRequest();
const url = 'http://localhost:8000/api/contato';

xhr.open('GET', url);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.setRequestHeader('Authorization', `Bearer ${window.localStorage.getItem('token')}`);

xhr.onreadystatechange = function() {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    window.alert("deu certo!");
  } else {
    window.alert("ERRADO!");
  }
};

const formData = 'nome=Hacker&email=hacker%40hacker.com';
xhr.send(formData);
