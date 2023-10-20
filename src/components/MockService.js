export const FieldService =  {
	getField: function(id) {
		return {
			"label": "Sales region",
			"required": false,
			"choices": [
				"Asia",
				"Australia",
				"Western Europe",
				"North America",
				"Eastern Europe",
				"Latin America",
				"Middle East and Africa"
			],
			"displayAlpha": true,
			"default": "North America"
		}
	},

	async saveField(data) {
		console.log("Function Called: saveField");
		console.log("Posted Data:", data);

		try {
			const response = await fetch('http://www.mocky.io/v2/566061f21200008e3aabd919', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (response.ok) {
				const responseData = await response.json();
				console.log("Server Response:", responseData);
			} else {
				console.error("Server responded with status:", response.status);
			}

			//const responseData = await response.json();

			// Log the posted data and the response from the server
			//console.log("Posted Data:", data);
			//console.log("Server Response:", responseData);

			// you can handle the response as needed
		} catch (error) {
			console.error("Error posting data:", error);
		}
	},


};
