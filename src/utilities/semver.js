export class SemVer {
    constructor(version) {
        this.rawVersion = version

        this.parseVersion()
    }

    parseVersion() {
        const regex = new RegExp('(?<major>\\d+)\\.(?<minor>\\d+)\\.(?<patch>\\d+)(?:-(?<pre>alpha|beta|rc))?(?:\\.(?<pre_count>\\d+))?', 'gm')
        this.baseVersion = { ...regex.exec(this.rawVersion).groups }

        this.baseVersion.major = parseInt(this.baseVersion.major)
        this.baseVersion.minor = parseInt(this.baseVersion.minor)
        this.baseVersion.patch = parseInt(this.baseVersion.patch)
        this.baseVersion.pre = undefined === this.baseVersion.pre ? false : this.baseVersion.pre
        this.baseVersion.pre_count = undefined === this.baseVersion.pre_count ? false : this.baseVersion.pre_count
    }

    getCurrentVersion() {
        return this.rawVersion
    }

    increment(type) {
        const nextVersion = { ...this.baseVersion }
        nextVersion[type] += 1

        if ('patch' !== type) {
            nextVersion.patch = 0
            if ('minor' !== type) {
                nextVersion.minor = 0
            }
        }

        return this.format(nextVersion);
    }

    format(version) {
        return `${version.major}.${version.minor}.${version.patch}`
    }
}

export function incrementVersion(version, type) {
	const semver = new SemVer(version)
	return semver.increment(type)
}
