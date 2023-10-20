import React, { useState, useEffect } from 'react';
import './FieldBuilder.css';
import {FieldService} from './MockService.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const SubmitButton = ({isLoading, ...props}) => {
	return (
		<button {...props}>
			{isLoading ? 'Saving...' : 'Save changes'}
		</button>
	);
}

const FieldBuilderForm = () => {
	// Setting up state for form fields
	const [label, setLabel] = useState('');
	const [choices, setChoices] = useState(''); // Will use a textarea for now
	const [defaultValue, setDefaultValue] = useState('');
	const [displayAlpha, setDisplayAlpha] = useState(true); // default to alphabetical order

	const [validationErrors, setValidationErrors] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		// Retrieve data from localStorage if present
		const savedData = localStorage.getItem('formData');
		if (savedData) {
			const data = JSON.parse(savedData);
			setLabel(data.label);
			setChoices(data.choices);
			setDefaultValue(data.defaultValue);
			setDisplayAlpha(data.displayAlpha);
		}
	}, []);

	useEffect(() => {
		// Save form data to localStorage whenever any state changes
		const data = {
			label,
			choices,
			defaultValue,
			displayAlpha
		};
		localStorage.setItem('formData', JSON.stringify(data));
	}, [label, choices, defaultValue, displayAlpha]);

	useEffect(() => {
		// Fetching default data from the service
		const defaultData = FieldService.getField(); // Assuming ID is not needed for now, based on the code you've provided
		setLabel(defaultData.label);
		setChoices(defaultData.choices.join('\n')); // Converting array to newline-separated string for textarea
		setDefaultValue(defaultData.default);
		setDisplayAlpha(defaultData.displayAlpha);
	}, []);

	const validateForm = () => {
		let errors = [];
		if (!label) errors.push("Label is required.");

		let choiceList = choices.split('\n');
		if (new Set(choiceList).size !== choiceList.length) errors.push("Duplicate choices are not allowed.");

		if (choiceList.length > 50) errors.push("There cannot be more than 50 choices.");



		setValidationErrors(errors);
		return errors.length === 0; // true if no errors
	};

	const handleSubmit = () => {
		setIsLoading(true);
		if (validateForm()) {
			let newChoices = choices;
			if (!choices.includes(defaultValue)) {
				newChoices = `${choices}\n${defaultValue}`;
				setChoices(newChoices);
			}
			else{
				setIsLoading(false);
			}
			let data = {
				label,
				choices: choices.split('\n'),
				defaultValue,
				displayAlpha
			};
			FieldService.saveField(data).finally(() => {
				setIsLoading(false);
			});
		}
	};


	const clearForm = () => {
		setLabel('');
		setChoices('');
		setDefaultValue('');
		setDisplayAlpha(true);
		setValidationErrors([]);
	};

	// Additional State for initial values to reset on cancel
	const [initialData, setInitialData] = useState({
																									 label: '',
																									 choices: '',
																									 defaultValue: '',
																									 displayAlpha: true
																								 });

	useEffect(() => {
		// Fetching default data from the service
		const defaultData = FieldService.getField();
		const formattedChoices = defaultData.choices.join('\n');

		setInitialData({
										 label: defaultData.label,
										 choices: formattedChoices,
										 defaultValue: defaultData.default,
										 displayAlpha: defaultData.displayAlpha
									 });

		// Set form fields
		setLabel(defaultData.label);
		setChoices(formattedChoices);
		setDefaultValue(defaultData.default);
		setDisplayAlpha(defaultData.displayAlpha);
	}, []);

	// ... [rest of your code]

	const cancelAndReset = () => {
		setLabel(initialData.label);
		setChoices(initialData.choices);
		setDefaultValue(initialData.defaultValue);
		setDisplayAlpha(initialData.displayAlpha);
		setValidationErrors([]);
	};

	return (
		<div className="container mt-5 max-width=700px">
			<h2 className="mb-4">Field Builder</h2>
			<form>
				<div className="form-group row mb-3">
					<label htmlFor="labelInput" className="col-sm-2 col-form-label">Label <span className="text-danger">*</span></label>
					<div className="col-sm-10">
						<input type="text" className="form-control" id="labelInput" value={label} onChange={e => setLabel(e.target.value)} />
						{validationErrors.includes("Label is required.") && <div className="error-message mt-2">Label is required.</div>}
					</div>
				</div>

				<div className="form-group row mb-3">
					<label className="col-sm-2">Type</label>
					<div className="col-sm-10 d-flex align-items-center">
						<span className="mr-2 pe-2">Multi Select</span>
						<input type="checkbox" className="form-check-input" id="multi-select" />
						<label className="form-check-label ml-2 ps-2" htmlFor="multi-select"> A value is required </label>
					</div>
				</div>


				<div className="form-group row mb-3">
					<label htmlFor="defaultValueInput" className="col-sm-2 col-form-label">Default Value</label>
					<div className="col-sm-10">
						<input type="text" className="form-control" id="defaultValueInput" value={defaultValue} onChange={e => setDefaultValue(e.target.value)} />
					</div>
				</div>

				<div className="form-group row mb-3">
					<label htmlFor="choicesTextarea" className="col-sm-2 col-form-label">Choices</label>
					<div className="col-sm-10">
						<textarea className="form-control" id="choicesTextarea" rows="5" value={choices} onChange={e => setChoices(e.target.value)}></textarea>
						{validationErrors.includes("Duplicate choices are not allowed.") && <div className="error-message mt-2">Duplicate choices are not allowed.</div>}
						{validationErrors.includes("There cannot be more than 50 choices.") && <div className="error-message mt-2">There cannot be more than 50 choices.</div>}
					</div>
				</div>

				<div className="form-group row mb-3">
					<label htmlFor="orderSelect" className="col-sm-2 col-form-label">Order</label>
					<div className="col-sm-10">
						<select className="form-control" id="orderSelect" value={displayAlpha ? 'alphabetical' : 'original'} onChange={e => setDisplayAlpha(e.target.value === 'alphabetical')}>
							<option value="alphabetical">Display choices in Alphabetical</option>
							<option value="original">Display choices in Original order</option>
						</select>
					</div>
				</div>

				<br/>

				<div className="row d-flex justify-content-between ps-10">
					<div className="col-md-auto"></div>
					<div className="col-sm-10 d-flex justify-content-between">

						<SubmitButton type="button" className="btn btn-primary mr-2" onClick={handleSubmit} isLoading={isLoading} />
						<button type="button" className="btn btn-warning mr-2" onClick={clearForm}>Clear Form</button>
						<button type="button" className="btn btn-secondary" onClick={cancelAndReset}>Cancel</button>
					</div>
				</div>
			</form>
		</div>
	);

}

export default FieldBuilderForm;
