/* eslint-disable no-undef */
$(() => {
	$('[data-toggle="tooltip"]').tooltip();

	$('#nav-tab').on('click', (event) => {
		console.log(event.target);
	});

	console.log(uuidv4());
});
