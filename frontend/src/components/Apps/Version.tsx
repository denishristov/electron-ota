import React from 'react'
import { IVersionModel } from 'shared'
import { observer } from 'mobx-react'

import Download from '../../img/Download.svg'
import { downloadFile } from '../../util/functions'

export interface IProps {
	version: IVersionModel
}

function Version({ version }: IProps) {
	return (
		<div className='version' key={version.id}>
			<h3>{version.versionName}</h3>
			{version.isBase && <div>base</div>}
			{version.isCritical && <div>base</div>}
			<label>Hash</label>
			<div>{version.hash}</div>
			<SVG src={Download} onClick={downloadFile.bind(null, version.downloadUrl)} />
			{/* {<p>{new Date(versioncreatedAt as string)}</p>} */}
		</div>
	)
}

export default observer(Version)
