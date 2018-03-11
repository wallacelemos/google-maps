//pegar elemento formulario 
var formulario = document.querySelector("#formLocalizar");

//objeto para o mapa
var map;

//objeto para o marcador
var marker;

//objeto para a geocodificacao
var geocoder;

//executar init depois de carregar
google.maps.event.addDomListener(window, 'load', init);

function init(){
	//pegar elemento mapa
	var elemMap = document.querySelector("#googleMap");
	
	//definir o centro do mapa
	var myCenter = new google.maps.LatLng(-3.7913402,-38.6593579);
	
	//definir propriedades do mapa
	var mapProp = {
		center : myCenter,
		zoom : 10,
		draggable: true,
		scrollwheel: false,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	
	//criar o mapa
	map = new google.maps.Map(elemMap, mapProp);
	
	//criar geocodificacao
	geocoder = new google.maps.Geocoder();
	
	//criar marcador
	marker = new google.maps.Marker({
		map: map,
		position: myCenter,
		draggable: true
	});
	
	//carregar dados de localizacao
	carregarLocalizacao({'latLng': marker.getPosition()});
	
	//adicionar evento para quando soltar o marcador
	google.maps.event.addListener(marker, 'dragend', function(){
		carregarLocalizacao({'latLng': marker.getPosition()});
	});
}

//metodo para carregar dados da localizacao
function carregarLocalizacao(params){
	//pegar elemento texto
	var textoLocalMapa = document.querySelector("#localMapa");
	
	//usar geocoder
	geocoder.geocode(params, function(results, status){
		//verificar se esta tudo ok
		if(status == google.maps.GeocoderStatus.OK){
			//pegar o primeiro resultado
			if(results[0]){
				//se tiver sido passado um endereco, setar posicao do marcador
				if(typeof params.address !== 'undefined'){
					marker.setPosition(results[0].geometry.location);
				}
				
				//centralizar no mapa a posicao
				map.setCenter(marker.getPosition());
				
				//percorrer componentes do endereco
				for(var i in results[0].address_components){
					//percorrer os tipos para colocar o valor no input certo
					for(var x in results[0].address_components[i].types){
						if(results[0].address_components[i].types[x] == "street_number"){
							document.dados.numero.value = results[0].address_components[i].long_name;
							break;
						}else if(results[0].address_components[i].types[x] == "route"){
							document.dados.endereco.value = results[0].address_components[i].long_name;
							break;
						}else if(results[0].address_components[i].types[x] == "sublocality"){
							document.dados.bairro.value = results[0].address_components[i].long_name;
							break;
						}else if(results[0].address_components[i].types[x] == "administrative_area_level_2"){
							document.dados.cidade.value = results[0].address_components[i].long_name;
							break;
						}else if(results[0].address_components[i].types[x] == "administrative_area_level_1"){
							document.dados.estado.value = results[0].address_components[i].long_name;
							break;
						}else if(results[0].address_components[i].types[x] == "postal_code"){
							document.dados.cep.value = results[0].address_components[i].long_name;
							break;
						}
					}
				}
				
				//passar endereco completo, latitude e longitude
				textoLocalMapa.innerHTML = results[0].formatted_address +"<br />" +marker.getPosition().lat() +" || " +marker.getPosition().lng();
			}
		}
	});
}

//adicionar evento de submit no formulario
formulario.addEventListener("submit", function(){
	//guardar os valores dos inputs
	var address = "";
	
	//verificar se nao esta vazio e passar os valores
	if(document.dados.endereco.value != ""){
		address += document.dados.endereco.value;
		
		if(document.dados.numero.value != ""){
			address += ", " +document.dados.numero.value;
		}
	}
	
	if(document.dados.cep.value != ""){
		address += ", " +document.dados.cep.value;
	}
	
	if(document.dados.bairro.value != ""){
		address += ", " +document.dados.bairro.value;
	}
	
	if(document.dados.cidade.value != ""){
		address += ", " +document.dados.cidade.value;
	}
	
	if(document.dados.estado.value != ""){
		address += ", " +document.dados.estado.value;
	}
	
	if(address != ""){
		//carregar dados de nova localizacao
		carregarLocalizacao({'address': address});
	}
});