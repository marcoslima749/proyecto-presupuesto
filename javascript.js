// JavaScript Document

function comenzar() {
	"use strict";

	var Items = [];

	function nuevafila(num = 1) {

		/* Crea 11 nuevos inputs las veces que sean necesarios (la cantidad de veces/filas la da num)
		Los añade a un array y los agrega al presupuesto */

		let pres1 = document.getElementById("presupuesto");

		for (let f = 1; f <= num; f++) {
			//inserta un array para la fila
			Items.push([]);
			//cuenta en "r" la cantidad de filas para agregar el dato "fil"
			let r = (pres1.childElementCount - 11) / 11;
			//loop para cada elemento de la fila utilizando "i" como iterador para agregar las != f()alidades
			for (let i = 0; i < 11; i++) {

				let n = document.createElement("input");
				n.className = "item";
				n.type = "text";
				n.name = `i${r}-${i}`;
				n.id = `i${r}-${i}`;
				n.dataset.fil = r;
				n.dataset.col = i;
				n.addEventListener("focus", llamarNF);
				n.addEventListener("keydown", tabEnter);
				switch (i) {
					case 3:
					case 4:
					case 5:
						n.addEventListener("blur", actVal);
				}
				Items[r].push(n);
				pres1.appendChild(n);
			}

		}


	}

	function borrar(e) {
		let elemento = e.target;
		elemento.textContent = "";
		elemento.style.color = "black";
	}

	function restablecer(e) {
		let elemento = e.target;
		if (elemento.textContent === "") {
			elemento.textContent = "N Cliente";
			elemento.style.color = "dimgray";
		}
	}

	function tabEnter(e) {
		let fil = Number(e.target.dataset.fil);
		let col = Number(e.target.dataset.col);
		let els = (document.getElementById("presupuesto").childElementCount - 11) / 11;

		switch (e.key) {
			case "Enter":
				if (col + 1 > 5 && fil + 1 < els) {
					Items[fil + 1][0].focus();
				} else if (col <= 9) {
					e.target.nextElementSibling.focus();
				}
				break;
			case "ArrowDown":
				if (fil + 1 < els) {
					Items[fil + 1][col].focus();
				}
				break;
			case "ArrowUp":
				if (fil - 1 >= 0) {
					Items[fil - 1][col].focus();
				}


		}
	}


	function datostab(datos) {

		let area = datos;
		let myRegexF = /^.+$/gm; // Coincide con toda la fila.
		let myRegexD = /((?<=\t)|(^)).+?((?=\t)|($))/gm; // Coincide con todos los elementos entre tabs.
		let filas = area.match(myRegexF); // Obtiene todas las filas.
		let tabla = [];
		for (let f = 0; f < filas.length; f++) {
			tabla[f] = filas[f].match(myRegexD); //Descompone la fila en un array de celdas y las añade a un array que vendría a ser la tabla.
		}
		return tabla;
	}

	function llamarNF(e) {
		let fil = Number(e.target.dataset.fil); // El número de fila del elemento enfocado
		let els = ((document.getElementById("presupuesto").childElementCount - 11) / 11) - 1; // La cantidad de filas
		let suma = Items[fil][0].value + Items[fil][1].value + Items[fil][2].value + Items[fil][3].value + Items[fil][4].value + Items[fil][5].value;
		// Suma es la concatenacion de todos los valores de la fila
		if (fil == els) { // Si se está enfocando la última fila
			if (fil == 0) { // Si además la última fila es la primera (hay una sola fila)
				nuevafila();
			} else {
				let fil0 = fil - 1; // La fila anterior
				let suma0 = Items[fil0][0].value + Items[fil0][1].value + Items[fil0][2].value + Items[fil0][3].value + Items[fil0][4].value + Items[fil0][5].value;
				if (suma0 != "" || suma != "") { // Si la fila enfocada y la de arriba están vacíás
					nuevafila();
				}
			}

		} else { //Si no está enfocada la última fila

			if (els - fil > 1) { // Si la fila enfocada está a dos o más filas de la última fila
				let els0 = els - 1; // La anteúltima fila...
				let suma1 = Items[els0][0].value + Items[els0][1].value + Items[els0][2].value + Items[els0][3].value + Items[els0][4].value + Items[els0][5].value;
				let suma2 = Items[els][0].value + Items[els][1].value + Items[els][2].value + Items[els][3].value + Items[els][4].value + Items[els][5].value;

				if (suma1 == "" && suma2 == "") { // Si la última fila y la anteúltima están vacías
					//remover la última fila

					Items[els].map((a) => a.remove());
					Items.pop();

				}
			}
		}


	}






	function handlePaste(e) {

		var clipboardData, pastedData;
		//captura el objetivo del evento paste
		let targ = e.target;
		let fil = Number(targ.dataset.fil);
		let col = Number(targ.dataset.col);
		let els = (document.getElementById("presupuesto").childElementCount - 11) / 11;

		// Stop data actually being pasted into div
		e.stopPropagation();
		e.preventDefault();

		// Get pasted data via clipboard API
		clipboardData = e.clipboardData || window.clipboardData;
		pastedData = clipboardData.getData("Text");



		// Do whatever with pasteddata

		let tabla = datostab(pastedData);


		/*si la longitud del array (la cant de filas a pegar) es mayor que uno y además
		la fila donde se va a pegar (fil) más la longitud de la tabla (tabla.lenght)
		alcanzan o sobrepasan la última fila (els) ENTONCES agregar cuántas filas sean
		necesarias para que se puedan pegar los elementos y quede una fila sobrante */

		if (tabla.length > 1 && fil + tabla.length >= els) {

			nuevafila(tabla.length + fil - els + 1);

		}
		/*Pega los valores donde corresponde omitiendo las columnas sobrantes */

		for (let f = 0; f < tabla.length; f++) {
			for (let c = 0; c < tabla[f].length && c + col < 11; c++) {
				Items[f + fil][c + col].value = tabla[f][c];
			}
		}


	}

	//FUNCIONES DE CALCULO
	//CHEQUEAR PRECISION O UTILIZAR LIBRERIAS TIPO DECIMAL.JS BIG.JS BIGNUMBER.JS
	function actVal(e) {
		let fil = Number(e.target.dataset.fil);

		Items[fil][6].value = ((Number(Items[fil][4].value) * 1000000) * ((100 * 1000000) + (Number(Items[fil][5].value) * 1000000)) / (100 * 1000000) / 1000000);
		Items[fil][7].value = (Number(Items[fil][3].value) * (Number(Items[fil][6].value) * 1000000) / 1000000);

		// Items[fil][6].value = Number(Items[fil][4].value) * (100 + Number(Items[fil][5].value))/100; 
		// Items[fil][7].value = Number(Items[fil][3].value) * Number(Items[fil][6].value);



	}




	nuevafila();
	document.getElementById("presupuesto").addEventListener("paste", handlePaste);
	document.getElementById("cliente").addEventListener("click", borrar);
	document.getElementById("cliente").addEventListener("focusout", restablecer);
	




	

}






