import './App.css';

const KEY = ['AC', '/', 'X', 7, 8, 9, '-', 4, 5, 6, '+', 1, 2, 3, '=', 0, '.'];

function KeyPad({ handleKeyInput }) {
	const keyArray = KEY.map((item, index) => {
		return(
			<div
				className="table text-center p-5 rounded-md"
				key={index + 1} 
				id={'key' + (index + 1)}
				onClick={() => handleKeyInput(item)}>
				<p className="table-cell align-middle select-none">{item}</p>
			</div>
		);
	});
	return (
		<div id="grid-container" className="w-full h-full">
			{keyArray}
		</div>
	);
}

function TextDisplay() {
	return (
		<div className="bg-[#232323] w-fill h-28"></div>
	);
}

export default function App() {

	function handleKeyInput(pressedKey) {
		switch(pressedKey) {
		case 'AC':
			console.log('AC');
			break;
		case '/':
			console.log('/');
			break;
		case 'X':
			console.log('X');
			break;
		case '+':
			console.log('+');
			break;
		case '=':
			console.log('=');
			break;
		case 7:
			console.log('is a number');
			break;
		}
	}

	return (
		<div className="App">
			<div className="flex flex-col justify-center mt-20 my-auto mx-auto w-[500px] h-[650px]">
				<TextDisplay/>
				<KeyPad handleKeyInput={handleKeyInput}/>
			</div>
		</div>
	);
}
