var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/lista', {
      templateUrl: 'views/lista.html',
      controller: 'ListaController'
    })
    .when('/cadastro', {
      templateUrl: 'views/cadastropessoa.html',
      controller: 'PessoaController'
    })
    .when('/editarpessoa/:pessoaId', { 
      templateUrl: 'views/editarpessoa.html',
      controller: 'PessoaController'
    })
    .otherwise({
      redirectTo: '/lista'
    });
});
