app.factory('ConfigService', function() {
  var config = {
      chaveAutenticacao: ''
  };

  return {
      getConfig: function() {
          return config;
      }
  };
});