/* SCRIPTS SIN USAR

-----------------------------------------------------------------

class Registro {
// ES UN SCRIPT PARA CREAR UN OBJETO QUE CONTENGA LOS VALORES DE UNA FILA DEL PRESUPUESTO	
	
	constructor (r, tipo, parte, descrip, cant, plista, bonif) {
		
		this.r = r;
		let prop = [r, "tipo", "parte", "descrip", "cant", "plista", "bonif"];
		let presup = document.getElementById("presupuesto");
		
		for (let i = 1; i < 7; i++) {
				
		this[prop[i]] =  document.createElement("input");
		this[prop[i]].type = "text";
		this[prop[i]].id=  `i${r}${i}`;
		this[prop[i]].className = "item";
		this[prop[i]].value = arguments[i];
		presup.appendChild(this[prop[i]]);
		
		}
		

	}
}

--------------------------------------------------------------------------
//ESTE ES UN SCRIPT PARA AGREGAR UN EVENTLISTENER PARA EL CLICK EN CADA ELEMENTO DEL PRESUPUESTO

//let grilla = document.getElementById("presupuesto").childElementCount;
//for (let gr = 12; gr <= grilla; gr++ ) {
//prs[gr].addEventListener("click", nuevafila);
//}

----------------------------------------------------
*/