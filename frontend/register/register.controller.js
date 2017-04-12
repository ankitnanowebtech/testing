(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function RegisterController(UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.register = register;
        vm.resetpassword = resetpassword;

         if($rootScope.globals.currentUser)
            {       
                vm.username = $rootScope.globals.currentUser.username;
            }


// RESET PASSWORD WORKING

    function resetpassword() {

                if(vm.newpassword != vm.cnewpassword)
                {
                     FlashService.Error("New Password and New Confirm Password Not Matched !");
                     return false;
                }

                var password        = vm.password;
                var newpassword     = vm.newpassword;
                var cnewpassword    = vm.cnewpassword;
                var iterations      = vm.iterations;
                var niterations      = vm.niterations;

        // check OLD Password is correct entered or not

              var mypbkdf2OLD = new PBKDF2(password, "ENPAST_SALT", iterations, 32);

            var status_callback = function(percent_done) {                    
                };

            var result_callback = function(key) {

                    // Hit Service For Check OLD PASSWORD CORRECT OR NOT

                var clientSidePassword    =  key; 
                var clientSideNewPassword =  clientSidePassword;

            var requestdata = {PASSWORD_HASH:""+clientSideNewPassword+"",email:$rootScope.globals.currentUser.username};

                UserService.Userinfo(requestdata)
                    .then(function (response) {

                        
                    if (response.return_code=='1000') {                             
                            

            // working for password   RESET         

                    var mypbkdf2NEW = new PBKDF2(newpassword, "ENPAST_SALT", iterations, 32);

                        var status_callback_new = function(percent_done) {                    
                            };

                        var result_callback_new = function(key) {
                        
                var clientSidePasswordNew    =  key; 
                var RESET_HASH_Password =  clientSidePasswordNew;

                var verification_token = 1;

                var requestdata = {RESET_HASH_Password:""+RESET_HASH_Password+"",PASSWORD_HASH:""+clientSideNewPassword+"",email:""+$rootScope.globals.currentUser.username+""};

                         

                    vm.dataLoading = true;

                 UserService.Resetpassword(requestdata)
                .then(function (newresponse) {                   


                    cosole.log(newresponse);

                    alert(newresponse.return_code);
                    
                    if (newresponse.return_code=='1000') {

                        FlashService.Success('Successfully reset your password.', true);
                        
                        vm.dataLoading = false;

                        $location.path('/reset');
                    }                  
                    else {

                        FlashService.Error(newresponse.msg);
                        vm.dataLoading = false;
                    }
                });

                };

            mypbkdf2NEW.deriveKey(status_callback_new, result_callback_new);

                   // end new password set                  

                             }
                             else 
                             {                                
                    FlashService.Error(response.msg);
                    vm.dataLoading = false;
                                
                             }                       

                        
                    });    


                    // END

                };

              mypbkdf2OLD.deriveKey(status_callback, result_callback);

        // end check OLD Password is correct entered or not         


        }


// END RESET PASSWORD WORKING

// REGISTRATION WORKING

        function register() {

            if(vm.user.password != vm.user.cpassword)
            {
                 FlashService.Error("Password and Confirm Password Not Matched !");
                 return false;
            }

            var firstname  = vm.user.firstname;
            var lastname   = vm.user.lastname;
            var password   = vm.user.password;
            var username   = vm.user.email;
            var iterations = vm.user.iteration;

            var mypbkdf2 = new PBKDF2(password, "ENPAST_SALT", iterations, 32);


            var status_callback = function(percent_done) {
                    
                };
            var result_callback = function(key) {
                        
                    var clientSidePassword    =  key; 
                    var clientSideNewPassword =  clientSidePassword;

             
                    var requestdata = {firstname:""+firstname+"",lastname:""+lastname+"",email:""+username+"",PASSWORD_HASH:""+clientSideNewPassword+""};

                    vm.dataLoading = true;

                UserService.Create(requestdata)
                .then(function (response) {
                   

                    //if (response.success) {
                    if (response.return_code=='1000') {

                        FlashService.Success('Register successfully. Please verify your email.', true);
                        $location.path('/login');
                    }
                    else if(response.return_code=='1005')
                    {
                        FlashService.Error("Field Data Missing");
                        vm.dataLoading = false;
                    }
                     else if(response.return_code=='1006')
                    {
                        FlashService.Error("Email already exists");
                        vm.dataLoading = false;
                    }
                    else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });

                };

            mypbkdf2.deriveKey(status_callback, result_callback);


        }

// END REGISTRATION WORKING

    }

})();
