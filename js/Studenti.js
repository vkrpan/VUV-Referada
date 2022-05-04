$(document).ready(function() {
    UcitajDropdownStudenti('#odaberiStudenta');
    UcitajDropdownStudenti('#odaberiStudentaZaOcj');
    UcitajSemestre('#odaberiSemestarZaBrisanje');
    UcitajSemestre('#odaberiSemestarZaAzuriranje');
    UcitajDropdownStudenti('#odaberiStudentaZaUpis');
    UcitajDobrodosli()
    $("#bbb").hide();
})

//--------------------funkcija ispisuje ime i prezime prijavljenog operatera u navbaru
function UcitajDobrodosli(){
    var holder = $("#dobrodosli");
    oDbUsers.once('value').then(sOdgovorPosluzitelja =>{
        sOdgovorPosluzitelja.forEach(itemUser =>{
            var korisnik = itemUser.val();
            auth.onAuthStateChanged(user =>{
                if(user.uid==korisnik.UserId){
                    user.updateProfile({
                        displayName: korisnik.Ime
                    }).then(()=>{
                        holder.append('Prijavljen/a:  ' + korisnik.Ime+ " " + korisnik.Prezime);
                    })
                }

            })
        })
    })
}
//--------------------funkcija ucitava brojeve semestara u dropdown
function UcitajSemestre(identif){
    var semestri = [1,2,3,4,5,6];
    var dropdown = $(identif);
    dropdown.empty();
    dropdown.append('<option>...</option>');
    semestri.forEach(item => {
        dropdown.append('<option>'+item+'</option>');
    })
}
//--------------------Otvaranje nove stranice na klik gumba sa index pagea
$("#azuriranjeStudenta").click(function(){
    var newURL = window.location.origin + "/AzuriranjePredmeta.html" 
    window.location.replace(newURL);
})
$("#Upisi").click(function(){
    var newURL = window.location.origin + "/Upisi.html" 
    window.location.replace(newURL);
})
$("#ConfStud").click(function(){
    var newURL = window.location.origin + "/ConfStud.html" 
    window.location.replace(newURL);
})
//--------------------funkcija provjerava valjanost unesenog jmbag-a
function ProvjeriJMBAG(jmbag){
    if(isNaN(jmbag)){
        alert("Unos JMBAG-a zahtjeva samo brojke!");
        return false;
    }
    else{
        if(jmbag.length==10){
            return true;
        }
        else{
            alert("JMBAG mora sadržavati točno 10 znamenaka!")
            return false;
        }
    }
}
//--------------------funkcija oznacava sve check boxove u modalu za upis predmeta
function OznaciSvePredmete(oznaciCheckbox, idModala){
    var modal = document.getElementById(idModala);
    var chekiraneKucice = modal.querySelectorAll('input[type="checkbox"]');
    if(oznaciCheckbox.checked==true){
        chekiraneKucice.forEach((item) =>{
            item.checked=true;
        })
    }
    else{
        chekiraneKucice.forEach((item) => {
            item.checked=false;
        })
    }
}
//--------------------jquery event klika na button za unos novog studenta
$('#unosStudenta').click(function(){
    var ime = $('#unosIme').val();
    var prezime = $('#unosPrezime').val();
    var jmbag = $('#unosJMBAG').val();
    var upisanaGodina=1;
    var idstudenta;
    var id = 1; 
    oDbStudenti.once('value', function(sOdgovorPosluzitelja)
	{
		sOdgovorPosluzitelja.forEach(function(snapshot)
		{
             id++;
		})
        idstudenta=id;
	})
    var postoji=false;
    var kontrolna = false;
    oDbStudenti.once("value").then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var snapp = childSnapshot.child("JMBAG").val();
            if(snapp == jmbag){
                postoji = true;
            }
        })
        var modal = document.getElementById('modalZaUpis');
        var chekiraneKucice = modal.querySelectorAll('input[type="checkbox"]');
        var predmetaBr = 0;
        chekiraneKucice.forEach((item)=>{
            if(item.checked){
                predmetaBr++;
            }
        })
        console.log(chekiraneKucice)
        console.log(predmetaBr);
        console.log(ime)
        console.log(prezime)
        console.log(jmbag)
    if(ime == "" || prezime== "" || jmbag=="" || predmetaBr<5){
        kontrolna = true;
        alert("Morate unijeti sve podatke o studentu te odabrati predmete za upis godine!");

    }
    if(postoji){
        alert("Unijeli ste JMBAG koji je već dodjeljen postojećem studentu!");
        ObrisiFormuUnosStudenta();
    }
    if(!postoji&&!kontrolna){
        if(ProvjeriJMBAG(jmbag)){
            var sKey = oDb.ref().child('Studenti').push().key;
            var oStudent={
            Ime: ime,
            Prezime: prezime, 
            JMBAG: jmbag,
            UpisanaGodina: upisanaGodina,
            Obrisan: false,
            IdStudenta: idstudenta
            };
            var oZapis ={};
            oZapis[sKey]=oStudent;
            oDbStudenti.update(oZapis);
            unesiNovePredmeteZaStudenta(oStudent, "modalZaUpis");
            UcitajDropdownStudenti('#odaberiStudenta');
            UcitajDropdownStudenti('#odaberiStudentaZaOcj');
            ObrisiFormuUnosStudenta();
            alert("Student " + ime+" "+prezime+" je uspješno dodan te su mu upisani odabrani predmeti")
        }
        
    }
})
})

