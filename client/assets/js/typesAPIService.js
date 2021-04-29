/* eslint-disable no-undef */
angular.module('smarthome').factory('typesAPI', ($http) => {
	const pathUrl = 'types';
	const baseUrl = window.location.origin;

	const _getTypes = (id) => {
		let url = '';

		if (typeof id === 'number' || typeof id === 'string') {
			url = `${baseUrl}/${idUrl}/${pathUrl}`;
		} else {
			url = `${baseUrl}/${pathUrl}`;
		}

		return $http.get(url);
	};

	return {
		getTypes: _getTypes,
	};
});
