import './App.css';
import PropTypes from 'prop-types';
import { useState } from 'react';

const KEY = ['AC', '/', 'x', 7, 8, 9, '-', 4, 5, 6, '+', 1, 2, 3, '=', 0, '.'];
const KEY_ID = ['clear', 'divide', 'multiply', 'seven', 'eight', 'nine','subtract','four','five','six','add','one','two','three','equals','zero','decimal'];


function KeyPad({ handleKeyInput }) {
	const keyArray = KEY.map((item, index) => {
		return(
			<div
				className="table text-center text-xl px-5 py-3 md:py-5 rounded-md"
				key={index + 1} 
				id={KEY_ID[index]}
				onClick={() => handleKeyInput(item)}>
				<p className="table-cell align-middle select-none">{item}</p>
			</div>
		);
	});
	return (
		<div id="grid-container" className="grid grid-cols-4 gap-[8px] pt-0 pb-2 md:pb-3 px-2 md:px-3">
			{keyArray}
		</div>
	);
}
KeyPad.propTypes = {
	handleKeyInput: PropTypes.func.isRequired
};

function TextDisplay({ entriesLine, resultsLine, calcOutput }) {
	return (
		<div className="flex flex-col text-white pt-16 md:pt-20 pb-10 md:pb-12 w-fill">
			<div className="flex flex-row justify-end px-4">
				<p className="text-right break-all text-[14px] md:text-lg">{entriesLine.length == 0 ? 0 : entriesLine}</p>
			</div>
			<div className="flex flex-row justify-end px-4">
				<p id="display" className={`${calcOutput ? 'text-[#ec4274]' : 'text-white'} text-[24px] md:text-4xl text-right break-all`}>{resultsLine.length == 0 ? 0 : resultsLine}</p>
			</div>
		</div>
	);
}
TextDisplay.propTypes = {
	entriesLine: PropTypes.array.isRequired,
	resultsLine: PropTypes.array,
	calcOutput: PropTypes.number
};

