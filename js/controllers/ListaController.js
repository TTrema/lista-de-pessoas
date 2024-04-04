app.controller('ListaController', function ($scope, $http, $location, ConfigService) {

    // Obtém a chave de autenticação do serviço de configuração
    var chaveAutenticacao = ConfigService.getConfig().chaveAutenticacao;

    // Configuração do cabeçalho para todas as requisições HTTP
    var headersConfig = {
        headers: {
            'accept': 'text/plain',
            'Chave': chaveAutenticacao
        }
    };

    // Função para carregar a lista com todas as pessoas
    $scope.carregarPessoas = function () {   
        $http.get('https://www.selida.com.br/avaliacaotecnica/api/Pessoas/GetAll', headersConfig)
            .then(function (response) {
                $scope.pessoas = response.data.data;
            })
            .catch(function (error) {
                console.error('Erro ao carregar pessoas:', error);
            });
    };

    // Chama a função para carregar a lista de pessoas ao carregar a página
    $scope.carregarPessoas();

    // Função para confirmar se deseja a exclusão da pessoa
    $scope.confirmarExcluirPessoa = function (pessoa) {
        var confirmacao = confirm("Tem certeza que deseja excluir " + pessoa.nome + "?");
        if (confirmacao) {
            $scope.excluirPessoa(pessoa);
        }
    };

    // Função para excluir uma pessoa
    $scope.excluirPessoa = function (pessoa) {
        $http.delete('https://www.selida.com.br/avaliacaotecnica/api/Pessoas/' + pessoa.pessoaId, headersConfig)
            .then(function (response) {
                // Remove a pessoa excluída da lista
                var index = $scope.pessoas.indexOf(pessoa);
                if (index !== -1) {
                    $scope.pessoas.splice(index, 1);
                }
                console.log('Pessoa excluída com sucesso:', pessoa);
            })
            .catch(function (error) {
                console.error('Erro ao excluir pessoa:', error);
            });
    };

    // Função para ir para a página de cadastro
    $scope.irParaCadastro = function () {
        $location.path('/cadastro');
    };    

    // Função para ir para a página de edição da pessoa
    $scope.irParaEditarPessoa = function (pessoa) {
        $location.path('/editarpessoa/' + pessoa.pessoaId); 
    };  
    

});
