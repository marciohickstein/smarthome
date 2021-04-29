/* eslint-disable no-undef */
const app = angular.module('smarthome', []);

app.controller('devicesController', async ($scope, $http, devicesAPI, typesAPI) => {
	devicesAPI.getDevices()
		.then((devices) => {
			typesAPI.getTypes()
				.then((types) => {
					const devs = devices.data.map((device) => {
						const type = types.data.find((itemType) => itemType.id === device.type);

						const deviceValues = Object.values(device);
						const typeValues = Object.values(type);

						const deviceAndType = new Device(...deviceValues);
						const deviceType = new DeviceType(...typeValues);

						deviceAndType.setType(deviceType);
						return deviceAndType;
					});
					$scope.devices = devs;
					$scope.listDevicesOK = true;
				});
		})
		.catch((error) => {
			$scope.devices = [];
			console.log('Error:', error);
			$scope.listDevicesOK = false;
		});

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
		const newValue = getValueComponentByEvent(event);
		const device = getDeviceById(getDeviceByTagHTML(event));

		const newValues = { value: newValue, code: device.getCode() };
		devicesAPI.saveDevice(device.getID(), newValues)
			.then((itemDevice) => {
				if (!itemDevice.data.id) {
					throw new Error('Cant execute command');
				}
				console.log('Response:', itemDevice.data.id ? itemDevice.data : 'Error');
				device.value = newValue;
				console.log('SetValue:', newValue);
			})
			.catch((error) => {
				device.value = device.getValue();
				setValueComponentByEvent(event, device.value);
				console.log('Error: ', error);
				console.log('Returning value to ', device.value);
				// eslint-disable-next-line no-alert
				alert('Nao foi possivel acionar o dispositivo!');
			});
	};
});
