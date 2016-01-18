function capas(){
	
	var url_servicio="http://'+localStorage.url_servidor+':8080/geoserver/wms";
	var osm=new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
           });
	var stamen=new OpenLayers.Layer.XYZ(
	        "StToner",
	        "http://tile.stamen.com/toner/${z}/${x}/${y}.jpg",
	        {
	            sphericalMercator: true,
	            transitionEffect: "resize",
	            buffer: 1
	            //,numZoomLevels: 16
	            
	        }
	  );
	
	
	var myStyles = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                pointRadius: "7",
                fillColor: "#ffcc66",
                fillOpacity: 0.8,
                strokeColor: "#ff9933",
                strokeWidth: 1,
                graphicZIndex: 1
            }),
            "select": new OpenLayers.Style({
                pointRadius: "9",
                fillColor: "#66ccff",
                strokeColor: "#3399ff",
                graphicZIndex: 2
            })
        });
	var geojson_layer = new OpenLayers.Layer.Vector("ins_geojson",{
                styleMap: myStyles,
                rendererOptions: {zIndexing: true}
            }
        );
	map.addLayers([osm,stamen,geojson_layer]);
	        
	db.transaction(ConsultaTablaCargaAsign);
			var report = function(e) {
                OpenLayers.Console.log(e.type, e.feature.id);
            };
            
            var highlightCtrl = new OpenLayers.Control.SelectFeature(geojson_layer, {
                hover: false,
                highlightOnly: true,
                renderIntent: "temporary",
                eventListeners: {
                    featurehighlighted: report,
                    featureunhighlighted: report
                }
            });

            var selectCtrl = new OpenLayers.Control.SelectFeature(geojson_layer,
                {clickout: true,onSelect: onFeatureSelect}
            );

            map.addControl(highlightCtrl);
            map.addControl(selectCtrl);

            highlightCtrl.activate();
            selectCtrl.activate();
        
        function onFeatureSelect(feature) {
            
        	$("#li_pickconsulta").empty();
        	
        	$("#li_edit").click(function() {
           	    window.open("../formulario.html","_parent");
            });
	        
	        
        	jQuery.each(feature.attributes, function(i, val) {
		      	//console.log(i+"-"+val);
		      	if(i!="g"){
		      		if(i!="gt"){
		      			if(i!="mid"){
				      	$('<li  data-role="list-divider">'+i+'</li>').appendTo('#li_pickconsulta');
		        	  	$('<li>').append($('<H6 />', {
				            html: val
				        })).appendTo('#li_pickconsulta');
		        	  	//$("#li_pickconsulta").append('<li><a href="#"><a>'+val+'</a></li>');
		        	  	}
	        	  	}
        	  	}
            });
        	
        	$("#li_pickconsulta").listview('refresh');
            
			localStorage.asignado = "t";
	      	localStorage.id_asignado = feature.attributes.mid;
		   	localStorage.id_feature = feature.attributes.id;
		   	localStorage.geotabla = feature.attributes.gt;
           
           	$( "#popupMenu" ).popup( "open", {
				transition : "slideup"
			} );
        	
        }
	
}
