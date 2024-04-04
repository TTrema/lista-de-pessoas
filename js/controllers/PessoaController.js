app.controller('PessoaController', function ($scope, $http, $routeParams, $location, ConfigService) {

    // Inicialização de variáveis de escopo
    $scope.pessoa = {};
    $scope.enderecoform = {};
    $scope.enderecos = {};

    // Obtém o ID da pessoa dos parâmetros da rota
    var pessoaId = $routeParams.pessoaId;

    // Obtém a chave de autenticação do serviço de configuração
    var chaveAutenticacao = ConfigService.getConfig().chaveAutenticacao;

    // Configuração do cabeçalho para todas as requisições HTTP
    var headersConfig = {
        headers: {
            'accept': 'text/plain',
            'Chave': chaveAutenticacao,
            'Content-Type': 'application/json'
        }
    };

    // FUNÇÕES PARA A PESSOA

    // Função para carregar os dados da pessoa
    $scope.carregarPessoa = function () {
        $http.get('https://www.selida.com.br/avaliacaotecnica/api/Pessoas/' + pessoaId, headersConfig)
            .then(function (response) {
                // Converte a data de nascimento para o formato Date
                response.data.data.dataNascimento = new Date(response.data.data.dataNascimento);
                $scope.pessoa = response.data.data;
            })
            .catch(function (error) {
                console.error('Erro ao carregar pessoa:', error);
            });
    };

    // Função que verifica a validade do formulario de dado da pessoa antes de adicionar
    $scope.validarDadosAdicionarPessoa = function() {
        // Marca todos os campos não preenchidos
        angular.forEach($scope.pessoafrm.$error.required, function (field) {
            field.$setDirty();
        });

        // Verificar se o formulário é válido antes de prosseguir
        if ($scope.pessoafrm.$valid) {
            $scope.adicionarPessoa();
        } else {
            console.log("Existem campos inválidos");
        }
    };

    // Função para adicionar uma nova pessoa
    $scope.adicionarPessoa = function () {
        // Monta e formata corretamente os dados da pessoa a ser adicionada
        var idade = parseInt($scope.pessoa.idade);
        var data = {
            nome: $scope.pessoa.nome,
            dataNascimento: $scope.pessoa.dataNascimento,
            idade: idade,
            email: $scope.pessoa.email,
            telefone: $scope.pessoa.telefone,
            celular: $scope.pessoa.celular
        };

        // Envia uma requisição POST para adicionar a pessoa
        $http.post('https://www.selida.com.br/avaliacaotecnica/api/Pessoas', data, headersConfig)
            .then(function (response) {
                console.log('Pessoa adicionada com sucesso:', response.data);
                // Redireciona para a página de edição da pessoa recém-adicionada
                $location.path('/editarpessoa/' + response.data.data);
            })
            .catch(function (error) {
                console.error('Erro ao adicionar pessoa:', error);
            });
    };

    // Função que verifica a validade do formulario de dado da pessoa antes de editar
    $scope.validarDadosEditarPessoa = function() {
        // Marcar todos os campos não preenchidos
        angular.forEach($scope.pessoafrm.$error.required, function (field) {
            field.$setDirty();
        });

        // Verificar se o formulário é válido antes de prosseguir
        if ($scope.pessoafrm.$valid) {
            $scope.editarDadosPessoa();
        } else {
            console.log("Existem campos inválidos");
        }
    };


    // Função para editar os dados de uma pessoa existente
    $scope.editarDadosPessoa = function () {
        // Monta os dados atualizados e corretamente formatados da pessoa
        var idade = parseInt($scope.pessoa.idade);
        var data = {
            nome: $scope.pessoa.nome,
            dataNascimento: $scope.pessoa.dataNascimento,
            idade: idade,
            email: $scope.pessoa.email,
            telefone: $scope.pessoa.telefone,
            celular: $scope.pessoa.celular
        };

        // Envia uma requisição PUT para atualizar os dados da pessoa
        $http.put('https://www.selida.com.br/avaliacaotecnica/api/Pessoas/' + pessoaId, data, headersConfig)
            .then(function (response) {
                console.log('Pessoa atualizada com sucesso:', response.data);
            })
            .catch(function (error) {
                console.error('Erro ao atualizar pessoa:', error);
            });
    };

    // FUNÇÕES PARA O ENDEREÇO

    // Função para carregar os endereços da pessoa
    $scope.carregarEnderecos = function () {
        $http.get('https://www.selida.com.br/avaliacaotecnica/api/Endereco/GetAll/' + pessoaId, headersConfig)
            .then(function (response) {
                $scope.enderecos = response.data.data;
            })
            .catch(function (error) {
                console.error('Erro ao carregar endereços:', error);
            });
    };

    // Função que verifica a validade do formulario de dado do endereço antes de adicionar 
    $scope.validarDadosAdicionarEndereco = function() {
        // Marcar todos os campos não tocados
        angular.forEach($scope.enderecofrm.$error.required, function (field) {
            field.$setDirty();
        });

        // Verificar se o formulário é válido antes de prosseguir
        if ($scope.enderecofrm.$valid) {
            $scope.adicionarEndereco();
        } else {
            console.log("Existem campos inválidos");
        }
    };

    // Função para adicionar um novo endereço para a pessoa
    $scope.adicionarEndereco = function () {
        // Monta e formata corretamente os dados do novo endereço
        var endereco_pessoaId = parseInt(pessoaId);
        var data = {
            pessoaId: endereco_pessoaId,
            logradouro: $scope.enderecoform.logradouro,
            numero: $scope.enderecoform.numero,
            bairro: $scope.enderecoform.bairro,
            cidade: $scope.enderecoform.cidade,
            uf: $scope.enderecoform.uf
        };

        // Envia uma requisição POST para adicionar o novo endereço
        $http.post('https://www.selida.com.br/avaliacaotecnica/api/Endereco', data, headersConfig)
            .then(function (response) {
                console.log('Endereço adicionado com sucesso:', response.data);
                // Recarrega a lista de endereços após a adição de um novo
                $scope.carregarEnderecos();
            })
            .catch(function (error) {
                console.error('Erro ao adicionar endereço:', error);
            });
    };

    // Função para confirmar a exclusão do endereço
    $scope.confirmarExcluirEndereco = function (endereco) {
        var confirmacao = confirm("Tem certeza que deseja excluir " + endereco.logradouro + endereco.numero + "?");
        if (confirmacao) {
            $scope.excluirEndereco(endereco);
        }
    };

    // Função para excluir um endereço da pessoa
    $scope.excluirEndereco = function (endereco) {
        $http.delete('https://www.selida.com.br/avaliacaotecnica/api/Endereco/' + endereco.enderecoId, headersConfig)
            .then(function (response) {
                // Remove o endereço excluído da lista de endereços
                var index = $scope.enderecos.indexOf(endereco);
                if (index !== -1) {
                    $scope.enderecos.splice(index, 1);
                }
                console.log('Endereço excluído com sucesso:', endereco);
            })
            .catch(function (error) {
                console.error('Erro ao excluir endereço:', error);
            });
    };

    // FUNÇÔES GERAIS
 
    // Função para voltar para a página de lista de pessoas
    $scope.irParaLista = function () {
        $location.path('/lista');
    };

    // Função para permitir apenas a entrada de números em um campo
    $scope.apenasNumeros = function (event) {
        var keyCode = event.keyCode;
        if (keyCode < 48 || keyCode > 57) {
            event.preventDefault();
        }
    };

    // Verifica se há um ID de pessoa nos parâmetros da rota e carrega os dados, se necessário
    if ($routeParams.pessoaId) {
        var pessoaId = $routeParams.pessoaId;
        $scope.carregarPessoa();
        $scope.carregarEnderecos();
    }

});
