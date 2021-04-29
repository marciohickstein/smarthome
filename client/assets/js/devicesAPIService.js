// eslint-disable-next-line no-undef
angular.module('smarthome').factory('devicesAPI', ($http) => {
	const pathUrl = 'devices';
	const baseUrl = window.location.origin;

	const _getDevices = (id) => {
		let url = '';

		if (typeof id === 'number' || typeof id === 'string') {
			url = `${baseUrl}/${id}/${pathUrl}`;
		} else {
			url = `${baseUrl}/${pathUrl}`;
		}

		return $http.get(url);
	};

	const _saveDevice = (id, device) => $http.patch(`${baseUrl}/${pathUrl}/${id}`, device);

	return {
		getDevices: _getDevices,
		saveDevice: _saveDevice,
	};
});
