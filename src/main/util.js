
var greekLetterNames = [ 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega' ];

var symbolMappings = {
	"<->": {
		unicode: "↔",
		latex: "\\leftrightarrow"
	},
	"->": {
		unicode: "→",
		latex: "\\rightarrow"
	},
	"<-": {
		unicode: "←",
		latex: "\\leftarrow"
	},
	"<=>": {
		unicode: "⇔",
		latex: "\\Leftrightarrow"
	},
	"=>": {
		unicode: "⇒",
		latex: "\\Rightarrow"
	},
	"<=": {
		unicode: "⇐",
		latex: "\\Leftarrow"
	}
}

export function convertLatexShortcuts(text) {
	// html greek characters
	for(var i = 0; i < greekLetterNames.length; i++) {
		var name = greekLetterNames[i];
		text = text.replace(new RegExp('\\\\' + name, 'g'), String.fromCharCode(913 + i + (i > 16)));
		text = text.replace(new RegExp('\\\\' + name.toLowerCase(), 'g'), String.fromCharCode(945 + i + (i > 16)));
	}

	// subscripts
	for(var i = 0; i < 10; i++) {
		text = text.replace(new RegExp('_' + i, 'g'), String.fromCharCode(8320 + i));
	}

	return text;
}

// Target is either "latex" or "unicode"
export function convertSymbols(text, target) {
	if (!text) {
		return text;
	}

	Object.keys(symbolMappings).forEach(k => {
		text = text.replace(new RegExp(k, "g"), symbolMappings[k][target]);
	});

	return text;
}

export function canvasHasFocus() {
	return (document.activeElement || document.body) == document.body;
}
