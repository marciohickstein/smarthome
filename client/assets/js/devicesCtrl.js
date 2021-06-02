/* eslint-disable no-undef */
const app = angular.module('smarthome', []);

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

	const getDeviceByTagHTML = (event) => Number(event.target.id.split('-')[1]);

	const getDeviceById = (deviceId) => $scope.devices.find((item) => item.id === deviceId);

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

	$scope.setValueDeviceByEvent = async (event) => {
		const component = event.target;
		const newValue = getValueComponentByEvent(event);
		const device = getDeviceById(getDeviceByTagHTML(event));

		component.disabled = true;
		const newValues = { value: newValue, code: device.getCode() };
		devicesAPI.saveDevice(device.getID(), newValues)
			.then((itemDevice) => {
				if (!itemDevice.data.id) {
					throw new Error('Cant execute command');
				}
				console.log('Response:', itemDevice.data.id ? itemDevice.data : 'Error');
				device.value = newValue;
				console.log('SetValue:', newValue);
				component.disabled = false;
			})
			.catch((error) => {
				device.value = device.getValue();
				setValueComponentByEvent(event, device.value);
				console.log('Error: ', error);
				console.log('Returning value to ', device.value);
				component.disabled = true;
				// eslint-disable-next-line no-alert
				alert('Nao foi possivel acionar o dispositivo!');
			});
	};
});
