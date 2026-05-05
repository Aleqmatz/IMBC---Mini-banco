let saldo = 0;
let historial = [];
let usuarioActual = "";

let resumenGastos = {
    "Comida": 0,
    "Transporte/Gasolina": 0,
    "Materiales escolares": 0,
    "Ropa": 0,
    "Higiene personal": 0,
    "Medicamentos/Suplementos": 0,
    "Salidas con amigos": 0
};

let grafica;

// =========================
//  LOGIN
// =========================
function login() {
    let usuario = document.getElementById("usuario").value;

    if (usuario === "") {
        alert("Ingresa un usuario");
        return;
    }

    usuarioActual = usuario;

    document.querySelector(".login").style.display = "none";
    document.getElementById("app").style.display = "block";

    cargarDatos();
    crearGrafica();
    actualizarPantalla();
}

// =========================
//  GUARDAR
// =========================
function guardarDatos() {
    let datos = {
        saldo,
        historial,
        resumenGastos
    };

    localStorage.setItem("miniBanco_" + usuarioActual, JSON.stringify(datos));
}

// =========================
//  CARGAR
// =========================
function cargarDatos() {
    let datos = localStorage.getItem("miniBanco_" + usuarioActual);

    if (datos) {
        let parsed = JSON.parse(datos);
        saldo = parsed.saldo;
        historial = parsed.historial;
        resumenGastos = parsed.resumenGastos;
    } else {
        saldo = 0;
        historial = [];

        resumenGastos = {
            "Comida": 0,
            "Transporte/Gasolina": 0,
            "Materiales escolares": 0,
            "Ropa": 0,
            "Higiene personal": 0,
            "Medicamentos/Suplementos": 0,
            "Salidas con amigos": 0
        };
    }
}

// =========================
//  GRÁFICA
// =========================
function crearGrafica() {
    let ctx = document.getElementById("grafica").getContext("2d");

    grafica = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(resumenGastos),
            datasets: [{
                data: Object.values(resumenGastos)
            }]
        }
    });
}

function actualizarGrafica() {
    grafica.data.datasets[0].data = Object.values(resumenGastos);
    grafica.update();
}

// =========================
//  ACTUALIZAR
// =========================
function actualizarPantalla() {
    document.getElementById("saldo").innerText = saldo;

    let lista = document.getElementById("historial");
    lista.innerHTML = "";
    historial.forEach(item => {
        let li = document.createElement("li");
        li.textContent = item;
        lista.appendChild(li);
    });

    actualizarGrafica();
    guardarDatos();
}

// =========================
// FUNCIONES
// =========================
function agregarIngreso() {
    let monto = Number(document.getElementById("monto").value);

    saldo += monto;
    historial.push("Ingreso: +$" + monto);

    actualizarPantalla();
}

function agregarGasto() {
    let monto = Number(document.getElementById("monto").value);
    let categoria = document.getElementById("categoria").value;

    if (monto > saldo) {
        alert("No tienes suficiente dinero");
        return;
    }

    if (categoria === "") {
        alert("Selecciona una categoría");
        return;
    }

    saldo -= monto;
    historial.push("Gasto: -$" + monto + " | " + categoria);
    resumenGastos[categoria] += monto;

    actualizarPantalla();
}