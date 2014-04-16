jQuery(document).ready(function($){
	// set up the options to be used for jqDock...
	var dockOptions =
		{ align: 'left' // vertical menu, with expansion RIGHT from a fixed LEFT edge
		, flow: true // allow surrounding elements to flow with changes in menu size
		, size: 55
		, distance: 75 // extend distance to compensate for padding
		, labels: true
		};
	// ...and apply...
	$('#menu').jqDock(dockOptions);
});