export default function App() {
	// Creates state `entriesLine` to track and display inputs to the `TextDisplay`.
	const [entriesLine, setEntriesLine] = useState([]);
	// Creates state `resultLine` to display result to `TextDisplay`.
	const [resultsLine, setResultsLine] = useState([]);
	// Creates state `calcOutput` to track output of the calculator based on the equation.
	const [calcOutput, setCalcOutput] = useState(null);
	// Creates const `operatorLogic` to manage helper functions for each operator.
	const operatorLogic = {
		'/': handleDivision,
		'-': handleSubtraction,
		'+': handleAddition,
		'x': handleMultiplication,
		'AC': handleClear,
		'=': handleEquals,
		'.': handleDecimal
	};

	function handleKeyInput(pressedKey) {
		// Get the operator function assigned to `pressedKey` in the `operatorLogic` object and store it in `operatorFunction`.
		const operatorFunction = operatorLogic[pressedKey];
		// Copies state `entriesLine` and assigns it to  `updatedEntries`.
		let updatedEntries = [...entriesLine];
		// Copies state `resultsLine` and assigns it to  `updatedResults`.
		let updatedResults = [...resultsLine];

		// Limit number inputs to 15 by returning early if `resultsLine` length is greater than 14 and `pressedKey` is a number.
		if (resultsLine.length > 14 && typeof pressedKey === 'number') {
			return;
		}

		// Handles decimal input when a previous calculation has occurred and an operator was pressed.
		if (operatorFunction && calcOutput && pressedKey === '.') {
			updatedEntries = [0,'.']; // Set `updatedEntries` to an array with a zero and decimal as elements.
			updatedResults = ['.']; // Set `updatedResults` to an array with a decimal as an element.
			setCalcOutput(null); // Reset `calcOutput` value to null to prepare for the next calculation.
		}

		// Handles further calculations when an operator function is defined and a previous calculation has occurred.
		if (operatorFunction && calcOutput && pressedKey !== '.' && pressedKey !== '=') {
			updatedEntries = [calcOutput]; // Store the current `calcOutput` value in the `updatedEntries` array for further calculations.
			setCalcOutput(null); // Reset `calcOutput` value to null in preparation for the next calculation.
		}

		// Clear existing data for a fresh calculation if there is no `operatorFunction` and `calcOutput` has a value assigned.
		if (!operatorFunction && calcOutput) {
			updatedEntries = []; // Reset `updatedEntries` array.
			updatedResults = []; // Reset `updatedResults` array.
			setCalcOutput(null); // Reset `calcOutput` value to null.
		}

		// Checks if `operatorFunction` is null or has a value assigned to it.
		if (operatorFunction) {
			// Calls `operatorFunction` with `updatedEntries`, `updatedResults`, and `pressedKey` as arguments and assigns the output to `functionOutput`.
			// The expected value for `functionOutput` is an object.
			let functionOutput = operatorFunction(updatedEntries, updatedResults);
			updatedEntries = functionOutput.newEntries; // Assigns the value from key `newEntries` to `updatedEntries`.
			updatedResults = functionOutput.newResults; // Assigns the value from key `newResults` to `updatedResults`.
		} else if (typeof updatedResults[0] !== 'number') {
			// Push `pressedKey` to the `updatedEntries` array and assign an array with `pressedKey` as a single element to `updatedResults`.
			updatedEntries.push(pressedKey);
			updatedResults = [pressedKey];
		} else if (updatedEntries.length === 1 && updatedEntries[0] === 0 && pressedKey === 0) {
			return; // Return early if the only element in `updatedEntries` is '0' and `pressedKey` is '0' to prevent multiple zeros.
		} else if (updatedEntries.length === 1 && updatedEntries[0] === 0 && pressedKey !== 0) {
			updatedEntries = [pressedKey]; // Set `updatedEntries` to an array with `pressedKey` as a single element.
			updatedResults = [pressedKey]; // Set `updatedResults` to an array with `pressedKey` as a single element
		} else {
			updatedEntries.push(pressedKey); // Pushes `pressedKey` to array `updatedEntries`.
			updatedResults.push(pressedKey); // Pushes `pressedKey` to array `updatedResults`.
		}

		// Sets state `entriesLine` to array `updatedEntries`.
		setEntriesLine(updatedEntries);
		// Sets state `resultsLine` to array `updatedResults`.
		setResultsLine(updatedResults);
		return;
	}

	function handleEquals(entriesArr, resultsArr) {
		// Checks if `entriesArr` is empty. When true, function is returned early to avoid `=` being pushed into `entriesArr`.
		if (entriesArr.length <= 0) {
			return {
				newEntries: entriesArr,
				newResults: resultsArr
			};
		}

		// Handles case when equals button was already pressed and returns `entriesArr` and `resultsArr`.
		if (calcOutput) {
			return {
				newEntries: entriesArr,
				newResults: resultsArr
			};
		}

		// Handles cases when equation is incomplete.
		switch(true) {
			// Checks if the last two elements in `entriesArr` are both operators. When true, the last two items from `entriesArr` is removed.
			case typeof entriesArr.slice(-1)[0] !== 'number' && typeof entriesArr.slice(-2)[0] !== 'number':
				entriesArr = [...entriesArr.slice(0, -2)];
				break;
			// Checks if the last element in `entriesArr` is an operator. When true, the last item in `entriesArr` is removed.
			case typeof entriesArr.slice(-1)[0] !== 'number':
				entriesArr = [...entriesArr.slice(0, -1)];
		}

		// Maps over the original equation and changes operators to their javascript equivalent. The new equation is then stored in `modifiedEquation`.
		let modifiedEquation = entriesArr.map((item) =>{
			if (item === 'x') {
				return '*';
			}
			return item;
		});
		// Converts `modifiedEquation` to a string which is then evaluated by `eval()`. The result is then stored in `sum`.
		let sum = eval(modifiedEquation.join(''));
		setCalcOutput(sum);
		return {
			// Returns `newEntries` with the original equation copied and `sum` added to the end.
			newEntries: [...entriesArr,'=',sum],
			// Returns `newResults` as an array with a single element `sum`.
			newResults: [sum]
		};
	}

	function handleClear() {
		setCalcOutput();
		// When the `AC` button is pressed, it sets `newEntries` and `newResults` to empty arrays.
		return {
			newEntries: [],
			newResults: []
		};
	}

	return (
		<div>
			<div className="App mx-auto mt-16 w-[240px] md:w-[360px] h-[fit] bg-[#232323] rounded-md">
				<div className="flex flex-col justify-center w-[100%] h-[100%]">
					<TextDisplay entriesLine={entriesLine} resultsLine={resultsLine}  calcOutput={calcOutput}/>
					<KeyPad handleKeyInput={handleKeyInput}/>
				</div>
			</div>
			<div className="flex justify-end gap-1 mx-auto my-1 pr-1 w-[240px] md:w-[360px]">
				<a href="https://alanbacay.dev/" rel="noreferrer" target="_blank" className="text-[13px] md:text-[15px] text-white mt-0 pt-0 select-none">©alanbacay</a>
				<a href="https://github.com/alanbacay02" rel="noreferrer" target="blank" className="icon-link my-auto text-[14px] md:text-[18px] px-[5px] py-[1px] rounded-md"><i className="fa fa-github"></i></a>
				<a href="https://www.linkedin.com/in/alan-neale-bacay-ii-60aa48258/" rel="noreferrer" target="_blank" className="icon-link text-[14px] md:text-[18px] px-[5px] py-[1px] rounded-md"><i className="fa fa-linkedin"></i></a>
			</div>
		</div>
	);
}