//-----funkcija u koju se prosljeđuju objekt studenta i identifikacija modala sa kojeg se prikupljaju označeni predmeti za upis
function unesiNovePredmeteZaStudenta(objStud, identifModal){
    var modal = document.getElementById(identifModal);
    console.log(objStud);
    console.log(objStud.UpisnaGodina);
    var chekiraneKucice = modal.querySelectorAll('input[type="checkbox"]');
    console.log(chekiraneKucice);
    oDbPredmeti.on('value', function(sOdgovorPosluzitelja){
        sOdgovorPosluzitelja.forEach(function(snapshot){    
            var idUpisaPredmeta=1;
            oDbUpisaniPredmeti.once('value', function(sOdgovorPosluziteljaUpPred){
                sOdgovorPosluziteljaUpPred.forEach(function(snapshot){
                    idUpisaPredmeta++;
                })
                var idUnos = idUpisaPredmeta;
                var Predmet = snapshot.val();

                chekiraneKucice.forEach(item=>{
                if(item.checked){                       
                    IdUpisanogPredmeta = item.getAttribute('idPredmeta');
                    if(IdUpisanogPredmeta==Predmet.IdPredmeta){
                        console.log("treba stvorit upisani predmet")
                        var sKey = oDb.ref().child('UpisPredmeta').push().key;
                        var oUpisaniPredmet={
                            UpisanaGodina: objStud.UpisanaGodina,
                            IdPredmeta: Predmet.IdPredmeta,
                            IdStudenta: objStud.IdStudenta,
                            IdUpisa: idUnos,
                            Ocjena: 0,
                            ECTS: Predmet.ECTS
                        };
                        var oZapis ={};
                        oZapis[sKey]=oUpisaniPredmet;
                        oDbUpisaniPredmeti.update(oZapis);
                    }
                }
            });
            })
        })
    })
}


//-------------------- funkcija brise sadrzaj polja za unose podataka za novog studenta
function ObrisiFormuUnosStudenta(){
    document.getElementById("unosIme").value = "";
    document.getElementById("unosPrezime").value = "";
    document.getElementById("unosJMBAG").value = "";
}

//--------------------  funkciji se prosljeđuje string po kojem nalazi dropdown u koji ucitava studente iz baze
function UcitajDropdownStudenti(Identif){
    var dropdown = $(Identif);
    $(Identif).empty();
    dropdown.append('<option>Odaberi studenta...</option>');
	oDbStudenti.once('value', function(sOdgovorPosluzitelja)
	{
		sOdgovorPosluzitelja.forEach(function(snapshot)
		{
            var Student = snapshot.val();
            if(Student.Obrisan==false){
                dropdown.append('<option id="'+Student.JMBAG+'">'+Student.Ime +' '+Student.Prezime+' ['+Student.JMBAG+'] </option>');
            }
		})
	});
}
// function UcitajDropdownPredmeti(Identif){
//     var dropdown = $(Identif);
//     $(Identif).empty();
// 	oDbStudenti.once('value', function(sOdgovorPosluzitelja)
// 	{
// 		sOdgovorPosluzitelja.forEach(function(snapshot)
// 		{
// 			var Student = snapshot.val();
//             dropdown.append('<option id="'+Student.JMBAG+'">'+Student.Ime +' '+Student.Prezime+' ['+Student.JMBAG+'] </option>');
// 		})
// 	});
// }

