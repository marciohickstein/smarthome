// eslint-disable-next-line no-undef
angular.module('smarthome').factory('groupsAPI', ($http) => {
	const pathUrl = 'groups';
	const baseUrl = window.location.origin;

	const _getGroups = (id) => {
		let url = '';

		if (typeof id === 'number' || typeof id === 'string') {
			url = `${baseUrl}/${pathUrl}/${id}`;
		} else {
			url = `${baseUrl}/${pathUrl}`;
		}
		console.log(url);
		return $http.get(url);
	};

	const _saveGroup = (id, device) => $http.patch(`${baseUrl}/${pathUrl}/${id}`, device);

	return {
		getGroups: _getGroups,
		saveGroup: _saveGroup,
	};
});
