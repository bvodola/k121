const angular = require('angular');
const DOMAIN = process.env.NODE_ENV === 'development' ?
  'http://localhost:3000':'http://k121.mybluemix.net';
console.log(process.env.NODE_ENV, DOMAIN);

angular.module('k121App', [])
  .controller('UsersController', function($scope, $http) {

    // ****************
    // Users Controller
    // ****************

    var usersCtrl = this;
    usersCtrl.userList = [];
    usersCtrl.showAlert = false;
    usersCtrl.newUser = {
      name: '',
      email: ''
    }

    // getUsers()
    // Retorna array com todos os usuários
    usersCtrl.getUsers = function() {
      $http.get(DOMAIN+'/api/users/', {}).then(
        function(res) {
          usersCtrl.userList = res.data;
        },
        function(res) {
          console.log(res);
        }
      );
    }

    // createUser()
    // Cria um novo usuário
    usersCtrl.createUser = function() {
      $http.post(DOMAIN + '/api/users/', usersCtrl.newUser ,{}).then(
        function(res) {
          usersCtrl.userList.push(res.data);
          usersCtrl.newUser = { name: '', email: '' }
        },
        function(res) {
          console.log(res);
        }
      );
    }

    // editUser()
    // Edita dados de  um usuário
    usersCtrl.editUser = function(user) {
      $http.put(DOMAIN + '/api/users/'+user._id, user ,{}).then(
        function(res) {
          console.log(res);
          usersCtrl.toggleEdit(user);
        },
        function(res) {
          console.log(res);
        }
      );
    }

    // deleteUser()
    // Exclui um usuário
    usersCtrl.deleteUser = function(user) {
      $http.delete(DOMAIN + '/api/users/'+user._id ,{}).then(
        function(res) {
          usersCtrl.userList = usersCtrl.userList.filter(function(v,i,a) {
            if(v._id === user._id) return false;
            else return true
          })
        },
        function(res) {
          console.log(res);
        }
      );
    }

    // toggleEdit()
    // Alterna o modo de edição dos dados de um usuário
    usersCtrl.toggleEdit = function(user) {
      if(typeof user._show == 'undefined')
        user._show = false;
      user._show = !user._show;
    }

    // setAlert()
    // Define o estado do alert, se é ou não mostrado na tela (true/false)
    usersCtrl.setAlert = function(state) {
      usersCtrl.showAlert = state;
    }

    // draw()
    // Faz o sorteio do amigo secreto entre os usuários
    usersCtrl.draw = function() {
      $http.get(DOMAIN + '/api/users/draw/' ,{}).then(
        function(res) {
          usersCtrl.setAlert(true);
          console.log(res);
        },
        function(res) {
          console.log(res);
        }
      );
    }

    // Chama a função getUsers() para popular a UI.
    usersCtrl.getUsers();
  })
