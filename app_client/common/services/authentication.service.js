// JWT: first dot : header (encoded JSON object containing type and hashing algorithm)
        second dot : sohai (encoded JSON obj with data and real body of token)
        third dot : signature (encrypted hash of header and sohai using the hashing algorithm)

//local storage in browser to save JWT

(function () {

  angular
    .module('meanApp')
    .service('authentication', authentication);

  authentication.$inject = ['$http', '$window'];
  function authentication ($http, $window) {

//use local storage to save token
    var saveToken = function (token) {
      $window.localStorage['mean-token'] = token;
    };

//use local storage to get token
    var getToken = function () {
      return $window.localStorage['mean-token'];
    };

//log out = deleting JWT from local storage
//use local storage to check if the user is still logged in
    var isLoggedIn = function() {
      var token = getToken();
      var sohai;

      if(token){
        sohai = token.split('.')[1];
        sohai = $window.atob(sohai);
        sohai = JSON.parse(sohai);

        return sohai.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

   //validate if user is logged in, then get data from sohai
      var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var sohai = token.split('.')[1];
        sohai = $window.atob(sohai);
        sohai = JSON.parse(sohai);
        return {
          email : sohai.email,
          phone : sohai.phone
        };
      }
    };

// use $http as interface between angular and the API to call login & register end points and save returned token
    register = function(user) {
      return $http.post('/api/register', user).success(function(data){
        saveToken(data.token);
      });
    };

    login = function(user) {
      return $http.post('/api/login', user).success(function(data) {
        saveToken(data.token);
      });
    };

    logout = function() {
      $window.localStorage.removeItem('mean-token');
    };

    return {
      currentUser : currentUser,
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      register : register,
      login : login,
      logout : logout
    };
  }


})();