//-------------------- funkcija se poziva na klik gumba za brisanje studenta
$('#btnStudentObrisi').click(function() {
    var node = document.getElementById("odaberiStudenta");
    var html = node.options[node.selectedIndex];
    var jmbag = html.getAttribute("id");
    var odabran = node.value;
    console.log(html);
    console.log(odabran);
    console.log(jmbag);
    oDbStudenti.once("value").then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var snapp = childSnapshot.child("JMBAG").val();
            if(snapp==jmbag){
                if(confirm("Jeste li sigurni da želite obrisati studenta "+ odabran+ "?")){
                    var oStudent = oDb.ref('Studenti/'+childSnapshot.key);
                    var student = childSnapshot.val();
                    var sKey = oDb.ref().child('Studenti').push().key;
                    var oDelStudent = {
                        Ime: student.Ime,
                        Prezime: student.Prezime, 
                        JMBAG: student.JMBAG,
                        UpisanaGodina: student.UpisanaGodina,
                        Obrisan: true,
                        IdStudenta: student.IdStudenta
                    }
                    var oZapis ={};
                    oZapis[sKey]=oDelStudent;
                    oDbStudenti.update(oZapis);
                    oStudent.remove();
                    UcitajDropdownStudenti('#odaberiStudenta');
                    alert(odabran+" je uspješno izbrisan/a iz baze!")

                }
            };
            // console.log(childSnapshot.key);
            // console.log(childSnapshot.val());
        })
    })
})
/*---------- jquery event metoda kojom se nakon odabira studenta ispisuju predmeti koji su tom studentu ostali za položiti u trenutnoj godini
-------------------- zatim se klikom na button unesi ocjenu poziva funkcija kojom se studentu upisuje ocjena za odabrani predmet */
$("#odaberiStudentaZaOcj").change(function(){
    var node = document.getElementById("odaberiStudentaZaOcj");
    var html = node.options[node.selectedIndex];
    var jmbag = html.getAttribute("id");
    var idStudenta;
    var imeStudenta;
	oDbStudenti.once('value', function(sOdgovorPosluzitelja)
	{
		sOdgovorPosluzitelja.forEach(function(snapshot)
		{
			var Student = snapshot.val();
            if(Student.JMBAG == jmbag){
                idStudenta= Student.IdStudenta;
                imeStudenta = Student.Ime + " " +Student.Prezime;
            }
		})
	});
    var dropdown = $("#odaberiPredmet");
    $("#odaberiPredmet").empty();
    dropdown.append('<option>...</option>');
    oDbPredmeti.on('value', function(sOdgovorPosluzitelja)
	{
		sOdgovorPosluzitelja.forEach(function(snapshotPredmet)
		{
            var Predmet = snapshotPredmet.val();
            oDbUpisaniPredmeti.once('value', function(sOdgovorPosluzitelja){
                sOdgovorPosluzitelja.forEach(function (snapshotUpisaniPredmet){
                    var instUpisanPredmet = snapshotUpisaniPredmet.val();
                    if(instUpisanPredmet.IdStudenta==idStudenta && (instUpisanPredmet.Ocjena==0 || instUpisanPredmet.Ocjena==1) &&Predmet.IdPredmeta==instUpisanPredmet.IdPredmeta){
                        dropdown.append('<option id="'+instUpisanPredmet.IdPredmeta+'" ECTS="'+Predmet.ECTS+'"> '+Predmet.Naziv+'</option>');
                    }
                })
            })
            
		})
	});
    var dropdownOcj = $("#odaberiOcj");
    $("#odaberiOcj").empty();
    dropdownOcj.append('<option>...</option>');
    var Ocjene = [1,2,3,4,5];
    Ocjene.forEach((item) =>{
        dropdownOcj.append('<option>'+item+'</option>');
    });
    $("#btnFormaZaUnosOcj").click(() => {
        var odabirOcj = $('#odaberiOcj').find(":selected").text();
        var odabirPredmeta = $('#odaberiPredmet').find(":selected").text();
        var id = $('#odaberiPredmet').find(":selected").attr('id');
        var upisECTS = $('#odaberiPredmet').find(":selected").attr('ECTS');
        var imeStudenta = $("#odaberiStudentaZaOcj option:selected").text();
        console.log()
        if(odabirOcj!="..."&&odabirPredmeta!="..."&&imeStudenta!="..."){
            if(odabirOcj.length>0 && odabirPredmeta.length>5 && imeStudenta.length>5){
                if(confirm("Jeste li sigurni da želite unijeti ocjenu "+ odabirOcj+" za predmet"+odabirPredmeta+" studentu "+imeStudenta)){
                    oDbUpisaniPredmeti.once('value', function(sOdgovorPosluzitelja){
                        sOdgovorPosluzitelja.forEach(function (snapshot){
                            var upisaniPredmet = snapshot.val();
                            if((upisaniPredmet.Ocjena==0 || upisaniPredmet.Ocjena==1)&&upisaniPredmet.IdPredmeta==id&&upisaniPredmet.IdStudenta==idStudenta){
                                console.log("nasao")
                                let oUpisaniPredmet = oDb.ref('UpisPredmeta/'+snapshot.key);
                                var oUpisaniPredmetOcj={
                                    UpisanaGodina: upisaniPredmet.UpisanaGodina,
                                    IdPredmeta: upisaniPredmet.IdPredmeta,
                                    IdStudenta: upisaniPredmet.IdStudenta,
                                    IdUpisa:upisaniPredmet.IdUpisa,
                                    Ocjena: parseInt(odabirOcj),
                                    ECTS: parseInt(upisECTS)
                                };
                                var sKey = oDb.ref().child('UpisPredmeta').push().key;
                                var oZapis ={};
                                oZapis[sKey]=oUpisaniPredmetOcj;
                                oDbUpisaniPredmeti.update(oZapis);
                                oUpisaniPredmet.remove();
                            }
                        })
                    })
    
    
                } 
            }
            else{

            }
        }
        else{
            alert('Za upis ocjene studentu morate odabrati valjane opcije!');
        }
        document.getElementById('odaberiStudentaZaOcj').getElementsByTagName('option')[0].selected = 'selected';
        $("#odaberiPredmet").empty();
        $("#odaberiOcj").empty();
        
    });

})



