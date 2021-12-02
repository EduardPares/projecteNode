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
	unUser.ambit.forEach(function (unAmbit) {
		const [ep,up] = unAmbit.split('_');
		console.log("--> "+[ep,up]);
	});
});
console.log("--------------------------------------------------------------------------------------------------------------");
console.log("FORMAT JSON. Llistat dels usuaris i els àmbits (EP,UP) on estan assignats");
var usuarisAmbits = [];
usersAll.forEach(function (unUser) {
    const userAmbit = unUser.ambit;
	var userResultat = {nom:unUser.dades.nom, cognoms:unUser.dades.cognoms, ambit:[]}
	unUser.ambit.forEach(function (unAmbit) {
		const [ep,up] = unAmbit.split('_');
		console.log("--> "+[ep,up]);
		userResultat.ambit.push({ep:ep,up:up});
	});
	usuarisAmbits.push(userResultat);
});
console.log(prettyJ(usuarisAmbits));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("FORMAT JSON: Llistat de les EP i la quantitat de UP");
var  resumEP = {};
usersAll.forEach(function (unUser) {
	const userAmbit = unUser.ambit;
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
});
console.log(prettyJ(resumEP));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat de les EP i les seves UP");

var totesEP = {};

usersAll.forEach(function (unUser) {
	const userAmbit = unUser.ambit;
	unUser.ambit.forEach(function (unAmbit) {
		const [ep,up] = unAmbit.split('_');
		if (!totesEP[ep]) {
			totesEP[ep]=[];
		}
		if(!totesEP[ep].find(element => element === up)){
			totesEP[ep].push(up);
		}	
	})	
});
console.log(prettyJ(totesEP));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat de les EP i els usuaris que estan assignats");

var totalEP = {};
var usuari = "";
usersAll.forEach(function (unUser) {
	const userAmbit = unUser.ambit;
	usuari = unUser.dades.nom;
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
});
console.log(prettyJ(totalEP));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat de les EP i la quantiat d'usuaris que estan assignats");

var totalEP = {};
var numUSU = {};
var usuari = "";
usersAll.forEach(function (unUser) {
	const userAmbit = unUser.ambit;
	usuari = unUser.dades.nom;
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
});
console.log(prettyJ(numUSU));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat de les EP i UP, i els usuaris que estan assignats");

var totalEU = {};
var usuari = "";
usersAll.forEach(function (unUser) {
	const userAmbit = unUser.ambit;
	usuari = unUser.dades.nom;
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
	id++;
});
console.log(prettyJ(comu));

console.log("--------------------------------------------------------------------------------------------------------------");
console.log("Llistat dels usuaris sense àmbit assignat");







