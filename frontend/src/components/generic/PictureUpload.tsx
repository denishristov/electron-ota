import React from 'react'
import { observer } from 'mobx-react'
import { DropFilesEventHandler } from 'react-dropzone'

import styles from '../../styles/PictureUpload.module.sass'
import icons from '../../util/constants/icons'
import Dropzone from './Dropzone'

interface IProps {
	onDrop: DropFilesEventHandler
	picture?: string
	label: string
}

export default observer(function PictureUpload({ onDrop, picture, label }: IProps) {
	return (
		<>
			<label className={styles.uploadLabel}>{label}</label>
			<Dropzone
				onDrop={onDrop}
				name='picture'
				accept='image/*'
				className={styles.dropzone}
			>
				{picture
					? <img src={picture} className={styles.uploadIcon} />
					: <SVG src={icons.Camera} className={styles.uploadIcon} />
				}
			</Dropzone>
		</>
	)
})
