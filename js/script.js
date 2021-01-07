async function getMonument() {
    console.log("get monument lancée");
    let data = { lieu: [] }; // Permet de tester sans lancer de serveur
    try {
        const resp = await fetch('./js/monuments.json');
        data = await resp.json();
    } catch (err) {
        console.log(err);
    }
    console.log(data);
    return data;
}

function displayData(data) {
    const boxLieu = document.getElementById("infosLieu");
    boxLieu.innerHTML = "";

    // Boucle qui affiche les lieux dans le DOM en fonction des données récupérées par la foncion async
    for (var i = 0; i < data.lieu.length; i++) {

        // Création de la box
        var maDiv = document.createElement("div");
        maDiv.setAttribute("class", "box");
        maDiv.setAttribute("id", "box" + i);
        maDiv.dataset.index = i;
        boxLieu.appendChild(maDiv);

        // Création de la div parente de l'image
        var divImage = document.createElement("div");
        maDiv.appendChild(divImage);

        // Ajout de l'image dans sa div
        var image = document.createElement("img")
        image.setAttribute("src", data.lieu[i].img);
        image.setAttribute("class", "imageLieu");
        divImage.appendChild(image);

        // Création de la div parente du texte
        var divTexte = document.createElement("div");
        maDiv.appendChild(divTexte);

        // Ajout du nom dans la box
        var name = document.createElement("h2");
        name.setAttribute("class", "nomMonument");
        divTexte.appendChild(name);
        name.innerHTML = data.lieu[i].name;

        // Ajout de la description dans la box
        var description = document.createElement("p");
        description.setAttribute("class", "descriptionMonument");
        divTexte.appendChild(description);
        description.innerHTML = data.lieu[i].description;

        // Animation de maDiv
        maDiv.addEventListener("mouseover", zoomIn);
        maDiv.addEventListener("mouseout", zoomOut);

        // Création des marqueurs sur la carte
        var marqueur = new mapboxgl.Marker({
            color: data.lieu[i].color,
        }).setLngLat(data.lieu[i].gps)
            .addTo(map);
    }

    function zoomIn(e) {
        map.easeTo({
            center: data.lieu[e.fromElement.dataset.index].gps,
            zoom: 13
        })
    }

    function zoomOut() {
        map.easeTo({
            center: [2.3488, 48.8534],
            zoom: 11
        });

    }

    // Gere l'ajout d'un lieu

    var btnAjout = document.getElementById("btnAjoutLieu");
    btnAjout.addEventListener("click", ajouterLieu);

    function ajouterLieu() {

        console.log("fonction lancée")


        // Récupération des 4 inputs remplis par l'utilisateur
        var nomNouveauLieu = document.getElementById("inputName").value;
        var longNouveauLieu = document.getElementById("inputLong").value;
        var lattNouveauLieu = document.getElementById("inputLatt").value;
        var colorNouveauLieu = document.getElementById("inputColor").value;

        // Test si les valeurs données dont bien dans le bon format

        if (nomNouveauLieu.length < 1 || longNouveauLieu.length < 1 || lattNouveauLieu.length < 1 || colorNouveauLieu.length < 1) {
            alert("Vous n'avez pas rempli tous les champs")
        } else {
            if (isNaN(longNouveauLieu) || isNaN(lattNouveauLieu)) {
                alert("Entrez une valeur numérique uniquement svp")
            } else {
                if (colorNouveauLieu.length < 6) {
                    alert("Entrez une valeur hexadécimale du type '#000000'")
                } else {
                    // Si c'est ok, alors ajout des valeurs dans le tableau 

                    var monLieu = {
                        "name": nomNouveauLieu,
                        "gps": [parseFloat(longNouveauLieu), parseFloat(lattNouveauLieu)],
                        "color": colorNouveauLieu,
                        "description": "Pas de description",
                        "img": "./img/placeholder.jpg",
                    }

                    data.lieu.push(monLieu);
                    console.log(data);

                    displayData(data);
                }
            }
        }


    }



} getMonument().then(displayData);





