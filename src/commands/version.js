import { getSetting, updateSetting, heading, msgErrorTitle, incrementVersion, msgSuccessTitle } from "../utilities/index.js";

const validTypes = ['major', 'minor', 'patch'];
const versionPattern = /^\d+\.\d+\.\d+$/; // Simple pattern to match version format like "1.2.3"

export default (version) => {
	heading('Incrementing Version...')
	const currentVersion = getSetting('product.version');

	try {
		if ( version === currentVersion ) {
			msgErrorTitle('Version is already up to date');
			return;
		}

		if (validTypes.includes(version)) {
			version = incrementVersion(currentVersion, version);
		}

		if ( !version || !versionPattern.test(version) ) {
			msgErrorTitle('Invalid version provided');
			return;
		}

		console.log('Current version:', currentVersion);
		console.log('New version:', version);
		updateSetting('product.version', version);
		msgSuccessTitle('Version updated successfully');
	}
	catch (err) {
		msgErrorTitle('We failed!!!');
		throw err;
	}
}
