function setCookie(cookie_name, cvalue, exdays)
{
    // Creamos la cookie con la info especificada
    var cookie_$ = "";
    var dfin_ = new Date();
    dfin_.setTime(dfin_.getTime() + (exdays*24*60*60*1000));

    // hay que especificar una fecha de expiracion
    // sino caducan al salir de la pagina
    var expira_ = "expires=" + dfin_.toUTCString();
    var path_ = "path=/" ;
    var cname_ = cookie_name + "=" + escape(cvalue) ;

    cookie_$ += cname_ ;
    cookie_$ += ";" + expira_ ;
    cookie_$ += ";" + path_ ;

    // definimos la cookie
    document.cookie = cookie_$;
} // setCookie

function getCookie(cookie_name)
{
    // devuelve la cookie pedida del todas las cookies del document.cookie
    var name = cookie_name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';'); // genero un array de cookies

    // recorremos el array de cookies
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i]; // tomamos una cookie del array
        while (c.charAt(0) == ' ') { // quitamos los espacios de adelante
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) { // si inicia con el nombre => lo encontramos
            return c.substring(name.length, c.length); // devolvemos solo el valor
        }
    }
    return ""; // no se encontro la cookie
}// getCookie

function checkCookies()
{
    if (navigator.cookieEnabled == false) {
        alert("Se utilizan Cookies para acceder. Por favor habilite el uso de cookies en el navegador.");
    }
} // checkCookies

function consulta_afiliado()
{
    var method_ = "GET";
    var url_ = "v_padron.php";
    var async_ = true;
    var param_ = "";
    var numdoc_ = document.getElementById("numdoc").value;
    var fecnac_ = document.getElementById("fecnac").value;
    var urlDestino_ = document.getElementById("destino").innerHTML;
    // alert("fecha="+fecnac_);

    /*
        Se usa AJAX para hacer ejecutar el PHP que hace la consulta
       */
    var xhttp = new XMLHttpRequest(); // definimos el objeto para el request

    // armamos los parametos con los campos ingresados en el html
    param_ += "?numdoc=" + numdoc_;
    param_ += "&fecnac=" + fecnac_;

    // seteamos un callback que atendera la respuesta de la consulta
    // cuando cambie el estado de la consulta, cambia 4 veces (del 1 -> 4)
    xhttp.onreadystatechange = function() {
        // 'readystate' es el estado del objeto: 4 ->  finalizo el request
        // 'staus' es el numero que regresa el request: 200 -> 'OK'
        if (this.readyState == 4 && this.status == 200 ) {
                // recibimos la respuesta en un JSON
                respuesta_= this.responseText;

                // alert(respuesta_);

                var resJSON = JSON.parse(respuesta_);
                var resText = "";
                guardar_respuesta(resJSON);
                switch (resJSON.STATUS) {
                        case "OK":
                            resText = "Valido";
                            resText += resJSON.NOMBEN;
                            //          window.location.assign(urlDestino_);
                            break;
                        case "ERROR":
                            resText = "Se produjo un error. " + "<br>" + resJSON.ERRMES;
                            alert("Por favor, verifique los datos y vuelva aintentar");
                            break;
                        default:
                            resText = "No valido. " + "<br>" + resJSON.STATUS;
                            alert("Por favor, verifique los datos y vuelva aintentar");
                            break;
                }
                // document.getElementById("resultado").innerHTML = resText;
            }
    } // onreadystatechange()

    xhttp.open(method_, url_ + param_, async_);
    xhttp.send();
} // consulta_afiliado()

function mostrar_afil()
{
        var method_ = "GET";
        var url_ = "r_afiliado.php";
        var async_ = true;
        var param_ = "";

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var numdoc_ = urlParams.get('numdoc');

// se arma el ajax, se lee php y se parsea el json
        respuesta_ = '{"NROAFI":"070985","NOMBEN":"AMESPIL, PABLO ESTEBAN","NUMDOC":"22470936","FEALSI":"13/10/1998"}';
        var resJSON = JSON.parse(respuesta_);
        document.getElementById("nroafi").value=resJSON.NROAFI;
        document.getElementById("nomben").value=resJSON.NOMBEN;
        document.getElementById("numdoc").value=resJSON.NUMDOC;
        document.getElementById("fealsi").value=resJSON.FEALSI;
//      $("#loader").css("display", "none");
        const dias_ = 1; // cantidad de dias en que van a ser validas las cookies
        setCookie("resAfiliado", respuesta_, dias_);
} // mostrar_afil()

function goto_destino_id()
{
        var urlDestino_ = document.getElementById("destino").innerHTML;
        window.location.assign(urlDestino_);
}