//-------------------- funkcija priakzuje predmete za odabir(samo sa prve godine) za upis novog studenta
$("#odabirPredmeta").click(function(){
    var modal = $("#modalZaUpis");
    modal.empty();
    $("#selectSve").prop('checked', false);
    modal.append('<label for="">Ukupan zbroj odabranih predmeta mora biti 60 ECTS!</label>');
    oDbPredmeti.on('value', function(sOdgovorPosluzitelja)
	{
		sOdgovorPosluzitelja.forEach(function(snapshotPredmet)
		{
            var Predmet = snapshotPredmet.val();
            if(Predmet.Godina==1){
                modal.append('<div class="form-check"><input type="checkbox" class="form-check-input" brojECTS="'+Predmet.ECTS+'" idPredmeta="'+Predmet.IdPredmeta+'"><label class="form-check-label">'+Predmet.Naziv+'  ['+Predmet.ECTS+']</label></input></div>')
            }
            
		})
	});

})

$("#btnUpisNovihPredmeta").click(()=>{
    var modal = $("#modalZaUpisNovihPredmeta");
    var jmbagStud = $('#odaberiStudentaZaUpis').find(":selected").attr('id');
    $("#oznaciSve").prop('checked', false);
    var trenutnaGodina= 0;
    console.log(jmbagStud);
    modal.empty();
    modal.append('<label for="">Ukupan zbroj odabranih predmeta mora biti 60 ECTS!</label>');
    oDbStudenti.once('value', function(sOdgovorPosluzitelja)
	{
		sOdgovorPosluzitelja.forEach(function(snapshot)
		{
            var Student = snapshot.val();
            if(Student.JMBAG==jmbagStud){
                trenutnaGodina=Student.UpisanaGodina;
            }
            
		})
        oDbPredmeti.on('value', function(sOdgovorPosluzitelja)
        {
            sOdgovorPosluzitelja.forEach(function(snapshotPredmet)
            {
                var Predmet = snapshotPredmet.val();
                if(Predmet.Godina==trenutnaGodina+1 && Predmet.Obrisan==false){
                    console.log("prosao");
                    modal.append('<div class="form-check"><input type="checkbox" class="form-check-input" brojECTS="'+Predmet.ECTS+'" idPredmeta="'+Predmet.IdPredmeta+'"><label class="form-check-label">'+Predmet.Naziv+'  ['+Predmet.ECTS+']</label></input></div>')
                }
                
            })
        });
	});
})

//------------------- funkcija provjerava zbroj ects-a odabranih predmeta iz modala te prihvaca spremanje samo ako je zbroj ects-a =60
function SpremiPredmete(modalBody, modalId){
    var modal = document.getElementById(modalBody);
    var chekiraneKucice = modal.querySelectorAll('input[type="checkbox"]');
    var ukECTS = 0;
    console.log(chekiraneKucice);
    chekiraneKucice.forEach(item=>{
        if(item.checked){
            ECTSpredmeta = item.getAttribute('brojECTS');
            ukECTS = ukECTS + parseInt(ECTSpredmeta);
        }
    })
    console.log(ukECTS);
    if(ukECTS != 60){
        alert('Ukupan broj ECTS bodova odabranih predmeta mora iznositi 60!');
        console.log(ukECTS);
    }
    else{
        console.log("uk broj ects-a je 60!")
        alert('Predmeti su uspješno spremljeni!');
        $(modalId).modal('hide');
        
    }
}

