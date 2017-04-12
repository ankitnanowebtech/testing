(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$location','UserService', '$rootScope','AuthenticationService','$sessionStorage'];
    function HomeController($location,UserService, $rootScope,AuthenticationService,$sessionStorage) {
        
            var vm = this;
            vm.user = null;        
            
            initController();

        function initController() {

            loadCurrentUser();   
        }        

        function loadCurrentUser() {     

            if($rootScope.globals.currentUser)
            {       
                vm.username = $rootScope.globals.currentUser.username;
            }           
        }

     
    }

})();