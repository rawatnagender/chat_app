Template.register.events({
    'submit form': function(event){
      event.preventDefault();
      // alert("register");
      /*var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Accounts.createUser({
      email: email,
      password: password
      }, function(error){
          if(error){
              console.log(error.reason); // Output error if registration fails
          } else {
              Router.go("home"); // Redirect user if registration succeeds
          }
      });*/

    }
});

Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});


Template.login.events({
    'submit form': function(event){
       /* event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
          if(error){
              console.log(error.reason);
          } else {
              Router.go("home");
          }
        });
        */

    }
});


//  Dont need to rewrite same code.....instead we can write code once in a default validator by updating
 // it($.validator.setDefaults)...and use .validate simply for both cases
// Template.login.onRendered(function(){
//     $('.login').validate({
//         rules: {
//             email: {
//                 required: true,
//                 email: true
//             },
//             password: {
//                 required: true,
//                 minlength: 6
//             }
//         },
//         messages: {
//             email: {
//                 required: "You must enter an email address.",
//                 email: "You've entered an invalid email address."
//             },
//             password: {
//                 required: "You must enter a password.",
//                 minlength: "Your password must be at least {0} characters."
//             }
//         }
//     });
// });


// Template.register.onRendered(function(){
//     $('.register').validate({
//         rules: {
//             email: {
//                 required: true,
//                 email: true
//             },
//             password: {
//                 required: true,
//                 minlength: 6
//             }
//         },
//         messages: {
//             email: {
//                 required: "You must enter an email address.",
//                 email: "You've entered an invalid email address."
//             },
//             password: {
//                 required: "You must enter a password.",
//                 minlength: "Your password must be at least {0} characters."
//             }
//         }
//     });
// });

$.validator.setDefaults({
    rules: {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minlength: 6
        }
    },
    messages: {
        email: {
            required: "You must enter an email address.",
            email: "You've entered an invalid email address."
        },
        password: {
            required: "You must enter a password.",
            minlength: "Your password must be at least {0} characters."
        }
    }
});



Template.login.onRendered(function(){
     var validator = $('.login').validate({
        submitHandler: function(event){
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();
            Meteor.loginWithPassword(email, password, function(error){
                if(error){
                    if(error.reason == "User not found"){
                        validator.showErrors({
                            email: "That email doesn't belong to a registered user."
                        });
                    }
                    if(error.reason == "Incorrect password"){
                        validator.showErrors({
                            password: "You entered an incorrect password."
                        });
                    }
                }
                 else {
                    var currentRoute = Router.current().route.getName();
                    if(currentRoute == "login"){
                        Router.go("home");
                    }
                }
            });
        }
    });
});

Template.register.onRendered(function(){
     var validator = $('.register').validate({
        submitHandler: function(event){
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();
            Accounts.createUser({
                email: email,
                password: password
            }, function(error){
              if(error){
                if(error.reason == "Email already exists."){
                    validator.showErrors({
                        email: "That email already belongs to a registered user."
                    });
                }
              }
              else {
                    Router.go("home");
                }
            });
        }
    });
});