function ObrisiPredmete(){
    $("#modalZaUpis").empty();
    
}

// <---------------------------------------------------------------------------------------------------------------------->
//---------- jquery event metoda koja klikom na button za unos novog predmeta provjerava sve unesene podatke te upisuje novi predmet u bazu
$("#unosPredmeta").click(()=>{
    var nazivPredmeta = $("#unosNazivPred").val();
    var unosSemestar = $("#unosSemestar").val();
    var unosECTS = $("#unosECTS").val();
    var kontrolnaIdPred = 1;
    var inputIdPredmeta;
    oDbPredmeti.on('value', function(sOdgovorPosluzitelja)
	{
		sOdgovorPosluzitelja.forEach(function(snapshotPredmet)
		{
            kontrolnaIdPred++;
            
		})
        inputIdPredmeta = kontrolnaIdPred;
	})
    var kontrolna = false;
    if(nazivPredmeta.length<2 || unosSemestar=="" || unosECTS==""){
        kontrolna = true;
        alert("Morate unijeti podatke o predmetu kako bi se on upisao!")

    }
    if(unosSemestar<1 || unosSemestar>6){
        kontrolna=true;
        alert("Uneseni semestar mora biti u rasponu od 1-6!")
    }

    if(!kontrolna){
        if(confirm("Jeste li sigurni da želite unijeti novi predmet" + nazivPredmeta+ " s ECTS brojem bodova:"+ unosECTS+"?")){
            var UpisnaGodina=0;
            oDbPredmeti.once('value', function(sOdgovorPosluzitelja)
            {
                if(unosSemestar ==1 || unosSemestar==2){
                    UpisnaGodina = 1;
                } 
                else if(unosSemestar==3||unosSemestar==4){
                    UpisnaGodina = 2;
                }
                else if(unosSemestar==5||unosSemestar==6){
                    UpisnaGodina = 3;
                }
                var sKey = oDb.ref().child('Predmeti').push().key;
                var oPredmet={
                    ECTS: parseInt(unosECTS),
                    Godina: UpisnaGodina, 
                    IdPredmeta: inputIdPredmeta,
                    Naziv: nazivPredmeta,
                    Semestar: parseInt(unosSemestar),
                    Obrisan: false
                };
                var oZapis ={};
                oZapis[sKey]=oPredmet;
                oDbPredmeti.update(oZapis);
                ObrisiFormuUnosPredmeta();
            });
        }
    }

})

