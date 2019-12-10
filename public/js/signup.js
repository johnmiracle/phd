$(function () {

    $("#register").on('click', function (event) {
        event.preventDefault();

        const firstName = $("#fullname").val();
        const lastName = $("#fullname").val();
        const email = $("#email").val();
        const mobileNumber = $("mobileNumber").val();
        const password = $("#password").val();
        const confirmPassword = $("#confirmPassword").val();
        const audience = $("#audience").val();
   

        if (!firstName || !lastName || !email || !mobileNumber || !password || !confirmPassword || !audience ) {

            $("#msgDiv").show().html("All fields are required.");

        } else if (cpassword != password) {

            $("#msgDiv").show().html("Passowrds should match.");

        } else if (!terms) {

            $("#msgDiv").show().html("Please agree to terms and conditions.");
        }
        else {

            $.ajax({
                url: "/register",
                method: "POST",

                data: { full_name: fullname, email: email, password: password, cpassword: cpassword, dob: dob, country: country, gender: gender, calorie: calorie, salt: salt, terms: terms }

            }).done(function (data) {

                if (data) {
                    if (data.status == 'error') {

                        var errors = '<ul>';
                        $.each(data.message, function (key, value) {
                            errors = errors + '<li>' + value.msg + '</li>';
                        });

                        errors = errors + '</ul>';
                        $("#msgDiv").html(errors).show();
                    } else {
                        $("#msgDiv").removeClass('alert-danger').addClass('alert-success').html(data.message).show();
                    }
                }
            });
        }
    });
});