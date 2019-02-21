import React from 'react'
import ReactDropzone, { DropFilesEventHandler } from 'react-dropzone'
import { list } from '../../util/functions'

import styles from '../../styles/Dropzone.module.sass'
import { DivProps } from '../../util/types'
import { Omit } from 'typelevel-ts'
import Pushable from './Pushable'

interface IProps extends Omit<DivProps, 'onDrop'> {
	onDrop?: DropFilesEventHandler
	name?: string
	accept?: string
	required?: boolean
	messages?: {
		active: string,
		notActive: string,
	}
}

export default function Dropzone({ messages, children, accept, required, name, onDrop, className, ...props }: IProps) {
	return (
		<ReactDropzone multiple={false} accept={accept} name={name} onDrop={onDrop}>
			{({ getRootProps, getInputProps, isDragActive }) => {
				return (
					<Pushable>
						<div
							className={list(styles.dropzone, isDragActive && styles.dropzoneActive, className)}
							{...getRootProps()}
							{...props}
						>
							<input {...getInputProps()} />
							{children || (messages && (isDragActive
								? messages.active
								: messages.notActive
							))}
							{required && !children && <div className={styles.required} />}
						</div>
					</Pushable>
				)
			}}
		</ReactDropzone>
	)
}
