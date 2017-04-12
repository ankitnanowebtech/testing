(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService','$sessionStorage','$localStorage','$routeParams','$http'];
    function LoginController($location, AuthenticationService, FlashService,$sessionStorage,$localStorage,$routeParams,$http) {
        var vm = this;

        vm.login = login;

        (function initController() {

            vm.iterations =  1000;
           
            // reset login status

            if($routeParams.vid)
            {
                 $http.post('/api/everification', { vtoken: $routeParams.vid })
                           .then(function (response) {

                               FlashService.Success(response.data.msg,true);
                               var return_code = response.data.return_code;                             

                           });
            }
            else
            {            
                AuthenticationService.ClearCredentials();
            }

        })();

        function login() {
            vm.dataLoading = true;
            

            AuthenticationService.Login(vm.username, vm.password, vm.iterations, function (response) {

                console.info(response);

                if (response.data.return_code=='1000') {

                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {

                    FlashService.Error(response.data.msg);
                    vm.dataLoading = false;
                }
            });

        };
    }

})();
