/* eslint-disable no-undef */
const app = angular.module('smarthome', []);

app.config(['$httpProvider', ($httpProvider) => {
	// eslint-disable-next-line no-param-reassign
	$httpProvider.defaults.headers.patch = {
		'Content-Type': 'application/json;charset=utf-8',
		'x-access-token': sessionStorage.getItem('token'),
	};
	// eslint-disable-next-line no-param-reassign
	$httpProvider.defaults.headers.get = {
		'Content-Type': 'application/json;charset=utf-8',
		'x-access-token': sessionStorage.getItem('token'),
	};
}]);

app.controller('devicesController', async ($scope, $http, devicesAPI, typesAPI, groupsAPI) => {
	$scope.group = [];
	$scope.devicesGroup = [];

	$scope.loadDevices = () => {
		devicesAPI.getDevices()
			.then((devices) => {
				const devs = devices.data.map((device) => {
					const { type } = device;
					const deviceValues = Object.values(device);
					const typeValues = Object.values(type);

					const deviceAndType = new Device(...deviceValues);
					const deviceType = new DeviceType(...typeValues);

					deviceAndType.setType(deviceType);
					return deviceAndType;
				});
				$scope.devices = devs;
				$scope.listDevicesOK = true;
				$scope.showErrorMessage = {
					visibility: 'hidden',
				};
			})
			.catch((error) => {
				$scope.devices = [];
				console.log('Error:', error);
				if (error.status === 401) {
					window.location.replace(`${window.location.origin}/client/login.html`);
					return;
				}
				$scope.listDevicesOK = false;
				$scope.showErrorMessage = {
					visibility: 'visible',
				};
			});
	};

	$scope.loadGroup = (groupId) => {
		groupsAPI.getGroups(groupId)
			.then((group) => {
				const [groupObject] = group.data;
				const devGroup = groupObject.devices.map((device) => {
					const { type } = device;
					const deviceValues = Object.values(device);
					const typeValues = Object.values(type);

					const deviceAndType = new Device(...deviceValues);
					const deviceType = new DeviceType(...typeValues);

					deviceAndType.setType(deviceType);
					return deviceAndType;
				});
				$scope.group[groupId] = groupObject;
				$scope.devicesGroup[groupId] = devGroup;
			})
			.catch((error) => {
				console.log(error);
			});
	};

	$scope.loadTab = (event) => {
		const tab = event.target.id.split('-')[0];

		if (tab.slice(0, 5) === 'group') {
			const groupId = tab[5];
			$scope.loadGroup(groupId);
			return;
		}

		$scope.loadDevices();
	};

	$scope.loadDevices();

	$scope.page = 'devices';
	$scope.getPage = () => $scope.page;
	$scope.setPageComponent = (page) => {
		$scope.page = page;
	};

	const getValueComponentByEvent = (event) => {
		let value;
		const component = event.target;

		if (component.type === 'checkbox') {
			value = component.checked;
		} else {
			value = component.value;
		}

		return value;
	};

	const setValueComponentByEvent = (event, value) => {
		const component = event.target;

		if (component.type === 'checkbox') {
			component.checked = value;
		} else {
			component.value = value;
		}
	};

	$scope.setValueDeviceByEvent = (event, device) => {
		const component = event.target;
		const newValue = getValueComponentByEvent(event);

		component.disabled = true;
		const newValues = { value: newValue };
		devicesAPI.saveDevice(device.getID(), newValues)
			.then((itemDevice) => {
				if (!itemDevice.data.id) {
					throw new Error('Cant execute command');
				}
				console.log('Response:', itemDevice.data.id ? itemDevice.data : 'Error');
				// eslint-disable-next-line no-param-reassign
				device.value = newValue;
				console.log('SetValue:', newValue);
				component.disabled = false;
			})
			.catch((error) => {
				// eslint-disable-next-line no-param-reassign
				device.value = device.getValue();
				setValueComponentByEvent(event, device.value);
				console.log('Error: ', error);
				console.log('Returning value to ', device.value);
				component.disabled = true;
				// eslint-disable-next-line no-alert
				alert('Nao foi possivel acionar o dispositivo!');
			});
	};

	$scope.setValueGroupByEvent = (event, group) => {
		const component = event.target;
		const newValue = getValueComponentByEvent(event);

		component.disabled = true;
		const newValues = { value: newValue };
		groupsAPI.saveGroup(group.id, newValues)
			.then((itemGroup) => {
				if (!itemGroup.data.id) {
					throw new Error('Cant execute command');
				}
				console.log('Response:', itemGroup.data.id ? itemGroup.data : 'Error');
				// eslint-disable-next-line no-param-reassign
				group.value = newValue;
				console.log('Group - SetValue:', newValue);
				component.disabled = false;
				$scope.loadGroup(group.id);
			})
			.catch((error) => {
				// eslint-disable-next-line no-param-reassign
				group.value = group.getValue();
				setValueComponentByEvent(event, group.value);
				console.log('Error: ', error);
				console.log('Groupd - Returning value to ', group.value);
				component.disabled = true;
				// eslint-disable-next-line no-alert
				alert('Nao foi possivel acionar o grupo de dispositivos!');
			});
	}
});
