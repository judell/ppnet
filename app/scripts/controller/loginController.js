'use strict';

angular.module('PPnet')
  .controller('LoginController', function($scope, $location, $routeParams, ppnetUser) {

    // Login a user with random credentials. Only for Debugging.
    $scope.login = function() {
      var newUser = {
        id: Math.ceil(Math.random() * 10000).toString(),
        name: 'User' + Math.ceil(Math.random() * 10000),
        provider: 'local'
      };
      ppnetUser.logout();
      if (ppnetUser.login(newUser)) {
        $location.path('');
      }
    };

    $scope.enableSimpleLogin = true;
    $scope.simpleLogin = function() {
      var newUser = {
        id: $scope.simple.id.toString(),
        name: $scope.simple.name,
        provider: 'simple'
      };
      ppnetUser.logout();
      if (ppnetUser.login(newUser)) {
        $location.path('');
      }
    };

    // Logs the User out if second url parameter is 'logout'
    if ($routeParams.task === 'logout') {
      hello().logout();
      ppnetUser.logout();
      $location.path('login');
    }
    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    var redirect_uri = '';
    if (app) {
      // PhoneGap application
      redirect_uri = 'http://www.tobias-rotter.de/ppnet/redirect.html';
    } else {
      // Web page
      redirect_uri = 'index.html';
    }

    // API Keys for oAuth2 Provider initialized with Hello.js
    hello.init({
      facebook: '758204300873538',
      fiware: '320',
      google: '971631219298-dgql1k3ia1qpkma6lfsrnt2cjevvg9fm.apps.googleusercontent.com',
      github: 'c6f5cd8c081419b33623',
      windows: '0000000048117AB3'
    }, {
      redirect_uri: redirect_uri
    });

    // Event Listener for the oAuth2 Provider response
    hello.on('auth.login', function(auth) {;
      // call user information, for the given network
      hello(auth.network).api('/me').success(function(r) {

        var userdata = {
          id: auth.network + '_' + r.id,
          name: r.name,
          provider: auth.network
        };
        ppnetUser.login(userdata);
      });
    });

  });