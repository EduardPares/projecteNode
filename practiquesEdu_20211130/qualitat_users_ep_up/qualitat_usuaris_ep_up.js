const fs = require('fs');

const usersAll = JSON.parse(fs.readFileSync('./users.js', 'utf8')); 

// ======================================================
function prettyJ(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
    function (match) {
      let cls = "\x1b[36m";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "\x1b[34m";
        } else {
          cls = "\x1b[32m";
        }
      } else if (/true|false/.test(match)) {
        cls = "\x1b[35m"; 
      } else if (/null/.test(match)) {
        cls = "\x1b[31m";
      }
      return cls + match + "\x1b[0m";
    }
  );
}
// ======================================================

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat dels usuaris i els àmbits (EP,UP) on estan assignats");
usersAll.forEach(function (unUser) {
    const userAmbit = unUser.ambit;
	console.log(unUser.dades.nom);
	console.log(unUser.dades.cognoms);
	if(unUser.ambit){
		unUser.ambit.forEach(function (unAmbit) {
			const [ep,up] = unAmbit.split('_');
			console.log("--> "+[ep,up]);
		});
	}
	
});
	

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("FORMAT JSON. Llistat dels usuaris i els àmbits (EP,UP) on estan assignats");
var usuarisAmbits = [];
usersAll.forEach(function (unUser) {
    const userAmbit = unUser.ambit;
	var userResultat = {nom:unUser.dades.nom, cognoms:unUser.dades.cognoms, ambit:[]}
	if(unUser.ambit){
		unUser.ambit.forEach(function (unAmbit) {
			const [ep,up] = unAmbit.split('_');
			console.log("--> "+[ep,up]);
			userResultat.ambit.push({ep:ep,up:up});
		});
	}
	usuarisAmbits.push(userResultat);
});
console.log(prettyJ(usuarisAmbits));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("FORMAT JSON: Llistat de les EP i la quantitat de UP");
var  resumEP = {};
usersAll.forEach(function (unUser) {
	const userAmbit = unUser.ambit;
	if(unUser.ambit){
		unUser.ambit.forEach(function (unAmbit) {
			const [ep,up] = unAmbit.split('_');
			if (!resumEP[ep]) {
				resumEP[ep]={};
			}
			if (!resumEP[ep][up]) {
				resumEP[ep][up]=0;
			}
			resumEP[ep][up] += 1;			
		})	
	}
});
console.log(prettyJ(resumEP));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat de les EP i les seves UP");

var totesEP = {};

usersAll.forEach(function (unUser) {
	const userAmbit = unUser.ambit;
	if(unUser.ambit){
		unUser.ambit.forEach(function (unAmbit) {
			const [ep,up] = unAmbit.split('_');
			if (!totesEP[ep]) {
				totesEP[ep]=[];
			}
			if(!totesEP[ep].find(element => element === up)){
				totesEP[ep].push(up);
			}	
		})	
	}
});
console.log(prettyJ(totesEP));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat de les EP i els usuaris que estan assignats");

var totalEP = {};
var usuari = "";
usersAll.forEach(function (unUser) {
	const userAmbit = unUser.ambit;
	usuari = unUser.dades.nom;
	if(unUser.ambit){
		unUser.ambit.forEach(function (unAmbit) {
			const [ep] = unAmbit.split('_');
			if (!totalEP[ep]) {
				totalEP[ep]=[usuari];
			}else{
				if(!totalEP[ep].find(element => element === usuari)){
					totalEP[ep].push(usuari);
				}	
			}
		})	
	}
});
console.log(prettyJ(totalEP));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat de les EP, el número de usuari que té, ordenades (les EP) per quantitat d'usuaris");

var totalEP = {};
var numUSU = {};
var numOR = [];
var usuari = "";
usersAll.forEach(function (unUser) {
	const userAmbit = unUser.ambit;
	usuari = unUser.dades.nom;
	if(unUser.ambit){
		unUser.ambit.forEach(function (unAmbit) {
			const [ep] = unAmbit.split('_');
			if (!totalEP[ep]) {
				totalEP[ep]=[usuari];
				numUSU[ep] = 1;

			}else{
				if(!totalEP[ep].find(element => element === usuari)){
					totalEP[ep].push(usuari);
					numUSU[ep] += 1;
				}	
			}
		})
	}
});