//---------- funkcija brise inpute za unos poodataka za novi predmet
function ObrisiFormuUnosPredmeta(){
    $("#unosNazivPred").val("");
    $("#unosSemestar").val("");
    $("#unosECTS").val("");
}
//---------- jquery event metoda koja odabirom semestra u drugi dropdown dodaje predmete koji se mogu obrisati
$("#odaberiSemestarZaBrisanje").change(()=>{
    var odabir = $('#odaberiSemestarZaBrisanje').find(":selected").text();
    var dropdownPredmeta = $("#odaberiPredmetZaBrisanje");
    dropdownPredmeta.empty();
    dropdownPredmeta.append('<option>...</option>')
	oDbPredmeti.once('value', function(sOdgovorPosluzitelja)
	{
		sOdgovorPosluzitelja.forEach(function(snapshot)
		{
            var Predmet = snapshot.val();
            if(Predmet.Semestar==odabir && Predmet.Obrisan==false){
                dropdownPredmeta.append('<option idPredmeta="'+Predmet.IdPredmeta+'">'+Predmet.Naziv+'');
            }

		})
	});

})
//---------- jquery event metoda koja klikom na button za brisanje predmeta mijenja atribut obrisan na true(predmet ostaje u bazi zbog zapisa)
$("#btnObrisiPredmet").click(()=>{
    var odabirPredmeta = $('#odaberiSemestarZaBrisanje').find(":selected").text();
    var idOdabranog = $('#odaberiPredmetZaBrisanje').find(":selected").attr('idPredmeta')
    var nazivPredmeta = $('#odaberiPredmetZaBrisanje').find(":selected").text();
    if(confirm("Jeste li sigurni da želite obrisati "+nazivPredmeta+" ?")){
        oDbPredmeti.once('value', (sOdgovorPosluzitelja)=>{

            sOdgovorPosluzitelja.forEach((snapshot) =>{
                
                var Predmet = snapshot.val();
                if(idOdabranog==Predmet.IdPredmeta){
                    var oPredmet = oDb.ref('Predmeti/'+snapshot.key);
                    var sKey = oDb.ref().child('Predmeti').push().key;
                    var oDelPredmet = {
                        ECTS: Predmet.ECTS,
                        Godina: Predmet.Godina, 
                        IdPredmeta: Predmet.IdPredmeta,
                        Naziv: Predmet.Naziv,
                        Semestar: Predmet.Semestar,
                        Obrisan: true
                    };
                    var oZapis ={};
                    oZapis[sKey]=oDelPredmet;
                    oDbPredmeti.update(oZapis);
                    oPredmet.remove();
                    alert(oDelPredmet.Naziv+" je uspješno izbrisan iz baze!")
                }
            })
        })
        document.getElementById('odaberiSemestarZaBrisanje').getElementsByTagName('option')[0].selected = 'selected';
        var predmetiii = $("#odaberiPredmetZaBrisanje");
        predmetiii.empty();
    }


})
//---------- jquery event metoda koja odabirom semesta u drugi dropdown dodaje predmete iz tog semestra za azuriranje
$("#odaberiSemestarZaAzuriranje").change(()=>{
    var odabir = $('#odaberiSemestarZaAzuriranje').find(":selected").text();
    var dropdownPredmeta = $("#odaberiPredmetZaAzuriranje");
    dropdownPredmeta.empty();
    dropdownPredmeta.append('<option>...</option>')
	oDbPredmeti.once('value', function(sOdgovorPosluzitelja)
	{
		sOdgovorPosluzitelja.forEach(function(snapshot)
		{
            var Predmet = snapshot.val();
            if(Predmet.Semestar==odabir && Predmet.Obrisan==false){
                dropdownPredmeta.append('<option idPredmeta="'+Predmet.IdPredmeta+'">'+Predmet.Naziv+'');
            }

		})
	});
})

//---------- jquery event metoda koja klikom na button uredi otvara modal sa nazivom predmeta i semestrom
$("#btnOtvoriModalZaUređivanje").click(()=>{
    var orgNazivPredmeta = $('#odaberiPredmetZaAzuriranje').find(":selected").text();
    var orgSemestar = $('#odaberiSemestarZaAzuriranje').find(":selected").text();
    if(orgNazivPredmeta!="..." &&orgSemestar!="..."){
        $("#AzuriranjePredmetaModal").modal('show');
        $("#nazivPredmeta").val(orgNazivPredmeta);
        $("#semestar").val(orgSemestar);
    }
    else{
        alert("Morate odabrati semestar i predmet kako bi ga uredili!");
    }
})
//---------- funkcija se poziva klikom na buton spremi u modalu za azuriranje predmeta. Predmetu je dozvoljeno promjeniti vrijednost atributa semestar samo u toj godini u kojoj je već upisan
function SpremiAzuriraniPredmet(){
    if(confirm("Jeste li sigurni da želite spremiti unesene promjene?")){
        var orgSemestar = $('#odaberiSemestarZaAzuriranje').find(":selected").text();
        var idOdabranogPredmeta = $("#odaberiPredmetZaAzuriranje").find(":selected").attr('idpredmeta');
        var inputNazivPredmeta = $('#nazivPredmeta').val();
        var inputSemestar = $('#semestar').val();
        var noviSemestar = 0;
        if(inputNazivPredmeta.length<2 || inputSemestar.length==0){
            alert("Nije moguće spremiti promjene!");
            $("#AzuriranjePredmetaModal").modal('hide');
        }
        else{
            if(inputSemestar==orgSemestar){
                noviSemestar = inputSemestar;
                AzurirajPredmet(idOdabranogPredmeta, inputNazivPredmeta, noviSemestar);
            }
            else{
                if(orgSemestar%2==0){
                    if(orgSemestar-1==inputSemestar && inputSemestar!=0){
                        noviSemestar = inputSemestar;
                        AzurirajPredmet(idOdabranogPredmeta, inputNazivPredmeta, noviSemestar);
                        
                    }
                    else{
                        alert("Dozvoljeno je promjeniti semestar održavanja predmeta samo u toj godini!");
                        $("#semestar").val(orgSemestar);
                    }
                }
                else if(orgSemestar%2==1){
                    if(parseInt(orgSemestar)+1==parseInt(inputSemestar)){
                        noviSemestar = inputSemestar;
                        AzurirajPredmet(idOdabranogPredmeta, inputNazivPredmeta, noviSemestar);
                    }
                    else{
                        alert("Dozvoljeno je promjeniti semestar održavanja predmeta samo u toj godini!");
                        $("#semestar").val(orgSemestar);
                    }
            
                }
                
            }
        }
    }
}


