(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};


        var base_url =  'https://localhost';
   
        service.Create          = Create;
        service.Resetpassword   = Resetpassword;
        service.Userinfo        = Userinfo;

        return service;


        function Create(user) {

            return $http.post('/api/create_user', user).then(handleSuccess, handleError('Error creating user'));
        }
        
        function Resetpassword(user) {

            return $http.post('/api/resetpass', user).then(handleSuccess, handleError('Error creating user'));
        } 

        function Userinfo(user) {

            return $http.post('/api/check_user', user).then(handleSuccess, handleError('Data not return'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