var array = Object.keys(numUSU)

array.forEach(function (unEp) {
	
	numOR.push([numUSU[unEp],unEp])
});


console.log(numOR.sort().reverse())


console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat de les EP i la quantiat d'usuaris que estan assignats");

var totalEP = {};
var numUSU = {};
var usuari = "";
usersAll.forEach(function (unUser) {
	const userAmbit = unUser.ambit;
	usuari = unUser.dades.nom;
	if(unUser.ambit){
		unUser.ambit.forEach(function (unAmbit) {
			const [ep] = unAmbit.split('_');
			if (!totalEP[ep]) {
				totalEP[ep]=[usuari];
				numUSU[ep] = 1;

			}else{
				if(!totalEP[ep].find(element => element === usuari)){
					totalEP[ep].push(usuari);
					numUSU[ep] += 1;
				}	
			}
		})
	}
});
console.log(prettyJ(numUSU));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat de les EP i UP, i els usuaris que estan assignats");

var totalEU = {};
var usuari = "";
usersAll.forEach(function (unUser) {
	const userAmbit = unUser.ambit;
	usuari = unUser.dades.nom;
	if(unUser.ambit){
		unUser.ambit.forEach(function (unAmbit) {
			const [ep,up] = unAmbit.split('_');
			if (!totalEU[ep]) {
				totalEU[ep]=[usuari];
			}else{
				if(!totalEU[ep].find(element => element === usuari)){
					totalEU[ep].push(usuari);
				}	
			}
			if (!totalEU[up]) {
				totalEU[up]=[usuari];
			}else{
				if(!totalEU[up].find(element => element === usuari)){
					totalEU[up].push(usuari);
				}	
			}
		})	
	}
});
console.log(prettyJ(totalEU));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat dels usuaris que comparteixen àmbit i què tenen en comú");

var infoU = {};
var comu = {};
var id = 0;
usersAll.forEach(function (unUser) {
	const userAmbit = unUser.ambit;
		infoU[id]={};
		infoU[id]["id"]=unUser.dades.nom;
		infoU[id]['ambits']= [];
	if(unUser.ambit){
		unUser.ambit.forEach(function (unAmbit) {
			const [ep,up] = unAmbit.split('_');
			if(!infoU[id]['ambits'].find(element => element === ep)){
				infoU[id]['ambits'].push(ep);
			}if(!infoU[id]['ambits'].find(element => element === up)){
				infoU[id]['ambits'].push(up);
			}	

			for(i = 0; i < id; i++){
				
				if(infoU[id]['ambits'].find(element => element === ep) === infoU[i]['ambits'].find(element => element === ep)){
					if (!comu[unUser.dades.nom + "--" + infoU[i]['id']]) {
						comu[unUser.dades.nom + "--" + infoU[i]['id']] = [infoU[id]['ambits'].find(element => element === ep)];
					}else{
						if(!comu[unUser.dades.nom + "--" + infoU[i]['id']].find(element => element === (infoU[id]['ambits'].find(element => element === ep)))){
							comu[unUser.dades.nom + "--" + infoU[i]['id']].push(infoU[id]['ambits'].find(element => element === ep));

						}
					}
					
				}

				if(infoU[id]['ambits'].find(element => element === up) === infoU[i]['ambits'].find(element => element === up)){
					if (!comu[unUser.dades.nom + "--" + infoU[i]['id']]) {
						comu[unUser.dades.nom + "--" + infoU[i]['id']] = [infoU[id]['ambits'].find(element => element === up)];
					}else{
						if(!comu[unUser.dades.nom + "--" + infoU[i]['id']].find(element => element === (infoU[id]['ambits'].find(element => element === up)))){
							comu[unUser.dades.nom + "--" + infoU[i]['id']].push(infoU[id]['ambits'].find(element => element === up));

						}
					}
					
				}
				
			
			}

		})	
	}
	id++;
});
console.log(prettyJ(comu));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat dels usuaris sense àmbit assignat");