//---------- funkcija prima id odabranog predmeta, te novi uneseni naziv i semestar za upis azuriranje predmeta u bazu
function AzurirajPredmet(idOdabranogPredmeta, inputNazivPredmeta, noviSemestar){
    oDbPredmeti.once('value', function(sOdgovorPosluzitelja){
        sOdgovorPosluzitelja.forEach(function(snapshot)
        {
            var Predmet = snapshot.val();
            if(Predmet.IdPredmeta==idOdabranogPredmeta){
                var oPredmet = oDb.ref('Predmeti/'+snapshot.key);
                    var sKey = oDb.ref().child('Predmeti').push().key;
                    var oDelPredmet = {
                        ECTS: Predmet.ECTS,
                        Godina: Predmet.Godina, 
                        IdPredmeta: Predmet.IdPredmeta,
                        Naziv: inputNazivPredmeta,
                        Semestar: noviSemestar,
                        Obrisan: false
                    };
                    var oZapis ={};
                    oZapis[sKey]=oDelPredmet;
                    oDbPredmeti.update(oZapis);
                    oPredmet.remove();
                    alert(oDelPredmet.Naziv+" je uspješno ažuriran!")
            }

        })
    })
    $("#AzuriranjePredmetaModal").modal('hide');
    document.getElementById('odaberiSemestarZaAzuriranje').getElementsByTagName('option')[0].selected = 'selected';
    var predmetiii = $("#odaberiPredmetZaAzuriranje");
    predmetiii.empty();

}
//---------- funkcija se poziva pri spremanju odabanih predmeta z upis u modalu. provjerava  je li student položio sve predmete u tekucoj godini
 function ProvjeriPredmete(){
    var jmbagOdabranogStudenta = $("#odaberiStudentaZaUpis").find(":selected").attr('id');
    var ukECTS = 0;
    var oStudent;
    oDbStudenti.once('value').then((sOdgovorPosluziteljaST) =>
	{
		sOdgovorPosluziteljaST.forEach(function(snapshotST)
		{
            var Student = snapshotST.val();
            if(Student.JMBAG==jmbagOdabranogStudenta){
                oStudent=snapshotST.val();
            }
		})
        var idPolozenihPredmeta =[];
        oDbUpisaniPredmeti.once('value').then((sOdgovorPosluziteljaUPPR) =>
        {
            sOdgovorPosluziteljaUPPR.forEach(function(snapshotUPPR)
            {
                var UpisaniPredmet = snapshotUPPR.val();
                if(UpisaniPredmet.IdStudenta==oStudent.IdStudenta && UpisaniPredmet.UpisanaGodina==oStudent.UpisanaGodina){
                    if(UpisaniPredmet.Ocjena>1){
                        idPolozenihPredmeta.push(UpisaniPredmet.IdPredmeta);
                    }
                }
            })
            oDbPredmeti.once('value').then((sOdgovorPosluziteljaPR) =>
            {
                sOdgovorPosluziteljaPR.forEach(function(snapshotPR)
                {
                    var Predmet = snapshotPR.val();
                    idPolozenihPredmeta.forEach((item)=>{
                        if(parseInt(item)==parseInt(Predmet.IdPredmeta)){
    
                            ukECTS +=parseInt(Predmet.ECTS);
                        }
                    })
                });
                if(ukECTS==60){
                    $("#bbb").text("true");
                    console.log("ima dovoljno");
                }
            });
        });
	});
}

