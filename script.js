// DATOS
let saldo = 0;
let historial = [];

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
//  GUARDAR DATOS
// =========================
function guardarDatos() {
    localStorage.setItem("saldo", saldo);
    localStorage.setItem("historial", JSON.stringify(historial));
    localStorage.setItem("resumenGastos", JSON.stringify(resumenGastos));
}

// =========================
//  CARGAR DATOS
// =========================
function cargarDatos() {
    let saldoGuardado = localStorage.getItem("saldo");
    let historialGuardado = localStorage.getItem("historial");
    let resumenGuardado = localStorage.getItem("resumenGastos");

    if (saldoGuardado !== null) saldo = Number(saldoGuardado);
    if (historialGuardado !== null) historial = JSON.parse(historialGuardado);
    if (resumenGuardado !== null) resumenGastos = JSON.parse(resumenGuardado);
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
//  ACTUALIZAR PANTALLA
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
    guardarDatos(); //  guarda automáticamente
}

// =========================
// FUNCIONES PRINCIPALES
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

// =========================
//  -- INICIO --
// =========================
cargarDatos();
crearGrafica();
actualizarPantalla();