function handleMultiplication(entriesArr) {
	// Checks each case if the argument is true.
	switch(true) {
		// Handles the case when `entriesArr` is empty.
		case entriesArr.length === 0:
			// Returns a new object with `newEntries` and `newResults` arrays containing the initial value of 0 and the 'x' symbol.
			return {
				newEntries: [0,'x'],
				newResults: ['x']
			};
		
		// Checks if the last element in `entriesArr` is a multiplication symbol. If true, it indicates that the original array is already in the desired state, so it returns the original array as `newEntries`. `newResults` is set to an array with a single element, 'x'.
		case entriesArr.slice(-1)[0] === 'x':
			return {
				newEntries: entriesArr,
				newResults: ['x']
			};
		
		// Checks the type of last item in `entriesArr` if it is a number. If true, `x` is added to the end of `entriesArr` and `newResults` is set to an array with `x` as a single element.
		case typeof entriesArr.slice(-1)[0] === 'number':
			return {
				newEntries: [...entriesArr, 'x'],
				newResults: ['x']
			};
		
		// Checks the type of the last two items in `entriesArr` if they are a number. If true, `entriesArr` is copied to `newEntries` with the last two items removed while `x` is added to the end. `newResults` is set to an array with a single element `x`.
		case typeof entriesArr.slice(-1)[0] !== 'number' && typeof entriesArr.slice(-2)[0] !== 'number':
			return {
				newEntries: [...entriesArr.slice(0,entriesArr.length - 2), 'x'],
				newResults: ['x']
			};
		
		// Checks the type of the last item in `entriesArr` if it is not a number. If true, the last item in `entriesArr` is removed and `x` is added to the end and `newResults` is set to an array with `x` in it.
		case typeof entriesArr.slice(-1)[0] !== 'number':
			entriesArr.pop();
			return {
				newEntries: [...entriesArr, 'x'],
				newResults: ['x']
			};
	}
}

function handleDivision(entriesArr) {
	switch(true) {
		// Handles the case when `entriesArr` is empty.
		case entriesArr.length === 0:
			// Returns a new object with `newEntries` and `newResults` arrays containing the initial value of 0 and the 'x' symbol.
			return {
				newEntries: [0,'/'],
				newResults: ['/']
			};
		
		// Checks if the last element in entriesArr is a division symbol. If true, it indicates that the original array is already in the desired state, so it returns the original array as `newEntries`. `newResults` is set to an array with a single element `/`.
		case entriesArr.slice(-1)[0] === '/':
			return {
				newEntries: entriesArr,
				newResults: ['/']
			};
		
		// Checks if the last element in `entriesArr` is a number. If true, `entriesArr` is copied to `newEntries` with `/` added to the end. `newResults` is set to an array with a single element `/`.
		case typeof entriesArr.slice(-1)[0] === 'number':
			return {
				newEntries: [...entriesArr, '/'],
				newResults: ['/']
			};
		
		// Checks the type of the last two items in `entriesArr` if they are a number. If true, `entriesArr` is copied to `newEntries` with the last two items removed while `/` is added to the end. `newResults` is set to an array with a single element `/`.
		case typeof entriesArr.slice(-1)[0] !== 'number' && typeof entriesArr.slice(-2)[0] !== 'number':
			return {
				newEntries: [...entriesArr.slice(0,entriesArr.length - 2), '/'],
				newResults: ['/']
			};
		
		// Checks if the last item in `entriesArr` is not a number. If true, the last item of `entriesArr` is removed and then copied to `newEntries` with `/` added to the end. `newResults` is set to an array with a single element `/`.
		case typeof entriesArr.slice(-1)[0] !== 'number':
			entriesArr.pop();
			return {
				newEntries: [...entriesArr, '/'],
				newResults: ['/']
			};

	}
}

