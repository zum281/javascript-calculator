const input_field = $("#screen");
const prev_span = $("#prev");

let initial_result = 0;
let theme = "light";

let completed;
let wait_for_input = true;
let initial_operation = true;
let op = "";
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var theme = getCookie("theme");
    if (theme == "light") {
        $("#dark-theme-icon").hide();
        $("#light-theme-icon").show();

        $("#calculator").removeClass("dark-theme");
        $("#calculator").addClass("light-theme");
        $("#footer").removeClass("dark-theme");
        $("#footer").addClass("light-theme");
    } else {
        $("#light-theme-icon").hide();
        $("#dark-theme-icon").show();
        $("#calculator").removeClass("light-theme");
        $("#calculator").addClass("dark-theme");
        $("#footer").removeClass("light-theme");
        $("#footer").addClass("dark-theme");
    }
}

$(document).ready(function () {
    input_field.val("");
    $("#prev").text("");
    checkCookie();
    $("#switch-theme").click(function () {
        if ($("#dark-theme-icon").is(":hidden")) {
            $("#light-theme-icon").hide();
            $("#dark-theme-icon").show();

            $("#calculator").removeClass("light-theme");
            $("#calculator").addClass("dark-theme");
            $("#footer").removeClass("light-theme");
            $("#footer").addClass("dark-theme");

            theme = "dark";
        } else {
            $("#dark-theme-icon").hide();
            $("#light-theme-icon").show();

            $("#calculator").removeClass("dark-theme");
            $("#calculator").addClass("light-theme");
            $("#footer").removeClass("dark-theme");
            $("#footer").addClass("light-theme");

            theme = "light";
        }

        setCookie("theme", theme, 30);
    });
    $(".btn").click(function () {
        $(this).animate(
            {
                opacity: 0.6,
            },
            300
        );
        $(this).animate(
            {
                opacity: 1,
            },
            300
        );
    });
    // CALCULATOR
    $("#AC").click(function () {
        initial_result = 0;
        prev_span.text("");
        input_field.text("");
        wait_for_input = true;
        op = "";
        initial_operation = true;
    });

    $("#c").click(function () {
        input_field.text("");
    });

    $(".transparent-btn").click(function () {
        let x = $(this).attr("id");
        if (x != ".") {
            if (completed) {
                prev_span.text("");
                input_field.text(x);
                wait_for_input = false;
                completed = false;
            } else if (wait_for_input) {
                input_field.text(x);
                wait_for_input = false;
            } else if (input_field.text() == "0") {
                input_field.text(x);
                wait_for_input = false;
            } else {
                let input = input_field.text();
                input_field.text(input + x);
            }
        } else {
            let input = input_field.text();
            if (!wait_for_input && !input.includes(".")) {
                input_field.text(input + x);
            }
        }
    });
    $(".blue-btn").click(function () {
        if (completed) {
            prev_span.text("");
        }
        let x = numeral(initial_result).value();
        let y = numeral(input_field.text()).value();
        if (initial_operation) {
            op = $(this).attr("id");
            initial_result = y;
            initial_operation = false;
            move_above(op);
        } else {
            op = prev_span.text().slice(-1);
            let res = calculate_result(x, y, op);
            initial_result = res;
            move_above($(this).attr("id"));
            display_result(res);
        }
        wait_for_input = true;
        completed = false;
    });

    $(".dark-blue-btn").click(function () {
        let op = prev_span.text().slice(-1);
        let x = numeral(initial_result).value();
        let y = numeral(input_field.text()).value();
        let res = calculate_result(x, y, op);
        move_above("=");
        display_result(res);
        completed = true;
        initial_result = 0;
        op = "";
        initial_operation = true;
    });

    $("#plus-minus").click(function () {
        let x = numeral(input_field.text()).value();
        x *= -1;
        display_result(x);
    });

    $("#\\%").click(function () {
        let x = numeral(input_field.text()).value();
        x /= 100;
        display_result(x);
    });
});

$(document).keyup(function (e) {
    let k = e.key;
    if (k == "Enter") {
        $(".dark-blue-btn").trigger("click");
    } else if (k == "Backspace") {
        $("#c").trigger("click");
    } else if (k == "Escape") {
        $("#AC").trigger("click");
    } else {
        let id = "#";
        if ("0123456789".includes(k)) {
            id = id + k;
        } else {
            id = id + "\\" + k;
        }
        $(id).trigger("click");
    }
    console.log(k);
});
function display_result(res) {
    input_field.text(res);
    wait_for_input = true;
}

function move_above(op) {
    let prev_text = prev_span.text();
    if (prev_text == "") {
        initial_result = numeral(input_field.text()).value();
        prev_span.text(input_field.text() + op);
    } else {
        prev_span.text(prev_text + input_field.text() + op);
    }
}

function calculate_result(num1, num2, op) {
    let decimals = 0;
    let result;
    if ((num1 * 10) % 10 != 0 || (num2 * 10) % 10 != 0) {
        let dec1 = 0;
        let dec2 = 0;
        if ((num1 * 10) % 10 != 0) dec1 = num1.toString().split(".")[1].length;
        if ((num2 * 10) % 10 != 0) dec2 = num2.toString().split(".")[1].length;

        if (op == "+" || op == "-") {
            decimals = Math.max(dec1, dec2);
        }
        if (op == "*") {
            decimals = Math.floor(dec1 + dec2);
        }
        if (decimals > 12) {
            decimals = 9;
        }
    }
    switch (op) {
        case "+":
            result = num1 + num2;
            break;
        case "-":
            result = num1 - num2;
            break;
        case "*":
            result = num1 * num2;
            break;
        case "/":
            return num1 / num2;
    }

    if (result == 0) return 0;

    return result.toFixed(decimals);
}