//---------- jquery event metoda koja klikom na button za upis studenta u visu godinu kupi oznacene predmete iz modala te ih upisuje kao zapis u bazu
$("#btnUpisStudenetaUVisu").click(()=>{
    var modal = document.getElementById('modalZaUpisNovihPredmeta');
    var chekiraneKucice = modal.querySelectorAll('input[type="checkbox"]');
    var jmbag = $("#odaberiStudentaZaUpis").find(":selected").attr('id');
    console.log(jmbag);
    console.log($("#bbb").text());
    var brPredmeta = 0;
    chekiraneKucice.forEach((item) =>{
        if(item.checked){
            brPredmeta++;
        }
    });
    if($("#bbb").text()=="true"){
        if(brPredmeta<5){
            alert('Morate odabrati predmete koje student upisuje!');
        }
        else{
            oDbStudenti.once('value', (sOdgovorPosluzitelja)=>{
                sOdgovorPosluzitelja.forEach((snapshot) =>{
                    var Student = snapshot.val();
                    if(Student.JMBAG==jmbag){
                        var oStudent = oDb.ref('Studenti/'+snapshot.key);
                        var oStudentUpis = {
                            Ime: Student.Ime,
                            Prezime: Student.Prezime,
                            JMBAG: Student.JMBAG,
                            UpisanaGodina: parseInt(Student.UpisanaGodina)+1,
                            Obrisan: false,
                            IdStudenta: Student.IdStudenta
                        };
                        oStudent.update(oStudentUpis);
                        console.log("Student je uspješno upisan u "+oStudentUpis.UpisanaGodina+". godinu");
                        unesiNovePredmeteZaStudenta(oStudentUpis, 'modalZaUpisNovihPredmeta')
                        alert("Student "+ oStudentUpis.Ime +" "+oStudentUpis.Prezime +" uspješno je upisan na "+ oStudentUpis.UpisanaGodina+". godinu");
                    }
                })
            })
            $("#bbb").empty();
            document.getElementById('odaberiStudentaZaUpis').getElementsByTagName('option')[0].selected = 'selected';

        }
    }
    else{
        alert('Student nije položio sve predmete u tekućoj godini!');
    }
})


//---------- funkcija prolazi kroz sve studente te poziva funkciju za ispis tablice
function IspisRedaTablice(){
    var redniBr = 1;
    oDbStudenti.on('value', (sOdgovorPosluzitelja) =>{
        sOdgovorPosluzitelja.forEach(snapp =>{
            var Student = snapp.val();
            ispisiStudente(Student, redniBr);
            redniBr++;
        })
    })
}
//---------- funkcija prima objekt studenta i njegov redni broj u tablici, prolazi po svim upisanim predmetima i zbraja ukupan broj ects bodova i ukupnu ocjenu tj prosjecnu ocjenu polozenih predmeta za tog studenta
function ispisiStudente(objStud, nRbr){
    var elTablica = $("#tablicaStudenata");
    var sum = 0;
    var counter = 0;
    var prosjek = 0;
    var ukECTS = 0;
    oDbUpisaniPredmeti.get().then((sOdgovorPosluzitelja) =>{
        sOdgovorPosluzitelja.forEach(item =>{
            var upisaniPredmet = item.val();
            if(objStud.IdStudenta== upisaniPredmet.IdStudenta && upisaniPredmet.Ocjena>1 && objStud.UpisanaGodina==upisaniPredmet.UpisanaGodina){
                counter++;
                sum = sum + upisaniPredmet.Ocjena;
                ukECTS = ukECTS + upisaniPredmet.ECTS;
            }
        })
        prosjek = sum/counter;
        if(isNaN(prosjek)){
            prosjek = 0;
        }
        var style="";
        if(ukECTS==60){
            style='Style="Background: green;"';
        }
        elTablica.find('tbody').append(
            '<tr '+style+'>'+
                '<td>' + nRbr + '</td>'+
                '<td>'+ objStud.Ime+'</td>'+
                '<td>'+ objStud.Prezime+'</td>'+
                '<td>'+ objStud.JMBAG+'</td>'+
                '<td>'+ objStud.UpisanaGodina+'</td>'+
                '<td>'+ prosjek.toFixed(2) +'</td>'+
                '<td>'+  ukECTS+'</td>'+												
            '</tr>');
    }) 
}






//---------- funkcija se poziva na onkey u input baru za pretrazivanje studenata. Prolazi po svim stupcima te dohvaća sadržaje tog stupca, zatim druga for petlja prolazi po sadržajima polja tablice tog stupca i uspoređuje te vrijednosti sa unesenim inputom
function Search() 
{

  var input = document.getElementById("search");
  var filter = input.value.toUpperCase();
  var table = document.getElementById("tablicaStudenata");
  var trs = table.tBodies[0].getElementsByTagName("tr");

  for (var i = 0; i < trs.length; i++) 
  	{

    	var tds = trs[i].getElementsByTagName("td");

    	trs[i].style.display = "none";

    	for (var i2 = 0; i2 < tds.length; i2++) 
    	{

      		if (tds[i2].innerHTML.toUpperCase().indexOf(filter) > -1) 
      		{

        		trs[i].style.display = "";
        
        		continue;
		}	}
    }
}	