function handleAddition(entriesArr, resultsArr) {
	switch(true) {
		// Checks if the first item in `entriesArr` is not a number and is not equal to `+`. If true, `newEntries` and `newResults` is set to an array with a single element `+`.
		case typeof entriesArr[0] !== 'number' && entriesArr[0] !== '+':
			return {
				newEntries: ['+'],
				newResults: ['+']
			};
		
			// Checks if the last item in `entriesArr` is equal to a addition symbol. If true, it indicates that the original arrays are already in the desired states, so it returns the original arrays as `newEntries` and `newResults`.
		case entriesArr.slice(-1)[0] === '+':
			return {
				newEntries: entriesArr,
				newResults: resultsArr
			};
		
		// Checks if the last item in `entriesArr` is an number. If true, `entriesArr` is copied to `newEntries` with `+` added to the end. `newResults` is set to an array with a single element `+`.
		case typeof entriesArr.slice(-1)[0] === 'number':
			return {
				newEntries: [...entriesArr, '+'],
				newResults: ['+']
			};
		
		// Checks if the last two items in `entriesArr` is not a number. If true, `entriesArr` is copied to `newEntries` with the last two items remove and `+ added to the end. `newResults` is set to an array with a single element `+`.
		case typeof entriesArr.slice(-1)[0] !== 'number' && typeof entriesArr.slice(-2)[0] !== 'number':
			return {
				newEntries: [...entriesArr.slice(0,entriesArr.length - 2), '+'],
				newResults: ['+']
			};
		
		// Checks if the last item in `entriesArr` is not a number. If true, `entriesArr` is copied to `newEntries` with `+` added to the end. `newResults` is set to an array with a single element `+`.
		case typeof entriesArr.slice(-1)[0] !== 'number':
			entriesArr.pop();
			return {
				newEntries: [...entriesArr, '+'],
				newResults: ['+']
			};

	}
}

function handleSubtraction(entriesArr, resultsArr) {
	switch(true) {
		// Checks if the last item in `entriesArr` is not a number and is not equal to `-`. If true, `newEntries` and `newResults` is set to an array with a single element `-`.
		case typeof entriesArr[0] !== 'number' && entriesArr[0] !== '-':
			return {
				newEntries: ['-'],
				newResults: ['-']
			};
		
		// Checks if the last item in `entriesArr` is not a subtraction symbol. If true, it indicates that the original arrays are already in the desired states, so it returns the original arrays as `newEntries` and `newResults`.
		case entriesArr.slice(-1)[0] === '-':
			return {
				newEntries: entriesArr,
				newResults: resultsArr
			};

		// Checks if the last item in `entriesArr` is a number. If true, `entriesArr` is copied to `newEntries` with `-` added to the end. `newResults` is set to an array with a single element `-`.
		case typeof entriesArr.slice(-1)[0] === 'number':
			return {
				newEntries: [...entriesArr, '-'],
				newResults: ['-']
			};
		
		// Checks if the last item in `entriesArr` is a multiplication or division symbol. If either are true, `entriesArr` is copied to `newEntries` with a `-` added to the end. `newResults` is set to an array with a single element `-`.
		case entriesArr.slice(-1)[0] === 'x' || entriesArr.slice(-1)[0] === '/':
			return {
				newEntries: [...entriesArr, '-'],
				newResults: ['-']
			};
		
		// Checks if the last item in `entriesArr` is not a number. If true, `entriesArr` is copied to `newEntries` with the last item removed and `-` added to the end. `newResults` is set to an array with a single element `-`.
		case typeof entriesArr.slice(-1)[0] !== 'number':
			entriesArr.pop();
			return {
				newEntries: [...entriesArr, '-'],
				newResults: ['-']
			};
	}
}

function handleDecimal(entriesArr, resultsArr) {
	// Checks if `resultsArr` already has a decimal. If true, the function is returned early with the original arrays as values for `newEntries` and `newResults`.
	if (resultsArr.find(element => element === '.')) {
		return {
			newEntries: entriesArr,
			newResults: resultsArr
		};
	}
	// Copies `entriesArr` and `resultsArr` to `newEntries` and `newResults` respectively with `.` added to both.
	return {
		newEntries: [...entriesArr,'.'],
		newResults: [...resultsArr,'.']
	};
}