id = 0;
usersAll.forEach(function (unUser) {
    const userAmbit = unUser.ambit;
	if(unUser.ambit){
		unUser.ambit.forEach(function (unAmbit) {
			if(!unAmbit){
				console.log(unUser.dades.nom);
				console.log(unUser.dades.cognoms);
				id++;
			}
		});
	}
});
if(id === 0){
	console.log("-->No n'hi han");
}




console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat rols amb la llista d'usuaris de cada rol");

var rolsU = {};
var usuari = "";
usersAll.forEach(function (unUser) {
	const userAmbit = unUser.ambit;
	usuari = unUser.id;
	var rol = unUser.rol;
	if(rol[1].length>1){
		rol.forEach(function (unRol) {
			if (!rolsU[unRol]) {
				rolsU[unRol]=[usuari];
			}else{
				if(!rolsU[unRol].find(element => element === usuari)){
					rolsU[unRol].push(usuari);
				}	
			}
		})
		
	}else{
	if (!rolsU[rol]) {
		rolsU[rol]=[usuari];
	}else{
		if(!rolsU[rol].find(element => element === usuari)){
			rolsU[rol].push(usuari);
		}	
	}
	}
	
	
});
console.log(prettyJ(rolsU));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat d'usuararis que comparteixen rol");

// var infoU = {};
// var usuari = "";var infoU = {};
// var id = 0;
// var comu = [];
// usersAll.forEach(function (unUser) {
// 	const userAmbit = unUser.ambit;
// 		infoU[id]={};
// 		infoU[id]["nom"]=unUser.id;
// 		infoU[id]['rols']= [unUser.rol];
		
// 		for(i = 0; i < id; i++){

// 			if(infoU[i]['rols'].find(element => element === unUser.rol)===infoU[id]['rols'].find(element => element === unUser.rol)){
				
// 				if(!comu.find(element => element === (infoU[i]["nom"] + "--" + infoU[id]["nom"]))){
// 					comu.push(infoU[i]["nom"] + "--" + infoU[id]["nom"]);
// 					if(i === id){
// 						console.log("j");
// 					}
// 				}	
// 			}

// 		}
// 		id++;
// });

// console.log(prettyJ(comu));


var comuns = [];
usersAll.forEach(function (priUser) {
	if(priUser.rol[1].length>1){
		priUser.rol.forEach(function (userRol) {
			
			usersAll.forEach(function (segUser) {
				if(segUser.rol[1].length>1){
					priUser.rol.forEach(function (userRolS) {
						if(priUser!==segUser){
							if(userRol === userRolS){
								if(!comuns.find(element => element === (priUser.id+"--"+segUser.id)) && !comuns.find(element => element === (segUser.id+"--"+priUser.id))){
									comuns.push(priUser.id+"--"+segUser.id);
								}
							}
						}
					});
				}else{
					if(priUser!==segUser){
						if(userRol === segUser.rol){
							if(!comuns.find(element => element === (priUser.id+"--"+segUser.id)) && !comuns.find(element => element === (segUser.id+"--"+priUser.id))){
								comuns.push(priUser.id+"--"+segUser.id);
							}
						}
					}
				}
			});

		});
	}else{

		usersAll.forEach(function (segUser) {
			if(segUser.rol[1].length>1){
			
				segUser.rol.forEach(function (userRolS) {
					if(priUser!==segUser){
						if(priUser.rol === userRolS){
							if(!comuns.find(element => element === (priUser.id+"--"+segUser.id)) && !comuns.find(element => element === (segUser.id+"--"+priUser.id))){
								comuns.push(priUser.id+"--"+segUser.id);
							}
						}
					}
				});

			}else{
				if(priUser!==segUser){
					if(priUser.rol === segUser.rol){
						if(!comuns.find(element => element === (priUser.id+"--"+segUser.id)) && !comuns.find(element => element === (segUser.id+"--"+priUser.id))){
							comuns.push(priUser.id+"--"+segUser.id);
						}
					}
				}
			}
		});

	}
	
});
console.log(comuns);

console.log("--------------------------------------------------------------------------------------------------------------");
