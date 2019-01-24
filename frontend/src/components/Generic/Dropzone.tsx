import React from 'react'
import ReactDropzone, { DropFilesEventHandler } from 'react-dropzone'
import { list } from '../../util/functions'

import styles from '../../styles/Dropzone.module.sass'
import { DivProps } from '../../util/types'
import { Omit } from 'typelevel-ts'

interface IProps extends Omit<DivProps, 'onDrop'> {
	onDrop?: DropFilesEventHandler
	name?: string
	accept?: string
	messages?: {
		active: string,
		notActive: string,
	}
}

export default function Dropzone({ messages, children, accept, name, onDrop, className, ...props }: IProps) {
	return (
		<ReactDropzone multiple={false} accept={accept} name={name} onDrop={onDrop}>
			{({ getRootProps, getInputProps, isDragActive }) => {
				return (
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
					</div>
				)
			}}
		</ReactDropzone>
	)
}
