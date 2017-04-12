(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService','$sessionStorage','$localStorage'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService,$sessionStorage,$localStorage) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(username, password, iterations, callback) {

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
            /*$timeout(function () {
                var response;
                UserService.GetByUsername(username)
                    .then(function (user) {
                        if (user !== null && user.password === password) {
                            response = { success: true };
                        } else {
                            response = { success: false, message: 'Username or password is incorrect' };
                        }
                        callback(response);
                    });
            }, 1000);*/

            var password  = password;

            var mypbkdf2 = new PBKDF2(password, "ENPAST_SALT", "100", 32);


            var status_callbacklogin = function(percent_done) {
                    
                };

            var result_callbacklogin = function(key) {

                    var clientSidePassword    =  key; 
                    var clientSideNewPassword =  clientSidePassword;                  

                        /* Use this for real authentication
                         ----------------------------------------------*/
                        $http.post('/api/check_user', { email: username, PASSWORD_HASH: clientSideNewPassword })
                           .then(function (response) {
                               
                               var return_code = response.data.return_code;

                                    callback(response);
                              

                           });
            
            };

            mypbkdf2.deriveKey(status_callbacklogin, result_callbacklogin);

        
        } // end AuthenticationService


        function SetCredentials(username, password) {           

             //  encoding service used by AuthenticationService   "container decryption key"                     
                
                var localStorageString = password+''+username.toLowerCase();
                      
                      //  $localStorage.containerDecryptionKey    = SHA256(localStorageString);

                var authdata =  $sessionStorage.containerDecryptionKey  = SHA256(localStorageString);

                alert("container decryption key - "+$sessionStorage.containerDecryptionKey);
            // end authdata "container decryption key" 

                    $rootScope.globals = {
                        currentUser: {
                            username: username,
                            authdata: authdata
                        }
                    };

            // set default auth header for http requests
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;

            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $sessionStorage.containerDecryptionKey  = "";
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }
 

})();